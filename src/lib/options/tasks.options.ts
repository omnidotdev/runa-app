import { queryOptions } from "@tanstack/react-query";

import { useTasksQuery } from "@/generated/graphql";

const tasksOptions = (columnId: string) =>
  queryOptions({
    queryKey: useTasksQuery.getKey({ columnId }),
    queryFn: useTasksQuery.fetcher({ columnId }),
  });

export default tasksOptions;
