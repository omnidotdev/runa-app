import { queryOptions } from "@tanstack/react-query";

import { useTaskQuery } from "@/generated/graphql";

import type { TaskQueryVariables } from "@/generated/graphql";

const taskOptions = (variables: TaskQueryVariables) =>
  queryOptions({
    queryKey: useTaskQuery.getKey(variables),
    queryFn: useTaskQuery.fetcher(variables),
  });

export default taskOptions;
