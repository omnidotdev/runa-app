import { CardContent, CardHeader, CardRoot } from "@omnidotdev/thornberry/card";
import { useLoaderData } from "@tanstack/react-router";

import { useTaskActivityQuery } from "@/generated/graphql";

/**
 * Task activity/audit feed, sourced from Chronicle via the runa-api
 * `taskActivity` query. Renders nothing when there is no activity (including
 * when Chronicle is not configured, which returns an empty list), so it stays
 * out of the way until there's something to show
 */
const TaskActivity = () => {
  const { taskId } = useLoaderData({
    from: "/_app/@{$workspaceSlug}/$projectSlug/$taskId",
  });

  const { data } = useTaskActivityQuery({ taskId }, { staleTime: 30_000 });

  const entries = data?.taskActivity ?? [];
  if (!entries.length) return null;

  return (
    <CardRoot className="p-0 shadow-none">
      <CardHeader className="flex h-10 flex-row items-center gap-2 rounded-t-xl border-b bg-base-50 px-3 dark:bg-base-800">
        <h3 className="font-medium text-base-900 text-sm dark:text-base-100">
          Activity
        </h3>
      </CardHeader>

      <CardContent className="no-scrollbar max-h-96 overflow-auto p-0">
        <ol className="grid gap-0">
          {entries.map((entry, index) => (
            <li
              key={entry.id}
              className={
                index === entries.length - 1
                  ? "flex items-baseline justify-between gap-3 px-3 py-2"
                  : "flex items-baseline justify-between gap-3 border-b px-3 py-2"
              }
            >
              <span className="min-w-0 text-base-700 text-sm dark:text-base-300">
                {entry.summary}
              </span>
              <span className="shrink-0 text-base-500 text-xs tabular-nums dark:text-base-400">
                {entry.relativeTime}
              </span>
            </li>
          ))}
        </ol>
      </CardContent>
    </CardRoot>
  );
};

export default TaskActivity;
