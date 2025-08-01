import { queryOptions } from "@tanstack/react-query";

import { useUsageMetricsQuery } from "@/generated/graphql";

import type { UsageMetricsQueryVariables } from "@/generated/graphql";

const usageMetricsOptions = (variables: UsageMetricsQueryVariables) =>
  queryOptions({
    queryKey: useUsageMetricsQuery.getKey(variables),
    queryFn: useUsageMetricsQuery.fetcher(variables),
  });

export default usageMetricsOptions;
