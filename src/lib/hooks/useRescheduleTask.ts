import { useQueryClient } from "@tanstack/react-query";

import {
  useMyCalendarTasksQuery,
  useTaskQuery,
  useTasksQuery,
  useUpdateTaskMutation,
} from "@/generated/graphql";
import getQueryKeyPrefix from "@/lib/util/getQueryKeyPrefix";

import type { QueryKey } from "@tanstack/react-query";

/** The list caches the calendar renders from, patched optimistically on a drag. */
const LIST_PREFIXES: Array<QueryKey> = [["Tasks"], ["MyCalendarTasks"]];

/** A cached list query's shape: everything else passes through untouched. */
type TaskListData = {
  tasks?: { nodes?: Array<{ rowId: string; dueDate?: Date | null }> } | null;
};

interface RescheduleContext {
  snapshots: Array<[QueryKey, unknown]>;
}

/**
 * Drag-to-reschedule with an optimistic cache update, so a dropped task chip
 * lands on its new day immediately instead of snapping back to the old day
 * until the server round-trip and refetch complete (seconds later).
 *
 * Patches every cached `Tasks` (project calendar) and `MyCalendarTasks` (My
 * Calendar) list in place, then lets the global mutation-cache `onSettled`
 * invalidation reconcile against the server; rolls the caches back on error.
 */
const useRescheduleTask = () => {
  const queryClient = useQueryClient();

  const { mutate } = useUpdateTaskMutation<Error, RescheduleContext>({
    onMutate: async ({ rowId, patch }) => {
      await Promise.all(
        LIST_PREFIXES.map((queryKey) =>
          queryClient.cancelQueries({ queryKey }),
        ),
      );

      const snapshots = LIST_PREFIXES.flatMap((queryKey) =>
        queryClient.getQueriesData({ queryKey }),
      );

      for (const queryKey of LIST_PREFIXES) {
        queryClient.setQueriesData<TaskListData>({ queryKey }, (old) => {
          if (!old?.tasks?.nodes) return old;
          return {
            ...old,
            tasks: {
              ...old.tasks,
              nodes: old.tasks.nodes.map((node) =>
                node.rowId === rowId
                  ? { ...node, dueDate: patch.dueDate ?? null }
                  : node,
              ),
            },
          };
        });
      }

      return { snapshots };
    },
    onError: (_error, _variables, context) => {
      context?.snapshots.forEach(([queryKey, data]) =>
        queryClient.setQueryData(queryKey, data),
      );
    },
    meta: {
      invalidates: [
        getQueryKeyPrefix(useMyCalendarTasksQuery),
        getQueryKeyPrefix(useTasksQuery),
        getQueryKeyPrefix(useTaskQuery),
      ],
    },
  });

  /** Move a task to `dueDate`, or unschedule it with `null`. */
  return (rowId: string, dueDate: Date | null) =>
    mutate({ rowId, patch: { dueDate } });
};

export default useRescheduleTask;
