import { DragDropContext, Droppable } from "@hello-pangea/dnd";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useParams } from "@tanstack/react-router";
import { ChevronDownIcon } from "lucide-react";
import { useCallback } from "react";

import TasksList from "@/components/TasksList";
import {
  CollapsibleContent,
  CollapsibleRoot,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useUpdateTaskMutation } from "@/generated/graphql";
import projectOptions from "@/lib/options/project.options";
import taskOptions from "@/lib/options/task.options";
import tasksOptions from "@/lib/options/tasks.options";
import getQueryClient from "@/lib/util/getQueryClient";
import { useTheme } from "@/providers/ThemeProvider";

import type { DropResult } from "@hello-pangea/dnd";

interface Props {
  shouldForceClose?: boolean;
}

const ListView = ({ shouldForceClose }: Props) => {
  const { theme } = useTheme();

  const { projectId } = useParams({
    from: "/_auth/workspaces/$workspaceId/projects/$projectId/",
  });

  const queryClient = getQueryClient();

  const { data: project } = useSuspenseQuery({
    ...projectOptions(projectId),
    select: (data) => data?.project,
  });

  const { mutate: updateTask } = useUpdateTaskMutation({
    onMutate: async (variables) => {
      const { task } = await queryClient.ensureQueryData(
        taskOptions(variables.rowId),
      );

      queryClient.setQueryData(
        tasksOptions(task?.columnId!).queryKey,
        (old) => ({
          tasks: {
            ...old?.tasks!,
            nodes: old?.tasks?.nodes?.filter(
              (task) => task?.rowId !== variables.rowId,
            )!,
          },
        }),
      );

      // TODO: figure out why this is causing issue
      // queryClient.setQueryData(
      //   tasksOptions(variables.patch.columnId!).queryKey,
      //   (old) => ({
      //     tasks: {
      //       ...old?.tasks!,
      //       nodes: [
      //         ...old?.tasks?.nodes!,
      //         {
      //           ...task!,
      //           columnId: variables.patch.columnId!,
      //           columnIndex: variables.patch.columnIndex!,
      //         },
      //       ],
      //     },
      //   }),
      // );
    },
    onSettled: () => queryClient.invalidateQueries(),
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

      updateTask({
        rowId: draggableId,
        patch: {
          columnId: destination.droppableId,
          columnIndex: destination.index,
        },
      });
    },
    [updateTask],
  );

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div
        className="custom-scrollbar h-full overflow-y-auto p-4"
        style={{
          backgroundColor: project?.color
            ? theme === "dark"
              ? `${project?.color}1A`
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
              open={shouldForceClose ? false : undefined}
            >
              <CollapsibleTrigger className="flex w-full items-center justify-between gap-2 rounded-t-lg px-4 py-3 text-left">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-base-800 text-sm dark:text-base-100">
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
                <ChevronDownIcon className="size-4 transition-transform" />
              </CollapsibleTrigger>

              <CollapsibleContent>
                <Droppable droppableId={column?.rowId!}>
                  {(provided, snapshot) => (
                    <TasksList
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      prefix={project?.prefix ?? "PROJ"}
                      columnId={column?.rowId!}
                      className="border-t"
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
