import { Droppable } from "@hello-pangea/dnd";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import {
  useLoaderData,
  useNavigate,
  useRouteContext,
} from "@tanstack/react-router";
import { useCallback, useRef } from "react";

import BoardItem from "@/components/projects/BoardItem";
import ColumnMenu from "@/components/projects/ColumnMenu";
import ColumnHeader from "@/components/shared/ColumnHeader";
import useDragStore from "@/lib/hooks/store/useDragStore";
import useTaskStore from "@/lib/hooks/store/useTaskStore";
import useTheme from "@/lib/hooks/useTheme";
import projectOptions from "@/lib/options/project.options";
import userPreferencesOptions from "@/lib/options/userPreferences.options";
import { cn } from "@/lib/utils";

import type { MouseEvent } from "react";
import type { TaskFragment } from "@/generated/graphql";

interface Props {
  tasks: TaskFragment[];
}

const Board = ({ tasks }: Props) => {
  const { theme } = useTheme();

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
  const { draggableId } = useDragStore();

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const autoScrollIntervalRef = useRef<NodeJS.Timeout | null>(null);

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

  const startAutoScroll = useCallback((direction: "left" | "right") => {
    if (autoScrollIntervalRef.current) return;

    autoScrollIntervalRef.current = setInterval(() => {
      if (scrollContainerRef.current) {
        const scrollAmount = direction === "left" ? -10 : 10;
        scrollContainerRef.current.scrollLeft += scrollAmount;
      }
    }, 16); // ~60fps
  }, []);

  const stopAutoScroll = useCallback(() => {
    if (autoScrollIntervalRef.current) {
      clearInterval(autoScrollIntervalRef.current);
      autoScrollIntervalRef.current = null;
    }
  }, []);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      // Only enable auto-scroll when a task is being dragged
      if (!draggableId || !scrollContainerRef.current) {
        stopAutoScroll();
        return;
      }

      const container = scrollContainerRef.current;
      const rect = container.getBoundingClientRect();
      const scrollZone = 100; // pixels from edge to trigger scroll

      const mouseX = e.clientX - rect.left;

      if (mouseX < scrollZone && container.scrollLeft > 0) {
        startAutoScroll("left");
      } else if (
        mouseX > rect.width - scrollZone &&
        container.scrollLeft < container.scrollWidth - container.clientWidth
      ) {
        startAutoScroll("right");
      } else {
        stopAutoScroll();
      }
    },
    [draggableId, startAutoScroll, stopAutoScroll],
  );

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
      className="no-scrollbar h-full select-none overflow-x-auto bg-primary-100/30 p-4 dark:bg-primary-950/20"
      style={{
        backgroundColor: userPreferences?.color
          ? theme === "dark"
            ? `${userPreferences?.color}12`
            : `${userPreferences?.color}0D`
          : undefined,
      }}
      onMouseMove={handleMouseMove}
    >
      <div className="h-full min-w-fit p-4">
        <div className="flex h-full gap-3">
          {project?.columns?.nodes?.map((column) => (
            <div
              key={column?.rowId}
              className="relative flex h-full w-[340px] flex-col gap-2 bg-inherit"
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
                  shortCut: "C",
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
              >
                <ColumnMenu columnId={column.rowId} />
              </ColumnHeader>

              <div className="no-scrollbar flex h-full overflow-y-auto">
                <Droppable droppableId={column.rowId}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={cn(
                        "flex flex-1 flex-col rounded-xl bg-background/60 p-2 dark:bg-background/20",
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
