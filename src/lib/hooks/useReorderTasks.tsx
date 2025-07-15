import { useSuspenseQuery } from "@tanstack/react-query";
import { useParams, useSearch } from "@tanstack/react-router";
import { useCallback } from "react";

import { useUpdateTaskMutation } from "@/generated/graphql";
import useDragStore from "@/lib/hooks/store/useDragStore";
import tasksOptions from "@/lib/options/tasks.options";
import getQueryClient from "@/lib/util/getQueryClient";

import type { DropResult } from "@hello-pangea/dnd";

interface HookOptions {
  callback?: () => void;
}

const useReorderTasks = ({ callback }: HookOptions = {}) => {
  const queryClient = getQueryClient();

  const { projectId } = useParams({
    from: "/_auth/workspaces/$workspaceId/projects/$projectId/",
  });

  const { search, assignees, labels, priorities } = useSearch({
    from: "/_auth/workspaces/$workspaceId/projects/$projectId/",
  });

  const { setDraggableId } = useDragStore();

  const options = tasksOptions({
    projectId,
    search,
    assignees: assignees.length
      ? { some: { user: { rowId: { in: assignees } } } }
      : undefined,
    labels: labels.length
      ? { some: { label: { rowId: { in: labels } } } }
      : undefined,
    priorities: priorities.length ? priorities : undefined,
  });

  const { data: tasks } = useSuspenseQuery({
    ...options,
    select: (data) => data?.tasks?.nodes,
  });

  const { mutate: updateTask } = useUpdateTaskMutation({
    meta: {
      invalidates: [["all"]],
    },
    onMutate: async (variables) => {
      await queryClient.cancelQueries(options);

      queryClient.setQueryData(
        options.queryKey,
        // @ts-ignore TODO: type properly
        (old) => ({
          tasks: {
            ...old?.tasks!,
            nodes: old?.tasks?.nodes?.map((task) => {
              if (task?.rowId === variables.rowId) {
                return {
                  ...task!,
                  columnId: variables.patch.columnId ?? task.columnId,
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
      callback?.();

      const { destination, source, draggableId } = result;

      // Exit early if dropped outside a droppable area or in the same position
      if (!destination) return;

      if (
        destination.droppableId === source.droppableId &&
        destination.index === source.index
      )
        return;

      setDraggableId(draggableId);

      if (tasks?.length) {
        const currentTask = tasks.find((task) => task.rowId === draggableId)!;

        const destinationColumnTasks = tasks.filter(
          (task) => task.columnId === destination.droppableId,
        );

        if (source.droppableId === destination.droppableId) {
          const reorderedColumnTasks = [...destinationColumnTasks];
          const [taskToMove] = reorderedColumnTasks.splice(
            currentTask.columnIndex,
            1,
          );
          reorderedColumnTasks.splice(destination.index, 0, taskToMove);

          reorderedColumnTasks.map((task, index) =>
            updateTask({
              rowId: task.rowId,
              patch: {
                columnIndex: index,
              },
            }),
          );
        } else {
          const sourceColumnTasksExcludingMovedTask = tasks.filter(
            (task) =>
              task.columnId === source.droppableId &&
              task.rowId !== draggableId,
          );

          sourceColumnTasksExcludingMovedTask.map((task, index) =>
            updateTask({
              rowId: task.rowId,
              patch: {
                columnIndex: index,
              },
            }),
          );

          const tasksWithMovedInDestination = [...destinationColumnTasks];
          tasksWithMovedInDestination.splice(destination.index, 0, currentTask);

          tasksWithMovedInDestination.map((task, index) =>
            updateTask({
              rowId: task.rowId,
              patch: {
                columnIndex: index,
                columnId:
                  task.rowId === currentTask.rowId
                    ? destination.droppableId
                    : task.columnId,
              },
            }),
          );
        }
      }
    },
    [updateTask, callback, setDraggableId, tasks],
  );

  return {
    tasks,
    onDragEnd,
  };
};

export default useReorderTasks;
