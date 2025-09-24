import { useQuery } from "@tanstack/react-query";
import { useLoaderData, useRouteContext } from "@tanstack/react-router";
import { match } from "ts-pattern";

import { Tier } from "@/generated/graphql";
import workspaceOptions from "@/lib/options/workspace.options";

const FREE_TIER_MAX_TASKS = 500;
const BASIC_TIER_MAX_TASKS = 2000;

const useMaxTasksReached = () => {
  const { workspaceId } = useLoaderData({
    from: "/_auth",
  });

  const { session } = useRouteContext({
    from: "/_auth",
  });

  const { data: tier } = useQuery({
    ...workspaceOptions({ rowId: workspaceId!, userId: session?.user.rowId! }),
    enabled: !!workspaceId,
    select: (data) => data.workspace?.tier,
  });

  const { data: totalTasks } = useQuery({
    ...workspaceOptions({ rowId: workspaceId!, userId: session?.user?.rowId! }),
    select: (data) =>
      data?.workspace?.projects?.nodes?.reduce(
        (acc, project) => acc + project.tasks.totalCount,
        0,
      ),
  });

  return match({ tier, totalTasks })
    .with({ tier: undefined }, () => true)
    .with({ totalTasks: undefined }, () => true)
    .with(
      { tier: Tier.Free },
      ({ totalTasks }) => Number(totalTasks) >= FREE_TIER_MAX_TASKS,
    )
    .with(
      { tier: Tier.Basic },
      ({ totalTasks }) => Number(totalTasks) >= BASIC_TIER_MAX_TASKS,
    )
    .with({ tier: Tier.Team }, () => false)
    .exhaustive();
};

export default useMaxTasksReached;
