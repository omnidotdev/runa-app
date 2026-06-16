import { queryOptions } from "@tanstack/react-query";

import { useTaskByNumberQuery } from "@/generated/graphql";

import type { TaskByNumberQueryVariables } from "@/generated/graphql";

const taskByNumberOptions = (variables: TaskByNumberQueryVariables) =>
  queryOptions({
    queryKey: useTaskByNumberQuery.getKey(variables),
    queryFn: useTaskByNumberQuery.fetcher(variables),
  });

export default taskByNumberOptions;
