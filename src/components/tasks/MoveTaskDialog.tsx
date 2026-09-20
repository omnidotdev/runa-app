import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";

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
import {
  useMoveTaskMutation,
  useProjectQuery,
  useTasksQuery,
} from "@/generated/graphql";
import useDialogStore, { DialogType } from "@/lib/hooks/store/useDialogStore";
import useTaskStore from "@/lib/hooks/store/useTaskStore";
import columnsOptions from "@/lib/options/columns.options";
import projectsOptions from "@/lib/options/projects.options";
import getQueryKeyPrefix from "@/lib/util/getQueryKeyPrefix";
import { isTaskRowId } from "@/lib/util/taskUrl";
import { cn } from "@/lib/utils";

interface Props {
  currentProjectId: string;
  organizationId: string;
  workspaceSlug: string;
}

/**
 * Moves a task to a column in another board within the same workspace. The task
 * gets a new key in the destination board and labels scoped to the current board
 * do not carry over (workspace-shared labels do). Opened via the shared dialog
 * store; the target task is read from the task store, so one instance per route
 * serves every card and the task detail menu
 */
const MoveTaskDialog = ({
  currentProjectId,
  organizationId,
  workspaceSlug,
}: Props) => {
  const navigate = useNavigate();
  const { taskId } = useTaskStore();
  const { isOpen: open, setIsOpen } = useDialogStore({
    type: DialogType.MoveTask,
  });
  const onOpenChange = (next: boolean) => setIsOpen(next);
  const [targetProjectId, setTargetProjectId] = useState<string | null>(null);
  const [targetColumnId, setTargetColumnId] = useState<string | null>(null);

  const { data: projects = [] } = useQuery({
    ...projectsOptions({ organizationId }),
    select: (data) =>
      (data?.projects?.nodes ?? []).filter((p) => p.rowId !== currentProjectId),
    enabled: open && !!organizationId,
  });

  const { data: columns = [] } = useQuery({
    ...columnsOptions({ projectId: targetProjectId ?? "" }),
    select: (data) => data?.columns?.nodes ?? [],
    enabled: open && !!targetProjectId,
  });

  const targetProject = projects.find((p) => p.rowId === targetProjectId);

  const { mutate: moveTask, isPending } = useMoveTaskMutation({
    meta: {
      invalidates: [
        getQueryKeyPrefix(useTasksQuery),
        getQueryKeyPrefix(useProjectQuery),
      ],
    },
    onSuccess: () => {
      toast.success("Task moved");
      onOpenChange(false);
      if (targetProject?.slug) {
        navigate({
          to: "/@{$workspaceSlug}/$projectSlug",
          params: { workspaceSlug, projectSlug: targetProject.slug },
        });
      }
    },
    onError: () => toast.error("Failed to move task. Please try again."),
  });

  const reset = () => {
    setTargetProjectId(null);
    setTargetColumnId(null);
  };

  return (
    <DialogRoot
      open={open}
      onOpenChange={(details) => {
        onOpenChange(details.open);
        if (!details.open) reset();
      }}
    >
      <DialogBackdrop />
      <DialogPositioner>
        <DialogContent className="w-full max-w-md rounded-lg bg-background">
          <DialogCloseTrigger />

          <div className="mb-4 flex flex-col gap-1">
            <DialogTitle>Move task</DialogTitle>
            <DialogDescription>
              Move this task to another board in this workspace. The task gets a
              new key, and labels specific to the current board do not carry
              over (workspace-shared labels do).
            </DialogDescription>
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1">
              <span className="font-medium text-muted-foreground text-xs">
                Board
              </span>
              <div className="flex max-h-40 flex-col gap-0.5 overflow-y-auto">
                {projects.length ? (
                  projects.map((project) => (
                    <button
                      key={project.rowId}
                      type="button"
                      onClick={() => {
                        setTargetProjectId(project.rowId);
                        setTargetColumnId(null);
                      }}
                      className={cn(
                        "rounded-md px-2 py-1.5 text-left text-sm hover:bg-accent",
                        targetProjectId === project.rowId &&
                          "bg-accent font-medium",
                      )}
                    >
                      {project.name}
                    </button>
                  ))
                ) : (
                  <p className="py-2 text-center text-muted-foreground text-xs">
                    No other boards in this workspace
                  </p>
                )}
              </div>
            </div>

            {targetProjectId && (
              <div className="flex flex-col gap-1">
                <span className="font-medium text-muted-foreground text-xs">
                  Column
                </span>
                <div className="flex max-h-40 flex-col gap-0.5 overflow-y-auto">
                  {columns.length ? (
                    columns.map((column) => (
                      <button
                        key={column.rowId}
                        type="button"
                        onClick={() => setTargetColumnId(column.rowId)}
                        className={cn(
                          "rounded-md px-2 py-1.5 text-left text-sm hover:bg-accent",
                          targetColumnId === column.rowId &&
                            "bg-accent font-medium",
                        )}
                      >
                        {column.title}
                      </button>
                    ))
                  ) : (
                    <p className="py-2 text-center text-muted-foreground text-xs">
                      This board has no columns
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="mt-4 flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              disabled={!targetProjectId || !targetColumnId || isPending}
              onClick={() => {
                if (!targetProjectId || !targetColumnId) return;
                // the store holds the resolved rowId; guard against a vanity key
                if (!isTaskRowId(taskId)) {
                  toast.error("Failed to move task. Please try again.");
                  return;
                }
                moveTask({
                  input: {
                    taskId,
                    projectId: targetProjectId,
                    columnId: targetColumnId,
                  },
                });
              }}
            >
              Move
            </Button>
          </div>
        </DialogContent>
      </DialogPositioner>
    </DialogRoot>
  );
};

export default MoveTaskDialog;
