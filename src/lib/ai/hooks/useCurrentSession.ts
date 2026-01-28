import { useCallback, useState } from "react";

import type { AgentSessionNode } from "./useAgentSessions";

/**
 * Hook for managing the currently active agent session.
 *
 * Tracks `currentSessionId` as local state. Provides methods to
 * select an existing session or start a new one (clearing the ID).
 */
export function useCurrentSession(sessions: AgentSessionNode[]) {
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);

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
  }, []);

  return {
    currentSessionId,
    currentSession,
    selectSession,
    startNewSession,
  };
}
