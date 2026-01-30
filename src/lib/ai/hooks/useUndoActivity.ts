/**
 * Hook for undoing agent activities.
 *
 * Provides the ability to undo recent agent actions via the API.
 */

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useState } from "react";

import {
  useAgentActivitiesQuery,
  useTaskQuery,
  useTasksQuery,
} from "@/generated/graphql";
import { API_BASE_URL } from "@/lib/config/env.config";
import getQueryKeyPrefix from "@/lib/util/getQueryKeyPrefix";
import { useAccessToken } from "./useAccessToken";

/** Time window for undo operations (5 minutes in ms). */
const UNDO_WINDOW_MS = 5 * 60 * 1000;

interface UndoCheckResult {
  canUndo: boolean;
  reason?: string;
  remainingSeconds?: number;
}

interface UndoResult {
  success: boolean;
  message: string;
  restoredEntityId?: string;
  restoredEntityIds?: string[];
}

interface UseUndoActivityOptions {
  activityId: string;
  activityCreatedAt: string;
  activityStatus: string;
  hasSnapshot: boolean;
}

/**
 * Check if an activity can be undone based on local criteria.
 *
 * This is an optimistic check - the server will perform additional validation.
 */
function canUndoLocally({
  activityCreatedAt,
  activityStatus,
  hasSnapshot,
}: Omit<UseUndoActivityOptions, "activityId">): {
  canUndo: boolean;
  reason?: string;
  remainingSeconds?: number;
} {
  if (activityStatus === "rolled_back") {
    return { canUndo: false, reason: "Already undone" };
  }

  if (activityStatus !== "completed") {
    return { canUndo: false, reason: "Not completed" };
  }

  if (!hasSnapshot) {
    return { canUndo: false, reason: "Cannot undo" };
  }

  const createdAt = new Date(activityCreatedAt).getTime();
  const now = Date.now();
  const elapsed = now - createdAt;

  if (elapsed >= UNDO_WINDOW_MS) {
    return { canUndo: false, reason: "Expired" };
  }

  const remainingSeconds = Math.ceil((UNDO_WINDOW_MS - elapsed) / 1000);
  return { canUndo: true, remainingSeconds };
}

export function useUndoActivity({
  activityId,
  activityCreatedAt,
  activityStatus,
  hasSnapshot,
}: UseUndoActivityOptions) {
  const accessToken = useAccessToken();
  const queryClient = useQueryClient();

  // Track undo success for UI feedback
  const [undoSuccess, setUndoSuccess] = useState(false);

  // Local check for undo eligibility
  const localCheck = canUndoLocally({
    activityCreatedAt,
    activityStatus,
    hasSnapshot,
  });

  // Server check for undo eligibility (only if local check passes)
  const { data: serverCheck, isLoading: isCheckLoading } =
    useQuery<UndoCheckResult>({
      queryKey: ["undoCheck", activityId],
      queryFn: async () => {
        const response = await fetch(
          `${API_BASE_URL}/api/ai/undo/${activityId}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          },
        );
        return response.json();
      },
      enabled: localCheck.canUndo && !!accessToken,
      staleTime: 10_000, // 10 seconds
      refetchInterval: localCheck.canUndo ? 30_000 : false, // Refresh every 30s while undoable
    });

  // Invalidate all task-related queries
  const invalidateTaskQueries = useCallback(() => {
    // Invalidate tasks list (board view)
    queryClient.invalidateQueries({
      queryKey: getQueryKeyPrefix(useTasksQuery),
    });
    // Invalidate individual task queries
    queryClient.invalidateQueries({
      queryKey: getQueryKeyPrefix(useTaskQuery),
    });
    // Invalidate agent activities
    queryClient.invalidateQueries({
      queryKey: getQueryKeyPrefix(useAgentActivitiesQuery),
    });
  }, [queryClient]);

  // Mutation to execute the undo
  const undoMutation = useMutation<UndoResult, Error>({
    mutationFn: async () => {
      const response = await fetch(`${API_BASE_URL}/api/ai/undo`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ activityId }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Undo failed");
      }

      return result;
    },
    onSuccess: () => {
      setUndoSuccess(true);

      // Invalidate the undo check first
      queryClient.invalidateQueries({
        queryKey: ["undoCheck", activityId],
      });

      // Invalidate all task-related queries to update UI
      invalidateTaskQueries();

      // Clear success state after a delay
      setTimeout(() => {
        setUndoSuccess(false);
      }, 2000);
    },
    onError: (error) => {
      console.error("[Undo] Failed to undo activity:", error);
    },
  });

  // Use server check if available, otherwise use local check
  const canUndo = serverCheck?.canUndo ?? localCheck.canUndo;
  const reason = serverCheck?.reason ?? localCheck.reason;
  const remainingSeconds =
    serverCheck?.remainingSeconds ?? localCheck.remainingSeconds;

  return {
    canUndo: canUndo && !undoSuccess, // Hide button after successful undo
    reason,
    remainingSeconds,
    isCheckLoading,
    undo: undoMutation.mutate,
    isUndoing: undoMutation.isPending,
    undoError: undoMutation.error,
    undoSuccess,
  };
}
