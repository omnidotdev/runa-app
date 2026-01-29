import {
  AlertTriangleIcon,
  CheckCircleIcon,
  ChevronDownIcon,
  ClockIcon,
  Undo2Icon,
  XCircleIcon,
} from "lucide-react";
import { useState } from "react";

import { formatRelativeTime } from "@/lib/ai/utils/formatRelativeTime";
import { formatToolName } from "@/lib/ai/utils/formatToolName";
import { cn } from "@/lib/utils";

import type { AgentActivitiesQuery } from "@/generated/graphql";

type ActivityNode = NonNullable<
  AgentActivitiesQuery["agentActivities"]
>["nodes"][number];

interface AgentActivityItemProps {
  activity: ActivityNode;
}

const STATUS_CONFIG = {
  completed: {
    icon: CheckCircleIcon,
    label: "Completed",
    className:
      "bg-green-100 text-green-700 dark:bg-green-950/50 dark:text-green-300",
  },
  failed: {
    icon: XCircleIcon,
    label: "Failed",
    className: "bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-300",
  },
  denied: {
    icon: XCircleIcon,
    label: "Denied",
    className:
      "bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300",
  },
  pending: {
    icon: ClockIcon,
    label: "Pending",
    className: "bg-muted text-muted-foreground",
  },
  rolled_back: {
    icon: Undo2Icon,
    label: "Undone",
    className:
      "bg-violet-100 text-violet-700 dark:bg-violet-950/50 dark:text-violet-300",
  },
} as const;

function getStatusConfig(
  status: string,
  approvalStatus: string | null | undefined,
): (typeof STATUS_CONFIG)[keyof typeof STATUS_CONFIG] {
  if (approvalStatus === "denied") return STATUS_CONFIG.denied;
  if (status === "rolled_back") return STATUS_CONFIG.rolled_back;
  if (status === "completed") return STATUS_CONFIG.completed;
  if (status === "failed") return STATUS_CONFIG.failed;
  return STATUS_CONFIG.pending;
}

export function AgentActivityItem({
  activity,
}: AgentActivityItemProps): React.ReactElement {
  const [isExpanded, setIsExpanded] = useState(false);
  const statusConfig = getStatusConfig(
    activity.status,
    activity.approvalStatus,
  );
  const StatusIcon = statusConfig.icon;
  const relativeTimestamp = formatRelativeTime(activity.createdAt);

  return (
    <div role="article" className="flex flex-col gap-1 rounded-md border p-2.5">
      <div className="flex items-center gap-2">
        <StatusIcon className="size-3.5 shrink-0" />
        <span className="flex-1 truncate font-medium text-xs">
          {formatToolName(activity.toolName)}
        </span>
        <span
          role="status"
          aria-label={`Status: ${statusConfig.label}`}
          className={cn(
            "shrink-0 rounded-full px-1.5 py-0.5 font-medium text-[10px]",
            statusConfig.className,
          )}
        >
          {statusConfig.label}
        </span>
      </div>

      <div className="flex items-center justify-between gap-2">
        <span className="text-[10px] text-muted-foreground">
          {activity.session?.title ?? "Session"} &middot; {relativeTimestamp}
        </span>

        <div className="flex items-center gap-1.5">
          {activity.requiresApproval && (
            <span className="text-[10px] text-amber-600 dark:text-amber-400">
              <AlertTriangleIcon className="inline size-2.5" /> Approval
            </span>
          )}
        </div>
      </div>

      {activity.errorMessage && (
        <p className="mt-1 text-[10px] text-destructive">
          {activity.errorMessage}
        </p>
      )}

      {(activity.toolInput || activity.toolOutput) && (
        <button
          type="button"
          onClick={() => setIsExpanded((prev) => !prev)}
          aria-expanded={isExpanded}
          aria-label={isExpanded ? "Hide tool details" : "Show tool details"}
          className="mt-1 flex items-center gap-1 text-[10px] text-muted-foreground transition-colors hover:text-foreground"
        >
          <ChevronDownIcon
            className={cn(
              "size-3 transition-transform",
              isExpanded && "rotate-180",
            )}
          />
          {isExpanded ? "Hide details" : "Show details"}
        </button>
      )}

      {isExpanded && (
        <div className="mt-1 flex flex-col gap-1.5">
          {activity.toolInput && (
            <div className="rounded bg-muted/50 p-2">
              <p className="mb-1 font-medium text-[10px] text-muted-foreground">
                Input
              </p>
              <pre className="overflow-x-auto text-[10px] leading-relaxed">
                {JSON.stringify(activity.toolInput, null, 2)}
              </pre>
            </div>
          )}
          {activity.toolOutput && (
            <div className="rounded bg-muted/50 p-2">
              <p className="mb-1 font-medium text-[10px] text-muted-foreground">
                Output
              </p>
              <pre className="overflow-x-auto text-[10px] leading-relaxed">
                {JSON.stringify(activity.toolOutput, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export type { ActivityNode };
