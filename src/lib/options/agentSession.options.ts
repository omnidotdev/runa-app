import { queryOptions } from "@tanstack/react-query";

import { useAgentSessionQuery } from "@/generated/graphql";

import type { AgentSessionQueryVariables } from "@/generated/graphql";

const agentSessionOptions = (variables: AgentSessionQueryVariables) =>
  queryOptions({
    queryKey: useAgentSessionQuery.getKey(variables),
    queryFn: useAgentSessionQuery.fetcher(variables),
    enabled: !!variables.rowId,
  });

export default agentSessionOptions;
