import {
  BotIcon,
  Loader2Icon,
  SparklesIcon,
  UserIcon,
  WrenchIcon,
} from "lucide-react";
import { useEffect, useRef } from "react";

import { cn } from "@/lib/utils";

import type { UIMessage } from "@tanstack/ai-client";

interface AgentChatMessagesProps {
  messages: UIMessage[];
  isLoading: boolean;
  error: Error | undefined;
}

export function AgentChatMessages({
  messages,
  isLoading,
  error,
}: AgentChatMessagesProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

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
  }, [messages]);

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
    >
      <div className="flex flex-col gap-4">
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
        {isLoading && (
          <div className="flex items-center gap-2 text-muted-foreground text-xs">
            <Loader2Icon className="size-3 animate-spin" />
            <span>Thinking...</span>
          </div>
        )}
        {error && (
          <div className="rounded-lg border border-destructive/50 bg-destructive/10 px-3 py-2 text-destructive text-sm">
            Something went wrong. Please try again.
          </div>
        )}
      </div>
    </div>
  );
}

function MessageBubble({ message }: { message: UIMessage }) {
  const isUser = message.role === "user";

  return (
    <div className={cn("flex gap-2.5", isUser && "flex-row-reverse")}>
      <div
        className={cn(
          "flex size-6 shrink-0 items-center justify-center rounded-full",
          isUser ? "bg-primary text-primary-foreground" : "bg-muted",
        )}
      >
        {isUser ? (
          <UserIcon className="size-3.5" />
        ) : (
          <BotIcon className="size-3.5" />
        )}
      </div>

      <div
        className={cn(
          "flex max-w-[85%] flex-col gap-1.5",
          isUser && "items-end",
        )}
      >
        {message.parts.map((part, idx) => {
          if (part.type === "text") {
            return (
              <div
                key={`text-${idx}`}
                className={cn(
                  "whitespace-pre-wrap rounded-lg px-3 py-2 text-sm",
                  isUser
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted",
                )}
              >
                {part.content}
              </div>
            );
          }

          if (part.type === "thinking") {
            return (
              <div
                key={`thinking-${idx}`}
                className="rounded-lg bg-muted/50 px-3 py-2 text-muted-foreground text-xs italic"
              >
                {part.content}
              </div>
            );
          }

          if (part.type === "tool-call") {
            const isComplete =
              part.state === "input-complete" || part.output !== undefined;

            return (
              <div
                key={part.id}
                className="flex items-center gap-1.5 rounded-md bg-muted/50 px-2.5 py-1.5 text-muted-foreground text-xs"
              >
                <WrenchIcon className="size-3" />
                <span className="font-medium">{part.name}</span>
                {!isComplete && (
                  <Loader2Icon className="size-3 animate-spin" />
                )}
                {isComplete && (
                  <span className="text-green-600 dark:text-green-400">
                    Done
                  </span>
                )}
              </div>
            );
          }

          return null;
        })}
      </div>
    </div>
  );
}
