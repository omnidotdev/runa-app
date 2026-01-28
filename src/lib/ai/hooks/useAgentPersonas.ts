import { useRef } from "react";
import { useQuery } from "@tanstack/react-query";

import { API_BASE_URL } from "@/lib/config/env.config";
import { useAccessToken } from "./useAccessToken";

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

export function agentPersonasQueryKey(organizationId: string) {
  return ["AgentPersonas", organizationId] as const;
}

async function fetchPersonas(
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

export function useAgentPersonas(organizationId: string | undefined) {
  const accessToken = useAccessToken();
  const tokenRef = useRef(accessToken);
  tokenRef.current = accessToken;

  return useQuery({
    queryKey: agentPersonasQueryKey(organizationId ?? ""),
    queryFn: () => fetchPersonas(organizationId!, tokenRef.current),
    enabled: !!organizationId,
  });
}
