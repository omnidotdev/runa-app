import { queryCollectionOptions } from "@tanstack/db-collections";
import { createCollection } from "@tanstack/react-db";

import getSdk from "@/lib/graphql/getSdk";
import getQueryClient from "@/utils/getQueryClient";

import type { Task, TaskInput } from "@/generated/graphql.sdk";

const queryClient = getQueryClient();
const sdk = getSdk();

const taskCollection = createCollection(
  // TODO: determine proper generic for this considering the different mutations. Possibly use fragment?
  queryCollectionOptions<Partial<Task>>({
    queryKey: ["Tasks"],
    // @ts-ignore seems to be an upstream type issue
    queryClient,
    // TODO: discuss and determine the appropriate refetch interval for live queries
    // refetchInterval: 3000,
    getKey: (task) => task.rowId!,
    queryFn: async () => {
      const { tasks } = await sdk.Tasks();

      return (tasks?.nodes ?? []) as Task[];
    },
    onInsert: async ({ transaction }) => {
      // NB: for the collection, need `rowId` when using `insert` as it is used in `getKey`. However, we do not want to actually use the `rowId` provided when performing the mutation
      const { rowId: _rowId, ...rest } = transaction.mutations[0]
        .modified as TaskInput;

      await sdk.CreateTask({
        input: { task: rest },
      });
    },
    onUpdate: async ({ transaction }) => {
      const { original, changes } = transaction.mutations[0];

      await sdk.UpdateTask({
        rowId: original.rowId!,
        patch: changes,
      });
    },
    onDelete: async ({ transaction }) => {
      const { original } = transaction.mutations[0];

      await sdk.DeleteTask({
        rowId: original.rowId!,
      });
    },
  }),
);

export default taskCollection;
