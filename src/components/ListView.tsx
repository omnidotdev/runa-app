import { DragDropContext, Droppable } from "@hello-pangea/dnd";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useParams } from "@tanstack/react-router";
import { useCallback } from "react";

import TasksList from "@/components/TasksList";
import {
  CollapsibleContent,
  CollapsibleRoot,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import tasksCollection from "@/lib/collections/tasks.collection";
import projectOptions from "@/lib/options/project.options";
import { useTheme } from "@/providers/ThemeProvider";

import type { DropResult } from "@hello-pangea/dnd";

const ListView = () => {
  const { theme } = useTheme();

  const { projectId } = useParams({
    from: "/_auth/workspaces/$workspaceId/projects/$projectId/",
  });

  const { data: project } = useSuspenseQuery({
    ...projectOptions(projectId),
    select: (data) => data?.project,
  });

  const projectTasksCollection = tasksCollection(projectId);

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
        className="custom-scrollbar h-full overflow-y-auto p-4"
        style={{
          backgroundColor: project?.color
            ? theme === "dark"
              ? `${project?.color}05`
              : `${project?.color}0D`
            : undefined,
        }}
      >
        {project?.columns?.nodes?.map((column) => {
          return (
            <CollapsibleRoot
              key={column?.rowId}
              className="mb-4 rounded-lg bg-white shadow-sm last:mb-0 dark:bg-base-800"
              defaultOpen
            >
              <CollapsibleTrigger className="flex w-full items-center gap-2 rounded-t-lg px-4 py-3 text-left">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-base-900 text-sm dark:text-base-100">
                    {column?.title}
                  </span>
                  <span className="text-base-500 text-sm dark:text-base-400">
                    {
                      project?.columns?.nodes?.find(
                        (c) => c?.rowId === column?.rowId,
                      )?.tasks?.totalCount
                    }
                  </span>
                </div>
              </CollapsibleTrigger>

              <CollapsibleContent>
                <Droppable droppableId={column?.rowId!}>
                  {(provided, snapshot) => (
                    <TasksList
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      prefix={project?.prefix ?? "PROJ"}
                      columnId={column?.rowId!}
                      className="bg-primary-50/5 dark:bg-base-800/5"
                      style={{
                        backgroundColor:
                          project?.color && snapshot.isDraggingOver
                            ? `${project?.color}0D`
                            : undefined,
                      }}
                    >
                      {provided.placeholder}
                    </TasksList>
                  )}
                </Droppable>
              </CollapsibleContent>
            </CollapsibleRoot>
          );
        })}
      </div>
    </DragDropContext>
  );
};

export default ListView;
