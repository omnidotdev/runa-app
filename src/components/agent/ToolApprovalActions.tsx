import { useSuspenseQuery } from "@tanstack/react-query";
import { useLoaderData } from "@tanstack/react-router";
import { CheckIcon, XIcon } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import toolRegistryOptions from "@/lib/options/toolRegistry.options";

import type { ToolRegistryResponse } from "@/lib/options/toolRegistry.options";

interface ToolApprovalActionsProps {
  approvalId: string;
  toolName: string;
  input: unknown;
  onApprovalResponse: (response: { id: string; approved: boolean }) => void;
}

/**
 * Extract the action verb from a tool name.
 * e.g., "createTasks" → "Create", "deleteTasks" → "Delete"
 */
function extractActionVerb(toolName: string): string {
  // Common action verbs at the start of tool names
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
function extractCount(input: unknown): number {
  if (!input || typeof input !== "object") return 1;

  const data = input as Record<string, unknown>;

  // Check common array field names
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
function formatTaskRef(
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
function formatApprovalDetails(
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
      // For single task deletion, try to show the task reference
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

    // Generic destructive
    return `Permanently delete ${count} ${entity ?? "item"}${count !== 1 ? "s" : ""}?`;
  }

  // Write operations
  if (category === "write") {
    // For single task creation, try to show the title
    if (action === "Create" && entity === "task" && count === 1) {
      const data = input as Record<string, unknown>;
      const tasks = data?.tasks as Array<{ title?: string }> | undefined;
      const title = tasks?.[0]?.title;
      if (title) {
        return `Create task: "${title}"?`;
      }
    }

    // Entity-specific messages
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

    // Generic write
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

  // Fallback
  return "Execute this operation?";
}

export function ToolApprovalActions({
  approvalId,
  toolName,
  input,
  onApprovalResponse,
}: ToolApprovalActionsProps) {
  // Fetch tool registry (cached with staleTime: Infinity)
  const { data: registry } = useSuspenseQuery(toolRegistryOptions());

  // Get project prefix from route loader data
  const { projectPrefix } = useLoaderData({
    from: "/_auth/workspaces/$workspaceSlug/projects/$projectSlug/",
  });

  const [isResponding, setIsResponding] = useState(false);

  const handleResponse = (approved: boolean) => {
    setIsResponding(true);
    onApprovalResponse({ id: approvalId, approved });
  };

  return (
    <div className="flex flex-col gap-3">
      <p className="text-pretty text-sm">
        {formatApprovalDetails(
          toolName,
          input,
          registry,
          projectPrefix ?? undefined,
        )}
      </p>
      <div className="flex gap-2">
        <Button
          size="sm"
          className="h-8 flex-1 gap-1.5"
          disabled={isResponding}
          onClick={() => handleResponse(true)}
        >
          <CheckIcon className="size-3.5" />
          Approve
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="h-8 flex-1 gap-1.5"
          disabled={isResponding}
          onClick={() => handleResponse(false)}
        >
          <XIcon className="size-3.5" />
          Deny
        </Button>
      </div>
    </div>
  );
}
