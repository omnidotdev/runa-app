import { useEffect, useMemo, useRef } from "react";
import { fetchServerSentEvents, useChat } from "@tanstack/ai-react";
import { useQueryClient } from "@tanstack/react-query";

import { API_BASE_URL } from "@/lib/config/env.config";
import { useAccessToken } from "./hooks/useAccessToken";
import { WRITE_TOOL_NAMES } from "./constants";

interface UseAgentChatOptions {
  projectId: string;
  /** Session ID to resume. `null` starts a new session. */
  sessionId?: string | null;
  /**
   * Composite key that changes whenever the session should be recreated.
   * Includes a generation counter to handle null→null transitions
   * when the user clicks "New Session" while already on a new session.
   */
  sessionKey?: string;
  /** Persona to use for this chat session. `null` uses the org default. */
  personaId?: string | null;
  /** Called when the server returns a session ID in response headers. */
  onSessionId?: (sessionId: string) => void;
}

/**
 * Hook for AI agent chat, wrapping TanStack AI's `useChat` with
 * project-scoped auth and session management.
 *
 * The access token is sourced from route context via `useAccessToken()`,
 * eliminating the need for prop drilling.
 *
 * Uses refs for dynamic values (token, projectId) to keep the connection
 * adapter stable — avoiding ChatClient recreation during a conversation.
 * The `sessionId` prop IS included as a memo dependency so that switching
 * sessions recreates the connection and clears stale messages.
 *
 * Session ID is captured from the `X-Agent-Session-Id` response header
 * via a custom `fetchClient` wrapper, since `onResponse` does not receive
 * the Response object in the current TanStack AI version.
 *
 * When write tools complete, React Query caches for board data are
 * invalidated so the UI reflects agent-made changes in real time.
 */
export function useAgentChat({
  projectId,
  sessionId,
  sessionKey,
  personaId,
  onSessionId,
}: UseAgentChatOptions) {
  const accessToken = useAccessToken();
  const queryClient = useQueryClient();
  const sessionIdRef = useRef<string | null>(sessionId ?? null);
  const accessTokenRef = useRef(accessToken);
  const projectIdRef = useRef(projectId);
  const personaIdRef = useRef(personaId ?? null);
  const onSessionIdRef = useRef(onSessionId);
  const invalidationTimerRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
  const lastWriteCountRef = useRef(0);

  // Keep refs in sync with latest prop values
  accessTokenRef.current = accessToken;
  projectIdRef.current = projectId;
  personaIdRef.current = personaId ?? null;
  onSessionIdRef.current = onSessionId;

  // Recreate connection when sessionId changes — this resets useChat's
  // message state so stale messages from the previous session are cleared.
  // Refs for accessToken/projectId keep those values fresh without triggering
  // a reconnection on every render.
  const connection = useMemo(
    () => {
      sessionIdRef.current = sessionId ?? null;
      lastWriteCountRef.current = 0;

      return fetchServerSentEvents(`${API_BASE_URL}/api/ai/chat`, () => ({
        headers: {
          Authorization: `Bearer ${accessTokenRef.current}`,
        },
        body: {
          projectId: projectIdRef.current,
          ...(sessionIdRef.current
            ? { sessionId: sessionIdRef.current }
            : {}),
          ...(personaIdRef.current
            ? { personaId: personaIdRef.current }
            : {}),
        },
        // Wrap fetch to capture session ID from response headers
        fetchClient: async (url, init) => {
          const response = await fetch(url, init);
          try {
            const sid = response.headers.get("X-Agent-Session-Id");
            if (sid && typeof sid === "string" && sid.length > 0) {
              sessionIdRef.current = sid;
              onSessionIdRef.current?.(sid);
            }
          } catch {
            // Session ID extraction is non-critical — don't break the SSE connection
          }
          return response;
        },
      }));
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [sessionKey ?? sessionId],
  );

  const chatResult = useChat({ connection });

  // Invalidate React Query cache when new write tools complete
  useEffect(() => {
    let completedWriteCount = 0;

    for (const message of chatResult.messages) {
      if (message.role !== "assistant") continue;
      for (const part of message.parts) {
        if (
          part.type === "tool-call" &&
          WRITE_TOOL_NAMES.has(part.name) &&
          part.output !== undefined
        ) {
          completedWriteCount++;
        }
      }
    }

    // Only invalidate when new write completions appear
    if (completedWriteCount <= lastWriteCountRef.current) return;
    lastWriteCountRef.current = completedWriteCount;

    // Debounce to prevent rapid-fire invalidations during multi-tool sequences
    if (invalidationTimerRef.current) {
      clearTimeout(invalidationTimerRef.current);
    }

    invalidationTimerRef.current = setTimeout(() => {
      queryClient.invalidateQueries({ queryKey: ["Tasks"] });
      queryClient.invalidateQueries({ queryKey: ["Task"] });
      queryClient.invalidateQueries({ queryKey: ["Project"] });
      invalidationTimerRef.current = null;
    }, 500);

    return () => {
      if (invalidationTimerRef.current) {
        clearTimeout(invalidationTimerRef.current);
        invalidationTimerRef.current = null;
      }
    };
  }, [chatResult.messages, queryClient]);

  return {
    ...chatResult,
    sessionId: sessionIdRef.current,
  };
}
