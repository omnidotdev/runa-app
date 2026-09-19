import { parseColor } from "@omnidotdev/thornberry/color-picker";
import {
  PopoverContent,
  PopoverPositioner,
  PopoverRoot,
  PopoverTrigger,
} from "@omnidotdev/thornberry/popover";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useLoaderData } from "@tanstack/react-router";
import { CheckIcon, PlusIcon } from "lucide-react";
import { useRef, useState } from "react";

import { ColorSelector, Label } from "@/components/core";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  useCreateLabelMutation,
  useCreateTaskLabelMutation,
  useDeleteTaskLabelMutation,
  useTasksQuery,
} from "@/generated/graphql";
import { useCurrentUserRole } from "@/lib/hooks/useCurrentUserRole";
import labelsOptions from "@/lib/options/labels.options";
import taskOptions from "@/lib/options/task.options";
import workspaceLabelsOptions from "@/lib/options/workspaceLabels.options";
import { Role, isAdminOrOwner } from "@/lib/permissions";
import getQueryKeyPrefix from "@/lib/util/getQueryKeyPrefix";
import { cn } from "@/lib/utils";
import { PropertyTrigger, PropertyValue } from "./propertyRow";

import type { LabelFragment } from "@/generated/graphql";

interface TaskLabel {
  labelId: string;
  label?: LabelFragment | null;
}

interface Props {
  taskId: string;
  projectId: string;
  taskLabels: TaskLabel[];
  editable: boolean;
}

type LabelScope = "project" | "workspace";

const TriggerContent = ({ taskLabels }: { taskLabels: TaskLabel[] }) => {
  if (!taskLabels.length) {
    return <span className="text-muted-foreground">No labels</span>;
  }

  return (
    <div className="flex flex-wrap gap-1">
      {taskLabels.map(
        (taskLabel) =>
          taskLabel.label && (
            <Label key={taskLabel.labelId} label={taskLabel.label} />
          ),
      )}
    </div>
  );
};

/** Editing surface, isolated so its hooks never mount in the read-only view. */
const LabelsEditor = ({
  taskId,
  projectId,
  taskLabels,
}: {
  taskId: string;
  projectId: string;
  taskLabels: TaskLabel[];
}) => {
  const queryClient = useQueryClient();
  const { organizationId } = useLoaderData({
    from: "/_app/@{$workspaceSlug}",
  });
  const role = useCurrentUserRole(organizationId);
  const canCreate = role !== Role.Member;
  // Workspace-shared labels require org admin (also enforced server-side)
  const canCreateWorkspace = role ? isAdminOrOwner(role) : false;

  const inputRef = useRef<HTMLInputElement>(null);
  const [newLabel, setNewLabel] = useState<{
    name: string;
    color: string;
    scope: LabelScope;
  }>({ name: "", color: "blue", scope: "project" });

  const { data: projectLabels = [] } = useQuery({
    ...labelsOptions({ projectId }),
    select: (data) => data?.labels?.nodes ?? [],
  });

  const { data: workspaceLabels = [] } = useQuery({
    ...workspaceLabelsOptions({ organizationId }),
    select: (data) => data?.labels?.nodes ?? [],
    enabled: !!organizationId,
  });

  // Workspace-shared labels first, then this board's own labels
  const labels = [...workspaceLabels, ...projectLabels];

  const invalidate = async () => {
    await queryClient.invalidateQueries({
      queryKey: taskOptions({ rowId: taskId }).queryKey,
    });
    await queryClient.invalidateQueries({
      queryKey: getQueryKeyPrefix(useTasksQuery),
    });
    await queryClient.invalidateQueries({
      queryKey: labelsOptions({ projectId }).queryKey,
    });
    await queryClient.invalidateQueries({
      queryKey: workspaceLabelsOptions({ organizationId }).queryKey,
    });
  };

  const { mutateAsync: createLabel } = useCreateLabelMutation();
  const { mutateAsync: createTaskLabel } = useCreateTaskLabelMutation();
  const { mutateAsync: deleteTaskLabel } = useDeleteTaskLabelMutation();

  const selected = taskLabels.map((taskLabel) => taskLabel.labelId);

  const handleToggle = async (labelId: string) => {
    if (selected.includes(labelId)) {
      await deleteTaskLabel({ taskId, labelId });
    } else {
      await createTaskLabel({ input: { taskLabel: { taskId, labelId } } });
    }
    await invalidate();
  };

  const handleCreate = async () => {
    if (!newLabel.name) return;

    // Workspace scope is admin-only; fall back to project scope defensively
    const useWorkspaceScope =
      newLabel.scope === "workspace" && canCreateWorkspace;
    const scopeFields = useWorkspaceScope ? { organizationId } : { projectId };

    const result = await createLabel({
      input: {
        label: { name: newLabel.name, color: newLabel.color, ...scopeFields },
      },
    });
    const created = result.createLabel?.label;
    if (created) {
      await createTaskLabel({
        input: { taskLabel: { taskId, labelId: created.rowId } },
      });
    }
    setNewLabel((prev) => ({ name: "", color: "blue", scope: prev.scope }));
    await invalidate();
  };

  return (
    <PopoverRoot positioning={{ placement: "bottom-start" }}>
      <PopoverTrigger asChild>
        <PropertyTrigger>
          <TriggerContent taskLabels={taskLabels} />
        </PropertyTrigger>
      </PopoverTrigger>

      <PopoverPositioner>
        <PopoverContent className="w-72 p-2">
          <div className="flex flex-col gap-1">
            {canCreate && (
              <div className="flex flex-col gap-2 border-b pb-2">
                {canCreateWorkspace && (
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-0.5 rounded-md bg-muted p-0.5 text-xs">
                      {(
                        [
                          ["project", "This board"],
                          ["workspace", "Workspace"],
                        ] as const
                      ).map(([scope, copy]) => (
                        <button
                          key={scope}
                          type="button"
                          onClick={() =>
                            setNewLabel((prev) => ({ ...prev, scope }))
                          }
                          className={cn(
                            "flex-1 rounded px-2 py-1 transition-colors",
                            newLabel.scope === scope
                              ? "bg-background font-medium shadow-sm"
                              : "text-muted-foreground hover:text-foreground",
                          )}
                        >
                          {copy}
                        </button>
                      ))}
                    </div>

                    {newLabel.scope === "workspace" && (
                      <p className="px-1 text-[11px] text-muted-foreground">
                        Shared across all boards in this workspace
                      </p>
                    )}
                  </div>
                )}

                <div className="flex items-center gap-1">
                  <ColorSelector
                    showChannelInput={false}
                    positioning={{ strategy: "fixed", placement: "bottom" }}
                    value={parseColor(newLabel.color)}
                    onValueChange={(details) =>
                      setNewLabel((prev) => ({
                        ...prev,
                        color: details.value.toString("hex"),
                      }))
                    }
                  />

                  <Input
                    ref={inputRef}
                    autoComplete="off"
                    className="h-8 border-0 px-2 text-sm shadow-none"
                    placeholder="Create a label…"
                    value={newLabel.name}
                    onChange={(event) =>
                      setNewLabel((prev) => ({
                        ...prev,
                        name: event.target.value,
                      }))
                    }
                    onKeyDown={(event) => {
                      if (event.key === "Enter" && newLabel.name) {
                        event.preventDefault();
                        void handleCreate();
                      }
                    }}
                  />

                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-7"
                    disabled={!newLabel.name}
                    onClick={handleCreate}
                    aria-label="Create label"
                  >
                    <PlusIcon className="size-4" />
                  </Button>
                </div>
              </div>
            )}

            {labels.length ? (
              <div className="flex max-h-64 flex-col gap-0.5 overflow-y-auto">
                {labels.map((label) => {
                  const isSelected = selected.includes(label.rowId);

                  return (
                    <button
                      type="button"
                      key={label.rowId}
                      onClick={() => handleToggle(label.rowId)}
                      className={cn(
                        "flex items-center justify-between gap-2 rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-accent",
                        !isSelected && "text-muted-foreground",
                      )}
                    >
                      <span className="flex min-w-0 items-center gap-2">
                        <span
                          className="size-3 shrink-0 rounded-full"
                          style={{ backgroundColor: label.color }}
                        />
                        <span className="truncate">{label.name}</span>
                        {label.organizationId && (
                          <span className="shrink-0 rounded bg-muted px-1 py-0.5 text-[10px] text-muted-foreground">
                            Workspace
                          </span>
                        )}
                      </span>

                      <CheckIcon
                        className={cn(
                          "size-4 shrink-0 text-primary transition-opacity",
                          isSelected ? "opacity-100" : "opacity-0",
                        )}
                      />
                    </button>
                  );
                })}
              </div>
            ) : canCreate ? (
              <Button
                variant="link"
                className="h-auto justify-center py-4 text-xs"
                onClick={() => inputRef.current?.focus()}
              >
                Create your first label
              </Button>
            ) : (
              <p className="py-4 text-center text-muted-foreground text-xs">
                No labels yet
              </p>
            )}
          </div>
        </PopoverContent>
      </PopoverPositioner>
    </PopoverRoot>
  );
};

const LabelsPopover = ({ taskId, projectId, taskLabels, editable }: Props) => {
  if (!editable) {
    return (
      <PropertyValue>
        <TriggerContent taskLabels={taskLabels} />
      </PropertyValue>
    );
  }

  return (
    <LabelsEditor
      taskId={taskId}
      projectId={projectId}
      taskLabels={taskLabels}
    />
  );
};

export default LabelsPopover;
