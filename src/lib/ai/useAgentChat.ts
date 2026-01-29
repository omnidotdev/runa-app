/**
 * Hook for AI agent chat.
 *
 * Wraps @ai-sdk/react's useChat with project-scoped auth and session management.
 */

import { useChat } from "@ai-sdk/react";
import { useQueryClient } from "@tanstack/react-query";
import {
  DefaultChatTransport,
  convertToModelMessages,
  getToolOrDynamicToolName,
  isToolOrDynamicToolUIPart,
  lastAssistantMessageIsCompleteWithApprovalResponses,
} from "ai";
import { useCallback, useEffect, useMemo, useRef } from "react";

import {
  useAgentActivitiesQuery,
  useLabelsQuery,
  useProjectQuery,
  useTaskQuery,
  useTasksQuery,
} from "@/generated/graphql";
import { API_BASE_URL } from "@/lib/config/env.config";
import getQueryKeyPrefix from "@/lib/util/getQueryKeyPrefix";
import { WRITE_TOOL_NAMES } from "./constants";
import { useAccessToken } from "./hooks/useAccessToken";

import type { UIMessage } from "ai";

interface UseAgentChatOptions {
  projectId: string;
  /** Session ID to resume. `null` starts a new session. */
  sessionId?: string | null;
  /**
   * Composite key that changes whenever the session should be recreated.
   * Includes a generation counter to handle null→null transitions.
   */
  sessionKey?: string;
  /** Persona to use for this chat session. `null` uses the org default. */
  personaId?: string | null;
  /** Called when the server returns a session ID in response headers. */
  onSessionId?: (sessionId: string) => void;
}

/**
 * Uses refs for dynamic values (token, projectId) to keep the connection
 * stable — avoiding reconnection during a conversation. The sessionId is
 * included in the key so switching sessions recreates the hook state.
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
  const lastWriteCountRef = useRef(0);

  // Keep refs in sync with latest prop values
  accessTokenRef.current = accessToken;
  projectIdRef.current = projectId;
  personaIdRef.current = personaId ?? null;
  onSessionIdRef.current = onSessionId;

  // Generate a unique ID for this chat instance based on session
  const chatId = useMemo(() => {
    sessionIdRef.current = sessionId ?? null;
    lastWriteCountRef.current = 0;
    return `agent-chat-${sessionKey ?? "new"}-${Date.now()}`;
  }, [sessionKey, sessionId]);

  // Create transport with dynamic headers and body
  const transport = useMemo(() => {
    return new DefaultChatTransport({
      api: `${API_BASE_URL}/api/ai/chat`,
      headers: () => ({
        Authorization: `Bearer ${accessTokenRef.current}`,
      }),
      body: () => ({
        projectId: projectIdRef.current,
        ...(sessionIdRef.current ? { sessionId: sessionIdRef.current } : {}),
        ...(personaIdRef.current ? { personaId: personaIdRef.current } : {}),
      }),
      prepareSendMessagesRequest: async (options) => {
        // Convert UIMessages to ModelMessages for the backend
        const modelMessages = await convertToModelMessages(options.messages);

        return {
          body: {
            projectId: projectIdRef.current,
            ...(sessionIdRef.current
              ? { sessionId: sessionIdRef.current }
              : {}),
            ...(personaIdRef.current
              ? { personaId: personaIdRef.current }
              : {}),
            messages: modelMessages,
          },
          headers: {
            ...options.headers,
            Authorization: `Bearer ${accessTokenRef.current}`,
          },
          credentials: options.credentials,
          api: options.api,
        };
      },
      fetch: async (input, init) => {
        const response = await globalThis.fetch(input, init);
        // Capture session ID from response headers
        try {
          const sid = response.headers.get("X-Agent-Session-Id");
          if (sid && typeof sid === "string" && sid.length > 0) {
            sessionIdRef.current = sid;
            onSessionIdRef.current?.(sid);
          }
        } catch {
          // Session ID extraction is non-critical
        }
        return response;
      },
    });
  }, []);

  const chatResult = useChat({
    id: chatId,
    transport,
    // Auto-continue chat after tool approvals are responded to
    sendAutomaticallyWhen: lastAssistantMessageIsCompleteWithApprovalResponses,
  });

  // Clear messages when generation changes (new session started)
  const prevGenerationRef = useRef<string | null>(null);
  const setMessages = chatResult.setMessages;

  useEffect(() => {
    const currentGeneration = sessionKey?.split("-").pop() ?? null;
    if (
      prevGenerationRef.current !== null &&
      prevGenerationRef.current !== currentGeneration
    ) {
      setMessages([]);
    }
    prevGenerationRef.current = currentGeneration;
  }, [sessionKey, setMessages]);

  // Invalidate React Query cache when new write tools complete
  useEffect(() => {
    let completedWriteCount = 0;

    for (const message of chatResult.messages) {
      if (message.role !== "assistant") continue;

      for (const part of message.parts) {
        if (isToolOrDynamicToolUIPart(part)) {
          const toolName = getToolOrDynamicToolName(part);
          if (
            toolName &&
            WRITE_TOOL_NAMES.has(toolName) &&
            part.state === "output-available"
          ) {
            completedWriteCount++;
          }
        }
      }
    }

    if (completedWriteCount <= lastWriteCountRef.current) return;
    lastWriteCountRef.current = completedWriteCount;

    const keysToInvalidate = [
      getQueryKeyPrefix(useTasksQuery),
      getQueryKeyPrefix(useTaskQuery),
      getQueryKeyPrefix(useProjectQuery),
      getQueryKeyPrefix(useLabelsQuery),
      getQueryKeyPrefix(useAgentActivitiesQuery),
    ];

    for (const key of keysToInvalidate) {
      queryClient.invalidateQueries({ queryKey: key });
    }
  }, [chatResult.messages, queryClient]);

  const addToolApprovalResponse = useCallback(
    (response: { id: string; approved: boolean }) => {
      chatResult.addToolApprovalResponse({
        id: response.id,
        approved: response.approved,
      });
    },
    [chatResult],
  );

  // Derive loading state from status
  const isLoading =
    chatResult.status === "submitted" || chatResult.status === "streaming";

  return {
    messages: chatResult.messages as UIMessage[],
    sendMessage: chatResult.sendMessage,
    isLoading,
    stop: chatResult.stop,
    error: chatResult.error,
    setMessages: chatResult.setMessages,
    addToolApprovalResponse,
    sessionId: sessionIdRef.current,
    // Expose regenerate for retry functionality
    regenerate: chatResult.regenerate,
    status: chatResult.status,
  };
}
