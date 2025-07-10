import { queryOptions } from "@tanstack/react-query";

import { useTasksQuery } from "@/generated/graphql";

import type { TasksQueryVariables } from "@/generated/graphql";

const tasksOptions = (variables: TasksQueryVariables) =>
  queryOptions({
    queryKey: useTasksQuery.getKey(variables),
    queryFn: useTasksQuery.fetcher(variables),
    // TODO: discuss proper refetch interval
    refetchInterval: 3000,
  });

export default tasksOptions;
