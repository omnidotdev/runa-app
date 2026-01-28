import {
  AlertTriangleIcon,
  BotIcon,
  CheckCircleIcon,
  Loader2Icon,
  PencilIcon,
  RefreshCwIcon,
  SparklesIcon,
  Trash2Icon,
  UserIcon,
  WrenchIcon,
  XCircleIcon,
} from "lucide-react";
import { useEffect, useRef } from "react";

import { DESTRUCTIVE_TOOL_NAMES, WRITE_TOOL_NAMES } from "@/lib/ai/constants";
import { formatToolName } from "@/lib/ai/utils/formatToolName";
import { formatWriteResult } from "@/lib/ai/utils/formatWriteResult";
import { cn } from "@/lib/utils";

import { AgentMarkdown } from "./AgentMarkdown";
import { ToolApprovalActions } from "./ToolApprovalActions";

import type { UIMessage } from "@tanstack/ai-client";

interface AgentChatMessagesProps {
  messages: UIMessage[];
  isLoading: boolean;
  error: Error | undefined;
  onApprovalResponse: (response: { id: string; approved: boolean }) => void;
  onRetry?: () => void;
}

export function AgentChatMessages({
  messages,
  isLoading,
  error,
  onApprovalResponse,
  onRetry,
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
            <span className="flex-1">Something went wrong. Please try again.</span>
            {onRetry && (
              <button
                type="button"
                onClick={onRetry}
                className="inline-flex shrink-0 items-center gap-1 rounded-md px-2 py-1 text-xs font-medium transition-colors hover:bg-destructive/20"
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

function MessageBubble({
  message,
  isLastAssistant,
  isLoading,
  onApprovalResponse,
}: {
  message: UIMessage;
  isLastAssistant: boolean;
  isLoading: boolean;
  onApprovalResponse: (response: { id: string; approved: boolean }) => void;
}) {
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
              />
            );
          }

          return null;
        })}
      </div>
    </div>
  );
}

function ToolCallBubble({
  part,
  onApprovalResponse,
}: {
  part: Extract<UIMessage["parts"][number], { type: "tool-call" }>;
  onApprovalResponse: (response: { id: string; approved: boolean }) => void;
}) {
  const isWrite = WRITE_TOOL_NAMES.has(part.name);
  const isDestructive = DESTRUCTIVE_TOOL_NAMES.has(part.name);
  const isApprovalRequested = part.state === "approval-requested";
  const isApprovalResponded = part.state === "approval-responded";
  const isApproved = isApprovalResponded && part.approval?.approved === true;
  const isDenied = isApprovalResponded && part.approval?.approved === false;
  const isComplete =
    part.state === "input-complete" || part.output !== undefined;

  const toolLabel = formatToolName(part.name);

  // Approval requested — amber background with approve/deny actions
  if (isApprovalRequested && part.approval) {
    return (
      <div className="flex flex-col gap-2 rounded-md border border-amber-300 bg-amber-50 px-2.5 py-2 dark:border-amber-700 dark:bg-amber-950/50" aria-label={`${toolLabel}: approval required`}>
        <div className="flex items-center gap-1.5 text-xs text-amber-700 dark:text-amber-300">
          <AlertTriangleIcon className="size-3" />
          <span className="font-medium">
            {toolLabel}
          </span>
          <span className="text-amber-600 dark:text-amber-400">
            — Approval required
          </span>
        </div>
        <ToolApprovalActions
          approvalId={part.approval.id}
          toolName={part.name}
          input={part.input}
          onApprovalResponse={onApprovalResponse}
        />
      </div>
    );
  }

  // Approved, executing — green with spinner
  if (isApproved && part.output === undefined) {
    return (
      <div className="flex items-center gap-1.5 rounded-md bg-green-50 px-2.5 py-1.5 text-xs text-green-700 dark:bg-green-950/50 dark:text-green-300" aria-label={`${toolLabel}: approved, executing`}>
        <CheckCircleIcon className="size-3" />
        <span className="font-medium">{toolLabel}</span>
        <span className="text-green-600 dark:text-green-400">
          Approved, executing...
        </span>
        <Loader2Icon className="size-3 animate-spin" />
      </div>
    );
  }

  // Denied — red badge
  if (isDenied) {
    return (
      <div className="flex items-center gap-1.5 rounded-md bg-red-50 px-2.5 py-1.5 text-xs text-red-700 dark:bg-red-950/50 dark:text-red-300" aria-label={`${toolLabel}: denied`}>
        <XCircleIcon className="size-3" />
        <span className="font-medium">{toolLabel}</span>
        <span className="text-red-600 dark:text-red-400">Denied</span>
      </div>
    );
  }

  // Determine status for aria-label
  const statusLabel = isComplete ? "completed" : "running";

  // Default tool call display (same as before, with destructive icon variant)
  return (
    <div
      className={cn(
        "flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs",
        isDestructive
          ? "bg-red-50 text-red-700 dark:bg-red-950/50 dark:text-red-300"
          : isWrite
            ? "bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300"
            : "bg-muted/50 text-muted-foreground",
      )}
      aria-label={`${toolLabel}: ${statusLabel}`}
    >
      {isDestructive ? (
        <Trash2Icon className="size-3" />
      ) : isWrite ? (
        <PencilIcon className="size-3" />
      ) : (
        <WrenchIcon className="size-3" />
      )}
      <span className="font-medium">{toolLabel}</span>
      {!isComplete && !isApprovalResponded && (
        <Loader2Icon className="size-3 animate-spin" />
      )}
      {(isComplete || isApproved) && part.output !== undefined && (
        <span
          className={
            isDestructive
              ? "text-red-600 dark:text-red-400"
              : isWrite
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
