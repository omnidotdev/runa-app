import { queryOptions } from "@tanstack/react-query";

import { useLabelsQuery } from "@/generated/graphql";

import type { LabelsQueryVariables } from "@/generated/graphql";

const labelsOptions = (variables: LabelsQueryVariables) =>
  queryOptions({
    queryKey: useLabelsQuery.getKey(variables),
    queryFn: useLabelsQuery.fetcher(variables),
  });

export default labelsOptions;
