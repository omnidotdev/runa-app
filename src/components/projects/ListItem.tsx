import { Draggable } from "@hello-pangea/dnd";
import { useNavigate, useParams } from "@tanstack/react-router";
import { format } from "date-fns";
import { CalendarIcon, TagIcon, UserIcon } from "lucide-react";
import { useRef, useState } from "react";

import RichTextEditor from "@/components/core/RichTextEditor";
import Tooltip from "@/components/core/Tooltip";
import Assignees from "@/components/shared/Assignees";
import Label from "@/components/shared/Label";
import PriorityIcon from "@/components/tasks/PriorityIcon";
import { AvatarFallback, AvatarRoot } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import useDialogStore, { DialogType } from "@/lib/hooks/store/useDialogStore";
import useDragStore from "@/lib/hooks/store/useDragStore";
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

  const [isHovered, setIsHovered] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const { isDragging } = useDragStore();
  const { taskId, setTaskId } = useTaskStore();
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

  const handleOnMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setIsHovered(true);
      // NB: tracking global `isDragging` is important to not trigger these handlers while a user is dragging a task
      if (!isUpdateDialogOpen && !isDragging && !taskId) {
        setTaskId(task.rowId);
      }
    }, 300);
  };

  const handleOnMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (isHovered) {
      setIsHovered(false);
      if (!isUpdateDialogOpen && !isDragging && !!taskId) {
        setTaskId(null);
      }
    }
  };

  return (
    <Draggable draggableId={task.rowId} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          // NB: tracking global `isDragging` is important to not trigger these handlers while a user is dragging a task
          onMouseEnter={handleOnMouseEnter}
          onMouseLeave={handleOnMouseLeave}
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
            "group flex cursor-pointer flex-col gap-2 bg-background px-4 py-3 last:rounded-b-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset",
            snapshot.isDragging ? "z-10 rounded-md border" : "",
          )}
        >
          <div className="flex items-center">
            <div className="flex flex-col">
              <div className="flex items-center gap-2 text-base-400 text-xs dark:text-base-400">
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
              trigger={
                <div className="-mt-6 ml-auto flex items-center gap-1">
                  {task.assignees.nodes.length ? (
                    <Assignees
                      assignees={task.assignees.nodes.map(
                        (assignee) => assignee.user?.rowId!,
                      )}
                      className="flex w-fit items-center -space-x-4"
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
              }
            />
          </div>

          <div className="hidden items-center justify-between sm:flex">
            <Tooltip
              positioning={{
                placement: "top-start",
                shift: -6,
              }}
              tooltip="Update Labels"
              shortcut="L"
              trigger={
                task.taskLabels.nodes.length ? (
                  <div className="flex flex-wrap gap-1">
                    {task.taskLabels.nodes?.map(({ label }) => (
                      <Label
                        key={label?.rowId}
                        label={label as LabelFragment}
                      />
                    ))}
                  </div>
                ) : (
                  <Badge
                    variant="outline"
                    className="border-border border-dashed"
                  >
                    <TagIcon className="size-2.5!" />
                  </Badge>
                )
              }
            />

            <Tooltip
              positioning={{
                placement: "top-end",
                shift: -8,
              }}
              tooltip="Update Due Date"
              shortcut="D"
              trigger={
                task?.dueDate ? (
                  <div className="flex h-5 items-center gap-1 text-base-500 text-xs dark:text-base-400">
                    <CalendarIcon className="h-3 w-3" />
                    <span>{format(new Date(task.dueDate), "MMM d")}</span>
                  </div>
                ) : (
                  <Badge
                    variant="outline"
                    className="h-5 w-fit place-self-end border-border border-dashed"
                  >
                    <CalendarIcon className="size-2.5!" />
                  </Badge>
                )
              }
            />
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default ListItem;
