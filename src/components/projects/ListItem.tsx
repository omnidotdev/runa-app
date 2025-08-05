import { Draggable } from "@hello-pangea/dnd";
import { useNavigate, useParams } from "@tanstack/react-router";
import { format } from "date-fns";
import { CalendarIcon, TagIcon, UserIcon } from "lucide-react";

import Assignees from "@/components/Assignees";
import RichTextEditor from "@/components/core/RichTextEditor";
import Label from "@/components/Label";
import PriorityIcon from "@/components/tasks/PriorityIcon";
import { AvatarFallback, AvatarRoot } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tooltip } from "@/components/ui/tooltip";
import useDialogStore, { DialogType } from "@/lib/hooks/store/useDialogStore";
import useTaskStore from "@/lib/hooks/store/useTaskStore";
import { cn } from "@/lib/utils";

import type { LabelFragment, TaskFragment } from "@/generated/graphql";

interface Props {
  task: TaskFragment;
  index: number;
  displayId: string;
}

const ListItem = ({ task, index, displayId }: Props) => {
  const navigate = useNavigate();

  const { workspaceSlug, projectSlug } = useParams({
    from: "/_auth/workspaces/$workspaceSlug/projects/$projectSlug/",
  });

  const { setTaskId } = useTaskStore();
  const { isOpen: isUpdateAssigneesDialogOpen } = useDialogStore({
    type: DialogType.UpdateAssignees,
  });
  const { isOpen: isUpdateDueDateDialogOpen } = useDialogStore({
    type: DialogType.UpdateDueDate,
  });
  const { isOpen: isUpdateTaskLabelsDialogOpen } = useDialogStore({
    type: DialogType.UpdateTaskLabels,
  });

  const isUpdateDialogOpen =
    isUpdateAssigneesDialogOpen ||
    isUpdateDueDateDialogOpen ||
    isUpdateTaskLabelsDialogOpen;

  return (
    <Draggable key={task.rowId} draggableId={task.rowId} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onMouseEnter={() => setTaskId(task.rowId)}
          onMouseLeave={() => !isUpdateDialogOpen && setTaskId(null)}
          onClick={() => {
            if (!snapshot.isDragging) {
              navigate({
                to: "/workspaces/$workspaceSlug/projects/$projectSlug/$taskId",
                params: {
                  workspaceSlug,
                  projectSlug,
                  taskId: task.rowId,
                },
              });
            }
          }}
          className={cn(
            "group flex cursor-pointer flex-col gap-2 bg-background px-4 py-3 last:rounded-b-md",
            snapshot.isDragging ? "z-10 rounded-md border" : "",
          )}
        >
          <div className="flex items-center">
            <div className="flex flex-col">
              <div className="flex items-center gap-2 text-base-400 text-xs dark:text-base-500">
                <span className="font-mono">{displayId}</span>
                <PriorityIcon
                  priority={task.priority}
                  className="scale-75 opacity-50"
                />
              </div>

              <div className="py-2">
                <RichTextEditor
                  defaultContent={task?.content}
                  className="min-h-0 border-0 p-0 text-xs dark:bg-background"
                  skeletonClassName="h-4 w-80"
                  editable={false}
                />
              </div>
            </div>

            <Tooltip
              positioning={{
                placement: "bottom-end",
                gutter: -4,
              }}
              tooltip="Update Assignees"
              shortcut="A"
            >
              <div className="-mt-6 -mr-2 ml-auto flex items-center gap-1">
                {task.assignees.nodes.length ? (
                  <Assignees
                    assignees={task.assignees.nodes.map(
                      (assignee) => assignee.user?.rowId!,
                    )}
                    className="-space-x-5.5 flex"
                  />
                ) : (
                  <AvatarRoot
                    aria-label="No Assignees"
                    className="mr-2 size-5.5"
                  >
                    <AvatarFallback className="border border-border border-dashed bg-transparent p-1 text-muted-foreground">
                      <UserIcon />
                    </AvatarFallback>
                  </AvatarRoot>
                )}
              </div>
            </Tooltip>
          </div>

          <div className="hidden items-center justify-between sm:flex">
            <Tooltip
              positioning={{
                placement: "top-start",
                shift: -6,
              }}
              tooltip="Update Labels"
              shortcut="L"
            >
              {task.taskLabels.nodes.length ? (
                <div className="flex flex-wrap gap-1">
                  {task.taskLabels.nodes?.map(({ label }) => (
                    <Label key={label?.rowId} label={label as LabelFragment} />
                  ))}
                </div>
              ) : (
                <Badge
                  size="sm"
                  variant="outline"
                  className="border-border border-dashed"
                >
                  <TagIcon className="!size-2.5" />
                </Badge>
              )}
            </Tooltip>

            <Tooltip
              positioning={{
                placement: "top-end",
                shift: -8,
              }}
              tooltip="Update Due Date"
              shortcut="D"
            >
              {task?.dueDate ? (
                <div className="flex h-5 items-center gap-1 text-base-500 text-xs dark:text-base-400">
                  <CalendarIcon className="h-3 w-3" />
                  <span>{format(new Date(task.dueDate), "MMM d")}</span>
                </div>
              ) : (
                <Badge
                  size="sm"
                  variant="outline"
                  className="h-5 w-fit place-self-end border-border border-dashed"
                >
                  <CalendarIcon className="!size-2.5" />
                </Badge>
              )}
            </Tooltip>
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default ListItem;
