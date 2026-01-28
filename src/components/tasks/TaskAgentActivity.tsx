import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import {
  CheckCircleIcon,
  ChevronRightIcon,
  ClockIcon,
  Loader2Icon,
  SparklesIcon,
  XCircleIcon,
} from "lucide-react";
import { useMemo } from "react";

import {
  CollapsibleContent,
  CollapsibleRoot,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { formatToolName } from "@/lib/ai/utils/formatToolName";
import agentActivitiesByTaskIdOptions from "@/lib/options/agentActivitiesByTaskId.options";
import { cn } from "@/lib/utils";

dayjs.extend(relativeTime);

interface TaskAgentActivityProps {
  taskId: string;
  projectId: string;
}

const STATUS_ICON = {
  completed: CheckCircleIcon,
  failed: XCircleIcon,
  pending: ClockIcon,
} as const;

/**
 * Collapsible section showing agent activity for a specific task.
 * Rendered in the task detail page below Comments.
 */
export function TaskAgentActivity({
  taskId,
  projectId,
}: TaskAgentActivityProps) {
  const { data, isLoading } = useQuery(
    agentActivitiesByTaskIdOptions({ projectId, first: 50 }),
  );

  // Client-side filter for activities affecting this task
  const activities = useMemo(() => {
    const nodes = data?.agentActivities?.nodes ?? [];
    return nodes.filter((activity) => {
      const ids = activity.affectedTaskIds;
      if (!Array.isArray(ids)) return false;
      return ids.includes(taskId);
    });
  }, [data, taskId]);

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 py-4 text-muted-foreground text-sm">
        <Loader2Icon className="size-4 animate-spin" />
        Loading agent activity...
      </div>
    );
  }

  if (activities.length === 0) {
    return null;
  }

  return (
    <CollapsibleRoot defaultOpen={false} className="rounded-lg border">
      <CollapsibleTrigger className="group">
        <div className="flex flex-1 items-center gap-2">
          <SparklesIcon className="size-4 text-primary" />
          <span>Agent Activity</span>
          <span className="rounded-full bg-muted px-2 py-0.5 text-muted-foreground text-xs">
            {activities.length}
          </span>
        </div>
        <ChevronRightIcon className="size-4 text-muted-foreground transition-transform group-data-[state=open]:rotate-90" />
      </CollapsibleTrigger>

      <CollapsibleContent>
        <div className="flex flex-col gap-2">
          {activities.map((activity) => {
            const StatusIcon =
              STATUS_ICON[activity.status as keyof typeof STATUS_ICON] ??
              ClockIcon;

            return (
              <div
                key={activity.rowId}
                className="flex items-center gap-2 text-sm"
              >
                <StatusIcon
                  className={cn(
                    "size-3.5 shrink-0",
                    activity.status === "completed" &&
                      "text-green-600 dark:text-green-400",
                    activity.status === "failed" &&
                      "text-red-600 dark:text-red-400",
                    activity.status === "pending" && "text-muted-foreground",
                  )}
                />
                <span className="flex-1 truncate">
                  {formatToolName(activity.toolName)}
                </span>
                <span className="shrink-0 text-muted-foreground text-xs">
                  {dayjs(activity.createdAt).fromNow()}
                </span>
              </div>
            );
          })}
        </div>
      </CollapsibleContent>
    </CollapsibleRoot>
  );
}
