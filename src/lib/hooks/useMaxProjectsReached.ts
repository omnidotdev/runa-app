import { useQuery } from "@tanstack/react-query";

import { hasBilling } from "@/lib/config/env.config";
import useTier from "@/lib/hooks/useTier";
import projectColumnsOptions from "@/lib/options/projectColumns.options";
import { getMaxProjects } from "@/lib/types/tier";

/**
 * Whether a workspace has reached its plan's project limit.
 *
 * The server (runa-api) is authoritative and rejects mutations that exceed the
 * limit; this hook drives the in-app upgrade affordances (disabled create
 * buttons, tooltips) so the limit is communicated before the request. The
 * limit mirrors the omni-api catalog SSOT via `getMaxProjects`. Gating is a
 * no-op when billing is not configured (e.g. self-hosted).
 */
const useMaxProjectsReached = (organizationId?: string): boolean => {
  const tier = useTier(organizationId);

  const { data: projectCount } = useQuery({
    ...projectColumnsOptions({ organizationId: organizationId! }),
    enabled: !!organizationId,
    select: (data) =>
      (data?.projectColumns?.nodes ?? []).reduce(
        (total, column) => total + (column.projects.totalCount ?? 0),
        0,
      ),
  });

  if (!hasBilling || !organizationId) return false;

  const maxProjects = getMaxProjects(tier);
  if (!Number.isFinite(maxProjects)) return false;

  return (projectCount ?? 0) >= maxProjects;
};

export default useMaxProjectsReached;
