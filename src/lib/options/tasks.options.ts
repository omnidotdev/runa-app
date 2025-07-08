import { queryOptions } from "@tanstack/react-query";

import { useTasksQuery } from "@/generated/graphql";

interface Options {
  projectId: string;
  search?: string;
}

const tasksOptions = ({ projectId, search }: Options) =>
  queryOptions({
    queryKey: useTasksQuery.getKey({ projectId, search }),
    queryFn: useTasksQuery.fetcher({ projectId, search }),
    // TODO: discuss proper refetch interval
    refetchInterval: 3000,
  });

export default tasksOptions;
