import { queryOptions } from "@tanstack/react-query";

import { useTasksQuery } from "@/generated/graphql";

const tasksOptions = (projectId: string, search?: string) =>
  queryOptions({
    queryKey: useTasksQuery.getKey({ projectId, search }),
    queryFn: useTasksQuery.fetcher({ projectId, search }),
    // TODO: discuss proper refetch interval
    refetchInterval: 3000,
  });

export default tasksOptions;
