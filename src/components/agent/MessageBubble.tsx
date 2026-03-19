/** Message bubble component for agent chat. */

import { useRouteContext } from "@tanstack/react-router";
import { isTextUIPart, isToolOrDynamicToolUIPart } from "ai";
import { SparklesIcon } from "lucide-react";

import {
  AvatarFallback,
  AvatarImage,
  AvatarRoot,
} from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { AgentMarkdown } from "./AgentMarkdown";
import { ToolCallBubble } from "./ToolCallBubble";

import type { UIMessage } from "ai";

interface MessageBubbleProps {
  message: UIMessage;
  isLastAssistant: boolean;
  isLoading: boolean;
  /** Set of tool call IDs that have completed across ALL messages. */
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

  // V6: Extract text content and tool invocations from parts
  const textParts = message.parts.filter(isTextUIPart);
  const toolParts = message.parts.filter(isToolOrDynamicToolUIPart);

  // Combine text content
  const textContent = textParts.map((part) => part.text).join("");
  const hasTextContent = textContent.length > 0;

  return (
    <div className={cn("flex gap-2", isUser && "flex-row-reverse")}>
      {isUser ? (
        <AvatarRoot className="size-5 shrink-0">
          <AvatarImage
            src={session?.user.image ?? undefined}
            alt={session?.user.username}
          />
          <AvatarFallback className="bg-primary text-[10px] text-primary-foreground">
            {session?.user.username?.charAt(0).toUpperCase()}
          </AvatarFallback>
        </AvatarRoot>
      ) : (
        <div className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/10">
          <SparklesIcon className="size-3 text-primary" />
        </div>
      )}

      <div
        className={cn("flex max-w-[92%] flex-col gap-2", isUser && "items-end")}
      >
        {/* Render text content */}
        {hasTextContent &&
          (isUser ? (
            <div className="whitespace-pre-wrap rounded-2xl bg-primary px-4 py-2.5 text-primary-foreground text-sm">
              {textContent}
            </div>
          ) : (
            <div className="rounded-2xl border border-border bg-card px-4 py-3">
              <AgentMarkdown content={textContent} isStreaming={isStreaming} />
            </div>
          ))}

        {/* Render tool invocations */}
        {toolParts.map((part) => (
          <ToolCallBubble
            key={part.toolCallId}
            part={part}
            hasResult={allCompletedToolCallIds.has(part.toolCallId)}
            isLoading={isLoading}
            onApprovalResponse={onApprovalResponse}
          />
        ))}
      </div>
    </div>
  );
}
