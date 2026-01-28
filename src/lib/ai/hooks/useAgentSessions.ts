import { useQuery, useQueryClient } from "@tanstack/react-query";

import agentSessionsOptions from "@/lib/options/agentSessions.options";

import type { AgentSessionsQuery } from "@/generated/graphql";

type AgentSessionNode = NonNullable<
  AgentSessionsQuery["agentSessions"]
>["nodes"][number];

interface UseAgentSessionsOptions {
  projectId: string;
  userId: string;
}

/**
 * Hook for fetching and managing agent sessions for a project.
 *
 * Uses the `agentSessionsOptions` query options factory for consistency
 * with the rest of the codebase. Exposes `refreshSessions` for cache
 * invalidation when the chat endpoint returns a new session ID.
 */
export function useAgentSessions({
  projectId,
  userId,
}: UseAgentSessionsOptions) {
  const queryClient = useQueryClient();
  const variables = { projectId, userId, first: 50 };
  const options = agentSessionsOptions(variables);

  const { data, isLoading, error } = useQuery(options);

  const sessions = data?.agentSessions?.nodes ?? [];
  const totalCount = data?.agentSessions?.totalCount ?? 0;

  /** Refetch sessions from the server. */
  const refreshSessions = () => {
    queryClient.invalidateQueries({ queryKey: options.queryKey });
  };

  /**
   * Optimistically upsert a session into the cache.
   * Called when the chat endpoint returns session metadata.
   */
  const upsertSession = (session: AgentSessionNode) => {
    queryClient.setQueryData<AgentSessionsQuery>(options.queryKey, (old) => {
      if (!old?.agentSessions) return old;

      const existingIndex = old.agentSessions.nodes.findIndex(
        (s) => s.rowId === session.rowId,
      );

      const updatedNodes =
        existingIndex >= 0
          ? old.agentSessions.nodes.map((s, i) =>
              i === existingIndex ? { ...s, ...session } : s,
            )
          : [session, ...old.agentSessions.nodes];

      return {
        ...old,
        agentSessions: {
          ...old.agentSessions,
          nodes: updatedNodes,
          totalCount:
            existingIndex >= 0
              ? old.agentSessions.totalCount
              : old.agentSessions.totalCount + 1,
        },
      };
    });
  };

  return {
    sessions,
    totalCount,
    isLoading,
    error,
    refreshSessions,
    upsertSession,
  };
}

export type { AgentSessionNode };
