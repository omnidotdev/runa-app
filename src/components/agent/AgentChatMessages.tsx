import { RefreshCwIcon } from "lucide-react";
import { useMemo } from "react";

import { getCompletedToolCallIds } from "@/lib/ai/utils";
import { MessageBubble } from "./MessageBubble";
import {
  ChatMessagesContainer,
  EmptyState,
  StreamingIndicator,
} from "./shared";

import type { UIMessage } from "@tanstack/ai-client";

interface AgentChatMessagesProps {
  messages: UIMessage[];
  isLoading: boolean;
  error: Error | undefined;
  onApprovalResponse: (response: { id: string; approved: boolean }) => void;
  onRetry?: () => void;
  /** Callback when a suggestion is clicked (auto-sends the message). */
  onSendMessage?: (message: string) => void;
}

const AGENT_SUGGESTIONS = [
  {
    label: "Show me high priority tasks",
    message: "Show me high priority tasks",
  },
  {
    label: "Create a task for...",
    message: "Create a task for ",
  },
  {
    label: "What's overdue?",
    message: "What tasks are overdue?",
  },
];

export function AgentChatMessages({
  messages,
  isLoading,
  error,
  onApprovalResponse,
  onRetry,
  onSendMessage,
}: AgentChatMessagesProps): React.ReactElement {
  // Collect all completed tool call IDs across ALL messages.
  // Server-side tools have tool-results in different messages than tool-calls,
  // so we need to track completion globally, not per-message.
  const allCompletedToolCallIds = useMemo(
    () => getCompletedToolCallIds(messages),
    [messages],
  );

  // Empty state with clickable suggestions
  if (messages.length === 0 && !error) {
    return (
      <EmptyState
        title="Ready to help with your board"
        description="Query tasks, check priorities, or explore your project."
        suggestions={AGENT_SUGGESTIONS}
        onSuggestionClick={(message) => onSendMessage?.(message)}
      />
    );
  }

  return (
    <ChatMessagesContainer
      isLoading={isLoading}
      messageCount={messages.length}
      ariaLabel="Chat messages"
    >
      {messages.map((message, messageIndex) => (
        <MessageBubble
          key={message.id}
          message={message}
          isLastAssistant={
            message.role === "assistant" && messageIndex === messages.length - 1
          }
          isLoading={isLoading}
          allCompletedToolCallIds={allCompletedToolCallIds}
          onApprovalResponse={onApprovalResponse}
        />
      ))}

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
