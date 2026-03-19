import { queryOptions } from "@tanstack/react-query";

import { useAgentSessionsQuery } from "@/generated/graphql";

import type {
  AgentSessionsQuery,
  AgentSessionsQueryVariables,
} from "@/generated/graphql";

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

export type AgentSessionNode = NonNullable<
  AgentSessionsQuery["agentSessions"]
>["nodes"][number];

// ─────────────────────────────────────────────
// Query Key
// ─────────────────────────────────────────────

export function agentSessionsQueryKey(variables: AgentSessionsQueryVariables) {
  return useAgentSessionsQuery.getKey(variables);
}

// ─────────────────────────────────────────────
// Query Options
// ─────────────────────────────────────────────

const agentSessionsOptions = (variables: AgentSessionsQueryVariables) =>
  queryOptions({
    queryKey: agentSessionsQueryKey(variables),
    queryFn: useAgentSessionsQuery.fetcher(variables),
  });

export default agentSessionsOptions;
