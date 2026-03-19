/**
 * Hook to manage polling for AI agent responses after @mention comments.
 *
 * When a user submits a comment containing @runa or @agent, the backend
 * processes the mention asynchronously. This hook enables temporary polling
 * on the task query to pick up the agent's response without requiring
 * a manual page refresh.
 *
 * Features:
 * - Exponential backoff (2s → 4s → 8s → 16s cap)
 * - Extended timeout (120 seconds)
 * - Elapsed time tracking for UI feedback
 * - Manual cancel support
 */

import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useRef, useState } from "react";

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

/** Initial poll interval (ms) */
const INITIAL_POLL_INTERVAL = 2000;

/** Maximum poll interval after backoff (ms) */
const MAX_POLL_INTERVAL = 16000;

/** How long to poll before giving up (ms) */
const POLL_DURATION = 120000;

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

interface MentionPollingState {
  /** Whether polling is currently active. */
  isPolling: boolean;
  /** Seconds elapsed since polling started. */
  elapsedSeconds: number;
  /** True if polling timed out without a response. */
  timedOut: boolean;
}

export function useMentionPolling({ taskId }: UseMentionPollingOptions) {
  const queryClient = useQueryClient();

  // Polling state
  const [state, setState] = useState<MentionPollingState>({
    isPolling: false,
    elapsedSeconds: 0,
    timedOut: false,
  });

  // Refs for timers
  const pollingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const elapsedTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number | null>(null);

  // Tracking
  const initialCommentCountRef = useRef<number | null>(null);
  const currentIntervalRef = useRef(INITIAL_POLL_INTERVAL);

  const clearTimers = useCallback(() => {
    if (pollingTimerRef.current) {
      clearTimeout(pollingTimerRef.current);
      pollingTimerRef.current = null;
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (elapsedTimerRef.current) {
      clearInterval(elapsedTimerRef.current);
      elapsedTimerRef.current = null;
    }
  }, []);

  const stopPolling = useCallback(
    (timedOut = false) => {
      clearTimers();
      initialCommentCountRef.current = null;
      currentIntervalRef.current = INITIAL_POLL_INTERVAL;
      startTimeRef.current = null;
      setState({
        isPolling: false,
        elapsedSeconds: 0,
        timedOut,
      });
    },
    [clearTimers],
  );

  const cancelPolling = useCallback(() => {
    stopPolling(false);
  }, [stopPolling]);

  const poll = useCallback(async () => {
    const taskQueryKey = taskOptions({ rowId: taskId }).queryKey;

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
      stopPolling(false);
      return;
    }

    // Schedule next poll with exponential backoff
    currentIntervalRef.current = Math.min(
      currentIntervalRef.current * 2,
      MAX_POLL_INTERVAL,
    );

    pollingTimerRef.current = setTimeout(poll, currentIntervalRef.current);
  }, [taskId, queryClient, stopPolling]);

  const startPolling = useCallback(() => {
    // Don't start if already polling
    if (state.isPolling) return;

    const taskQueryKey = taskOptions({ rowId: taskId }).queryKey;

    // Reset state
    currentIntervalRef.current = INITIAL_POLL_INTERVAL;
    startTimeRef.current = Date.now();

    setState({
      isPolling: true,
      elapsedSeconds: 0,
      timedOut: false,
    });

    // Small delay to let the user's comment mutation complete first
    setTimeout(() => {
      // Capture current comment count AFTER user's comment is added
      const currentData = queryClient.getQueryData<TaskQueryData>(taskQueryKey);
      initialCommentCountRef.current =
        currentData?.task?.posts?.nodes?.length ?? 0;

      // Start polling
      pollingTimerRef.current = setTimeout(poll, currentIntervalRef.current);

      // Update elapsed time every second
      elapsedTimerRef.current = setInterval(() => {
        if (startTimeRef.current) {
          const elapsed = Math.floor(
            (Date.now() - startTimeRef.current) / 1000,
          );
          setState((prev) => ({ ...prev, elapsedSeconds: elapsed }));
        }
      }, 1000);

      // Set timeout to stop polling after duration
      timeoutRef.current = setTimeout(() => {
        stopPolling(true);
      }, POLL_DURATION);
    }, 500); // Wait 500ms for user's comment to be added
  }, [taskId, queryClient, poll, stopPolling, state.isPolling]);

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
      clearTimers();
    };
  }, [clearTimers]);

  return {
    onCommentSubmit,
    cancelPolling,
    isPolling: state.isPolling,
    elapsedSeconds: state.elapsedSeconds,
    timedOut: state.timedOut,
  };
}
