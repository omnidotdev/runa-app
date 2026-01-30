/**
 * Hook for AI-assisted project creation.
 *
 * Similar to useAgentChat but operates at the organization level
 * and handles project creation workflow.
 */

import { useChat } from "@ai-sdk/react";
import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import {
  DefaultChatTransport,
  convertToModelMessages,
  getToolOrDynamicToolName,
  isToolOrDynamicToolUIPart,
  lastAssistantMessageIsCompleteWithApprovalResponses,
} from "ai";
import { useCallback, useEffect, useMemo, useRef } from "react";

import {
  useProjectColumnsQuery,
  useProjectsQuery,
  useProjectsSidebarQuery,
} from "@/generated/graphql";
import { API_BASE_URL } from "@/lib/config/env.config";
import toolRegistryOptions, {
  isProjectCreationTool,
} from "@/lib/options/toolRegistry.options";
import getQueryKeyPrefix from "@/lib/util/getQueryKeyPrefix";
import { useAccessToken } from "./hooks/useAccessToken";

import type { UIMessage } from "ai";
import type { ProjectProposal } from "@/components/agent/ProjectProposalCard";

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
  /** Composite key that changes whenever the session should be recreated. */
  sessionKey?: string;
  /** Called when the server returns a session ID in response headers. */
  onSessionId?: (sessionId: string) => void;
  /** Called when a project is successfully created. */
  onProjectCreated?: (project: CreatedProject, boardUrl: string) => void;
}

/**
 * Hook for AI-assisted project creation chat.
 *
 * Uses refs for dynamic values (token, organizationId) to keep the connection
 * stable — avoiding reconnection during a conversation.
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
  const lastCreationCountRef = useRef(0);

  // Fetch tool registry (cached with staleTime: Infinity)
  const { data: registry } = useSuspenseQuery(toolRegistryOptions());

  // Keep refs in sync with latest prop values
  accessTokenRef.current = accessToken;
  organizationIdRef.current = organizationId;
  organizationNameRef.current = organizationName;
  onSessionIdRef.current = onSessionId;
  onProjectCreatedRef.current = onProjectCreated;

  // Generate a unique ID for this chat instance based on session
  const chatId = useMemo(() => {
    sessionIdRef.current = sessionId ?? null;
    lastCreationCountRef.current = 0;
    return `project-creation-${sessionKey ?? "new"}-${Date.now()}`;
  }, [sessionKey, sessionId]);

  // Create transport with dynamic headers and body
  const transport = useMemo(() => {
    return new DefaultChatTransport({
      api: `${API_BASE_URL}/api/ai/project-creation/chat`,
      headers: () => ({
        Authorization: `Bearer ${accessTokenRef.current}`,
      }),
      body: () => ({
        organizationId: organizationIdRef.current,
        ...(organizationNameRef.current
          ? { organizationName: organizationNameRef.current }
          : {}),
        ...(sessionIdRef.current ? { sessionId: sessionIdRef.current } : {}),
      }),
      prepareSendMessagesRequest: async (options) => {
        // Convert UIMessages to ModelMessages for the backend
        const modelMessages = await convertToModelMessages(options.messages);

        return {
          body: {
            organizationId: organizationIdRef.current,
            ...(organizationNameRef.current
              ? { organizationName: organizationNameRef.current }
              : {}),
            ...(sessionIdRef.current
              ? { sessionId: sessionIdRef.current }
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

  // Watch for successful project creation and trigger callback + query invalidation
  useEffect(() => {
    let creationCount = 0;
    let pendingProject: { project: CreatedProject; boardUrl: string } | null =
      null;

    for (const message of chatResult.messages) {
      if (message.role !== "assistant") continue;

      for (const part of message.parts) {
        if (isToolOrDynamicToolUIPart(part)) {
          const toolName = getToolOrDynamicToolName(part);
          if (
            toolName &&
            isProjectCreationTool(toolName, registry) &&
            toolName === "createProjectFromProposal" &&
            part.state === "output-available"
          ) {
            creationCount++;

            const output = part.output as
              | { project?: CreatedProject; boardUrl?: string }
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

    // Invalidate immediately - no debounce needed since we track count
    const keysToInvalidate = [
      getQueryKeyPrefix(useProjectsQuery),
      getQueryKeyPrefix(useProjectColumnsQuery),
      getQueryKeyPrefix(useProjectsSidebarQuery),
    ];

    for (const key of keysToInvalidate) {
      queryClient.invalidateQueries({ queryKey: key });
    }

    if (pendingProject) {
      onProjectCreatedRef.current?.(
        pendingProject.project,
        pendingProject.boardUrl,
      );
    }
  }, [chatResult.messages, queryClient, registry]);

  // Store edited proposals keyed by proposalId
  const editedProposalsRef = useRef<Map<string, ProjectProposal>>(new Map());

  const setEditedProposal = useCallback(
    (proposalId: string, proposal: ProjectProposal) => {
      editedProposalsRef.current.set(proposalId, proposal);
    },
    [],
  );

  const getEditedProposal = useCallback((proposalId: string) => {
    return editedProposalsRef.current.get(proposalId);
  }, []);

  const clearEditedProposal = useCallback((proposalId: string) => {
    editedProposalsRef.current.delete(proposalId);
  }, []);

  const addToolApprovalResponse = useCallback(
    (response: {
      id: string;
      approved: boolean;
      overrideProposal?: ProjectProposal;
    }) => {
      // If approved and there's an override proposal, we need to modify the tool input
      // The approach: modify the message containing the createProjectFromProposal tool call
      // to include the overrideProposal in its input
      if (response.approved && response.overrideProposal) {
        const currentMessages = chatResult.messages;
        const updatedMessages = currentMessages.map((message) => {
          if (message.role !== "assistant") return message;

          const updatedParts = message.parts.map((part) => {
            if (!isToolOrDynamicToolUIPart(part)) return part;

            const toolName = getToolOrDynamicToolName(part);
            if (toolName !== "createProjectFromProposal") return part;

            // Check if this is the tool we're approving
            const approvalId = part.approval?.id ?? part.toolCallId;
            if (approvalId !== response.id) return part;

            // Add overrideProposal to the input
            return {
              ...part,
              input: {
                ...(part.input as object),
                overrideProposal: response.overrideProposal,
              },
            };
          });

          return { ...message, parts: updatedParts };
        });

        chatResult.setMessages(updatedMessages as UIMessage[]);
      }

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
    setEditedProposal,
    getEditedProposal,
    clearEditedProposal,
    sessionId: sessionIdRef.current,
    // Expose regenerate for retry functionality
    regenerate: chatResult.regenerate,
    status: chatResult.status,
  };
}
