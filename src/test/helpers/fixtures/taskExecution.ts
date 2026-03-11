import type { TaskExecution } from "@/lib/options/taskExecution.options";

const base: Omit<TaskExecution, "status" | "metadata"> = {
  id: "exec-1",
  organizationId: "org-1",
  projectId: "proj-1",
  taskId: "task-1",
  triggeredBy: "user-1",
  createdAt: "2026-03-11T10:00:00Z",
  updatedAt: "2026-03-11T10:00:00Z",
};

export const queuedExecution: TaskExecution = {
  ...base,
  status: "queued",
  metadata: { model: "anthropic/claude-sonnet-4.5" },
};

export const runningExecution: TaskExecution = {
  ...base,
  status: "running",
  metadata: {
    model: "anthropic/claude-sonnet-4.5",
    branchName: "runa/t-42",
    stepCount: 5,
  },
};

export const succeededExecution: TaskExecution = {
  ...base,
  status: "succeeded",
  metadata: {
    model: "anthropic/claude-sonnet-4.5",
    branchName: "runa/t-42",
    prUrl: "https://github.com/omnidotdev/runa-api/pull/42",
    prNumber: 42,
    stepCount: 12,
  },
};

export const failedExecution: TaskExecution = {
  ...base,
  status: "failed",
  metadata: {
    model: "anthropic/claude-sonnet-4.5",
    branchName: "runa/t-42",
    errorMessage: "Command timed out after 120000ms",
  },
};

export const cancelledExecution: TaskExecution = {
  ...base,
  status: "cancelled",
  metadata: { model: "anthropic/claude-sonnet-4.5" },
};
