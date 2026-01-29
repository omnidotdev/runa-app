import { fetchServerSentEvents, useChat } from "@tanstack/ai-react";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useRef } from "react";

import {
  useProjectColumnsQuery,
  useProjectsQuery,
  useProjectsSidebarQuery,
} from "@/generated/graphql";
import { API_BASE_URL } from "@/lib/config/env.config";
import getQueryKeyPrefix from "@/lib/util/getQueryKeyPrefix";
import { PROJECT_CREATION_TOOL_NAMES } from "./constants";
import { useAccessToken } from "./hooks/useAccessToken";
import { extractApprovals } from "./utils";

import type { UIMessage } from "@tanstack/ai-client";

/** Project data returned after successful creation. */
export interface CreatedProject {
  id: string;
  name: string;
  slug: string;
  prefix: string;
}

interface UseProjectCreationChatOptions {
  organizationId: string;
  organizationName?: string;
  /** Session ID to resume. `null` starts a new session. */
  sessionId?: string | null;
  /**
   * Composite key that changes whenever the session should be recreated.
   */
  sessionKey?: string;
  /** Called when the server returns a session ID in response headers. */
  onSessionId?: (sessionId: string) => void;
  /** Called when a project is successfully created. */
  onProjectCreated?: (project: CreatedProject, boardUrl: string) => void;
}

/**
 * Hook for AI-assisted project creation chat.
 *
 * Similar to useAgentChat but operates at the organization level
 * and handles project creation workflow.
 */
export function useProjectCreationChat({
  organizationId,
  organizationName,
  sessionId,
  sessionKey,
  onSessionId,
  onProjectCreated,
}: UseProjectCreationChatOptions) {
  const accessToken = useAccessToken();
  const queryClient = useQueryClient();
  const sessionIdRef = useRef<string | null>(sessionId ?? null);
  const accessTokenRef = useRef(accessToken);
  const organizationIdRef = useRef(organizationId);
  const organizationNameRef = useRef(organizationName);
  const onSessionIdRef = useRef(onSessionId);
  const onProjectCreatedRef = useRef(onProjectCreated);
  const messagesRef = useRef<UIMessage[]>([]);
  const lastCreationCountRef = useRef(0);
  const invalidationTimerRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );

  // Keep refs in sync
  accessTokenRef.current = accessToken;
  organizationIdRef.current = organizationId;
  organizationNameRef.current = organizationName;
  onSessionIdRef.current = onSessionId;
  onProjectCreatedRef.current = onProjectCreated;

  // biome-ignore lint/correctness/useExhaustiveDependencies: Intentionally recreate on sessionKey/sessionId change
  const connection = useMemo(() => {
    sessionIdRef.current = sessionId ?? null;
    lastCreationCountRef.current = 0;

    return fetchServerSentEvents(
      `${API_BASE_URL}/api/ai/project-creation/chat`,
      () => {
        const approvals = extractApprovals(messagesRef.current);

        return {
          headers: {
            Authorization: `Bearer ${accessTokenRef.current}`,
          },
          body: {
            organizationId: organizationIdRef.current,
            ...(organizationNameRef.current
              ? { organizationName: organizationNameRef.current }
              : {}),
            ...(sessionIdRef.current
              ? { sessionId: sessionIdRef.current }
              : {}),
            ...(approvals.length > 0 ? { approvals } : {}),
          },
          fetchClient: async (url, init) => {
            const response = await fetch(url, init);
            try {
              const sid = response.headers.get("X-Agent-Session-Id");
              if (sid && typeof sid === "string" && sid.length > 0) {
                sessionIdRef.current = sid;
                onSessionIdRef.current?.(sid);
              }
            } catch {
              // Non-critical
            }
            return response;
          },
        };
      },
    );
  }, [sessionKey, sessionId]);

  const chatResult = useChat({ connection });

  messagesRef.current = chatResult.messages;

  // Continuation marker for approval flow
  const CONTINUATION_MARKER = "[CONTINUE_AFTER_APPROVAL]";

  const wrappedAddToolApprovalResponse = useCallback(
    async (response: { id: string; approved: boolean }) => {
      await chatResult.addToolApprovalResponse(response);

      if (response.approved) {
        await new Promise((resolve) => setTimeout(resolve, 50));
        await chatResult.append({
          role: "user",
          content: CONTINUATION_MARKER,
        });
      }
    },
    [chatResult],
  );

  // Filter out continuation markers
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

  // Clear messages on generation change
  const prevGenerationRef = useRef<string | null>(null);
  const clearMessages = chatResult.clear;
  // biome-ignore lint/correctness/useExhaustiveDependencies: Only trigger on sessionKey change
  useEffect(() => {
    const currentGeneration = sessionKey?.split("-").pop() ?? null;
    if (
      prevGenerationRef.current !== null &&
      prevGenerationRef.current !== currentGeneration
    ) {
      clearMessages();
    }
    prevGenerationRef.current = currentGeneration;
  }, [sessionKey]);

  // Watch for successful project creation and trigger callback + query invalidation
  // Uses debounced invalidation pattern from useAgentChat for reliable cache updates
  useEffect(() => {
    const allCompletedToolCallIds = new Set<string>();
    for (const message of chatResult.messages) {
      if (message.role !== "assistant") continue;
      for (const part of message.parts) {
        if (part.type === "tool-result") {
          allCompletedToolCallIds.add(part.toolCallId);
        }
      }
    }

    let creationCount = 0;
    let pendingProject: { project: CreatedProject; boardUrl: string } | null =
      null;

    for (const message of chatResult.messages) {
      if (message.role !== "assistant") continue;

      for (const part of message.parts) {
        if (
          part.type === "tool-call" &&
          PROJECT_CREATION_TOOL_NAMES.has(part.name) &&
          part.name === "createProjectFromProposal"
        ) {
          const hasResult = allCompletedToolCallIds.has(part.id);
          const hasOutput = part.output !== undefined;

          if (hasResult || hasOutput) {
            creationCount++;

            // Extract project data from output
            const output = part.output as
              | {
                  project?: CreatedProject;
                  boardUrl?: string;
                }
              | undefined;

            if (output?.project && output?.boardUrl) {
              pendingProject = {
                project: output.project,
                boardUrl: output.boardUrl,
              };
            }
          }
        }
      }
    }

    // Only process when new creation completions appear
    if (creationCount <= lastCreationCountRef.current) return;
    lastCreationCountRef.current = creationCount;

    // Debounce invalidation to prevent rapid-fire during streaming
    // and ensure database transaction has committed
    if (invalidationTimerRef.current) {
      clearTimeout(invalidationTimerRef.current);
    }

    invalidationTimerRef.current = setTimeout(() => {
      // Invalidate all project-related queries for full UI reactivity
      // Following the same pattern as useAgentChat and mutation handlers
      const keysToInvalidate = [
        getQueryKeyPrefix(useProjectsQuery),
        getQueryKeyPrefix(useProjectColumnsQuery),
        getQueryKeyPrefix(useProjectsSidebarQuery),
      ];

      for (const key of keysToInvalidate) {
        queryClient.invalidateQueries({ queryKey: key });
      }

      invalidationTimerRef.current = null;

      // Trigger callback after invalidation is queued
      if (pendingProject) {
        onProjectCreatedRef.current?.(
          pendingProject.project,
          pendingProject.boardUrl,
        );
      }
    }, 150); // Slightly longer delay than useAgentChat to ensure DB commit

    return () => {
      if (invalidationTimerRef.current) {
        clearTimeout(invalidationTimerRef.current);
        invalidationTimerRef.current = null;
      }
    };
  }, [chatResult.messages, queryClient]);

  return {
    ...chatResult,
    messages: filteredMessages,
    addToolApprovalResponse: wrappedAddToolApprovalResponse,
    sessionId: sessionIdRef.current,
  };
}
