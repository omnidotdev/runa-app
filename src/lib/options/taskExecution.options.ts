/**
 * Query options for task execution status.
 *
 * Polls every 3 seconds while execution is active (queued or running).
 */

import { queryOptions } from "@tanstack/react-query";

import { API_BASE_URL } from "@/lib/config/env.config";

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

export interface TaskExecutionMetadata {
  model?: string;
  branchName?: string;
  prUrl?: string;
  prNumber?: number;
  errorMessage?: string;
  stepCount?: number;
}

export interface TaskExecution {
  id: string;
  organizationId: string;
  projectId: string;
  taskId: string;
  triggeredBy: string;
  status: "queued" | "running" | "succeeded" | "failed" | "cancelled";
  metadata: TaskExecutionMetadata;
  createdAt: string;
  updatedAt: string;
}

interface TaskExecutionResponse {
  executions: TaskExecution[];
}

// ─────────────────────────────────────────────
// Query Key
// ─────────────────────────────────────────────

export function taskExecutionQueryKey(taskId: string, projectId: string) {
  return ["TaskExecution", taskId, projectId] as const;
}

// ─────────────────────────────────────────────
// Fetcher
// ─────────────────────────────────────────────

async function fetchTaskExecutions(
  taskId: string,
  projectId: string,
  accessToken: string,
): Promise<TaskExecutionResponse> {
  const url = new URL(`${API_BASE_URL}/api/ai/execute/${taskId}`);
  url.searchParams.set("projectId", projectId);

  const response = await fetch(url.toString(), {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch task executions");
  }

  return response.json() as Promise<TaskExecutionResponse>;
}

// ─────────────────────────────────────────────
// Options
// ─────────────────────────────────────────────

export interface TaskExecutionVariables {
  taskId: string;
  projectId: string;
  accessToken: string;
}

const taskExecutionOptions = ({
  taskId,
  projectId,
  accessToken,
}: TaskExecutionVariables) =>
  queryOptions({
    queryKey: taskExecutionQueryKey(taskId, projectId),
    queryFn: () => fetchTaskExecutions(taskId, projectId, accessToken),
    enabled: !!taskId && !!projectId && !!accessToken,
    refetchInterval: (query) => {
      const data = query.state.data;
      if (!data) return false;

      // Poll while any execution is active
      const hasActive = data.executions.some(
        (e) => e.status === "queued" || e.status === "running",
      );

      return hasActive ? 3000 : false;
    },
  });

export default taskExecutionOptions;
