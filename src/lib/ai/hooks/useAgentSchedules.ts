import { useRef } from "react";
import { useQuery } from "@tanstack/react-query";

import { API_BASE_URL } from "@/lib/config/env.config";
import { useAccessToken } from "./useAccessToken";

export interface AgentSchedule {
  id: string;
  name: string;
  cronExpression: string;
  instruction: string;
  personaId: string | null;
  enabled: boolean;
  lastRunAt: string | null;
  nextRunAt: string | null;
  createdAt: string;
}

export function agentSchedulesQueryKey(projectId: string) {
  return ["AgentSchedules", projectId] as const;
}

async function fetchSchedules(
  projectId: string,
  accessToken: string,
): Promise<AgentSchedule[]> {
  const url = new URL(`${API_BASE_URL}/api/ai/schedules`);
  url.searchParams.set("projectId", projectId);

  const response = await fetch(url.toString(), {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch schedules");
  }

  const data = (await response.json()) as { schedules: AgentSchedule[] };
  return data.schedules;
}

export function useAgentSchedules(projectId: string | undefined) {
  const accessToken = useAccessToken();
  const tokenRef = useRef(accessToken);
  tokenRef.current = accessToken;

  return useQuery({
    queryKey: agentSchedulesQueryKey(projectId ?? ""),
    queryFn: () => fetchSchedules(projectId!, tokenRef.current),
    enabled: !!projectId,
  });
}
