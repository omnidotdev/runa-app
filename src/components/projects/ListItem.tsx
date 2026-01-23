import { Draggable } from "@hello-pangea/dnd";
import { useNavigate, useParams } from "@tanstack/react-router";
import dayjs from "dayjs";
import { CalendarIcon } from "lucide-react";
import { useRef, useState } from "react";

import { Assignees, Label, RichTextEditor, Tooltip } from "@/components/core";
import { PriorityIcon } from "@/components/tasks";
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

            {task.assignees.nodes.length > 0 && (
              <Tooltip
                positioning={{
                  placement: "bottom-end",
                  gutter: -4,
                }}
                tooltip="Update Assignees"
                shortcut="A"
                trigger={
                  <div className="-mt-6 ml-auto flex items-center gap-1">
                    <Assignees
                      assignees={task.assignees.nodes.map(
                        (assignee) => assignee.user?.identityProviderId!,
                      )}
                      className="flex w-fit items-center -space-x-4"
                    />
                  </div>
                }
              />
            )}
          </div>

          <div className="hidden items-center justify-between sm:flex">
            {task.taskLabels.nodes.length > 0 && (
              <Tooltip
                positioning={{
                  placement: "top-start",
                  shift: -6,
                }}
                tooltip="Update Labels"
                shortcut="L"
                trigger={
                  <div className="flex flex-wrap gap-1">
                    {task.taskLabels.nodes?.map(({ label }) => (
                      <Label
                        key={label?.rowId}
                        label={label as LabelFragment}
                      />
                    ))}
                  </div>
                }
              />
            )}

            {task.dueDate && (
              <Tooltip
                positioning={{
                  placement: "top-end",
                  shift: -8,
                }}
                tooltip="Update Due Date"
                shortcut="D"
                trigger={
                  <div className="flex h-5 items-center gap-1 text-base-500 text-xs dark:text-base-400">
                    <CalendarIcon className="h-3 w-3" />
                    <span>{dayjs(task.dueDate).format("MMM D")}</span>
                  </div>
                }
              />
            )}
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default ListItem;
