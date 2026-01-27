import { useEffect, useMemo, useRef } from "react";
import { fetchServerSentEvents, useChat } from "@tanstack/ai-react";
import { useQueryClient } from "@tanstack/react-query";

import { API_BASE_URL } from "@/lib/config/env.config";
import { WRITE_TOOL_NAMES } from "./constants";

interface UseAgentChatOptions {
  projectId: string;
  accessToken: string;
}

/**
 * Hook for AI agent chat, wrapping TanStack AI's `useChat` with
 * project-scoped auth and session management.
 *
 * Uses refs for dynamic values (token, projectId, sessionId) to keep the
 * connection adapter stable — avoiding ChatClient recreation which would
 * clear conversation state.
 *
 * Session ID is captured from the `X-Agent-Session-Id` response header
 * via a custom `fetchClient` wrapper, since `onResponse` does not receive
 * the Response object in the current TanStack AI version.
 *
 * When write tools complete, React Query caches for board data are
 * invalidated so the UI reflects agent-made changes in real time.
 */
export function useAgentChat({ projectId, accessToken }: UseAgentChatOptions) {
  const queryClient = useQueryClient();
  const sessionIdRef = useRef<string | null>(null);
  const accessTokenRef = useRef(accessToken);
  const projectIdRef = useRef(projectId);
  const invalidationTimerRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
  const lastWriteCountRef = useRef(0);

  // Keep refs in sync with latest prop values
  accessTokenRef.current = accessToken;
  projectIdRef.current = projectId;

  // Connection adapter created once — options function is called fresh per request
  const connection = useMemo(
    () =>
      fetchServerSentEvents(`${API_BASE_URL}/api/ai/chat`, () => ({
        headers: {
          Authorization: `Bearer ${accessTokenRef.current}`,
        },
        body: {
          projectId: projectIdRef.current,
          ...(sessionIdRef.current
            ? { sessionId: sessionIdRef.current }
            : {}),
        },
        // Wrap fetch to capture session ID from response headers
        fetchClient: async (url, init) => {
          const response = await fetch(url, init);
          const sid = response.headers.get("X-Agent-Session-Id");
          if (sid) sessionIdRef.current = sid;
          return response;
        },
      })),
    [],
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

  return chatResult;
}
