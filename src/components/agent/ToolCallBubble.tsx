import {
  CheckCircle2Icon,
  ChevronDownIcon,
  ChevronRightIcon,
  CircleDotIcon,
  LayersIcon,
  Loader2Icon,
  PencilIcon,
  Trash2Icon,
  UsersIcon,
  WrenchIcon,
  XCircleIcon,
} from "lucide-react";
import { useState } from "react";

import {
  BATCH_TOOL_NAMES,
  DELEGATION_TOOL_NAMES,
  DESTRUCTIVE_TOOL_NAMES,
  WRITE_TOOL_NAMES,
} from "@/lib/ai/constants";
import { formatToolName } from "@/lib/ai/utils/formatToolName";
import { formatWriteResult } from "@/lib/ai/utils/formatWriteResult";
import { cn } from "@/lib/utils";
import { ToolApprovalActions } from "./ToolApprovalActions";

import type { UIMessage } from "@tanstack/ai-client";

interface ToolCallBubbleProps {
  part: Extract<UIMessage["parts"][number], { type: "tool-call" }>;
  /** Whether there's a corresponding tool-result part for this tool call (server-side tools). */
  hasResult?: boolean;
  /** The parsed output from the corresponding tool-result part (server-side tools). */
  resultOutput?: unknown;
  /** Whether the chat is currently loading/streaming. Used to detect approved tool completion. */
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
  isLoading,
  onApprovalResponse,
}: ToolCallBubbleProps): React.ReactElement {
  const [isDelegateExpanded, setIsDelegateExpanded] = useState(false);

  const isWrite = WRITE_TOOL_NAMES.has(part.name);
  const isDestructive = DESTRUCTIVE_TOOL_NAMES.has(part.name);
  const isBatch = BATCH_TOOL_NAMES.has(part.name);
  const isDelegation = DELEGATION_TOOL_NAMES.has(part.name);
  const isApprovalRequested = part.state === "approval-requested";
  const isApprovalResponded = part.state === "approval-responded";
  const isApproved = isApprovalResponded && part.approval?.approved === true;
  const isDenied = isApprovalResponded && part.approval?.approved === false;
  const isApprovedAndFinished = isApproved && isLoading === false;
  const isComplete =
    part.state === "input-complete" ||
    part.output !== undefined ||
    hasResult === true ||
    isApprovedAndFinished;

  const toolLabel = formatToolName(part.name);

  // Get the appropriate icon based on tool type
  const ToolIcon = isDestructive
    ? Trash2Icon
    : isBatch
      ? LayersIcon
      : isWrite
        ? PencilIcon
        : isDelegation
          ? UsersIcon
          : WrenchIcon;

  // Approval requested — card with approval actions
  if (isApprovalRequested && part.approval) {
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
          approvalId={part.approval.id}
          toolName={part.name}
          input={part.input}
          onApprovalResponse={onApprovalResponse}
        />
      </div>
    );
  }

  // Approved, executing — card with spinner
  if (isApproved && !isComplete) {
    return (
      <div
        role="status"
        className="flex items-center justify-between gap-2 rounded-lg border border-border bg-card p-3"
        aria-label={`${toolLabel}: approved, executing`}
      >
        <div className="flex items-center gap-2">
          <ToolIcon className="size-3.5 text-muted-foreground" />
          <span className="font-medium text-sm">{toolLabel}</span>
        </div>
        <span className="inline-flex items-center gap-1.5 text-muted-foreground text-xs">
          <Loader2Icon className="size-3 animate-spin" />
          Running
        </span>
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
    const delegationResult = isComplete
      ? parseDelegationOutput(part.output)
      : null;

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
          : isBatch
            ? "border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/50"
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
              : isBatch
                ? "text-amber-600 dark:text-amber-400"
                : isWrite
                  ? "text-blue-600 dark:text-blue-400"
                  : "text-muted-foreground",
          )}
        />
        <span className="font-medium text-sm">{toolLabel}</span>
      </div>

      <div className="flex items-center gap-2">
        {!isComplete && !isApprovalResponded && (
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
                : isBatch
                  ? "text-amber-600 dark:text-amber-400"
                  : isWrite
                    ? "text-blue-600 dark:text-blue-400"
                    : "text-primary",
            )}
          >
            <CheckCircle2Icon className="size-3" />
            {isWrite && part.output !== undefined
              ? formatWriteResult(part.name, part.output)
              : "Done"}
          </span>
        )}
      </div>
    </div>
  );
}
