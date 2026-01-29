/**
 * Query options for agent configuration.
 *
 * Used for SSR prefetching in route loaders and suspense queries in components.
 */

import { queryOptions } from "@tanstack/react-query";

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

export interface AgentConfigResponse {
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
// Fetcher
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

// ─────────────────────────────────────────────
// Options
// ─────────────────────────────────────────────

export interface AgentConfigVariables {
  organizationId: string;
  accessToken: string;
}

const agentConfigOptions = ({
  organizationId,
  accessToken,
}: AgentConfigVariables) =>
  queryOptions({
    queryKey: agentConfigQueryKey(organizationId),
    queryFn: () => fetchAgentConfig(organizationId, accessToken),
    enabled: !!organizationId && !!accessToken,
  });

export default agentConfigOptions;
