import { queryOptions } from "@tanstack/react-query";

import { useTasksQuery } from "@/generated/graphql";

import type {
  InputMaybe,
  TaskToManyAssigneeFilter,
  TaskToManyTaskLabelFilter,
} from "@/generated/graphql";

interface Options {
  projectId: string;
  search?: string;
  assignees?: InputMaybe<TaskToManyAssigneeFilter> | undefined;
  labels?: InputMaybe<TaskToManyTaskLabelFilter> | undefined;
}

const tasksOptions = ({ projectId, search, assignees, labels }: Options) =>
  queryOptions({
    queryKey: useTasksQuery.getKey({ projectId, search, assignees, labels }),
    queryFn: useTasksQuery.fetcher({ projectId, search, assignees, labels }),
    // TODO: discuss proper refetch interval
    refetchInterval: 3000,
  });

export default tasksOptions;
