/** Tool call bubble component for agent chat. */

import { useSuspenseQuery } from "@tanstack/react-query";
import { getToolOrDynamicToolName } from "ai";
import {
  CheckCircle2Icon,
  ChevronDownIcon,
  ChevronRightIcon,
  CircleDotIcon,
  ColumnsIcon,
  Loader2Icon,
  PencilIcon,
  Trash2Icon,
  UsersIcon,
  WrenchIcon,
  XCircleIcon,
} from "lucide-react";
import { useState } from "react";

import { formatToolName } from "@/lib/ai/utils/formatToolName";
import toolRegistryOptions, {
  isColumnTool,
  isDelegationTool,
  isDestructiveTool,
  isWriteTool,
} from "@/lib/options/toolRegistry.options";
import { cn } from "@/lib/utils";
import { ToolApprovalActions } from "./ToolApprovalActions";

import type { DynamicToolUIPart, ToolUIPart } from "ai";

type ToolPart = ToolUIPart | DynamicToolUIPart;

interface ToolCallBubbleProps {
  part: ToolPart;
  /** Whether there's a completed result for this tool call. */
  hasResult?: boolean;
  /** Whether the chat is currently loading/streaming. */
  isLoading?: boolean;
  onApprovalResponse: (response: { id: string; approved: boolean }) => void;
}

/** Extract persona name and response from delegation tool output. */
function parseDelegationOutput(output: unknown): {
  personaName: string;
  response: string;
} | null {
  if (!output || typeof output !== "object") return null;
  const data = output as Record<string, unknown>;
  if (
    typeof data.personaName === "string" &&
    typeof data.response === "string"
  ) {
    return { personaName: data.personaName, response: data.response };
  }
  return null;
}

export function ToolCallBubble({
  part,
  hasResult,
  onApprovalResponse,
}: ToolCallBubbleProps): React.ReactElement {
  const [isDelegateExpanded, setIsDelegateExpanded] = useState(false);

  // Fetch tool registry (cached with staleTime: Infinity)
  const { data: registry } = useSuspenseQuery(toolRegistryOptions());

  const toolName = getToolOrDynamicToolName(part) ?? "unknown";
  const isWrite = isWriteTool(toolName, registry);
  const isDestructive = isDestructiveTool(toolName, registry);
  const isDelegation = isDelegationTool(toolName, registry);
  const isColumn = isColumnTool(toolName, registry);

  const isComplete = part.state === "output-available" || hasResult === true;
  const needsApproval = part.state === "approval-requested";
  const isDenied = part.state === "output-denied";
  const output = part.state === "output-available" ? part.output : undefined;

  const toolLabel = formatToolName(toolName);

  // Get the appropriate icon based on tool type
  const ToolIcon = isDestructive
    ? Trash2Icon
    : isColumn
      ? ColumnsIcon
      : isWrite
        ? PencilIcon
        : isDelegation
          ? UsersIcon
          : WrenchIcon;

  // Approval requested — card with approval actions
  if (needsApproval) {
    return (
      <div
        role="status"
        className="flex w-full flex-col gap-3 rounded-lg border border-primary/30 bg-primary/5 p-3"
        aria-label={`${toolLabel}: approval required`}
      >
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <ToolIcon className="size-3.5 text-primary" />
            <span className="font-medium text-sm">{toolLabel}</span>
          </div>
          <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-primary text-xs">
            <CircleDotIcon className="size-2.5" />
            Needs Approval
          </span>
        </div>
        <ToolApprovalActions
          approvalId={part.approval?.id ?? part.toolCallId}
          toolName={toolName}
          input={part.input}
          onApprovalResponse={onApprovalResponse}
        />
      </div>
    );
  }

  // Denied — card with denied status
  if (isDenied) {
    return (
      <div
        role="status"
        className="flex items-center justify-between gap-2 rounded-lg border border-destructive/30 bg-destructive/5 p-3"
        aria-label={`${toolLabel}: denied`}
      >
        <div className="flex items-center gap-2">
          <ToolIcon className="size-3.5 text-destructive" />
          <span className="font-medium text-sm">{toolLabel}</span>
        </div>
        <span className="inline-flex items-center gap-1 text-destructive text-xs">
          <XCircleIcon className="size-3" />
          Denied
        </span>
      </div>
    );
  }

  // Delegation tool — distinct style with expandable response
  if (isDelegation) {
    const delegationResult = isComplete ? parseDelegationOutput(output) : null;

    return (
      <div
        role="status"
        className="flex w-full flex-col gap-2 rounded-lg border border-indigo-200 bg-indigo-50 p-3 dark:border-indigo-800 dark:bg-indigo-950/50"
        aria-label={`${toolLabel}: ${isComplete ? "completed" : "running"}`}
      >
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <UsersIcon className="size-3.5 text-indigo-600 dark:text-indigo-400" />
            <span className="font-medium text-indigo-900 text-sm dark:text-indigo-100">
              {toolLabel}
            </span>
            {delegationResult && (
              <span className="text-indigo-600 text-xs dark:text-indigo-400">
                {delegationResult.personaName}
              </span>
            )}
          </div>
          {!isComplete && (
            <Loader2Icon className="size-3 animate-spin text-indigo-500" />
          )}
          {isComplete && (
            <CheckCircle2Icon className="size-3.5 text-indigo-600 dark:text-indigo-400" />
          )}
        </div>
        {delegationResult?.response && (
          <button
            type="button"
            onClick={() => setIsDelegateExpanded((prev) => !prev)}
            className="flex items-center gap-0.5 text-[11px] text-indigo-500 transition-colors hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-200"
            aria-expanded={isDelegateExpanded}
            aria-label={
              isDelegateExpanded
                ? "Collapse delegate response"
                : "Expand delegate response"
            }
          >
            {isDelegateExpanded ? (
              <ChevronDownIcon className="size-3" />
            ) : (
              <ChevronRightIcon className="size-3" />
            )}
            {isDelegateExpanded ? "Hide response" : "Show response"}
          </button>
        )}
        {isDelegateExpanded && delegationResult?.response && (
          <div className="rounded-md border border-indigo-200 bg-white/60 p-2.5 text-indigo-900 text-xs dark:border-indigo-800 dark:bg-indigo-950/30 dark:text-indigo-100">
            {delegationResult.response}
          </div>
        )}
      </div>
    );
  }

  // Default tool call display
  const statusLabel = isComplete ? "completed" : "running";

  return (
    <div
      role="status"
      className={cn(
        "flex items-center justify-between gap-2 rounded-lg border p-3",
        isDestructive
          ? "border-destructive/20 bg-destructive/5"
          : isWrite
            ? "border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/50"
            : "border-border bg-muted/30",
      )}
      aria-label={`${toolLabel}: ${statusLabel}`}
    >
      <div className="flex items-center gap-2">
        <ToolIcon
          className={cn(
            "size-3.5",
            isDestructive
              ? "text-destructive"
              : isWrite
                ? "text-blue-600 dark:text-blue-400"
                : "text-muted-foreground",
          )}
        />
        <span className="font-medium text-sm">{toolLabel}</span>
      </div>

      <div className="flex items-center gap-2">
        {!isComplete && (
          <span className="inline-flex items-center gap-1 text-muted-foreground text-xs">
            <Loader2Icon className="size-3 animate-spin" />
            Running
          </span>
        )}
        {isComplete && (
          <span
            className={cn(
              "inline-flex items-center gap-1 text-xs",
              isDestructive
                ? "text-destructive"
                : isWrite
                  ? "text-blue-600 dark:text-blue-400"
                  : "text-primary",
            )}
          >
            <CheckCircle2Icon className="size-3" />
            Done
          </span>
        )}
      </div>
    </div>
  );
}
