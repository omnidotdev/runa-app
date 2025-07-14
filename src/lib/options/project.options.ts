import { queryOptions } from "@tanstack/react-query";

import { useProjectQuery } from "@/generated/graphql";

import type { ProjectQueryVariables } from "@/generated/graphql";

const projectOptions = (variables: ProjectQueryVariables) =>
  queryOptions({
    queryKey: useProjectQuery.getKey(variables),
    queryFn: useProjectQuery.fetcher(variables),
  });

export default projectOptions;
