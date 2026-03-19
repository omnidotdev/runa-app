import { queryOptions } from "@tanstack/react-query";

import { useAgentSessionTokenUsageQuery } from "@/generated/graphql";

import type { AgentSessionTokenUsageQueryVariables } from "@/generated/graphql";

const agentSessionTokenUsageOptions = (
  variables: AgentSessionTokenUsageQueryVariables,
) =>
  queryOptions({
    queryKey: useAgentSessionTokenUsageQuery.getKey(variables),
    queryFn: useAgentSessionTokenUsageQuery.fetcher(variables),
  });

export default agentSessionTokenUsageOptions;
