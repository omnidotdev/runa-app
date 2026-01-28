/**
 * Rollback hooks for agent activity undo operations.
 *
 * Provides three mutation hooks:
 *  - `useRollbackActivity` — undo a single activity by ID
 *  - `useRollbackByMatch` — undo by matching session + tool + input
 *  - `useRollbackSession` — undo all activities in a session
 *
 * All hooks call the REST rollback endpoint, invalidate relevant
 * React Query caches on success, and show error toasts on failure.
 */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { API_BASE_URL } from "@/lib/config/env.config";
import { useAccessToken } from "./useAccessToken";

interface RollbackActivityResult {
  success: boolean;
  rolledBackActivityId: string;
  description: string;
}

export interface RollbackByMatchParams {
  sessionId: string;
  toolName: string;
  toolInput: unknown;
}

interface RollbackSessionResult {
  success: boolean;
  sessionId: string;
  rolledBackCount: number;
  details: Array<{
    activityId: string;
    toolName: string;
    description: string;
  }>;
}

/**
 * Mutation hook to rollback a single agent activity.
 *
 * Calls `POST /api/ai/rollback/:activityId` and invalidates
 * the activity feed cache on success.
 */
export function useRollbackActivity() {
  const accessToken = useAccessToken();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (activityId: string): Promise<RollbackActivityResult> => {
      const response = await fetch(
        `${API_BASE_URL}/api/ai/rollback/${activityId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(
          (body as { error?: string }).error ?? "Rollback failed",
        );
      }

      return response.json() as Promise<RollbackActivityResult>;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["AgentActivities"] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to undo action");
    },
  });
}

/**
 * Mutation hook to rollback an activity by matching session + tool name + input.
 *
 * Used by ToolCallBubble where the activityId is not directly available.
 * Calls `POST /api/ai/rollback/by-match`.
 */
export function useRollbackByMatch() {
  const accessToken = useAccessToken();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      params: RollbackByMatchParams,
    ): Promise<RollbackActivityResult> => {
      const response = await fetch(`${API_BASE_URL}/api/ai/rollback/by-match`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(
          (body as { error?: string }).error ?? "Rollback failed",
        );
      }

      return response.json() as Promise<RollbackActivityResult>;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["AgentActivities"] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to undo action");
    },
  });
}

/**
 * Mutation hook to rollback all activities in an agent session.
 *
 * Calls `POST /api/ai/rollback/session/:sessionId` and invalidates
 * relevant caches on success.
 */
export function useRollbackSession() {
  const accessToken = useAccessToken();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (sessionId: string): Promise<RollbackSessionResult> => {
      const response = await fetch(
        `${API_BASE_URL}/api/ai/rollback/session/${sessionId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(
          (body as { error?: string }).error ?? "Session rollback failed",
        );
      }

      return response.json() as Promise<RollbackSessionResult>;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["AgentActivities"] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to undo session");
    },
  });
}
