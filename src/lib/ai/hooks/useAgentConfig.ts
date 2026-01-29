import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";

import { API_BASE_URL } from "@/lib/config/env.config";

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

export interface ByokKeyInfo {
  maskedKey: string;
}

export interface AgentConfig {
  model: string;
  requireApprovalForDestructive: boolean;
  requireApprovalForCreate: boolean;
  maxIterationsPerRequest: number;
  customInstructions: string | null;
  byokKey: ByokKeyInfo | null;
}

interface AgentConfigResponse {
  config: AgentConfig;
  allowedModels: string[];
}

// ─────────────────────────────────────────────
// Query Key
// ─────────────────────────────────────────────

export function agentConfigQueryKey(organizationId: string) {
  return ["AgentConfig", organizationId] as const;
}

// ─────────────────────────────────────────────
// API Functions
// ─────────────────────────────────────────────

async function fetchAgentConfig(
  organizationId: string,
  accessToken: string,
): Promise<AgentConfigResponse> {
  const url = new URL(`${API_BASE_URL}/api/ai/config`);
  url.searchParams.set("organizationId", organizationId);

  const response = await fetch(url.toString(), {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch agent config");
  }

  return response.json() as Promise<AgentConfigResponse>;
}

async function updateAgentConfig(
  organizationId: string,
  accessToken: string,
  config: Partial<AgentConfig>,
): Promise<AgentConfig> {
  const response = await fetch(`${API_BASE_URL}/api/ai/config`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ organizationId, ...config }),
  });

  if (!response.ok) {
    throw new Error("Failed to update agent config");
  }

  const data = (await response.json()) as { config: AgentConfig };
  return data.config;
}

async function saveApiKey(
  organizationId: string,
  accessToken: string,
  apiKey: string,
): Promise<ByokKeyInfo> {
  const response = await fetch(`${API_BASE_URL}/api/ai/config/key`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ organizationId, apiKey }),
  });

  if (!response.ok) {
    const err = (await response.json().catch(() => null)) as {
      error?: string;
    } | null;
    throw new Error(err?.error ?? "Failed to save API key");
  }

  const data = (await response.json()) as { key: ByokKeyInfo };
  return data.key;
}

async function removeApiKey(
  organizationId: string,
  accessToken: string,
): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/ai/config/key`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ organizationId }),
  });

  if (!response.ok) {
    const err = (await response.json().catch(() => null)) as {
      error?: string;
    } | null;
    throw new Error(err?.error ?? "Failed to remove API key");
  }
}

// ─────────────────────────────────────────────
// Hook
// ─────────────────────────────────────────────

interface UseAgentConfigOptions {
  organizationId: string;
  accessToken: string | undefined;
}

/**
 * Hook for managing agent configuration.
 *
 * Provides query for fetching config, and mutations for
 * updating config and managing BYOK API keys.
 */
export function useAgentConfig({
  organizationId,
  accessToken,
}: UseAgentConfigOptions) {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: agentConfigQueryKey(organizationId),
    queryFn: () => fetchAgentConfig(organizationId, accessToken!),
    enabled: !!organizationId && !!accessToken,
  });

  const config = data?.config;
  const allowedModels = data?.allowedModels ?? [];

  const { mutate: saveConfig, isPending: isSaving } = useMutation({
    mutationFn: (updates: Partial<AgentConfig>) => {
      if (!accessToken) throw new Error("Not authenticated");
      return updateAgentConfig(organizationId, accessToken, updates);
    },
    onSuccess: (saved) => {
      queryClient.setQueryData(
        agentConfigQueryKey(organizationId),
        (prev: AgentConfigResponse | undefined) =>
          prev ? { ...prev, config: saved } : prev,
      );
    },
  });

  const { mutate: saveKey, isPending: isSavingKey } = useMutation({
    mutationFn: (apiKey: string) => {
      if (!accessToken) throw new Error("Not authenticated");
      return saveApiKey(organizationId, accessToken, apiKey);
    },
    onSuccess: (savedKey) => {
      queryClient.setQueryData(
        agentConfigQueryKey(organizationId),
        (prev: AgentConfigResponse | undefined) =>
          prev
            ? { ...prev, config: { ...prev.config, byokKey: savedKey } }
            : prev,
      );
    },
  });

  const { mutate: deleteKey, isPending: isDeletingKey } = useMutation({
    mutationFn: () => {
      if (!accessToken) throw new Error("Not authenticated");
      return removeApiKey(organizationId, accessToken);
    },
    onSuccess: () => {
      queryClient.setQueryData(
        agentConfigQueryKey(organizationId),
        (prev: AgentConfigResponse | undefined) =>
          prev ? { ...prev, config: { ...prev.config, byokKey: null } } : prev,
      );
    },
  });

  const updateConfig = useCallback(
    (updates: Partial<AgentConfig>) => {
      saveConfig(updates);
    },
    [saveConfig],
  );

  return {
    config,
    allowedModels,
    isLoading,
    isSaving,
    updateConfig,
    saveKey,
    isSavingKey,
    deleteKey,
    isDeletingKey,
  };
}
