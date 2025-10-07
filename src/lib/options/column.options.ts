import { queryOptions } from "@tanstack/react-query";

import { useColumnQuery } from "@/generated/graphql";

import type { ColumnQueryVariables } from "@/generated/graphql";

const columnOptions = (variables: ColumnQueryVariables) =>
  queryOptions({
    queryKey: useColumnQuery.getKey(variables),
    queryFn: useColumnQuery.fetcher(variables),
  });

export default columnOptions;
