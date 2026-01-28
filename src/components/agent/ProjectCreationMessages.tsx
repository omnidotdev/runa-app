import { Loader2Icon, RefreshCwIcon, SparklesIcon } from "lucide-react";
import { useEffect, useMemo, useRef } from "react";

import { PROJECT_CREATION_TOOL_NAMES } from "@/lib/ai/constants";
import { ProjectCreationToolBubble } from "./ProjectCreationToolBubble";
import { ProjectProposalCard } from "./ProjectProposalCard";

import type { UIMessage } from "@tanstack/ai-client";
import type { ReactElement } from "react";
import type { ProjectProposal } from "./ProjectProposalCard";

interface ProjectCreationMessagesProps {
  messages: UIMessage[];
  isLoading: boolean;
  error: Error | undefined;
  onApprovalResponse: (response: { id: string; approved: boolean }) => void;
  onRetry?: () => void;
}

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
}: ProjectCreationMessagesProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Track completed tool calls
  const allCompletedToolCallIds = useMemo(() => {
    const ids = new Set<string>();
    for (const message of messages) {
      if (message.role !== "assistant") continue;
      for (const part of message.parts) {
        if (part.type === "tool-result") {
          ids.add(part.toolCallId);
        }
      }
    }
    return ids;
  }, [messages]);

  // Auto-scroll
  // biome-ignore lint/correctness/useExhaustiveDependencies: Trigger on message count
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const isNearBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight <
      100;

    if (isNearBottom) {
      container.scrollTo({
        top: container.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages.length]);

  // Empty state
  if (messages.length === 0 && !error) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
        <SparklesIcon className="size-10 text-primary/30" />
        <div>
          <p className="font-medium text-sm">What would you like to build?</p>
          <p className="mt-1 max-w-[280px] text-muted-foreground text-xs">
            Describe your project and I'll help you set it up with the right
            structure, columns, and labels.
          </p>
        </div>
        <div className="mt-2 flex flex-wrap justify-center gap-2">
          {[
            "A software development project",
            "Marketing campaign tracker",
            "Personal task board",
          ].map((suggestion) => (
            <span
              key={suggestion}
              className="rounded-full border bg-muted/50 px-3 py-1 text-muted-foreground text-xs"
            >
              {suggestion}
            </span>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      ref={scrollRef}
      className="custom-scrollbar flex-1 overflow-y-auto px-4 py-3"
      role="log"
      aria-live="polite"
      aria-label="Project creation chat"
    >
      <div className="flex flex-col gap-4">
        {messages.map((message) => {
          if (message.role === "user") {
            // User message
            const textPart = message.parts.find((p) => p.type === "text");
            if (!textPart || textPart.type !== "text" || !textPart.content) {
              return null;
            }

            return (
              <div key={message.id} className="flex justify-end">
                <div className="max-w-[85%] rounded-lg bg-primary px-3 py-2 text-primary-foreground text-sm">
                  {textPart.content}
                </div>
              </div>
            );
          }

          if (message.role === "assistant") {
            // Assistant message - may contain text and/or tool calls
            const elements: ReactElement[] = [];

            for (const part of message.parts) {
              if (part.type === "text" && part.content) {
                elements.push(
                  <div
                    key={`${message.id}-text-${elements.length}`}
                    className="max-w-[95%] whitespace-pre-wrap rounded-lg bg-muted px-3 py-2 text-sm"
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
                  // Extract proposal from input (with defensive checks)
                  const proposal = part.input as ProjectProposal | undefined;

                  // Only render card if proposal has required fields
                  if (proposal?.name && proposal?.columns) {
                    elements.push(
                      <div key={`${message.id}-proposal-${part.id}`}>
                        <ProjectProposalCard proposal={proposal} />
                      </div>,
                    );
                  } else {
                    // Fallback: show summary from output if input unavailable
                    const output = part.output as
                      | { summary?: string }
                      | undefined;
                    if (output?.summary) {
                      elements.push(
                        <div
                          key={`${message.id}-proposal-summary-${part.id}`}
                          className="whitespace-pre-wrap rounded-lg border bg-card px-4 py-3 text-sm"
                        >
                          {output.summary}
                        </div>,
                      );
                    }
                  }
                } else if (part.name === "createProjectFromProposal") {
                  // Show creation tool bubble
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
                  // Proposal in progress
                  elements.push(
                    <div
                      key={`${message.id}-proposing-${part.id}`}
                      className="flex items-center gap-2 rounded-md bg-muted/50 px-3 py-2 text-muted-foreground text-xs"
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

        {isLoading && (
          <div className="flex items-center gap-2 text-muted-foreground text-xs">
            <Loader2Icon className="size-3 animate-spin" />
            <span>Thinking...</span>
          </div>
        )}

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
      </div>
    </div>
  );
}
