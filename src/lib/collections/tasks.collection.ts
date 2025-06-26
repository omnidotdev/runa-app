import { queryCollectionOptions } from "@tanstack/db-collections";
import { createCollection } from "@tanstack/react-db";

import getSdk from "@/lib/graphql/getSdk";
import projectOptions from "@/lib/options/project.options";
import getQueryClient from "@/utils/getQueryClient";

import type { Task } from "@/generated/graphql.sdk";

const queryClient = getQueryClient();
const sdk = getSdk();

const tasksCollection = (projectId: string) =>
  createCollection(
    queryCollectionOptions<Partial<Task>>({
      queryClient,
      getKey: (task) => task.rowId!,
      queryKey: ["TasksCollection", { projectId }],
      queryFn: async () => {
        const { tasks } = await sdk.Tasks({ projectId });

        return (tasks?.nodes ?? []) as Task[];
      },
      refetchInterval: 3000,
      onUpdate: async ({ transaction }) => {
        const { original, changes } = transaction.mutations[0];

        await sdk.UpdateTask({
          rowId: original.rowId!,
          patch: changes,
        });

        queryClient.invalidateQueries(projectOptions(projectId));
      },
    }),
  );

export default tasksCollection;
