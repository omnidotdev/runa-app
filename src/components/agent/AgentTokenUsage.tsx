import { useSuspenseQuery } from "@tanstack/react-query";

import agentSessionTokenUsageOptions from "@/lib/options/agentSessionTokenUsage.options";

interface AgentTokenUsageProps {
  organizationId: string;
}

function formatNumber(value: string | number | null | undefined): string {
  if (value == null) return "0";
  return Number(value).toLocaleString();
}

/**
 * Displays aggregate session stats for an organization.
 * Rendered as a compact header row within the unified Agent Settings card.
 *
 * Data is prefetched in the route loader, so this uses useSuspenseQuery.
 */
export function AgentTokenUsage({ organizationId }: AgentTokenUsageProps) {
  const { data } = useSuspenseQuery(
    agentSessionTokenUsageOptions({ organizationId }),
  );

  const aggregates = data?.agentSessions?.aggregates;
  const totalSessions = data?.agentSessions?.totalCount ?? 0;
  const totalToolCalls = aggregates?.sum?.toolCallCount ?? "0";

  return (
    <div className="flex items-center justify-between gap-4 bg-muted/30 px-4 py-3">
      <span className="font-medium text-muted-foreground text-xs uppercase tracking-wide">
        Usage
      </span>
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-1.5">
          <span className="font-semibold text-sm tabular-nums">
            {totalSessions.toLocaleString()}
          </span>
          <span className="text-muted-foreground text-xs">sessions</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="font-semibold text-sm tabular-nums">
            {formatNumber(totalToolCalls)}
          </span>
          <span className="text-muted-foreground text-xs">tool calls</span>
        </div>
      </div>
    </div>
  );
}
