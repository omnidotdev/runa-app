import { Loader2Icon, RefreshCwIcon } from "lucide-react";
import { useMemo } from "react";

import { PROJECT_CREATION_TOOL_NAMES } from "@/lib/ai/constants";
import { getCompletedToolCallIds } from "@/lib/ai/utils";
import { ProjectCreationToolBubble } from "./ProjectCreationToolBubble";
import { ProjectProposalCard } from "./ProjectProposalCard";
import {
  ChatMessagesContainer,
  EmptyState,
  StreamingIndicator,
} from "./shared";

import type { UIMessage } from "@tanstack/ai-client";
import type { ReactElement } from "react";
import type { ProjectProposal } from "./ProjectProposalCard";

interface ProjectCreationMessagesProps {
  messages: UIMessage[];
  isLoading: boolean;
  error: Error | undefined;
  onApprovalResponse: (response: { id: string; approved: boolean }) => void;
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

  return (
    <ChatMessagesContainer
      isLoading={isLoading}
      messageCount={messages.length}
      ariaLabel="Project creation chat"
    >
      {messages.map((message) => {
        if (message.role === "user") {
          const textPart = message.parts.find((p) => p.type === "text");
          if (!textPart || textPart.type !== "text" || !textPart.content) {
            return null;
          }

          return (
            <div key={message.id} className="flex justify-end">
              <div className="bubble-user max-w-[85%] bg-primary px-4 py-2.5 text-primary-foreground text-sm">
                {textPart.content}
              </div>
            </div>
          );
        }

        if (message.role === "assistant") {
          const elements: ReactElement[] = [];

          for (const part of message.parts) {
            if (part.type === "text" && part.content) {
              elements.push(
                <div
                  key={`${message.id}-text-${elements.length}`}
                  className="bubble-assistant max-w-[95%] whitespace-pre-wrap border border-border bg-card px-4 py-3 text-sm"
                >
                  {part.content}
                </div>,
              );
            }

            if (
              part.type === "tool-call" &&
              PROJECT_CREATION_TOOL_NAMES.has(part.name)
            ) {
              const hasResult = allCompletedToolCallIds.has(part.id);

              // Special rendering for proposeProject
              if (part.name === "proposeProject" && hasResult) {
                const proposal = part.input as ProjectProposal | undefined;

                if (proposal?.name && proposal?.columns) {
                  elements.push(
                    <div key={`${message.id}-proposal-${part.id}`}>
                      <ProjectProposalCard proposal={proposal} />
                    </div>,
                  );
                } else {
                  const output = part.output as
                    | { summary?: string }
                    | undefined;
                  if (output?.summary) {
                    elements.push(
                      <div
                        key={`${message.id}-proposal-summary-${part.id}`}
                        className="bubble-assistant whitespace-pre-wrap border border-border bg-card px-4 py-3 text-sm"
                      >
                        {output.summary}
                      </div>,
                    );
                  }
                }
              } else if (part.name === "createProjectFromProposal") {
                elements.push(
                  <ProjectCreationToolBubble
                    key={`${message.id}-tool-${part.id}`}
                    part={part}
                    hasResult={hasResult}
                    isLoading={isLoading}
                    onApprovalResponse={onApprovalResponse}
                  />,
                );
              } else if (part.name === "proposeProject" && !hasResult) {
                elements.push(
                  <div
                    key={`${message.id}-proposing-${part.id}`}
                    className="flex items-center gap-2 rounded-lg border border-border bg-muted/30 px-3 py-2 text-muted-foreground text-xs"
                  >
                    <Loader2Icon className="size-3 animate-spin" />
                    <span>Preparing project proposal...</span>
                  </div>,
                );
              }
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
