import { useCallback, useState } from "react";

import type { AgentSessionNode } from "./useAgentSessions";

/**
 * Hook for managing the currently active agent session.
 *
 * Tracks `currentSessionId` as local state with a generation counter.
 * The generation counter ensures that calling `startNewSession()` when
 * already on a null session still triggers downstream effects (e.g.,
 * `useAgentChat`'s memo recomputes to create a fresh connection).
 */
export function useCurrentSession(sessions: AgentSessionNode[]) {
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [generation, setGeneration] = useState(0);

  const currentSession = currentSessionId
    ? sessions.find((s) => s.rowId === currentSessionId) ?? null
    : null;

  /** Set the active session by ID (for selection or server response). */
  const selectSession = useCallback((id: string) => {
    setCurrentSessionId(id);
  }, []);

  /** Clear the active session to start a new conversation. */
  const startNewSession = useCallback(() => {
    setCurrentSessionId(null);
    setGeneration((prev) => prev + 1);
  }, []);

  // Composite key for downstream memo dependencies
  const sessionKey = `${currentSessionId ?? "new"}-${generation}`;

  return {
    currentSessionId,
    currentSession,
    sessionKey,
    selectSession,
    startNewSession,
  };
}
