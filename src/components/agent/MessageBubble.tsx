import { BotIcon, UserIcon } from "lucide-react";

import { cn } from "@/lib/utils";

import { AgentMarkdown } from "./AgentMarkdown";
import { ToolCallBubble } from "./ToolCallBubble";

import type { UIMessage } from "@tanstack/ai-client";

import type { RollbackByMatchParams } from "@/lib/ai/hooks/useRollback";

interface MessageBubbleProps {
  message: UIMessage;
  isLastAssistant: boolean;
  isLoading: boolean;
  onApprovalResponse: (response: { id: string; approved: boolean }) => void;
  onUndoToolCall?: (toolName: string, toolInput: unknown) => void;
  /** The in-flight undo mutation variables for per-bubble loading state. */
  undoingToolCall?: RollbackByMatchParams;
}

export function MessageBubble({
  message,
  isLastAssistant,
  isLoading,
  onApprovalResponse,
  onUndoToolCall,
  undoingToolCall,
}: MessageBubbleProps) {
  const isUser = message.role === "user";
  const isStreaming = isLastAssistant && isLoading;

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
            if (isUser) {
              return (
                <div
                  key={`text-${idx}`}
                  className="whitespace-pre-wrap rounded-lg bg-primary px-3 py-2 text-primary-foreground text-sm"
                >
                  {part.content}
                </div>
              );
            }

            return (
              <div
                key={`text-${idx}`}
                className="rounded-lg bg-muted px-3 py-2"
              >
                <AgentMarkdown
                  content={part.content}
                  isStreaming={isStreaming}
                />
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
            return (
              <ToolCallBubble
                key={part.id}
                part={part}
                onApprovalResponse={onApprovalResponse}
                onUndo={onUndoToolCall}
                undoingToolCall={undoingToolCall}
              />
            );
          }

          return null;
        })}
      </div>
    </div>
  );
}
