import { useNavigate, useParams } from "@tanstack/react-router";
import dayjs from "dayjs";
import { AlignLeftIcon, CalendarIcon, MessageCircleIcon } from "lucide-react";
import { useRef, useState } from "react";

import { Assignees, Label, RichTextEditor, Tooltip } from "@/components/core";
import { Badge } from "@/components/ui/badge";
import useDialogStore, { DialogType } from "@/lib/hooks/store/useDialogStore";
import useDragStore from "@/lib/hooks/store/useDragStore";
import useTaskStore from "@/lib/hooks/store/useTaskStore";
import BoardItemBase from "./BoardItemBase";

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

  const navigateToTask = () => {
    navigate({
      to: "/workspaces/$workspaceSlug/projects/$projectSlug/$taskId",
      params: {
        workspaceSlug,
        projectSlug,
        taskId: task.rowId,
      },
    });
  };

  return (
    <BoardItemBase
      draggableId={task.rowId}
      index={index}
      displayId={displayId}
      priority={task.priority}
      onMouseEnter={handleSetTaskId}
      onMouseLeave={handleClearTaskId}
      onFocus={handleSetTaskId}
      onBlur={handleClearTaskId}
      onKeyDown={(evt) => {
        if (evt.key === "Enter") {
          navigateToTask();
        }
      }}
      onClick={navigateToTask}
      content={
        <RichTextEditor
          defaultContent={task?.content}
          className="min-h-0! w-fit border-0 p-0 text-xs dark:bg-background [&_.ProseMirror]:line-clamp-2 [&_.ProseMirror]:overflow-hidden"
          skeletonClassName="h-4 w-40"
          editable={false}
        />
      }
      assignees={
        task.assignees.nodes.length > 0 ? (
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
        ) : undefined
      }
      labels={
        task.taskLabels.nodes.length > 0 ? (
          <Tooltip
            positioning={{ placement: "top-start", shift: -6 }}
            tooltip="Update Labels"
            shortcut="L"
            trigger={
              <div className="flex max-h-6 flex-wrap gap-1 overflow-hidden">
                {task.taskLabels.nodes.slice(0, 3).map(({ label }) => (
                  <Label key={label?.rowId} label={label as LabelFragment} />
                ))}
                {task.taskLabels.nodes.length > 3 && (
                  <Badge variant="outline" className="border-border text-xs">
                    +{task.taskLabels.nodes.length - 3}
                  </Badge>
                )}
              </div>
            }
          />
        ) : undefined
      }
      footer={
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
      }
    />
  );
};

export default BoardItem;
