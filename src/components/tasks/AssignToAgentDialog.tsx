/**
 * Dialog for assigning a task to the AI agent for autonomous code execution.
 *
 * Shows model selector, connected repository info, and a warning banner.
 * Admin-only — disabled with tooltip for non-admin users.
 */

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouteContext } from "@tanstack/react-router";
import { AlertTriangleIcon, BotIcon, GitBranchIcon } from "lucide-react";
import { useCallback, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  DialogBackdrop,
  DialogCloseTrigger,
  DialogContent,
  DialogDescription,
  DialogPositioner,
  DialogRoot,
  DialogTitle,
} from "@/components/ui/dialog";
import { API_BASE_URL } from "@/lib/config/env.config";
import useDialogStore, { DialogType } from "@/lib/hooks/store/useDialogStore";
import githubRepositoriesOptions from "@/lib/options/githubRepositories.options";
import { taskExecutionQueryKey } from "@/lib/options/taskExecution.options";

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

interface AssignToAgentDialogProps {
  taskId: string;
  projectId: string;
}

const EXECUTION_MODELS = [
  {
    id: "anthropic/claude-sonnet-4.5",
    label: "Claude Sonnet 4.5",
    description: "Fast and capable (recommended)",
  },
  {
    id: "anthropic/claude-opus-4.6",
    label: "Claude Opus 4.6",
    description: "Maximum reasoning for complex tasks",
  },
] as const;

// ─────────────────────────────────────────────
// API
// ─────────────────────────────────────────────

async function triggerExecution(
  projectId: string,
  taskId: string,
  model: string,
  accessToken: string,
): Promise<{ executionId: string; status: string }> {
  const response = await fetch(`${API_BASE_URL}/api/ai/execute`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ projectId, taskId, model }),
  });

  if (!response.ok) {
    const data = (await response.json().catch(() => null)) as {
      error?: string;
    } | null;
    throw new Error(data?.error ?? "Failed to assign task to agent");
  }

  return response.json() as Promise<{ executionId: string; status: string }>;
}

// ─────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────

export function AssignToAgentDialog({
  taskId,
  projectId,
}: AssignToAgentDialogProps) {
  const { isOpen, setIsOpen } = useDialogStore({
    type: DialogType.AssignToAgent,
  });
  const { session } = useRouteContext({ from: "/_app" });
  const accessToken = session?.accessToken!;
  const queryClient = useQueryClient();

  const [selectedModel, setSelectedModel] = useState(
    EXECUTION_MODELS[0].id as string,
  );

  // Fetch connected repository
  const { data: repoData } = useQuery(
    githubRepositoriesOptions({ projectId, accessToken }),
  );

  const connectedRepo = repoData?.repositories?.[0];

  // Trigger execution mutation
  const { mutate: assign, isPending } = useMutation({
    mutationFn: () =>
      triggerExecution(projectId, taskId, selectedModel, accessToken),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: taskExecutionQueryKey(taskId, projectId),
      });
      setIsOpen(false);
    },
  });

  const handleSubmit = useCallback(() => {
    assign();
  }, [assign]);

  return (
    <DialogRoot
      open={isOpen}
      onOpenChange={(details) => setIsOpen(details.open)}
    >
      <DialogBackdrop />
      <DialogPositioner>
        <DialogContent className="max-w-md">
          <DialogCloseTrigger />

          <div className="flex items-center gap-2">
            <BotIcon className="size-5 text-primary" />
            <DialogTitle>Assign to Agent</DialogTitle>
          </div>

          <DialogDescription>
            The agent will autonomously work on this task by making code changes
            and opening a pull request.
          </DialogDescription>

          <div className="mt-4 flex flex-col gap-4">
            {/* Repository info */}
            <div className="flex items-center gap-2 rounded-md border p-3">
              <GitBranchIcon className="size-4 shrink-0 text-muted-foreground" />
              {connectedRepo ? (
                <span className="text-sm">{connectedRepo.repoFullName}</span>
              ) : (
                <span className="text-destructive text-sm">
                  No repository connected. Connect one in project settings.
                </span>
              )}
            </div>

            {/* Model selector */}
            <div className="flex flex-col gap-2">
              <span className="font-medium text-sm">Model</span>
              <div className="flex flex-col gap-1.5">
                {EXECUTION_MODELS.map((model) => (
                  <button
                    key={model.id}
                    type="button"
                    onClick={() => setSelectedModel(model.id)}
                    className={`flex flex-col rounded-md border p-2.5 text-left transition-colors ${
                      selectedModel === model.id
                        ? "border-primary bg-primary/5"
                        : "hover:bg-muted/50"
                    }`}
                  >
                    <span className="font-medium text-sm">{model.label}</span>
                    <span className="text-muted-foreground text-xs">
                      {model.description}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Warning */}
            <div className="flex items-start gap-2 rounded-md border border-amber-200 bg-amber-50 p-3 dark:border-amber-800 dark:bg-amber-950/30">
              <AlertTriangleIcon className="mt-0.5 size-4 shrink-0 text-amber-600" />
              <p className="text-amber-700 text-xs dark:text-amber-400">
                The agent will clone your repo, make code changes, and open a
                PR. Review the PR before merging.
              </p>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-2">
              <DialogCloseTrigger asChild>
                <Button variant="outline" size="sm">
                  Cancel
                </Button>
              </DialogCloseTrigger>
              <Button
                size="sm"
                disabled={!connectedRepo || isPending}
                onClick={handleSubmit}
              >
                {isPending ? "Assigning..." : "Assign to Agent"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </DialogPositioner>
    </DialogRoot>
  );
}
