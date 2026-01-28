import { fetchServerSentEvents, useChat } from "@tanstack/ai-react";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useRef } from "react";

import {
  useAgentActivitiesQuery,
  useProjectQuery,
  useTaskQuery,
  useTasksQuery,
} from "@/generated/graphql";
import { API_BASE_URL } from "@/lib/config/env.config";
import getQueryKeyPrefix from "@/lib/util/getQueryKeyPrefix";
import { WRITE_TOOL_NAMES } from "./constants";
import { useAccessToken } from "./hooks/useAccessToken";

import type { UIMessage } from "@tanstack/ai-client";

/**
 * Extract pending approval responses from UIMessages.
 *
 * TanStack AI's ModelMessage format doesn't include approval state,
 * so we extract approvals and send them separately in the request body.
 */
function extractApprovals(
  messages: UIMessage[],
): Array<{ id: string; approved: boolean }> {
  const approvalsMap = new Map<string, { id: string; approved: boolean }>();

  for (const message of messages) {
    if (message.role !== "assistant") continue;

    for (const part of message.parts) {
      if (
        part.type === "tool-call" &&
        part.state === "approval-responded" &&
        typeof part.approval?.id === "string" &&
        part.approval.id.length > 0 &&
        typeof part.approval?.approved === "boolean"
      ) {
        approvalsMap.set(part.approval.id, {
          id: part.approval.id,
          approved: part.approval.approved,
        });
      }
    }
  }

  return Array.from(approvalsMap.values());
}

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
  // Store UIMessages for approval extraction (body function reads this)
  const messagesRef = useRef<UIMessage[]>([]);

  // Keep refs in sync with latest prop values
  accessTokenRef.current = accessToken;
  projectIdRef.current = projectId;
  personaIdRef.current = personaId ?? null;
  onSessionIdRef.current = onSessionId;

  // Recreate connection when sessionId changes — this resets useChat's
  // message state so stale messages from the previous session are cleared.
  // Refs for accessToken/projectId keep those values fresh without triggering
  // a reconnection on every render.
  // biome-ignore lint/correctness/useExhaustiveDependencies: Intentionally recreate connection on sessionKey OR sessionId change
  const connection = useMemo(() => {
    sessionIdRef.current = sessionId ?? null;
    lastWriteCountRef.current = 0;

    return fetchServerSentEvents(`${API_BASE_URL}/api/ai/chat`, () => {
      // Extract approvals from current UIMessages (before they're converted to ModelMessages)
      const approvals = extractApprovals(messagesRef.current);

      return {
        headers: {
          Authorization: `Bearer ${accessTokenRef.current}`,
        },
        body: {
          projectId: projectIdRef.current,
          ...(sessionIdRef.current ? { sessionId: sessionIdRef.current } : {}),
          ...(personaIdRef.current ? { personaId: personaIdRef.current } : {}),
          // Include approvals separately since ModelMessages don't preserve them
          ...(approvals.length > 0 ? { approvals } : {}),
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
      };
    });
  }, [sessionKey, sessionId]);

  const chatResult = useChat({ connection });

  // Keep messagesRef in sync with current messages for approval extraction
  // The body function reads this ref when making requests
  messagesRef.current = chatResult.messages;

  // Clear messages only when explicitly starting fresh (generation changes in sessionKey).
  // Don't clear when server assigns a session ID to the current conversation.
  // sessionKey format: "sessionId-generation" or "new-generation"
  const prevGenerationRef = useRef<string | null>(null);
  const clearMessages = chatResult.clear;
  // biome-ignore lint/correctness/useExhaustiveDependencies: Only trigger on sessionKey change, clearMessages is stable
  useEffect(() => {
    // Extract generation from sessionKey (the part after the last dash)
    const currentGeneration = sessionKey?.split("-").pop() ?? null;
    if (
      prevGenerationRef.current !== null &&
      prevGenerationRef.current !== currentGeneration
    ) {
      clearMessages();
    }
    prevGenerationRef.current = currentGeneration;
  }, [sessionKey]);

  // Invalidate React Query cache when new write tools complete
  useEffect(() => {
    let completedWriteCount = 0;

    for (const message of chatResult.messages) {
      if (message.role !== "assistant") continue;

      // Collect tool-result IDs to know which tool calls have completed
      const completedToolCallIds = new Set<string>();
      for (const part of message.parts) {
        if (part.type === "tool-result") {
          completedToolCallIds.add(part.toolCallId);
        }
      }

      // Count write tool calls that have a matching result
      for (const part of message.parts) {
        if (part.type === "tool-call" && WRITE_TOOL_NAMES.has(part.name)) {
          // Tool is complete if: has tool-result part, has output (client tools),
          // or was approved and stream is no longer loading
          const hasResult = completedToolCallIds.has(part.id);
          const hasOutput = part.output !== undefined;
          const isApprovedAndComplete =
            part.state === "approval-responded" &&
            part.approval?.approved === true &&
            !chatResult.isLoading;

          if (hasResult || hasOutput || isApprovedAndComplete) {
            completedWriteCount++;
          }
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
      queryClient.invalidateQueries({
        queryKey: getQueryKeyPrefix(useTasksQuery),
      });
      queryClient.invalidateQueries({
        queryKey: getQueryKeyPrefix(useTaskQuery),
      });
      queryClient.invalidateQueries({
        queryKey: getQueryKeyPrefix(useProjectQuery),
      });
      queryClient.invalidateQueries({
        queryKey: getQueryKeyPrefix(useAgentActivitiesQuery),
      });
      invalidationTimerRef.current = null;
    }, 500);

    return () => {
      if (invalidationTimerRef.current) {
        clearTimeout(invalidationTimerRef.current);
        invalidationTimerRef.current = null;
      }
    };
  }, [chatResult.messages, chatResult.isLoading, queryClient]);

  return {
    ...chatResult,
    sessionId: sessionIdRef.current,
  };
}
