import {
  AlertTriangleIcon,
  CheckCircleIcon,
  LayersIcon,
  Loader2Icon,
  XCircleIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import type { UIMessage } from "@tanstack/ai-client";

interface ProjectCreationToolBubbleProps {
  part: Extract<UIMessage["parts"][number], { type: "tool-call" }>;
  hasResult?: boolean;
  isLoading?: boolean;
  onApprovalResponse: (response: { id: string; approved: boolean }) => void;
}

/**
 * Tool bubble for createProjectFromProposal tool.
 *
 * Handles approval flow and shows status during project creation.
 */
export function ProjectCreationToolBubble({
  part,
  hasResult,
  isLoading,
  onApprovalResponse,
}: ProjectCreationToolBubbleProps) {
  const isApprovalRequested = part.state === "approval-requested";
  const isApprovalResponded = part.state === "approval-responded";
  const isApproved = isApprovalResponded && part.approval?.approved === true;
  const isDenied = isApprovalResponded && part.approval?.approved === false;
  const isApprovedAndFinished = isApproved && isLoading === false;
  const isComplete =
    part.state === "input-complete" ||
    part.output !== undefined ||
    hasResult === true ||
    isApprovedAndFinished;

  // Approval requested
  if (isApprovalRequested && part.approval) {
    return (
      <div className="flex flex-col gap-3 rounded-lg border border-amber-300 bg-amber-50 p-3 dark:border-amber-700 dark:bg-amber-950/50">
        <div className="flex items-center gap-2">
          <AlertTriangleIcon className="size-4 text-amber-600 dark:text-amber-400" />
          <span className="font-medium text-amber-800 text-sm dark:text-amber-200">
            Ready to create project?
          </span>
        </div>
        <p className="text-amber-700 text-xs dark:text-amber-300">
          This will create the project with all columns, labels, and initial
          tasks.
        </p>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="solid"
            onClick={() =>
              onApprovalResponse({ id: part.approval!.id, approved: true })
            }
            className="bg-green-600 text-white hover:bg-green-700"
          >
            <CheckCircleIcon className="mr-1 size-3" />
            Create Project
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() =>
              onApprovalResponse({ id: part.approval!.id, approved: false })
            }
          >
            <XCircleIcon className="mr-1 size-3" />
            Cancel
          </Button>
        </div>
      </div>
    );
  }

  // Approved, creating
  if (isApproved && !isComplete) {
    return (
      <div className="flex items-center gap-2 rounded-md bg-green-50 px-3 py-2 text-green-700 text-sm dark:bg-green-950/50 dark:text-green-300">
        <Loader2Icon className="size-4 animate-spin" />
        <span>Creating project...</span>
      </div>
    );
  }

  // Denied
  if (isDenied) {
    return (
      <div className="flex items-center gap-2 rounded-md bg-muted px-3 py-2 text-muted-foreground text-sm">
        <XCircleIcon className="size-4" />
        <span>Project creation cancelled</span>
      </div>
    );
  }

  // Complete - show success
  if (isComplete) {
    const output = part.output as
      | {
          project?: { name: string; prefix: string };
          columnsCreated?: number;
          labelsCreated?: number;
          tasksCreated?: number;
        }
      | undefined;

    return (
      <div className="flex flex-col gap-2 rounded-lg border border-green-200 bg-green-50 p-3 dark:border-green-800 dark:bg-green-950/50">
        <div className="flex items-center gap-2">
          <CheckCircleIcon className="size-4 text-green-600 dark:text-green-400" />
          <span className="font-medium text-green-800 text-sm dark:text-green-200">
            Project created successfully!
          </span>
        </div>
        {output?.project && (
          <div className="flex items-center gap-2 text-green-700 text-xs dark:text-green-300">
            <LayersIcon className="size-3" />
            <span>
              {output.project.name} ({output.project.prefix})
            </span>
          </div>
        )}
        {(output?.columnsCreated ||
          output?.labelsCreated ||
          output?.tasksCreated) && (
          <p className="text-green-600 text-xs dark:text-green-400">
            Created {output.columnsCreated ?? 0} columns
            {output.labelsCreated ? `, ${output.labelsCreated} labels` : ""}
            {output.tasksCreated ? `, ${output.tasksCreated} tasks` : ""}
          </p>
        )}
      </div>
    );
  }

  // In progress (shouldn't normally be visible, but handle it)
  return (
    <div className="flex items-center gap-2 rounded-md bg-muted/50 px-3 py-2 text-muted-foreground text-xs">
      <Loader2Icon className="size-3 animate-spin" />
      <span>Preparing to create project...</span>
    </div>
  );
}
