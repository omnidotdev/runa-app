import { CardContent, CardHeader, CardRoot } from "@omnidotdev/thornberry/card";
import { useLoaderData } from "@tanstack/react-router";

import { useTaskActivityQuery } from "@/generated/graphql";
import groupActivity from "@/lib/util/groupActivity";

/**
 * Task activity/audit feed, sourced from Chronicle via the runa-api
 * `taskActivity` query. Renders nothing when there is no activity (including
 * when Chronicle is not configured, which returns an empty list).
 *
 * This is a per-task feed, so it does NOT restate the task on every row (the
 * server's human-readable string does); it shows actor + a friendly verb +
 * time, and collapses runs of the same action by the same actor (e.g. a burst
 * of debounced `task.updated` saves) into one row with a count
 */
const TaskActivity = () => {
  const { taskId } = useLoaderData({
    from: "/_app/@{$workspaceSlug}/$projectSlug/$taskId",
  });

  // TEMP: hidden on prod. Spurious `task.updated` events are racking up without
  // real user edits (likely the description/title editor firing onUpdate on
  // mount/hydration), so the feed showed noise like "updated this task (42×)".
  // `enabled: false` stops the polling and renders nothing. Re-enable once the
  // source of the phantom updates is fixed.
  const ACTIVITY_FEED_ENABLED = false;

  const { data } = useTaskActivityQuery(
    { taskId },
    { staleTime: 30_000, enabled: ACTIVITY_FEED_ENABLED },
  );

  const groups = groupActivity(data?.taskActivity ?? []);
  if (!groups.length) return null;

  return (
    <CardRoot className="p-0 shadow-none">
      <CardHeader className="flex h-10 flex-row items-center gap-2 rounded-t-xl border-b bg-base-50 px-3 dark:bg-base-800">
        <h3 className="font-medium text-base-900 text-sm dark:text-base-100">
          Activity
        </h3>
      </CardHeader>

      <CardContent className="no-scrollbar max-h-96 overflow-auto p-0">
        <ol className="grid gap-0">
          {groups.map((group, index) => (
            <li
              key={group.id}
              className={
                index === groups.length - 1
                  ? "flex items-baseline justify-between gap-3 px-3 py-2"
                  : "flex items-baseline justify-between gap-3 border-b px-3 py-2"
              }
            >
              <span className="min-w-0 text-base-700 text-sm dark:text-base-300">
                <span className="font-medium text-base-900 dark:text-base-100">
                  {group.actorName ?? "Someone"}
                </span>{" "}
                {group.verb}
                {group.count > 1 && (
                  <span className="text-base-500 dark:text-base-400">
                    {" "}
                    ({group.count}×)
                  </span>
                )}
              </span>
              <span className="shrink-0 text-base-500 text-xs tabular-nums dark:text-base-400">
                {group.relativeTime}
              </span>
            </li>
          ))}
        </ol>
      </CardContent>
    </CardRoot>
  );
};

export default TaskActivity;
