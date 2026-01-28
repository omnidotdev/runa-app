import { fetchServerSentEvents, useChat } from "@tanstack/ai-react";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useRef } from "react";

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
 *
 * Only extracts approvals for tool-calls that haven't been executed yet
 * (no corresponding tool-result). This prevents re-sending old approvals
 * when making subsequent requests in the same session.
 */
function extractApprovals(
  messages: UIMessage[],
): Array<{ id: string; approved: boolean }> {
  // First, collect all tool-call IDs that have been executed (have tool-results)
  const executedToolCallIds = new Set<string>();
  for (const message of messages) {
    if (message.role !== "assistant") continue;
    for (const part of message.parts) {
      if (part.type === "tool-result") {
        executedToolCallIds.add(part.toolCallId);
      }
    }
  }

  // TanStack AI uses "approval_${toolCallId}" format for approval IDs
  const APPROVAL_PREFIX = "approval_";

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
        // Extract tool call ID from approval ID
        const toolCallId = part.approval.id.startsWith(APPROVAL_PREFIX)
          ? part.approval.id.slice(APPROVAL_PREFIX.length)
          : part.id;

        // Skip approvals for tools that have already been executed
        if (executedToolCallIds.has(toolCallId)) {
          continue;
        }

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

  // Workaround for TanStack AI's broken server-side tool continuation:
  // TanStack AI's areAllToolsComplete() doesn't handle server-side tools correctly:
  // - Server tools have state "input-complete" (not "approval-responded")
  // - Server tools don't populate part.output (results go in tool-result parts)
  // So areAllToolsComplete() returns false even when approval is granted.
  // Workaround: After approval, use append() to send a continuation marker
  // that triggers the server to execute pending tools.
  const CONTINUATION_MARKER = "[CONTINUE_AFTER_APPROVAL]";

  const wrappedAddToolApprovalResponse = useCallback(
    async (response: { id: string; approved: boolean }) => {
      // First, let TanStack AI update the approval state
      await chatResult.addToolApprovalResponse(response);

      // If approved, append a continuation marker to trigger the request
      // The server will see the pending tools with approvals and execute them
      if (response.approved) {
        // Small delay to ensure state is updated
        await new Promise((resolve) => setTimeout(resolve, 50));

        // Append a synthetic user message to trigger continuation
        // This message will be filtered out in the UI
        await chatResult.append({
          role: "user",
          content: CONTINUATION_MARKER,
        });
      }
    },
    [chatResult],
  );

  // Filter out continuation marker messages from display
  const filteredMessages = useMemo(
    () =>
      chatResult.messages.filter((m) => {
        if (m.role !== "user") return true;
        const textPart = m.parts.find((p) => p.type === "text");
        if (!textPart || textPart.type !== "text") return true;
        return textPart.content !== CONTINUATION_MARKER;
      }),
    [chatResult.messages],
  );

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
    // First, collect ALL tool-result IDs across ALL messages
    // This is necessary because after the approval continuation flow,
    // tool-results may be in a different message than the tool-calls
    const allCompletedToolCallIds = new Set<string>();
    for (const message of chatResult.messages) {
      if (message.role !== "assistant") continue;
      for (const part of message.parts) {
        if (part.type === "tool-result") {
          allCompletedToolCallIds.add(part.toolCallId);
        }
      }
    }

    let completedWriteCount = 0;

    for (const message of chatResult.messages) {
      if (message.role !== "assistant") continue;

      // Count write tool calls that have ACTUALLY completed (have results)
      // We only count tools with tool-result parts, not just approval state,
      // because approval state is set BEFORE the continuation executes the tool
      for (const part of message.parts) {
        if (part.type === "tool-call" && WRITE_TOOL_NAMES.has(part.name)) {
          // Tool is complete if:
          // 1. Has tool-result part (server tools) - check across ALL messages
          // 2. Has output (client tools)
          // Note: We DON'T count isApprovedAndComplete because that triggers
          // BEFORE the tool actually executes (approval is set, then continuation runs)
          const hasResult = allCompletedToolCallIds.has(part.id);
          const hasOutput = part.output !== undefined;

          if (hasResult || hasOutput) {
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

    // Reduced debounce time for faster invalidation
    invalidationTimerRef.current = setTimeout(() => {
      const keysToInvalidate = [
        getQueryKeyPrefix(useTasksQuery),
        getQueryKeyPrefix(useTaskQuery),
        getQueryKeyPrefix(useProjectQuery),
        getQueryKeyPrefix(useAgentActivitiesQuery),
      ];

      for (const key of keysToInvalidate) {
        queryClient.invalidateQueries({ queryKey: key });
      }
      invalidationTimerRef.current = null;
    }, 100);

    return () => {
      if (invalidationTimerRef.current) {
        clearTimeout(invalidationTimerRef.current);
        invalidationTimerRef.current = null;
      }
    };
  }, [chatResult.messages, queryClient]);

  return {
    ...chatResult,
    // Use filtered messages that exclude continuation markers
    messages: filteredMessages,
    // Use wrapped approval response that triggers continuation
    addToolApprovalResponse: wrappedAddToolApprovalResponse,
    sessionId: sessionIdRef.current,
  };
}
