import { queryOptions } from "@tanstack/react-query";

import { useProjectColumnsQuery } from "@/generated/graphql";

import type { ProjectColumnsQueryVariables } from "@/generated/graphql";

const projectColumnsOptions = (variables: ProjectColumnsQueryVariables) =>
  queryOptions({
    queryKey: useProjectColumnsQuery.getKey(variables),
    queryFn: useProjectColumnsQuery.fetcher(variables),
  });

export default projectColumnsOptions;
