import { queryOptions } from "@tanstack/react-query";

import { useTasksQuery } from "@/generated/graphql";

const tasksOptions = (columnId: string, search?: string) =>
  queryOptions({
    queryKey: useTasksQuery.getKey({ columnId, search }),
    queryFn: useTasksQuery.fetcher({ columnId, search }),
    // TODO: discuss proper refetch interval
    refetchInterval: 3000,
  });

export default tasksOptions;
