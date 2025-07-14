import { DragDropContext, Droppable } from "@hello-pangea/dnd";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useParams, useSearch } from "@tanstack/react-router";
import { PlusIcon } from "lucide-react";
import { useCallback, useRef } from "react";

import Tasks from "@/components/Tasks";
import { Button } from "@/components/ui/button";
import { SidebarMenuShotcut } from "@/components/ui/sidebar";
import { Tooltip } from "@/components/ui/tooltip";
import { useUpdateTaskMutation } from "@/generated/graphql";
import useDialogStore, { DialogType } from "@/lib/hooks/store/useDialogStore";
import useDragStore from "@/lib/hooks/store/useDragStore";
import useTaskStore from "@/lib/hooks/store/useTaskStore";
import projectOptions from "@/lib/options/project.options";
import projectsOptions from "@/lib/options/projects.options";
import tasksOptions from "@/lib/options/tasks.options";
import { getColumnIcon } from "@/lib/util/getColumnIcon";
import getQueryClient from "@/lib/util/getQueryClient";
import { useTheme } from "@/providers/ThemeProvider";

import type { DropResult } from "@hello-pangea/dnd";
import type { MouseEvent } from "react";

const Board = () => {
  const { theme } = useTheme();

  const { workspaceId, projectId } = useParams({
    from: "/_auth/workspaces/$workspaceId/projects/$projectId/",
  });

  const { search } = useSearch({
    from: "/_auth/workspaces/$workspaceId/projects/$projectId/",
  });

  const { setIsOpen: setIsCreateTaskDialogOpen } = useDialogStore({
    type: DialogType.CreateTask,
  });

  const { setColumnId } = useTaskStore();

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const autoScrollIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const { setDraggableId } = useDragStore();

  const queryClient = getQueryClient();

  const { data: project } = useSuspenseQuery({
    ...projectOptions({ rowId: projectId }),
    select: (data) => data?.project,
  });

  const { mutate: updateTask } = useUpdateTaskMutation({
    meta: {
      invalidates: [
        tasksOptions({ projectId, search }).queryKey,
        projectsOptions({ workspaceId, search }).queryKey,
      ],
    },
    onMutate: async (variables) => {
      await queryClient.cancelQueries(tasksOptions({ projectId, search }));

      queryClient.setQueryData(
        tasksOptions({ projectId, search }).queryKey,
        // @ts-ignore TODO: type properly
        (old) => ({
          tasks: {
            ...old?.tasks!,
            nodes: old?.tasks?.nodes?.map((task) => {
              if (task?.rowId === variables.rowId) {
                return {
                  ...task!,
                  columnId: variables.patch.columnId,
                  columnIndex: variables.patch.columnIndex,
                };
              }

              return task;
            }),
          },
        }),
      );

      setDraggableId(null);
    },
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
      if (!scrollContainerRef.current) return;

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
    [startAutoScroll, stopAutoScroll],
  );

  const onDragStart = useCallback(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.addEventListener(
        "mousemove",
        // biome-ignore lint/suspicious/noExplicitAny: needed for conversion
        handleMouseMove as any,
      );
    }
  }, [handleMouseMove]);

  const onDragEnd = useCallback(
    (result: DropResult) => {
      stopAutoScroll();
      if (scrollContainerRef.current) {
        scrollContainerRef.current.removeEventListener(
          "mousemove",
          // biome-ignore lint/suspicious/noExplicitAny: needed for conversion
          handleMouseMove as any,
        );
      }

      const { destination, source, draggableId } = result;

      // Exit early if dropped outside a droppable area or in the same position
      if (!destination) return;

      if (
        destination.droppableId === source.droppableId &&
        destination.index === source.index
      )
        return;

      setDraggableId(draggableId);

      updateTask({
        rowId: draggableId,
        patch: {
          columnId: destination.droppableId,
          columnIndex: destination.index,
        },
      });
    },
    [updateTask, stopAutoScroll, handleMouseMove, setDraggableId],
  );

  return (
    <div
      ref={scrollContainerRef}
      className="no-scrollbar h-full select-none overflow-x-auto bg-primary-100/30 dark:bg-primary-950/20"
      style={{
        backgroundColor: project?.color
          ? theme === "dark"
            ? `${project?.color}12`
            : `${project?.color}0D`
          : undefined,
      }}
    >
      <div className="h-full min-w-fit p-4">
        <DragDropContext onDragStart={onDragStart} onDragEnd={onDragEnd}>
          <Droppable droppableId="board" direction="horizontal" type="column">
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="flex h-full gap-3"
              >
                {project?.columns?.nodes?.map((column) => {
                  const ColumnIcon = getColumnIcon(column.title);

                  return (
                    <div
                      key={column?.rowId}
                      className="relative flex h-full w-[340px] flex-col gap-2 bg-inherit"
                    >
                      <div className="z-10 mb-1 flex items-center justify-between rounded-lg border bg-background px-3 py-2">
                        <div className="flex items-center gap-2">
                          <div className="flex-shrink-0">{ColumnIcon}</div>

                          <h3 className="text-base-800 text-sm dark:text-base-100">
                            {column?.title}
                          </h3>

                          <span className="flex size-7 items-center justify-center rounded-full bg-muted text-foreground text-xs tabular-nums">
                            {
                              project?.columns?.nodes?.find(
                                (c) => c?.rowId === column?.rowId,
                              )?.tasks?.totalCount
                            }
                          </span>
                        </div>

                        <Tooltip
                          positioning={{ placement: "top", gutter: 11 }}
                          tooltip={{
                            className: "bg-background text-foreground border",
                            children: (
                              <div className="inline-flex">
                                Add Task
                                <div className="ml-2 flex items-center gap-0.5">
                                  <SidebarMenuShotcut>C</SidebarMenuShotcut>
                                </div>
                              </div>
                            ),
                          }}
                        >
                          <Button
                            variant="ghost"
                            size="xs"
                            className="size-5"
                            onClick={() => {
                              setColumnId(column.rowId);
                              setIsCreateTaskDialogOpen(true);
                            }}
                          >
                            <PlusIcon className="size-4" />
                          </Button>
                        </Tooltip>
                      </div>

                      <div className="no-scrollbar flex h-full overflow-y-auto">
                        <Droppable droppableId={column.rowId}>
                          {(provided, snapshot) => (
                            <Tasks
                              ref={provided.innerRef}
                              {...provided.droppableProps}
                              prefix={project.prefix ?? "PROJ"}
                              columnId={column.rowId}
                              style={{
                                backgroundColor:
                                  project?.color && snapshot.isDraggingOver
                                    ? `${project?.color}0D`
                                    : undefined,
                              }}
                            >
                              {provided.placeholder}
                            </Tasks>
                          )}
                        </Droppable>
                      </div>
                    </div>
                  );
                })}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    </div>
  );
};

export default Board;
