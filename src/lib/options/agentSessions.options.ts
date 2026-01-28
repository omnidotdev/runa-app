import { queryOptions } from "@tanstack/react-query";

import { useAgentSessionsQuery } from "@/generated/graphql";

import type { AgentSessionsQueryVariables } from "@/generated/graphql";

const agentSessionsOptions = (variables: AgentSessionsQueryVariables) =>
  queryOptions({
    queryKey: useAgentSessionsQuery.getKey(variables),
    queryFn: useAgentSessionsQuery.fetcher(variables),
  });

export default agentSessionsOptions;
