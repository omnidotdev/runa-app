import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useLoaderData } from "@tanstack/react-router";
import { CheckIcon, PlusIcon } from "lucide-react";
import { useState } from "react";

import { ColorSelector, Label } from "@/components/core";
import { Button } from "@/components/ui/button";
import { parseColor } from "@/components/ui/color-picker";
import { Input } from "@/components/ui/input";
import {
  PopoverContent,
  PopoverPositioner,
  PopoverRoot,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  useCreateLabelMutation,
  useCreateTaskLabelMutation,
  useDeleteTaskLabelMutation,
  useTasksQuery,
} from "@/generated/graphql";
import { useCurrentUserRole } from "@/lib/hooks/useCurrentUserRole";
import labelsOptions from "@/lib/options/labels.options";
import taskOptions from "@/lib/options/task.options";
import { Role } from "@/lib/permissions";
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
    from: "/_app/workspaces/$workspaceSlug",
  });
  const role = useCurrentUserRole(organizationId);
  const canCreate = role !== Role.Member;

  const [newLabel, setNewLabel] = useState({ name: "", color: "blue" });

  const { data: labels = [] } = useQuery({
    ...labelsOptions({ projectId }),
    select: (data) => data?.labels?.nodes ?? [],
  });

  const invalidate = async () => {
    await queryClient.invalidateQueries({
      queryKey: taskOptions({ rowId: taskId }).queryKey,
    });
    await queryClient.invalidateQueries({
      queryKey: getQueryKeyPrefix(useTasksQuery),
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

    const result = await createLabel({
      input: {
        label: { name: newLabel.name, color: newLabel.color, projectId },
      },
    });
    const created = result.createLabel?.label;
    if (created) {
      await createTaskLabel({
        input: { taskLabel: { taskId, labelId: created.rowId } },
      });
    }
    setNewLabel({ name: "", color: "blue" });
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
              <div className="flex items-center gap-1 border-b pb-2">
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
                      <span className="flex items-center gap-2">
                        <span
                          className="size-3 shrink-0 rounded-full"
                          style={{ backgroundColor: label.color }}
                        />
                        <span className="truncate">{label.name}</span>
                      </span>

                      <CheckIcon
                        className={cn(
                          "size-4 text-primary transition-opacity",
                          isSelected ? "opacity-100" : "opacity-0",
                        )}
                      />
                    </button>
                  );
                })}
              </div>
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
