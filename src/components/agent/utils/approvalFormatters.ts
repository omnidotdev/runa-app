/**
 * Pure formatting functions for tool approval messages.
 *
 * Extracted from ToolApprovalActions for independent testability.
 */

import type { ToolRegistryResponse } from "@/lib/options/toolRegistry.options";

/**
 * Extract the action verb from a tool name.
 * e.g., "createTasks" → "Create", "deleteTasks" → "Delete"
 */
export function extractActionVerb(toolName: string): string {
  const verbPatterns = [
    { pattern: /^create/i, verb: "Create" },
    { pattern: /^update/i, verb: "Update" },
    { pattern: /^delete/i, verb: "Delete" },
    { pattern: /^move/i, verb: "Move" },
    { pattern: /^assign/i, verb: "Assign" },
    { pattern: /^add/i, verb: "Add" },
    { pattern: /^remove/i, verb: "Remove" },
    { pattern: /^reorder/i, verb: "Reorder" },
  ];

  for (const { pattern, verb } of verbPatterns) {
    if (pattern.test(toolName)) {
      return verb;
    }
  }

  return "Execute";
}

/**
 * Extract count from input based on common schema patterns.
 * Looks for arrays in known fields: tasks, updates, assignments, operations
 */
export function extractCount(input: unknown): number {
  if (!input || typeof input !== "object") return 1;

  const data = input as Record<string, unknown>;

  const arrayFields = ["tasks", "updates", "assignments", "operations"];
  for (const field of arrayFields) {
    if (Array.isArray(data[field])) {
      return data[field].length;
    }
  }

  return 1;
}

/**
 * Format a task reference for display.
 */
export function formatTaskRef(
  task: unknown,
  projectPrefix: string,
): string | undefined {
  if (!task || typeof task !== "object") return undefined;

  const t = task as Record<string, unknown>;
  if (typeof t.taskNumber === "number") {
    return `${projectPrefix}-${t.taskNumber}`;
  }
  if (typeof t.taskId === "string") {
    return t.taskId;
  }
  return undefined;
}

/**
 * Format the approval request into a human-readable summary.
 *
 * Uses the tool registry metadata (category, entity) to generate
 * context-appropriate messages without hardcoding tool names.
 */
export function formatApprovalDetails(
  toolName: string,
  input: unknown,
  registry: ToolRegistryResponse,
  projectPrefix = "T",
): string {
  const metadata = registry.tools[toolName];
  if (!metadata) {
    return "Execute this operation?";
  }

  const { category, entity } = metadata;
  const action = extractActionVerb(toolName);
  const count = extractCount(input);

  // Destructive operations get special "permanent" language
  if (category === "destructive") {
    if (entity === "task") {
      if (count === 1) {
        const data = input as Record<string, unknown>;
        const tasks = data?.tasks as unknown[] | undefined;
        const ref = tasks?.[0] ? formatTaskRef(tasks[0], projectPrefix) : null;
        if (ref) {
          return `Permanently delete task ${ref}?`;
        }
      }
      return `Permanently delete ${count} task${count !== 1 ? "s" : ""}?`;
    }

    if (entity === "column") {
      return "Permanently delete this column?";
    }

    return `Permanently delete ${count} ${entity ?? "item"}${count !== 1 ? "s" : ""}?`;
  }

  // Write operations
  if (category === "write") {
    if (action === "Create" && entity === "task" && count === 1) {
      const data = input as Record<string, unknown>;
      const tasks = data?.tasks as Array<{ title?: string }> | undefined;
      const title = tasks?.[0]?.title;
      if (title) {
        return `Create task: "${title}"?`;
      }
    }

    if (entity === "task") {
      return `${action} ${count} task${count !== 1 ? "s" : ""}?`;
    }

    if (entity === "column") {
      return `${action} this column?`;
    }

    if (entity === "label") {
      return `${action} labels for ${count} task${count !== 1 ? "s" : ""}?`;
    }

    if (entity === "comment") {
      return `Add ${count} comment${count !== 1 ? "s" : ""}?`;
    }

    return `${action} ${count} ${entity ?? "item"}${count !== 1 ? "s" : ""}?`;
  }

  // Project creation
  if (category === "projectCreation") {
    return "Create this project?";
  }

  // Delegation
  if (category === "delegation") {
    return "Delegate this task?";
  }

  return "Execute this operation?";
}
