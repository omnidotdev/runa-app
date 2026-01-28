import { Loader2Icon, RefreshCwIcon, SparklesIcon } from "lucide-react";
import { useEffect, useRef } from "react";

import { MessageBubble } from "./MessageBubble";

import type { UIMessage } from "@tanstack/ai-client";
import type { RollbackByMatchParams } from "@/lib/ai/hooks/useRollback";

interface AgentChatMessagesProps {
  messages: UIMessage[];
  isLoading: boolean;
  error: Error | undefined;
  onApprovalResponse: (response: { id: string; approved: boolean }) => void;
  onRetry?: () => void;
  onUndoToolCall?: (toolName: string, toolInput: unknown) => void;
  /** The in-flight undo mutation variables for per-bubble loading state. */
  undoingToolCall?: RollbackByMatchParams;
}

export function AgentChatMessages({
  messages,
  isLoading,
  error,
  onApprovalResponse,
  onRetry,
  onUndoToolCall,
  undoingToolCall,
}: AgentChatMessagesProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // biome-ignore lint/correctness/useExhaustiveDependencies: Intentionally trigger scroll on message count change
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    // Only auto-scroll if the user is already near the bottom
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

  if (messages.length === 0 && !error) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
        <SparklesIcon className="size-8 text-muted-foreground/50" />
        <div>
          <p className="font-medium text-sm">Ask about your project</p>
          <p className="mt-1 text-muted-foreground text-xs">
            Query tasks, check priorities, or explore your board.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={scrollRef}
      className="flex-1 overflow-y-auto px-4 py-3"
      role="log"
      aria-live="polite"
      aria-label="Chat messages"
    >
      <div className="flex flex-col gap-4">
        {messages.map((message, messageIndex) => (
          <MessageBubble
            key={message.id}
            message={message}
            isLastAssistant={
              message.role === "assistant" &&
              messageIndex === messages.length - 1
            }
            isLoading={isLoading}
            onApprovalResponse={onApprovalResponse}
            onUndoToolCall={onUndoToolCall}
            undoingToolCall={undoingToolCall}
          />
        ))}
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
