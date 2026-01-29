import { queryOptions } from "@tanstack/react-query";

import { API_BASE_URL } from "@/lib/config/env.config";

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

export interface AgentWebhook {
  id: string;
  name: string;
  eventType: string;
  instructionTemplate: string;
  enabled: boolean;
  lastTriggeredAt: string | null;
  createdAt: string;
}

export interface AgentWebhooksVariables {
  projectId: string;
  accessToken: string;
}

// ─────────────────────────────────────────────
// Query Key
// ─────────────────────────────────────────────

export function agentWebhooksQueryKey(projectId: string) {
  return ["AgentWebhooks", projectId] as const;
}

// ─────────────────────────────────────────────
// Fetcher
// ─────────────────────────────────────────────

async function fetchAgentWebhooks(
  projectId: string,
  accessToken: string,
): Promise<AgentWebhook[]> {
  const url = new URL(`${API_BASE_URL}/api/ai/webhooks`);
  url.searchParams.set("projectId", projectId);

  const response = await fetch(url.toString(), {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch webhooks");
  }

  const data = (await response.json()) as { webhooks: AgentWebhook[] };
  return data.webhooks;
}

// ─────────────────────────────────────────────
// Query Options
// ─────────────────────────────────────────────

const agentWebhooksOptions = ({
  projectId,
  accessToken,
}: AgentWebhooksVariables) =>
  queryOptions({
    queryKey: agentWebhooksQueryKey(projectId),
    queryFn: () => fetchAgentWebhooks(projectId, accessToken),
    enabled: !!projectId && !!accessToken,
  });

export default agentWebhooksOptions;
