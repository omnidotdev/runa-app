import { useSuspenseQuery } from "@tanstack/react-query";
import { BarChart3Icon } from "lucide-react";

import agentSessionTokenUsageOptions from "@/lib/options/agentSessionTokenUsage.options";

interface AgentTokenUsageProps {
  organizationId: string;
}

function formatNumber(value: string | number | null | undefined): string {
  if (value == null) return "0";
  return Number(value).toLocaleString();
}

/**
 * Displays aggregate token usage and session stats for an organization.
 * Rendered within the Agent Config settings section.
 *
 * Data is prefetched in the route loader, so this uses useSuspenseQuery.
 */
export function AgentTokenUsage({ organizationId }: AgentTokenUsageProps) {
  const { data } = useSuspenseQuery(
    agentSessionTokenUsageOptions({ organizationId }),
  );

  const aggregates = data?.agentSessions?.aggregates;
  const totalSessions = data?.agentSessions?.totalCount ?? 0;
  const totalTokens = aggregates?.sum?.totalTokensUsed ?? "0";
  const totalToolCalls = aggregates?.sum?.toolCallCount ?? "0";

  return (
    <div className="mt-4 flex flex-col gap-2 rounded-lg border p-3">
      <h3 className="flex items-center gap-2 font-medium text-muted-foreground text-xs uppercase tracking-wide">
        <BarChart3Icon className="size-3.5" />
        Usage
      </h3>

      <div className="grid grid-cols-3 gap-3">
        <div className="flex flex-col gap-0.5">
          <span className="font-semibold text-lg tabular-nums">
            {totalSessions.toLocaleString()}
          </span>
          <span className="text-muted-foreground text-xs">Sessions</span>
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="font-semibold text-lg tabular-nums">
            {formatNumber(totalTokens)}
          </span>
          <span className="text-muted-foreground text-xs">Tokens Used</span>
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="font-semibold text-lg tabular-nums">
            {formatNumber(totalToolCalls)}
          </span>
          <span className="text-muted-foreground text-xs">Tool Calls</span>
        </div>
      </div>
    </div>
  );
}
