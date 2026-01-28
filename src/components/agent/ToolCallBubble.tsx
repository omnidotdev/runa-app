import {
  AlertTriangleIcon,
  CheckCircleIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  Loader2Icon,
  PencilIcon,
  Trash2Icon,
  Undo2Icon,
  UsersIcon,
  WrenchIcon,
  XCircleIcon,
} from "lucide-react";
import { useState } from "react";

import {
  DELEGATION_TOOL_NAMES,
  DESTRUCTIVE_TOOL_NAMES,
  WRITE_TOOL_NAMES,
} from "@/lib/ai/constants";
import { formatToolName } from "@/lib/ai/utils/formatToolName";
import { formatWriteResult } from "@/lib/ai/utils/formatWriteResult";
import { cn } from "@/lib/utils";
import { ToolApprovalActions } from "./ToolApprovalActions";

import type { UIMessage } from "@tanstack/ai-client";
import type { RollbackByMatchParams } from "@/lib/ai/hooks/useRollback";

interface ToolCallBubbleProps {
  part: Extract<UIMessage["parts"][number], { type: "tool-call" }>;
  /** Whether there's a corresponding tool-result part for this tool call (server-side tools). */
  hasResult?: boolean;
  /** The parsed output from the corresponding tool-result part (server-side tools). */
  resultOutput?: unknown;
  /** Whether the chat is currently loading/streaming. Used to detect approved tool completion. */
  isLoading?: boolean;
  onApprovalResponse: (response: { id: string; approved: boolean }) => void;
  /** Called when the user clicks the undo button. */
  onUndo?: (toolName: string, toolInput: unknown) => void;
  /** The in-flight undo mutation variables for per-bubble loading state. */
  undoingToolCall?: RollbackByMatchParams;
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
  onUndo,
  undoingToolCall,
}: ToolCallBubbleProps) {
  const [isDelegateExpanded, setIsDelegateExpanded] = useState(false);

  const isWrite = WRITE_TOOL_NAMES.has(part.name);
  const isDestructive = DESTRUCTIVE_TOOL_NAMES.has(part.name);
  const isDelegation = DELEGATION_TOOL_NAMES.has(part.name);
  const isApprovalRequested = part.state === "approval-requested";
  const isApprovalResponded = part.state === "approval-responded";
  const isApproved = isApprovalResponded && part.approval?.approved === true;
  const isDenied = isApprovalResponded && part.approval?.approved === false;
  // Tool is complete if:
  // - has output (client tools)
  // - has result part (server tools)
  // - state is input-complete
  // - was approved and loading finished (server doesn't add tool-result to message due to TanStack AI bug)
  const isApprovedAndFinished = isApproved && isLoading === false;
  const isComplete =
    part.state === "input-complete" ||
    part.output !== undefined ||
    hasResult === true ||
    isApprovedAndFinished;

  const toolLabel = formatToolName(part.name);

  // Approval requested — amber background with approve/deny actions
  if (isApprovalRequested && part.approval) {
    return (
      <div
        role="status"
        className="flex flex-col gap-2 rounded-md border border-amber-300 bg-amber-50 px-2.5 py-2 dark:border-amber-700 dark:bg-amber-950/50"
        aria-label={`${toolLabel}: approval required`}
      >
        <div className="flex items-center gap-1.5 text-amber-700 text-xs dark:text-amber-300">
          <AlertTriangleIcon className="size-3" />
          <span className="font-medium">{toolLabel}</span>
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

  // Approved, executing — green with spinner (not complete yet)
  if (isApproved && !isComplete) {
    return (
      <div
        role="status"
        className="flex items-center gap-1.5 rounded-md bg-green-50 px-2.5 py-1.5 text-green-700 text-xs dark:bg-green-950/50 dark:text-green-300"
        aria-label={`${toolLabel}: approved, executing`}
      >
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
      <div
        role="status"
        className="flex items-center gap-1.5 rounded-md bg-red-50 px-2.5 py-1.5 text-red-700 text-xs dark:bg-red-950/50 dark:text-red-300"
        aria-label={`${toolLabel}: denied`}
      >
        <XCircleIcon className="size-3" />
        <span className="font-medium">{toolLabel}</span>
        <span className="text-red-600 dark:text-red-400">Denied</span>
      </div>
    );
  }

  // Delegation tool — distinct purple style with expandable response
  if (isDelegation) {
    const delegationResult = isComplete
      ? parseDelegationOutput(part.output)
      : null;

    return (
      <div
        role="status"
        className="flex flex-col gap-1 rounded-md bg-indigo-50 px-2.5 py-1.5 text-indigo-700 text-xs dark:bg-indigo-950/50 dark:text-indigo-300"
        aria-label={`${toolLabel}: ${isComplete ? "completed" : "running"}`}
      >
        <div className="flex items-center gap-1.5">
          <UsersIcon className="size-3" />
          <span className="font-medium">{toolLabel}</span>
          {!isComplete && <Loader2Icon className="size-3 animate-spin" />}
          {delegationResult && (
            <span className="text-indigo-600 dark:text-indigo-400">
              — {delegationResult.personaName}
            </span>
          )}
        </div>
        {delegationResult && delegationResult.response && (
          <button
            type="button"
            onClick={() => setIsDelegateExpanded((prev) => !prev)}
            className="flex items-center gap-0.5 text-[10px] text-indigo-500 transition-colors hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-200"
            aria-expanded={isDelegateExpanded}
            aria-label={
              isDelegateExpanded
                ? "Collapse delegate response"
                : "Expand delegate response"
            }
          >
            {isDelegateExpanded ? (
              <ChevronDownIcon className="size-2.5" />
            ) : (
              <ChevronRightIcon className="size-2.5" />
            )}
            {isDelegateExpanded ? "Hide response" : "Show response"}
          </button>
        )}
        {isDelegateExpanded && delegationResult?.response && (
          <div className="mt-1 rounded border border-indigo-200 bg-white/60 p-2 text-[11px] text-indigo-900 dark:border-indigo-800 dark:bg-indigo-950/30 dark:text-indigo-100">
            {delegationResult.response}
          </div>
        )}
      </div>
    );
  }

  // Determine status for aria-label
  const statusLabel = isComplete ? "completed" : "running";

  // Default tool call display with destructive icon variant
  return (
    <div
      role="status"
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
      {isComplete && (
        <span
          className={
            isDestructive
              ? "text-red-600 dark:text-red-400"
              : isWrite
                ? "text-blue-600 dark:text-blue-400"
                : "text-green-600 dark:text-green-400"
          }
        >
          {isWrite && part.output !== undefined
            ? formatWriteResult(part.name, part.output)
            : "Done"}
        </span>
      )}
      {isComplete &&
        isWrite &&
        onUndo &&
        (() => {
          const isThisUndoing =
            undoingToolCall !== undefined &&
            undoingToolCall.toolName === part.name &&
            JSON.stringify(undoingToolCall.toolInput) ===
              JSON.stringify(part.input);

          return (
            <button
              type="button"
              onClick={() => onUndo(part.name, part.input)}
              disabled={undoingToolCall !== undefined}
              aria-label={`Undo ${toolLabel}`}
              className="ml-auto inline-flex items-center gap-0.5 rounded px-1 py-0.5 text-[10px] text-violet-600 transition-colors hover:bg-violet-100 disabled:opacity-50 dark:text-violet-400 dark:hover:bg-violet-950/50"
            >
              {isThisUndoing ? (
                <Loader2Icon className="size-2.5 animate-spin" />
              ) : (
                <Undo2Icon className="size-2.5" />
              )}
              Undo
            </button>
          );
        })()}
    </div>
  );
}
