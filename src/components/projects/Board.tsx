import { Droppable } from "@hello-pangea/dnd";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import {
  useLoaderData,
  useNavigate,
  useRouteContext,
} from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";

import { ColumnHeader } from "@/components/core";
import useDragStore from "@/lib/hooks/store/useDragStore";
import useTaskStore from "@/lib/hooks/store/useTaskStore";
import useMaxTasksReached from "@/lib/hooks/useMaxTasksReached";
import projectOptions from "@/lib/options/project.options";
import userPreferencesOptions from "@/lib/options/userPreferences.options";
import { cn } from "@/lib/utils";
import { useTheme } from "@/providers/ThemeProvider";
import BoardItem from "./BoardItem";
import ColumnMenu from "./ColumnMenu";

import type { MouseEvent as ReactMouseEvent } from "react";
import type { TaskFragment } from "@/generated/graphql";

interface Props {
  tasks: TaskFragment[];
}

const EDGE_THRESHOLD = 150;
const MAX_SCROLL_SPEED = 25;

const Board = ({ tasks }: Props) => {
  const { theme } = useTheme();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { isDragging } = useDragStore();

  // Drag-to-scroll state
  const [isMouseDragging, setIsMouseDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftStart, setScrollLeftStart] = useState(0);

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
  }, [isDragging]);

  // Drag-to-scroll handlers (replaces react-indiana-drag-scroll)
  const handleMouseDown = useCallback((e: ReactMouseEvent<HTMLDivElement>) => {
    // Only start drag-scroll if clicking on the container background, not on draggable items
    const target = e.target as HTMLElement;
    if (target.closest("[data-rfd-draggable-id]")) return;

    const container = scrollContainerRef.current;
    if (!container) return;

    setIsMouseDragging(true);
    setStartX(e.pageX - container.offsetLeft);
    setScrollLeftStart(container.scrollLeft);
    container.style.cursor = "grabbing";
  }, []);

  const handleMouseUp = useCallback(() => {
    setIsMouseDragging(false);
    const container = scrollContainerRef.current;
    if (container) {
      container.style.cursor = "grab";
    }
  }, []);

  const handleMouseMove = useCallback(
    (e: ReactMouseEvent<HTMLDivElement>) => {
      if (!isMouseDragging) return;
      e.preventDefault();

      const container = scrollContainerRef.current;
      if (!container) return;

      const x = e.pageX - container.offsetLeft;
      const walk = (x - startX) * 1.5;
      container.scrollLeft = scrollLeftStart - walk;
    },
    [isMouseDragging, startX, scrollLeftStart],
  );

  const handleMouseLeave = useCallback(() => {
    if (isMouseDragging) {
      setIsMouseDragging(false);
      const container = scrollContainerRef.current;
      if (container) {
        container.style.cursor = "grab";
      }
    }
  }, [isMouseDragging]);

  const { projectId } = useLoaderData({
    from: "/_auth/workspaces/$workspaceSlug/projects/$projectSlug/",
  });

  const { session } = useRouteContext({
    from: "/_auth/workspaces/$workspaceSlug/projects/$projectSlug/",
  });

  const navigate = useNavigate({
    from: "/workspaces/$workspaceSlug/projects/$projectSlug",
  });

  const { setColumnId } = useTaskStore();

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

  const maxTasksReached = useMaxTasksReached();

  const taskIndex = (taskId: string) =>
    project?.columns?.nodes
      ?.flatMap((column) => column?.tasks?.nodes?.map((task) => task))
      .sort(
        (a, b) =>
          new Date(a.createdAt!).getTime() - new Date(b.createdAt!).getTime(),
      )
      .map((task) => task?.rowId)
      .indexOf(taskId) ?? 0;

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
                count={
                  project?.columns?.nodes?.find(
                    (c) => c?.rowId === column?.rowId,
                  )?.tasks?.totalCount ?? 0
                }
                tooltip={{
                  title: "Add Task",
                  shortcut: "C",
                }}
                emoji={column.emoji}
                onCreate={() => {
                  setColumnId(column.rowId);
                  navigate({
                    search: (prev) => ({
                      ...prev,
                      createTask: true,
                    }),
                  });
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
                        "flex flex-1 flex-col rounded-xl p-2",
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
                      <div className="no-scrollbar flex h-full flex-col overflow-y-auto p-1">
                        {tasks
                          .filter((task) => task.columnId === column.rowId)
                          .map((task, index) => {
                            const displayId = `${project?.prefix ?? "PROJ"}-${taskIndex(
                              task.rowId,
                            )}`;

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
