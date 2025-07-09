import { DragDropContext, Droppable } from "@hello-pangea/dnd";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useParams, useSearch } from "@tanstack/react-router";
import { ChevronDownIcon, PlusIcon } from "lucide-react";
import { useCallback } from "react";

import { columnIcons } from "@/components/Tasks";
import TasksList from "@/components/TasksList";
import { Button } from "@/components/ui/button";
import {
  CollapsibleContent,
  CollapsibleRoot,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Tooltip } from "@/components/ui/tooltip";
import { useUpdateTaskMutation } from "@/generated/graphql";
import useDialogStore, { DialogType } from "@/lib/hooks/store/useDialogStore";
import useDragStore from "@/lib/hooks/store/useDragStore";
import useTaskStore from "@/lib/hooks/store/useTaskStore";
import projectOptions from "@/lib/options/project.options";
import projectsOptions from "@/lib/options/projects.options";
import tasksOptions from "@/lib/options/tasks.options";
import getQueryClient from "@/lib/util/getQueryClient";
import { useTheme } from "@/providers/ThemeProvider";
import { SidebarMenuShotcut } from "./ui/sidebar";

import type { DropResult } from "@hello-pangea/dnd";

interface Props {
  shouldForceClose?: boolean;
}

const ListView = ({ shouldForceClose }: Props) => {
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

  const queryClient = getQueryClient();

  const { data: project } = useSuspenseQuery({
    ...projectOptions({ rowId: projectId }),
    select: (data) => data?.project,
  });

  const { setDraggableId } = useDragStore();

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

      setDraggableId(draggableId);

      updateTask({
        rowId: draggableId,
        patch: {
          columnId: destination.droppableId,
          columnIndex: destination.index,
        },
      });
    },
    [updateTask, setDraggableId],
  );

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div
        className="custom-scrollbar h-full overflow-y-auto bg-primary-100/30 p-4 dark:bg-primary-950/20"
        style={{
          backgroundColor: project?.color
            ? theme === "dark"
              ? `${project?.color}12`
              : `${project?.color}0D`
            : undefined,
        }}
      >
        {project?.columns?.nodes?.map((column) => {
          return (
            <CollapsibleRoot
              key={column?.rowId}
              className="mb-4 rounded-lg border bg-background last:mb-0"
              defaultOpen
              open={shouldForceClose ? false : undefined}
            >
              <CollapsibleTrigger asChild>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex-shrink-0">
                      {
                        columnIcons[
                          column?.title
                            .toLowerCase()
                            .replace(/ /g, "-") as keyof typeof columnIcons
                        ]
                      }
                    </div>

                    <h3 className="text-base-800 text-sm dark:text-base-100">
                      {column?.title}
                    </h3>

                    <span className="px-2 py-0.5 text-foreground text-xs">
                      {
                        project?.columns?.nodes?.find(
                          (c) => c?.rowId === column?.rowId,
                        )?.tasks?.totalCount
                      }
                    </span>
                  </div>

                  <div className="ml-auto flex gap-2">
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

                  <ChevronDownIcon className="ml-2 size-4 text-base-400 transition-transform" />
                </div>
              </CollapsibleTrigger>

              <CollapsibleContent className="border-t">
                <Droppable droppableId={column.rowId}>
                  {(provided, snapshot) => (
                    <TasksList
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      prefix={project?.prefix ?? "PROJ"}
                      columnId={column.rowId}
                      // className="border-t"
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
