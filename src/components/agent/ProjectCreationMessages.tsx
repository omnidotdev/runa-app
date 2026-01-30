import {
  getToolOrDynamicToolName,
  isTextUIPart,
  isToolOrDynamicToolUIPart,
} from "ai";
import { Loader2Icon, RefreshCwIcon } from "lucide-react";
import { useCallback, useMemo, useState } from "react";

import { PROJECT_CREATION_TOOL_NAMES } from "@/lib/ai/constants";
import { getCompletedToolCallIds } from "@/lib/ai/utils";
import { ProjectCreationToolBubble } from "./ProjectCreationToolBubble";
import { ProjectProposalCard } from "./ProjectProposalCard";
import {
  ChatMessagesContainer,
  EmptyState,
  StreamingIndicator,
} from "./shared";

import type { UIMessage } from "ai";
import type { ReactElement } from "react";
import type { ProjectProposal } from "./ProjectProposalCard";

interface ProjectCreationMessagesProps {
  messages: UIMessage[];
  isLoading: boolean;
  error: Error | undefined;
  onApprovalResponse: (response: {
    id: string;
    approved: boolean;
    overrideProposal?: ProjectProposal;
  }) => void;
  onRetry?: () => void;
  /** Callback when a suggestion is clicked (auto-sends the message). */
  onSendMessage?: (message: string) => void;
}

const PROJECT_SUGGESTIONS = [
  {
    label: "A software development project",
    message: "A software development project",
  },
  {
    label: "Marketing campaign tracker",
    message: "Marketing campaign tracker",
  },
  {
    label: "Personal task board",
    message: "Personal task board",
  },
];

/**
 * Message list for project creation chat.
 *
 * Renders user messages, assistant text, and special handling for
 * proposeProject tool calls to show ProjectProposalCard.
 */
export function ProjectCreationMessages({
  messages,
  isLoading,
  error,
  onApprovalResponse,
  onRetry,
  onSendMessage,
}: ProjectCreationMessagesProps) {
  // Track completed tool calls
  const allCompletedToolCallIds = useMemo(
    () => getCompletedToolCallIds(messages),
    [messages],
  );

  // Track edited proposals by proposalId
  const [editedProposals, setEditedProposals] = useState<
    Map<string, ProjectProposal>
  >(new Map());

  // Handle proposal changes from editable cards
  const handleProposalChange = useCallback(
    (proposalId: string, proposal: ProjectProposal) => {
      setEditedProposals((prev) => {
        const next = new Map(prev);
        next.set(proposalId, proposal);
        return next;
      });
    },
    [],
  );

  // Get proposal for a given toolCallId (edited version if available)
  const getProposal = useCallback(
    (originalProposal: ProjectProposal, proposalId: string) => {
      return editedProposals.get(proposalId) ?? originalProposal;
    },
    [editedProposals],
  );

  // Handle approval with edited proposal
  const handleApprovalResponse = useCallback(
    (response: { id: string; approved: boolean }, proposalId?: string) => {
      const editedProposal = proposalId
        ? editedProposals.get(proposalId)
        : undefined;

      onApprovalResponse({
        id: response.id,
        approved: response.approved,
        overrideProposal: response.approved ? editedProposal : undefined,
      });
    },
    [onApprovalResponse, editedProposals],
  );

  // Empty state with clickable suggestions
  if (messages.length === 0 && !error) {
    return (
      <EmptyState
        title="What would you like to build?"
        description="Describe your project and I'll help you set it up with the right structure, columns, and labels."
        suggestions={PROJECT_SUGGESTIONS}
        onSuggestionClick={(message) => onSendMessage?.(message)}
      />
    );
  }

  // Find the active proposal (from the most recent proposeProject tool call)
  let activeProposalId: string | undefined;

  for (let i = messages.length - 1; i >= 0; i--) {
    const message = messages[i];
    if (message.role !== "assistant") continue;

    for (const part of message.parts) {
      if (!isToolOrDynamicToolUIPart(part)) continue;

      const toolName = getToolOrDynamicToolName(part);
      if (toolName === "proposeProject" && part.state === "output-available") {
        const output = part.output as { proposalId?: string } | undefined;
        if (output?.proposalId) {
          activeProposalId = output.proposalId;
          break;
        }
      }
    }
    if (activeProposalId) break;
  }

  return (
    <ChatMessagesContainer
      isLoading={isLoading}
      messageCount={messages.length}
      ariaLabel="Project creation chat"
    >
      {messages.map((message) => {
        if (message.role === "user") {
          // V6: Extract text from parts
          const textContent = message.parts
            .filter(isTextUIPart)
            .map((part) => part.text)
            .join("");
          if (!textContent) return null;

          return (
            <div key={message.id} className="flex justify-end">
              <div className="bubble-user max-w-[85%] bg-primary px-4 py-2.5 text-primary-foreground text-sm">
                {textContent}
              </div>
            </div>
          );
        }

        if (message.role === "assistant") {
          const elements: ReactElement[] = [];

          // V6: Extract text from parts
          const textContent = message.parts
            .filter(isTextUIPart)
            .map((part) => part.text)
            .join("");
          if (textContent) {
            elements.push(
              <div
                key={`${message.id}-text`}
                className="bubble-assistant max-w-[95%] whitespace-pre-wrap border border-border bg-card px-4 py-3 text-sm"
              >
                {textContent}
              </div>,
            );
          }

          // V6: Extract tool invocations from parts
          const toolParts = message.parts.filter(isToolOrDynamicToolUIPart);

          for (const part of toolParts) {
            const toolName = getToolOrDynamicToolName(part);
            if (!toolName || !PROJECT_CREATION_TOOL_NAMES.has(toolName)) {
              continue;
            }

            const hasResult = allCompletedToolCallIds.has(part.toolCallId);

            // Special rendering for proposeProject
            if (toolName === "proposeProject" && hasResult) {
              const originalProposal = part.input as
                | ProjectProposal
                | undefined;
              const output = part.output as { proposalId?: string } | undefined;

              if (originalProposal?.name && originalProposal?.columns) {
                const proposalId = output?.proposalId ?? part.toolCallId;
                const displayProposal = getProposal(
                  originalProposal,
                  proposalId,
                );

                // Only show editable card if there's a pending createProjectFromProposal
                // and this is the active proposal
                const isPendingApproval = messages.some((m) =>
                  m.parts.some(
                    (p) =>
                      isToolOrDynamicToolUIPart(p) &&
                      getToolOrDynamicToolName(p) ===
                        "createProjectFromProposal" &&
                      p.state === "approval-requested",
                  ),
                );

                elements.push(
                  <div key={`${message.id}-proposal-${part.toolCallId}`}>
                    <ProjectProposalCard
                      proposal={displayProposal}
                      editable={
                        isPendingApproval && proposalId === activeProposalId
                      }
                      onProposalChange={(updatedProposal) =>
                        handleProposalChange(proposalId, updatedProposal)
                      }
                    />
                  </div>,
                );
              } else if (part.state === "output-available") {
                const output = part.output as { summary?: string } | undefined;
                if (output?.summary) {
                  elements.push(
                    <div
                      key={`${message.id}-proposal-summary-${part.toolCallId}`}
                      className="bubble-assistant whitespace-pre-wrap border border-border bg-card px-4 py-3 text-sm"
                    >
                      {output.summary}
                    </div>,
                  );
                }
              }
            } else if (toolName === "createProjectFromProposal") {
              elements.push(
                <ProjectCreationToolBubble
                  key={`${message.id}-tool-${part.toolCallId}`}
                  part={part}
                  isLoading={isLoading}
                  onApprovalResponse={(response) =>
                    handleApprovalResponse(response, activeProposalId)
                  }
                />,
              );
            } else if (toolName === "proposeProject" && !hasResult) {
              elements.push(
                <div
                  key={`${message.id}-proposing-${part.toolCallId}`}
                  className="flex items-center gap-2 rounded-lg border border-border bg-muted/30 px-3 py-2 text-muted-foreground text-xs"
                >
                  <Loader2Icon className="size-3 animate-spin" />
                  <span>Preparing project proposal...</span>
                </div>,
              );
            }
          }

          if (elements.length === 0) return null;

          return (
            <div key={message.id} className="flex flex-col gap-2">
              {elements}
            </div>
          );
        }

        return null;
      })}

      {isLoading && <StreamingIndicator />}

      {error && (
        <div className="flex items-center gap-2 rounded-lg border border-destructive/50 bg-destructive/10 px-3 py-2 text-destructive text-sm">
          <span className="flex-1">
            Something went wrong. Please try again.
          </span>
          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="inline-flex shrink-0 items-center gap-1 rounded-md px-2 py-1 font-medium text-xs transition-colors hover:bg-destructive/20"
            >
              <RefreshCwIcon className="size-3" />
              Retry
            </button>
          )}
        </div>
      )}
    </ChatMessagesContainer>
  );
}
