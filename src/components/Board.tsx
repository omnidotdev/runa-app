import { DragDropContext, Droppable } from "@hello-pangea/dnd";
import { useLiveQuery } from "@tanstack/react-db";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useParams } from "@tanstack/react-router";
import { PlusIcon } from "lucide-react";
import { useCallback, useRef } from "react";
import { useIsClient } from "usehooks-ts";

import Tasks from "@/components/Tasks";
import { Button } from "@/components/ui/button";
import tasksCollection from "@/lib/collections/tasks.collection";
import projectOptions from "@/lib/options/project.options";

import type { DropResult } from "@hello-pangea/dnd";

const Board = () => {
  const { projectId } = useParams({
    from: "/_auth/workspaces/$workspaceId/projects/$projectId/",
  });

  const isClient = useIsClient();

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const autoScrollIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const { data: project } = useSuspenseQuery({
    ...projectOptions(projectId),
    select: (data) => data?.project,
  });

  const projectTasksCollection = tasksCollection(projectId);

  const { data: tasks } = useLiveQuery((q) =>
    q.from({ projectTasksCollection }),
  );

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
    (e: React.MouseEvent) => {
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

      // TODO: bulk update to properly handle index changes? Not sure tbh...
      projectTasksCollection.update(draggableId, (draft) => {
        draft.columnId = destination.droppableId;
        draft.columnIndex = destination.index;
      });
    },
    [projectTasksCollection, stopAutoScroll, handleMouseMove],
  );

  return (
    <div
      ref={scrollContainerRef}
      className="custom-scrollbar h-full select-none overflow-x-auto"
    >
      <div className="h-full min-w-fit px-4 py-4">
        <DragDropContext onDragStart={onDragStart} onDragEnd={onDragEnd}>
          <Droppable droppableId="board" direction="horizontal" type="column">
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="flex h-full gap-3"
              >
                {project?.columns?.nodes?.map((column) => (
                  <div
                    key={column?.rowId}
                    className="no-scrollbar relative flex w-80 flex-col overflow-y-auto rounded-lg bg-base-50/80 shadow-sm dark:bg-base-800/30 dark:shadow-base-50/10"
                    style={{ minHeight: "4px" }}
                  >
                    <div className="sticky top-0 flex items-center justify-between border-base-200 border-b bg-base-50 p-3 dark:border-base-700 dark:bg-base-800">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-base-800 dark:text-base-100">
                          {column?.title}
                        </h3>
                        {isClient && (
                          <span className="rounded-full bg-base-200 px-2 py-1 text-base-600 text-xs dark:bg-base-700 dark:text-base-300">
                            {
                              tasks?.filter((t) => t.columnId === column?.rowId)
                                .length
                            }
                          </span>
                        )}
                      </div>
                      <Button variant="ghost" size="icon">
                        <PlusIcon className="h-4 w-4" />
                      </Button>
                    </div>
                    <Droppable droppableId={column?.rowId!}>
                      {(provided, snapshot) => (
                        <Tasks
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          prefix={project?.prefix ?? "PROJ"}
                          columnId={column?.rowId!}
                          className={
                            // TODO: dynamic on project color
                            snapshot.isDraggingOver
                              ? "bg-primary-50/50 dark:bg-base-800/50"
                              : ""
                          }
                          style={{
                            backgroundColor: project?.color
                              ? snapshot.isDraggingOver
                                ? `${project?.color}33`
                                : `${project?.color}0D`
                              : undefined,
                          }}
                        >
                          {provided.placeholder}
                        </Tasks>
                      )}
                    </Droppable>
                  </div>
                ))}
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
