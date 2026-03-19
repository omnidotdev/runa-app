/**
 * Query options for agent personas.
 *
 * Used for SSR prefetching in route loaders and suspense queries in components.
 */

import { queryOptions } from "@tanstack/react-query";

import { API_BASE_URL } from "@/lib/config/env.config";

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

export interface AgentPersona {
  id: string;
  organizationId: string;
  name: string;
  description: string | null;
  systemPrompt: string;
  icon: string | null;
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
}

// ─────────────────────────────────────────────
// Query Key
// ─────────────────────────────────────────────

export function agentPersonasQueryKey(organizationId: string) {
  return ["AgentPersonas", organizationId] as const;
}

// ─────────────────────────────────────────────
// Fetcher
// ─────────────────────────────────────────────

async function fetchAgentPersonas(
  organizationId: string,
  accessToken: string,
): Promise<AgentPersona[]> {
  const url = new URL(`${API_BASE_URL}/api/ai/personas`);
  url.searchParams.set("organizationId", organizationId);

  const response = await fetch(url.toString(), {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch personas");
  }

  const data = (await response.json()) as { personas: AgentPersona[] };
  return data.personas;
}

// ─────────────────────────────────────────────
// Options
// ─────────────────────────────────────────────

export interface AgentPersonasVariables {
  organizationId: string;
  accessToken: string;
}

const agentPersonasOptions = ({
  organizationId,
  accessToken,
}: AgentPersonasVariables) =>
  queryOptions({
    queryKey: agentPersonasQueryKey(organizationId),
    queryFn: () => fetchAgentPersonas(organizationId, accessToken),
    enabled: !!organizationId && !!accessToken,
  });

export default agentPersonasOptions;
