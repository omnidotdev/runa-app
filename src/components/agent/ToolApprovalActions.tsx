import { CheckIcon, XIcon } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";

interface ToolApprovalActionsProps {
  approvalId: string;
  toolName: string;
  input: unknown;
  onApprovalResponse: (response: { id: string; approved: boolean }) => void;
}

/**
 * Format the approval request into a human-readable summary of what will happen.
 */
function formatApprovalDetails(toolName: string, input: unknown): string {
  if (!input || typeof input !== "object") return "Execute this operation?";

  const data = input as Record<string, unknown>;

  switch (toolName) {
    case "deleteTask": {
      const ref = data.taskNumber ? `T-${data.taskNumber}` : data.taskId;
      return `Delete task ${ref ?? ""}?`;
    }
    case "batchMoveTasks": {
      const tasks = data.tasks as Array<unknown> | undefined;
      const count = tasks?.length ?? 0;
      return `Move ${count} task${count !== 1 ? "s" : ""} to a new column?`;
    }
    case "batchUpdateTasks": {
      const tasks = data.tasks as Array<unknown> | undefined;
      const count = tasks?.length ?? 0;
      const fields: string[] = [];
      if (data.priority) fields.push(`priority to ${data.priority}`);
      if (data.dueDate !== undefined)
        fields.push(data.dueDate ? "due date" : "clear due date");
      return `Update ${count} task${count !== 1 ? "s" : ""}${fields.length > 0 ? ` (${fields.join(", ")})` : ""}?`;
    }
    case "batchDeleteTasks": {
      const tasks = data.tasks as Array<unknown> | undefined;
      const count = tasks?.length ?? 0;
      return `Permanently delete ${count} task${count !== 1 ? "s" : ""}?`;
    }
    case "createTask": {
      const title = data.title as string | undefined;
      return `Create task${title ? `: "${title}"` : ""}?`;
    }
    default:
      return "Execute this operation?";
  }
}

export function ToolApprovalActions({
  approvalId,
  toolName,
  input,
  onApprovalResponse,
}: ToolApprovalActionsProps) {
  const [isResponding, setIsResponding] = useState(false);

  const handleResponse = (approved: boolean) => {
    setIsResponding(true);
    onApprovalResponse({ id: approvalId, approved });
  };

  return (
    <div className="flex flex-col gap-3">
      <p className="text-pretty text-sm">
        {formatApprovalDetails(toolName, input)}
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
