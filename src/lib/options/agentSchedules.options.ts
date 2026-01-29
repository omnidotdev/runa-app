import { queryOptions } from "@tanstack/react-query";

import { API_BASE_URL } from "@/lib/config/env.config";

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

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

export interface AgentSchedulesVariables {
  projectId: string;
  accessToken: string;
}

// ─────────────────────────────────────────────
// Query Key
// ─────────────────────────────────────────────

export function agentSchedulesQueryKey(projectId: string) {
  return ["AgentSchedules", projectId] as const;
}

// ─────────────────────────────────────────────
// Fetcher
// ─────────────────────────────────────────────

async function fetchAgentSchedules(
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

// ─────────────────────────────────────────────
// Query Options
// ─────────────────────────────────────────────

const agentSchedulesOptions = ({
  projectId,
  accessToken,
}: AgentSchedulesVariables) =>
  queryOptions({
    queryKey: agentSchedulesQueryKey(projectId),
    queryFn: () => fetchAgentSchedules(projectId, accessToken),
    enabled: !!projectId && !!accessToken,
  });

export default agentSchedulesOptions;
