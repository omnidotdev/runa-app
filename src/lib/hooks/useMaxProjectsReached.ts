import { useQuery } from "@tanstack/react-query";
import { useLoaderData, useRouteContext } from "@tanstack/react-router";
import { match } from "ts-pattern";

import { Tier } from "@/generated/graphql";
import workspaceOptions from "@/lib/options/workspace.options";

const FREE_TIER_MAX_PROJECTS = 2;
const BASIC_TIER_MAX_PROJECTS = 10;

const billingBypassSlugs: string[] =
  import.meta.env.VITE_BILLING_BYPASS_SLUGS?.split(",")
    .map((s: string) => s.trim())
    .filter(Boolean) ?? [];

const useMaxProjectsReached = () => {
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

  const { data: slug, isLoading: isSlugLoading } = useQuery({
    ...workspaceOptions({ rowId: workspaceId!, userId: session?.user.rowId! }),
    enabled: !!workspaceId && !!session?.user?.rowId,
    select: (data) => data.workspace?.slug,
  });

  const { data: totalProjects, isLoading: isProjectsLoading } = useQuery({
    ...workspaceOptions({ rowId: workspaceId!, userId: session?.user?.rowId! }),
    enabled: !!workspaceId && !!session?.user?.rowId,
    select: (data) => data?.workspace?.projects?.totalCount,
  });

  // Allow project creation while data is loading
  if (isTierLoading || isProjectsLoading || isSlugLoading) return false;

  // Bypass tier limits for exempt workspaces
  if (slug && billingBypassSlugs.includes(slug)) return false;

  return match({ tier, totalProjects })
    .with({ tier: undefined }, () => false)
    .with({ totalProjects: undefined }, () => false)
    .with(
      { tier: Tier.Free },
      ({ totalProjects }) => Number(totalProjects) >= FREE_TIER_MAX_PROJECTS,
    )
    .with(
      { tier: Tier.Basic },
      ({ totalProjects }) => Number(totalProjects) >= BASIC_TIER_MAX_PROJECTS,
    )
    .with({ tier: Tier.Team }, () => false)
    .exhaustive();
};

export default useMaxProjectsReached;
