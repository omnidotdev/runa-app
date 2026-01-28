import {
  AlertTriangleIcon,
  CheckCircleIcon,
  ChevronDownIcon,
  ClockIcon,
  XCircleIcon,
} from "lucide-react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useState } from "react";

import { formatToolName } from "@/lib/ai/utils/formatToolName";
import { cn } from "@/lib/utils";

import type { AgentActivitiesQuery } from "@/generated/graphql";

dayjs.extend(relativeTime);

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
    className: "bg-green-100 text-green-700 dark:bg-green-950/50 dark:text-green-300",
  },
  failed: {
    icon: XCircleIcon,
    label: "Failed",
    className: "bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-300",
  },
  denied: {
    icon: XCircleIcon,
    label: "Denied",
    className: "bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300",
  },
  pending: {
    icon: ClockIcon,
    label: "Pending",
    className: "bg-muted text-muted-foreground",
  },
} as const;

function getStatusConfig(status: string, approvalStatus: string | null | undefined) {
  if (approvalStatus === "denied") return STATUS_CONFIG.denied;
  if (status === "completed") return STATUS_CONFIG.completed;
  if (status === "failed") return STATUS_CONFIG.failed;
  return STATUS_CONFIG.pending;
}

export function AgentActivityItem({ activity }: AgentActivityItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const statusConfig = getStatusConfig(activity.status, activity.approvalStatus);
  const StatusIcon = statusConfig.icon;
  const relativeTimestamp = dayjs(activity.createdAt).fromNow();

  return (
    <div role="article" className="flex flex-col gap-1 rounded-md border p-2.5">
      <div className="flex items-center gap-2">
        <StatusIcon className="size-3.5 shrink-0" />
        <span className="flex-1 truncate font-medium text-xs">
          {formatToolName(activity.toolName)}
        </span>
        <span
          className={cn(
            "shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-medium",
            statusConfig.className,
          )}
        >
          {statusConfig.label}
        </span>
      </div>

      <div className="flex items-center justify-between gap-2">
        <span className="text-muted-foreground text-[10px]">
          {activity.session?.title ?? "Session"} &middot; {relativeTimestamp}
        </span>

        {activity.requiresApproval && (
          <span className="text-amber-600 text-[10px] dark:text-amber-400">
            <AlertTriangleIcon className="inline size-2.5" /> Approval
          </span>
        )}
      </div>

      {activity.errorMessage && (
        <p className="mt-1 text-destructive text-[10px]">
          {activity.errorMessage}
        </p>
      )}

      {(activity.toolInput || activity.toolOutput) && (
        <button
          type="button"
          onClick={() => setIsExpanded((prev) => !prev)}
          className="mt-1 flex items-center gap-1 text-muted-foreground text-[10px] transition-colors hover:text-foreground"
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
