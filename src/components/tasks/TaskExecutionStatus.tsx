/**
 * Task execution status display.
 *
 * Shows the current status of autonomous code execution on a task.
 * Polls automatically while execution is active.
 */

import { useQuery } from "@tanstack/react-query";
import { useRouteContext } from "@tanstack/react-router";
import {
  CheckCircleIcon,
  ClockIcon,
  ExternalLinkIcon,
  Loader2Icon,
  XCircleIcon,
} from "lucide-react";

import taskExecutionOptions from "@/lib/options/taskExecution.options";

import type { TaskExecution } from "@/lib/options/taskExecution.options";

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

interface TaskExecutionStatusProps {
  taskId: string;
  projectId: string;
}

// ─────────────────────────────────────────────
// Status Badge
// ─────────────────────────────────────────────

function ExecutionBadge({ execution }: { execution: TaskExecution }) {
  const { status, metadata } = execution;

  switch (status) {
    case "queued":
      return (
        <div className="flex items-center gap-2 rounded-md border p-3">
          <ClockIcon className="size-4 text-muted-foreground" />
          <span className="text-muted-foreground text-sm">
            Waiting to start...
          </span>
        </div>
      );

    case "running":
      return (
        <div className="flex items-center gap-2 rounded-md border border-blue-200 bg-blue-50 p-3 dark:border-blue-800 dark:bg-blue-950/30">
          <Loader2Icon className="size-4 animate-spin text-blue-600" />
          <div className="flex flex-col">
            <span className="text-blue-700 text-sm dark:text-blue-400">
              Agent is working on this task...
            </span>
            {metadata.branchName && (
              <span className="text-blue-500 text-xs">
                Branch: {metadata.branchName}
              </span>
            )}
          </div>
        </div>
      );

    case "succeeded":
      return (
        <div className="flex items-center gap-2 rounded-md border border-green-200 bg-green-50 p-3 dark:border-green-800 dark:bg-green-950/30">
          <CheckCircleIcon className="size-4 text-green-600" />
          <div className="flex flex-1 items-center justify-between">
            <span className="text-green-700 text-sm dark:text-green-400">
              Completed
            </span>
            {metadata.prUrl && (
              <a
                href={metadata.prUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 font-medium text-green-700 text-sm underline hover:text-green-800 dark:text-green-400"
              >
                View PR #{metadata.prNumber}
                <ExternalLinkIcon className="size-3" />
              </a>
            )}
          </div>
        </div>
      );

    case "failed":
      return (
        <div className="flex items-center gap-2 rounded-md border border-red-200 bg-red-50 p-3 dark:border-red-800 dark:bg-red-950/30">
          <XCircleIcon className="size-4 text-red-600" />
          <div className="flex flex-col">
            <span className="text-red-700 text-sm dark:text-red-400">
              Execution failed
            </span>
            {metadata.errorMessage && (
              <span className="text-red-500 text-xs">
                {metadata.errorMessage}
              </span>
            )}
          </div>
        </div>
      );

    case "cancelled":
      return (
        <div className="flex items-center gap-2 rounded-md border p-3">
          <XCircleIcon className="size-4 text-muted-foreground" />
          <span className="text-muted-foreground text-sm">Cancelled</span>
        </div>
      );

    default:
      return null;
  }
}

// ─────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────

export function TaskExecutionStatus({
  taskId,
  projectId,
}: TaskExecutionStatusProps) {
  const { session } = useRouteContext({ from: "/_app" });
  const accessToken = session?.accessToken!;

  const { data } = useQuery(
    taskExecutionOptions({ taskId, projectId, accessToken }),
  );

  const executions = data?.executions ?? [];

  if (executions.length === 0) {
    return null;
  }

  // Show the most recent execution
  const latestExecution = executions[0];

  return (
    <div className="flex flex-col gap-2">
      <ExecutionBadge execution={latestExecution} />
    </div>
  );
}
