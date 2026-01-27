import {
  BotIcon,
  Loader2Icon,
  PencilIcon,
  SparklesIcon,
  UserIcon,
  WrenchIcon,
} from "lucide-react";
import { useEffect, useRef } from "react";

import { WRITE_TOOL_NAMES } from "@/lib/ai/constants";
import { cn } from "@/lib/utils";

import type { UIMessage } from "@tanstack/ai-client";

interface AgentChatMessagesProps {
  messages: UIMessage[];
  isLoading: boolean;
  error: Error | undefined;
}

/** Format a camelCase tool name into a human-readable label. */
function formatToolName(name: string): string {
  return name.replace(/([A-Z])/g, " $1").replace(/^./, (c) => c.toUpperCase());
}

/**
 * Format a write tool result into a human-readable summary.
 * Falls back to tool name if the output format is unexpected.
 */
function formatWriteResult(name: string, output: unknown): string {
  if (!output || typeof output !== "object") return "Done";

  const data = output as Record<string, unknown>;

  switch (name) {
    case "createTask": {
      const task = data.task as Record<string, unknown> | undefined;
      if (!task) return "Task created";
      const num = task.number ? `T-${task.number}: ` : "";
      return `Created ${num}${task.title ?? "task"}`;
    }
    case "updateTask": {
      const task = data.task as Record<string, unknown> | undefined;
      if (!task) return "Task updated";
      const num = task.number ? `T-${task.number}: ` : "";
      return `Updated ${num}${task.title ?? "task"}`;
    }
    case "moveTask": {
      const task = data.task as Record<string, unknown> | undefined;
      const num = task?.number ? `T-${task.number}: ` : "";
      return `Moved ${num}${data.fromColumn ?? "?"} → ${data.toColumn ?? "?"}`;
    }
    case "assignTask": {
      const action = data.action === "remove" ? "Unassigned" : "Assigned";
      return `${action} ${data.userName ?? "user"}`;
    }
    case "addLabel": {
      return `Added "${data.labelName ?? "label"}"`;
    }
    case "removeLabel": {
      return `Removed "${data.labelName ?? "label"}"`;
    }
    case "addComment": {
      return "Comment added";
    }
    default:
      return "Done";
  }
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
            const isWrite = WRITE_TOOL_NAMES.has(part.name);
            const isComplete =
              part.state === "input-complete" || part.output !== undefined;

            return (
              <div
                key={part.id}
                className={cn(
                  "flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs",
                  isWrite
                    ? "bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300"
                    : "bg-muted/50 text-muted-foreground",
                )}
              >
                {isWrite ? (
                  <PencilIcon className="size-3" />
                ) : (
                  <WrenchIcon className="size-3" />
                )}
                <span className="font-medium">
                  {formatToolName(part.name)}
                </span>
                {!isComplete && (
                  <Loader2Icon className="size-3 animate-spin" />
                )}
                {isComplete && (
                  <span
                    className={
                      isWrite
                        ? "text-blue-600 dark:text-blue-400"
                        : "text-green-600 dark:text-green-400"
                    }
                  >
                    {isWrite
                      ? formatWriteResult(part.name, part.output)
                      : "Done"}
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
