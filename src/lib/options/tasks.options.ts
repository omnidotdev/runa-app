import { queryOptions } from "@tanstack/react-query";

import { useTasksQuery } from "@/generated/graphql";

interface Options {
  projectId: string;
  search?: string;
  assignees?: string[];
}

const tasksOptions = ({ projectId, search, assignees }: Options) =>
  queryOptions({
    queryKey: useTasksQuery.getKey({ projectId, search, assignees }),
    queryFn: useTasksQuery.fetcher({ projectId, search, assignees }),
    // TODO: discuss proper refetch interval
    refetchInterval: 3000,
  });

export default tasksOptions;
