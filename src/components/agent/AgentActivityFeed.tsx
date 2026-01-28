import { useQuery } from "@tanstack/react-query";
import { Loader2Icon, ZapIcon } from "lucide-react";
import { useCallback, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { useRollbackActivity } from "@/lib/ai/hooks/useRollback";
import agentActivitiesOptions from "@/lib/options/agentActivities.options";
import { AgentActivityItem } from "./AgentActivityItem";

import type { AgentActivitiesQuery } from "@/generated/graphql";

type ActivityNode = NonNullable<
  AgentActivitiesQuery["agentActivities"]
>["nodes"][number];

interface AgentActivityFeedProps {
  projectId: string;
}

export function AgentActivityFeed({ projectId }: AgentActivityFeedProps) {
  const [cursor, setCursor] = useState<string | null>(null);
  const [previousActivities, setPreviousActivities] = useState<ActivityNode[]>(
    [],
  );
  const lastAppendedCursorRef = useRef<string | null>(null);

  const {
    mutate: rollbackActivity,
    isPending: isRollingBack,
    variables: rollingBackId,
  } = useRollbackActivity();

  const { data, isLoading, isFetching } = useQuery(
    agentActivitiesOptions({
      projectId,
      first: 20,
      after: cursor,
    }),
  );

  const currentPageNodes = data?.agentActivities?.nodes ?? [];
  const pageInfo = data?.agentActivities?.pageInfo;
  const totalCount = data?.agentActivities?.totalCount ?? 0;

  // Accumulate: previously loaded pages + current page
  const activities = [...previousActivities, ...currentPageNodes];

  const handleLoadMore = useCallback(() => {
    if (!pageInfo?.endCursor) return;
    // Guard against double-click: skip if we already appended from this cursor
    if (lastAppendedCursorRef.current === pageInfo.endCursor) return;
    lastAppendedCursorRef.current = pageInfo.endCursor;

    // Save current page nodes before advancing cursor, deduplicating by rowId
    setPreviousActivities((prev) => {
      const existingIds = new Set(prev.map((a) => a.rowId));
      const newNodes = currentPageNodes.filter(
        (node) => !existingIds.has(node.rowId),
      );
      return [...prev, ...newNodes];
    });
    setCursor(pageInfo.endCursor);
  }, [pageInfo?.endCursor, currentPageNodes]);

  if (isLoading && previousActivities.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <Loader2Icon className="size-4 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (activities.length === 0 && !isFetching) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
        <ZapIcon className="size-8 text-muted-foreground/50" />
        <div>
          <p className="font-medium text-sm">No activity yet</p>
          <p className="mt-1 text-muted-foreground text-xs">
            Tool executions will appear here as the agent works.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="custom-scrollbar flex flex-1 flex-col gap-2 overflow-y-auto px-4 py-3"
      role="feed"
      aria-label="Agent activity log"
    >
      <p className="text-muted-foreground text-xs">
        {totalCount} {totalCount === 1 ? "activity" : "activities"}
      </p>

      {activities.map((activity) => (
        <AgentActivityItem
          key={activity.rowId}
          activity={activity}
          onUndo={rollbackActivity}
          isUndoing={isRollingBack}
          undoingActivityId={rollingBackId}
        />
      ))}

      {pageInfo?.hasNextPage && (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLoadMore}
          disabled={isFetching}
          className="self-center text-xs"
        >
          {isFetching ? (
            <Loader2Icon className="size-3 animate-spin" />
          ) : (
            "Load more"
          )}
        </Button>
      )}
    </div>
  );
}
