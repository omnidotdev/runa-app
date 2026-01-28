/**
 * Hook to manage polling for AI agent responses after @mention comments.
 *
 * When a user submits a comment containing @runa or @agent, the backend
 * processes the mention asynchronously. This hook enables temporary polling
 * on the task query to pick up the agent's response without requiring
 * a manual page refresh.
 */

import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useRef } from "react";

import { useTasksQuery } from "@/generated/graphql";
import taskOptions from "@/lib/options/task.options";
import getQueryKeyPrefix from "@/lib/util/getQueryKeyPrefix";

/**
 * Detect @runa or @agent mentions in HTML content.
 * Handles both plain text (@runa) and MentionNode HTML (data-mention="runa").
 */
function hasMention(html: string): boolean {
  // Check for MentionNode data attribute
  if (/data-mention=["'](runa|agent)["']/i.test(html)) {
    return true;
  }
  // Check for plain text mention
  if (/@(runa|agent)\b/i.test(html)) {
    return true;
  }
  return false;
}

/** How often to poll for updates (ms) */
const POLL_INTERVAL = 2000;

/** How long to poll before giving up (ms) */
const POLL_DURATION = 30000;

interface UseMentionPollingOptions {
  taskId: string;
}

interface TaskQueryData {
  task?: {
    posts?: {
      nodes?: Array<{ rowId: string }>;
    };
  };
}

export function useMentionPolling({ taskId }: UseMentionPollingOptions) {
  const queryClient = useQueryClient();
  const pollingTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const initialCommentCountRef = useRef<number | null>(null);
  const isPollingRef = useRef(false);

  const stopPolling = useCallback(() => {
    if (pollingTimerRef.current) {
      clearInterval(pollingTimerRef.current);
      pollingTimerRef.current = null;
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    initialCommentCountRef.current = null;
    isPollingRef.current = false;
  }, []);

  const startPolling = useCallback(() => {
    // Don't start if already polling
    if (isPollingRef.current) return;
    isPollingRef.current = true;

    const taskQueryKey = taskOptions({ rowId: taskId }).queryKey;

    // Small delay to let the user's comment mutation complete first
    setTimeout(() => {
      // Capture current comment count AFTER user's comment is added
      const currentData = queryClient.getQueryData<TaskQueryData>(taskQueryKey);
      initialCommentCountRef.current =
        currentData?.task?.posts?.nodes?.length ?? 0;

      // Start polling
      pollingTimerRef.current = setInterval(async () => {
        // Refetch and wait for it to complete
        await queryClient.refetchQueries({ queryKey: taskQueryKey });

        // Also refetch tasks list in case agent modified task properties
        queryClient.invalidateQueries({
          queryKey: getQueryKeyPrefix(useTasksQuery),
        });

        // Check if we got a new comment (agent response)
        const newData = queryClient.getQueryData<TaskQueryData>(taskQueryKey);
        const newCommentCount = newData?.task?.posts?.nodes?.length ?? 0;

        if (
          initialCommentCountRef.current !== null &&
          newCommentCount > initialCommentCountRef.current
        ) {
          // Agent responded, stop polling
          stopPolling();
        }
      }, POLL_INTERVAL);

      // Set timeout to stop polling after duration
      timeoutRef.current = setTimeout(() => {
        stopPolling();
      }, POLL_DURATION);
    }, 500); // Wait 500ms for user's comment to be added
  }, [taskId, queryClient, stopPolling]);

  /**
   * Call this when submitting a comment.
   * If the comment contains a mention, starts polling for agent response.
   */
  const onCommentSubmit = useCallback(
    (commentHtml: string) => {
      if (hasMention(commentHtml)) {
        startPolling();
      }
    },
    [startPolling],
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopPolling();
    };
  }, [stopPolling]);

  return {
    onCommentSubmit,
    stopPolling,
  };
}
