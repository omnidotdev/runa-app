import { useQuery } from "@tanstack/react-query";
import { useRef } from "react";

import { API_BASE_URL } from "@/lib/config/env.config";
import { useAccessToken } from "./useAccessToken";

export interface AgentWebhook {
  id: string;
  name: string;
  eventType: string;
  instructionTemplate: string;
  enabled: boolean;
  lastTriggeredAt: string | null;
  createdAt: string;
}

export function agentWebhooksQueryKey(projectId: string) {
  return ["AgentWebhooks", projectId] as const;
}

async function fetchWebhooks(
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

export function useAgentWebhooks(projectId: string | undefined) {
  const accessToken = useAccessToken();
  const tokenRef = useRef(accessToken);
  tokenRef.current = accessToken;

  return useQuery({
    queryKey: agentWebhooksQueryKey(projectId ?? ""),
    queryFn: () => fetchWebhooks(projectId!, tokenRef.current),
    enabled: !!projectId,
  });
}
