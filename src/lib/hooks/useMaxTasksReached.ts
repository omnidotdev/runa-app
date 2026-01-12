import { useQuery } from "@tanstack/react-query";
import { useLoaderData, useRouteContext } from "@tanstack/react-router";
import { match } from "ts-pattern";

import { Tier } from "@/generated/graphql";
import workspaceOptions from "@/lib/options/workspace.options";

const FREE_TIER_MAX_TASKS = 500;
const BASIC_TIER_MAX_TASKS = 2000;

const billingBypassOrgIds: string[] =
  import.meta.env.VITE_BILLING_BYPASS_ORG_IDS?.split(",")
    .map((s: string) => s.trim())
    .filter(Boolean) ?? [];

const useMaxTasksReached = () => {
  const { workspaceId } = useLoaderData({
    from: "/_auth",
  });

  const { session } = useRouteContext({
    from: "/_auth",
  });

  const { data: tier, isLoading: isTierLoading } = useQuery({
    ...workspaceOptions({ rowId: workspaceId!, userId: session?.user.rowId! }),
    enabled: !!workspaceId && !!session?.user?.rowId,
    select: (data) => data.workspace?.tier,
  });

  const { data: organizationId, isLoading: isOrgIdLoading } = useQuery({
    ...workspaceOptions({ rowId: workspaceId!, userId: session?.user.rowId! }),
    enabled: !!workspaceId && !!session?.user?.rowId,
    select: (data) => data.workspace?.organizationId,
  });

  const { data: totalTasks, isLoading: isTasksLoading } = useQuery({
    ...workspaceOptions({ rowId: workspaceId!, userId: session?.user?.rowId! }),
    enabled: !!workspaceId && !!session?.user?.rowId,
    select: (data) =>
      data?.workspace?.projects?.nodes?.reduce(
        (acc, project) => acc + project.tasks.totalCount,
        0,
      ),
  });

  // Allow task creation while data is loading
  if (isTierLoading || isTasksLoading || isOrgIdLoading) return false;

  // Bypass tier limits for exempt organizations
  if (organizationId && billingBypassOrgIds.includes(organizationId))
    return false;

  return match({ tier, totalTasks })
    .with({ tier: undefined }, () => false)
    .with({ totalTasks: undefined }, () => false)
    .with(
      { tier: Tier.Free },
      ({ totalTasks }) => Number(totalTasks) >= FREE_TIER_MAX_TASKS,
    )
    .with(
      { tier: Tier.Basic },
      ({ totalTasks }) => Number(totalTasks) >= BASIC_TIER_MAX_TASKS,
    )
    .with({ tier: Tier.Team }, () => false)
    .with({ tier: Tier.Enterprise }, () => false)
    .exhaustive();
};

export default useMaxTasksReached;
