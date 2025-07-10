import { queryOptions } from "@tanstack/react-query";

import { useTasksQuery } from "@/generated/graphql";

import type {
  InputMaybe,
  TasksQueryVariables,
  TaskToManyAssigneeFilter,
  TaskToManyTaskLabelFilter,
} from "@/generated/graphql";

interface Options {
  projectId: string;
  search?: string;
  assignees?: InputMaybe<TaskToManyAssigneeFilter> | undefined;
  labels?: InputMaybe<TaskToManyTaskLabelFilter> | undefined;
  priorities?: string[];
}

const tasksOptions = ({
  projectId,
  search,
  assignees,
  labels,
  priorities,
}: Options) => {
  const variables: TasksQueryVariables = {
    projectId,
    search,
    assignees,
    labels,
    priorities,
  };

  return queryOptions({
    queryKey: useTasksQuery.getKey(variables),
    queryFn: useTasksQuery.fetcher(variables),
    // TODO: discuss proper refetch interval
    refetchInterval: 3000,
  });
};

export default tasksOptions;
