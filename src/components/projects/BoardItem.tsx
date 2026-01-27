import { Draggable } from "@hello-pangea/dnd";
import { useNavigate, useParams } from "@tanstack/react-router";
import dayjs from "dayjs";
import { AlignLeftIcon, CalendarIcon, MessageCircleIcon } from "lucide-react";
import { useRef, useState } from "react";

import { Assignees, Label, RichTextEditor, Tooltip } from "@/components/core";
import { PriorityIcon } from "@/components/tasks";
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

const BoardItem = ({ task, index, displayId }: Props) => {
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
    }),
    { isOpen: isUpdateDueDateDialogOpen } = useDialogStore({
      type: DialogType.UpdateDueDate,
    }),
    { isOpen: isUpdateTaskLabelsDialogOpen } = useDialogStore({
      type: DialogType.UpdateTaskLabels,
    });

  const isUpdateDialogOpen =
    isUpdateAssigneesDialogOpen ||
    isUpdateDueDateDialogOpen ||
    isUpdateTaskLabelsDialogOpen;

  const handleSetTaskId = () => {
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

  const handleClearTaskId = () => {
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
          onMouseEnter={handleSetTaskId}
          onMouseLeave={handleClearTaskId}
          onFocus={handleSetTaskId}
          onBlur={handleClearTaskId}
          onKeyDown={(evt) => {
            if (evt.key === "Enter") {
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
            "mb-2 h-35 shrink-0 cursor-pointer overflow-hidden rounded-lg border bg-background p-3 outline-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background dark:border-border",
            !snapshot.isDragging && "hover:shadow-sm dark:shadow-gray-400/10",
          )}
        >
          <div className="flex h-full flex-col">
            <div className="flex items-start gap-2">
              <div className="mt-0.5 min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <PriorityIcon
                    priority={task.priority}
                    className="size-2.5 shrink-0 opacity-60"
                  />
                  <span className="shrink-0 font-medium font-mono text-base-400 text-xs dark:text-base-400">
                    {displayId}
                  </span>
                </div>

                <div className="line-clamp-2 py-2">
                  <RichTextEditor
                    defaultContent={task?.content}
                    className="min-h-0! w-fit border-0 p-0 text-xs dark:bg-background [&_.ProseMirror]:line-clamp-2 [&_.ProseMirror]:overflow-hidden"
                    skeletonClassName="h-4 w-40"
                    editable={false}
                  />
                </div>
              </div>

              {task.assignees.nodes.length > 0 && (
                <Tooltip
                  positioning={{ placement: "bottom-end", gutter: -4 }}
                  tooltip="Update Assignees"
                  shortcut="A"
                  trigger={
                    <Assignees
                      assignees={task.assignees.nodes.map(
                        (assignee) => assignee.user?.identityProviderId!,
                      )}
                      className="flex w-fit items-center"
                    />
                  }
                />
              )}
            </div>

            <div className="mt-auto flex items-end justify-between gap-2">
              {task.taskLabels.nodes.length > 0 && (
                <Tooltip
                  positioning={{ placement: "top-start", shift: -6 }}
                  tooltip="Update Labels"
                  shortcut="L"
                  trigger={
                    <div className="flex max-h-6 flex-wrap gap-1 overflow-hidden">
                      {task.taskLabels.nodes.slice(0, 3).map(({ label }) => (
                        <Label
                          key={label?.rowId}
                          label={label as LabelFragment}
                        />
                      ))}
                      {task.taskLabels.nodes.length > 3 && (
                        <Badge
                          variant="outline"
                          className="border-border text-xs"
                        >
                          +{task.taskLabels.nodes.length - 3}
                        </Badge>
                      )}
                    </div>
                  }
                />
              )}

              <div className="ml-auto flex items-center gap-2 text-base-500 text-xs dark:text-base-400">
                {task.description && (
                  <Tooltip
                    positioning={{ placement: "top" }}
                    tooltip="Has description"
                    trigger={
                      <div className="flex items-center">
                        <AlignLeftIcon className="size-3" />
                      </div>
                    }
                  />
                )}

                {task.posts.totalCount > 0 && (
                  <Tooltip
                    positioning={{ placement: "top" }}
                    tooltip={`${task.posts.totalCount} comment${task.posts.totalCount === 1 ? "" : "s"}`}
                    trigger={
                      <div className="flex items-center gap-0.5">
                        <MessageCircleIcon className="size-3" />
                        <span>{task.posts.totalCount}</span>
                      </div>
                    }
                  />
                )}

                {task.dueDate && (
                  <Tooltip
                    positioning={{ placement: "top-end", shift: -8 }}
                    tooltip="Update Due Date"
                    shortcut="D"
                    trigger={
                      <div className="flex items-center gap-1">
                        <CalendarIcon className="size-3" />
                        {/* TODO: timezone handling */}
                        <span>{dayjs(task.dueDate).format("MMM D")}</span>
                      </div>
                    }
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default BoardItem;
