import { DragDropContext, Droppable } from "@hello-pangea/dnd";
import { useLiveQuery } from "@tanstack/react-db";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useParams } from "@tanstack/react-router";
import { ChevronDown } from "lucide-react";
import { useCallback, useState } from "react";
import { useIsClient } from "usehooks-ts";

import TasksList from "@/components/TasksList";
import tasksCollection from "@/lib/collections/tasks.collection";
import projectOptions from "@/lib/options/project.options";

import type { DropResult } from "@hello-pangea/dnd";

const ListView = () => {
  const { projectId } = useParams({
    from: "/_auth/workspaces/$workspaceId/projects/$projectId/",
  });

  const isClient = useIsClient();

  const [expandedSections, setExpandedSections] = useState<{
    [key: string]: boolean;
  }>({});

  const { data: project } = useSuspenseQuery({
    ...projectOptions(projectId),
    select: (data) => data?.project,
  });

  const projectTasksCollection = tasksCollection(projectId);

  const { data: tasks } = useLiveQuery((q) =>
    q.from({ projectTasksCollection }),
  );

  const onToggleSection = useCallback((columnId: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [columnId]: !prev[columnId],
    }));
  }, []);

  const onDragEnd = useCallback(
    (result: DropResult) => {
      const { destination, source, draggableId } = result;

      // Exit early if dropped outside a droppable area or in the same position
      if (!destination) return;

      if (
        destination.droppableId === source.droppableId &&
        destination.index === source.index
      )
        return;

      // Update task with new column and index
      projectTasksCollection.update(draggableId, (draft) => {
        draft.columnId = destination.droppableId;
        draft.columnIndex = destination.index;
      });
    },
    [projectTasksCollection],
  );

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div
        className="custom-scrollbar h-full overflow-y-auto p-6"
        style={{
          backgroundColor: project?.color ? `${project?.color}10` : undefined,
        }}
      >
        {project?.columns?.nodes?.map((column) => {
          const columnTasks = tasks?.filter(
            (task) => task.columnId === column?.rowId,
          );

          if (!columnTasks?.length) return null;

          const isExpanded = expandedSections[column?.rowId!] ?? true;

          return (
            <div
              key={column?.rowId}
              className="mb-6 rounded-lg bg-white shadow-sm last:mb-0 dark:bg-base-800"
            >
              <button
                type="button"
                onClick={() => onToggleSection(column?.rowId!)}
                className="flex w-full items-center gap-2 rounded-t-lg px-4 py-3 text-left"
              >
                <ChevronDown
                  className={`h-4 w-4 text-base-500 transition-transform dark:text-base-400 ${
                    isExpanded ? "" : "-rotate-90"
                  }`}
                />
                <span className="font-medium text-base-900 text-sm dark:text-base-100">
                  {column?.title}
                </span>
                {isClient && (
                  <span className="text-base-500 text-sm dark:text-base-400">
                    {columnTasks.length}
                  </span>
                )}
              </button>

              {isExpanded && (
                <Droppable droppableId={column?.rowId!}>
                  {(provided, snapshot) => (
                    <TasksList
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      prefix={project?.prefix ?? "PROJ"}
                      columnId={column?.rowId!}
                      className={
                        snapshot.isDraggingOver
                          ? project?.color
                            ? `bg-opacity-10`
                            : "bg-primary-50/50 dark:bg-base-800/50"
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
                    </TasksList>
                  )}
                </Droppable>
              )}
            </div>
          );
        })}
      </div>
    </DragDropContext>
  );
};

export default ListView;
