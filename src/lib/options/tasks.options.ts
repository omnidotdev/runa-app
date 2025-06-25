import { queryOptions } from "@tanstack/react-query";

import { useTasksQuery } from "@/generated/graphql";

const tasksOptions = (projectId: string) =>
  queryOptions({
    queryKey: useTasksQuery.getKey({ projectId }),
    queryFn: useTasksQuery.fetcher({ projectId }),
  });

export default tasksOptions;
