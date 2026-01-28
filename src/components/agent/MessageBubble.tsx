import { useRouteContext } from "@tanstack/react-router";
import { BotIcon } from "lucide-react";

import {
  AvatarFallback,
  AvatarImage,
  AvatarRoot,
} from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { AgentMarkdown } from "./AgentMarkdown";
import { ToolCallBubble } from "./ToolCallBubble";

import type { UIMessage } from "@tanstack/ai-client";
import type { RollbackByMatchParams } from "@/lib/ai/hooks/useRollback";

interface MessageBubbleProps {
  message: UIMessage;
  isLastAssistant: boolean;
  isLoading: boolean;
  /** Set of tool call IDs that have completed (have tool-results) across ALL messages. */
  allCompletedToolCallIds: Set<string>;
  onApprovalResponse: (response: { id: string; approved: boolean }) => void;
  onUndoToolCall?: (toolName: string, toolInput: unknown) => void;
  /** The in-flight undo mutation variables for per-bubble loading state. */
  undoingToolCall?: RollbackByMatchParams;
}

export function MessageBubble({
  message,
  isLastAssistant,
  isLoading,
  allCompletedToolCallIds,
  onApprovalResponse,
  onUndoToolCall,
  undoingToolCall,
}: MessageBubbleProps) {
  const { session } = useRouteContext({ strict: false });
  const isUser = message.role === "user";
  const isStreaming = isLastAssistant && isLoading;

  return (
    <div className={cn("flex gap-2.5", isUser && "flex-row-reverse")}>
      {isUser ? (
        <AvatarRoot className="size-6 shrink-0">
          <AvatarImage
            src={session?.user.image ?? undefined}
            alt={session?.user.username}
          />
          <AvatarFallback className="bg-primary text-primary-foreground text-xs">
            {session?.user.username?.charAt(0).toUpperCase()}
          </AvatarFallback>
        </AvatarRoot>
      ) : (
        <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-muted">
          <BotIcon className="size-3.5" />
        </div>
      )}

      <div
        className={cn(
          "flex max-w-[85%] flex-col gap-1.5",
          isUser && "items-end",
        )}
      >
        {(message.parts ?? []).map((part, idx) => {
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
                hasResult={allCompletedToolCallIds.has(part.id)}
                isLoading={isLoading}
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
