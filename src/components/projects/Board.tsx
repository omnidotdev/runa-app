import { Droppable } from "@hello-pangea/dnd";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { useLoaderData, useRouteContext } from "@tanstack/react-router";
import { useEffect, useMemo } from "react";

import { ColumnHeader } from "@/components/core";
import useDialogStore, { DialogType } from "@/lib/hooks/store/useDialogStore";
import useDragStore from "@/lib/hooks/store/useDragStore";
import useTaskStore from "@/lib/hooks/store/useTaskStore";
import useInertialScroll from "@/lib/hooks/useInertialScroll";
import useMaxTasksReached from "@/lib/hooks/useMaxTasksReached";
import projectOptions from "@/lib/options/project.options";
import projectTaskIndexOptions from "@/lib/options/projectTaskIndex.options";
import userPreferencesOptions from "@/lib/options/userPreferences.options";
import { cn } from "@/lib/utils";
import { useTheme } from "@/providers/ThemeProvider";
import BoardItem from "./BoardItem";
import ColumnMenu from "./ColumnMenu";

import type { TaskFragment } from "@/generated/graphql";

interface Props {
  tasks: TaskFragment[];
}

const EDGE_THRESHOLD = 150;
const MAX_SCROLL_SPEED = 25;

const Board = ({ tasks }: Props) => {
  const { theme } = useTheme();
  const { isDragging } = useDragStore();

  // Inertial scroll for drag-to-scroll with momentum
  const {
    scrollContainerRef,
    handleMouseDown,
    handleMouseUp,
    handleMouseMove,
    handleMouseLeave,
  } = useInertialScroll();

  // Auto-scroll during card drag
  useEffect(() => {
    if (!isDragging) return;

    let animationFrameId: number;
    let scrollSpeed = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const container = scrollContainerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const mouseX = e.clientX;

      if (mouseX < rect.left + EDGE_THRESHOLD) {
        const distanceFromEdge = mouseX - rect.left;
        const intensity = 1 - distanceFromEdge / EDGE_THRESHOLD;
        scrollSpeed = -MAX_SCROLL_SPEED * intensity ** 2;
      } else if (mouseX > rect.right - EDGE_THRESHOLD) {
        const distanceFromEdge = rect.right - mouseX;
        const intensity = 1 - distanceFromEdge / EDGE_THRESHOLD;
        scrollSpeed = MAX_SCROLL_SPEED * intensity ** 2;
      } else {
        scrollSpeed = 0;
      }
    };

    const scrollStep = () => {
      const container = scrollContainerRef.current;
      if (container && scrollSpeed !== 0) {
        container.scrollLeft += scrollSpeed;
      }
      animationFrameId = requestAnimationFrame(scrollStep);
    };

    document.addEventListener("mousemove", handleMouseMove);
    animationFrameId = requestAnimationFrame(scrollStep);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isDragging, scrollContainerRef]);

  const { projectId } = useLoaderData({
    from: "/_auth/workspaces/$workspaceSlug/projects/$projectSlug/",
  });

  const { session } = useRouteContext({
    from: "/_auth/workspaces/$workspaceSlug/projects/$projectSlug/",
  });

  const { setColumnId } = useTaskStore();

  const { setIsOpen: setIsCreateTaskOpen } = useDialogStore({
    type: DialogType.CreateTask,
  });

  const { data: userPreferences } = useSuspenseQuery({
    ...userPreferencesOptions({
      userId: session?.user?.rowId!,
      projectId,
    }),
    select: (data) => data?.userPreferenceByUserIdAndProjectId,
  });

  const { data: project } = useQuery({
    ...projectOptions({
      rowId: projectId,
    }),
    select: (data) => ({
      ...data?.project,
      columns: {
        ...data?.project?.columns,
        nodes: data?.project?.columns?.nodes?.filter(
          (column) => !userPreferences?.hiddenColumnIds.includes(column.rowId),
        ),
      },
    }),
  });

  const { data: taskIndexNodes } = useSuspenseQuery({
    ...projectTaskIndexOptions({ projectId }),
    select: (data) => data?.tasks?.nodes ?? [],
  });

  const taskIndexById = useMemo(
    () =>
      new Map((taskIndexNodes ?? []).map((task, index) => [task.rowId, index])),
    [taskIndexNodes],
  );

  const maxTasksReached = useMaxTasksReached();

  const taskIndex = (taskId: string) => taskIndexById.get(taskId) ?? 0;

  return (
    <div
      ref={scrollContainerRef}
      className="custom-scrollbar h-full cursor-grab select-none overflow-x-auto bg-primary-100/30 dark:bg-primary-950/15"
      style={{
        backgroundColor: userPreferences?.color
          ? theme === "dark"
            ? `${userPreferences?.color}12`
            : `${userPreferences?.color}0D`
          : undefined,
      }}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div className="h-full min-w-fit p-4">
        <div className="flex h-full gap-3">
          {project?.columns?.nodes?.map((column) => (
            <div
              key={column?.rowId}
              className="relative flex h-full w-85 flex-col gap-2"
            >
              <ColumnHeader
                title={column.title}
                count={column.tasks?.totalCount ?? 0}
                tooltip={{
                  title: "Add Task",
                  shortcut: "C",
                }}
                emoji={column.emoji}
                onCreate={() => {
                  setColumnId(column.rowId);
                  setIsCreateTaskOpen(true);
                }}
                // TODO: tooltip for disabled state
                disabled={maxTasksReached}
              >
                <ColumnMenu columnId={column.rowId} />
              </ColumnHeader>

              <div className="flex h-full overflow-hidden">
                <Droppable droppableId={column.rowId}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={cn(
                        "flex flex-1 flex-col rounded-xl",
                        snapshot.isDraggingOver &&
                          "bg-primary-100/40 dark:bg-primary-950/40",
                      )}
                      style={{
                        backgroundColor:
                          userPreferences?.color && snapshot.isDraggingOver
                            ? `${userPreferences?.color}0D`
                            : undefined,
                      }}
                    >
                      <div className="no-scrollbar flex h-full flex-col overflow-y-auto">
                        {tasks
                          .filter((task) => task.columnId === column.rowId)
                          .map((task, index) => {
                            const displayId = `${project?.prefix ?? "PROJ"}-${taskIndex(task.rowId) + 1}`;

                            return (
                              <BoardItem
                                key={task.rowId}
                                task={task}
                                index={index}
                                displayId={displayId}
                              />
                            );
                          })}
                        {provided.placeholder}
                      </div>
                    </div>
                  )}
                </Droppable>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Board;
