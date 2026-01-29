import { useRouteContext } from "@tanstack/react-router";
import { SparklesIcon } from "lucide-react";

import {
  AvatarFallback,
  AvatarImage,
  AvatarRoot,
} from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { AgentMarkdown } from "./AgentMarkdown";
import { ToolCallBubble } from "./ToolCallBubble";

import type { UIMessage } from "@tanstack/ai-client";

interface MessageBubbleProps {
  message: UIMessage;
  isLastAssistant: boolean;
  isLoading: boolean;
  /** Set of tool call IDs that have completed (have tool-results) across ALL messages. */
  allCompletedToolCallIds: Set<string>;
  onApprovalResponse: (response: { id: string; approved: boolean }) => void;
}

export function MessageBubble({
  message,
  isLastAssistant,
  isLoading,
  allCompletedToolCallIds,
  onApprovalResponse,
}: MessageBubbleProps): React.ReactElement {
  const { session } = useRouteContext({ strict: false });
  const isUser = message.role === "user";
  const isStreaming = isLastAssistant && isLoading;

  return (
    <div className={cn("flex gap-2.5", isUser && "flex-row-reverse")}>
      {isUser ? (
        <AvatarRoot className="size-7 shrink-0">
          <AvatarImage
            src={session?.user.image ?? undefined}
            alt={session?.user.username}
          />
          <AvatarFallback className="bg-primary text-primary-foreground text-xs">
            {session?.user.username?.charAt(0).toUpperCase()}
          </AvatarFallback>
        </AvatarRoot>
      ) : (
        <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/10">
          <SparklesIcon className="size-3.5 text-primary" />
        </div>
      )}

      <div
        className={cn("flex max-w-[85%] flex-col gap-2", isUser && "items-end")}
      >
        {(message.parts ?? []).map((part, idx) => {
          if (part.type === "text") {
            if (isUser) {
              return (
                <div
                  key={`text-${idx}`}
                  className="bubble-user whitespace-pre-wrap bg-primary px-4 py-2.5 text-primary-foreground text-sm"
                >
                  {part.content}
                </div>
              );
            }

            return (
              <div
                key={`text-${idx}`}
                className="bubble-assistant border border-border bg-card px-4 py-3"
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
                className="bubble-assistant bg-muted/50 px-4 py-2.5 text-muted-foreground text-xs italic"
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
              />
            );
          }

          return null;
        })}
      </div>
    </div>
  );
}
