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
            "mb-2 cursor-pointer rounded-lg border bg-background p-3 outline-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background dark:border-border",
            !snapshot.isDragging && "hover:shadow-sm dark:shadow-gray-400/10",
          )}
        >
          <div className="flex flex-col gap-1">
            <div className="flex items-start gap-2">
              <div className="mt-0.5 min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="shrink-0 font-medium font-mono text-base-400 text-xs dark:text-base-400">
                    {displayId}
                  </span>

                  <PriorityIcon
                    priority={task.priority}
                    className="scale-75 opacity-50"
                  />
                </div>

                <div className="py-4">
                  <RichTextEditor
                    defaultContent={task?.content}
                    className="min-h-0 w-fit border-0 p-0 text-xs dark:bg-background"
                    skeletonClassName="h-4 w-40"
                    editable={false}
                  />
                </div>
              </div>

              <Tooltip
                positioning={{
                  placement: "bottom-end",
                  gutter: -4,
                }}
                openDelay={1000}
                tooltip="Update Assignees"
                shortcut="A"
                trigger={
                  <div className="-mt-2.5 -mr-2 flex items-center gap-1">
                    {task.assignees.nodes.length ? (
                      <Assignees
                        assignees={task?.assignees.nodes.map(
                          (assignee) => assignee.user?.rowId!,
                        )}
                        className="-space-x-4 mt-1 flex w-fit items-center"
                      />
                    ) : (
                      <AvatarRoot
                        aria-label="No Assignees"
                        className="mt-2.5 mr-2 size-5.5"
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

            <div className="grid grid-cols-4">
              <div className="-m-3 col-span-3 flex items-end p-2.5">
                <Tooltip
                  positioning={{
                    placement: "top-start",
                    shift: -6,
                  }}
                  openDelay={1000}
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
              </div>

              <Tooltip
                positioning={{
                  placement: "top-end",
                  shift: -8,
                }}
                openDelay={1000}
                tooltip="Update Due Date"
                shortcut="D"
                trigger={
                  task?.dueDate ? (
                    <div className="col-span-1 mr-1 flex h-5 items-center justify-end gap-1 place-self-end text-base-500 text-xs dark:text-base-400">
                      <CalendarIcon className="h-3 w-3" />
                      {/* TODO: timezone handling */}
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
        </div>
      )}
    </Draggable>
  );
};

export default BoardItem;
