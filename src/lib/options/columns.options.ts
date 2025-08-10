import { queryOptions } from "@tanstack/react-query";

import { useColumnsQuery } from "@/generated/graphql";

import type { ColumnsQueryVariables } from "@/generated/graphql";

const columnsOptions = (variables: ColumnsQueryVariables) =>
  queryOptions({
    queryKey: useColumnsQuery.getKey(variables),
    queryFn: useColumnsQuery.fetcher(variables),
  });

export default columnsOptions;
