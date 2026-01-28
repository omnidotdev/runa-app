/**
 * Format a write tool result into a human-readable summary.
 * Falls back to "Done" if the output format is unexpected.
 */
export function formatWriteResult(name: string, output: unknown): string {
  if (!output || typeof output !== "object") return "Done";

  const data = output as Record<string, unknown>;

  switch (name) {
    case "createTask": {
      const task = data.task as Record<string, unknown> | undefined;
      if (!task) return "Task created";
      const num = task.number ? `T-${task.number}: ` : "";
      return `Created ${num}${task.title ?? "task"}`;
    }
    case "updateTask": {
      const task = data.task as Record<string, unknown> | undefined;
      if (!task) return "Task updated";
      const num = task.number ? `T-${task.number}: ` : "";
      return `Updated ${num}${task.title ?? "task"}`;
    }
    case "moveTask": {
      const task = data.task as Record<string, unknown> | undefined;
      const num = task?.number ? `T-${task.number}: ` : "";
      return `Moved ${num}${data.fromColumn ?? "?"} → ${data.toColumn ?? "?"}`;
    }
    case "assignTask": {
      const action = data.action === "remove" ? "Unassigned" : "Assigned";
      return `${action} ${data.userName ?? "user"}`;
    }
    case "addLabel": {
      return `Added "${data.labelName ?? "label"}"`;
    }
    case "removeLabel": {
      return `Removed "${data.labelName ?? "label"}"`;
    }
    case "addComment": {
      return "Comment added";
    }
    case "deleteTask": {
      const num = data.deletedTaskNumber
        ? `T-${data.deletedTaskNumber}: `
        : "";
      return `Deleted ${num}${data.deletedTaskTitle ?? "task"}`;
    }
    case "batchMoveTasks": {
      const count = (data.movedCount as number) ?? 0;
      const target = data.targetColumn ?? "?";
      const errCount = (data.errors as Array<unknown>)?.length ?? 0;
      const suffix = errCount > 0 ? ` (${errCount} failed)` : "";
      return `Moved ${count} task${count !== 1 ? "s" : ""} → ${target}${suffix}`;
    }
    case "batchUpdateTasks": {
      const count = (data.updatedCount as number) ?? 0;
      const errCount = (data.errors as Array<unknown>)?.length ?? 0;
      const suffix = errCount > 0 ? ` (${errCount} failed)` : "";
      return `Updated ${count} task${count !== 1 ? "s" : ""}${suffix}`;
    }
    case "batchDeleteTasks": {
      const count = (data.deletedCount as number) ?? 0;
      const errCount = (data.errors as Array<unknown>)?.length ?? 0;
      const suffix = errCount > 0 ? ` (${errCount} failed)` : "";
      return `Deleted ${count} task${count !== 1 ? "s" : ""}${suffix}`;
    }
    default:
      return "Done";
  }
}
