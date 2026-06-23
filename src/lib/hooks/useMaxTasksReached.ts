import { useQuery } from "@tanstack/react-query";

import { hasBilling } from "@/lib/config/env.config";
import useTier from "@/lib/hooks/useTier";
import projectsOptions from "@/lib/options/projects.options";
import { getMaxTasks } from "@/lib/types/tier";

/**
 * Whether a workspace has reached its plan's task limit.
 *
 * The task limit is workspace-wide (summed across every project), so the count
 * is derived from the workspace project list rather than a single project. The
 * server (runa-api) is authoritative and rejects mutations that exceed the
 * limit; this hook drives the in-app upgrade affordances (disabled create
 * buttons, tooltips). The limit mirrors the omni-api catalog SSOT via
 * `getMaxTasks`. Gating is a no-op when billing is not configured.
 */
const useMaxTasksReached = (organizationId?: string): boolean => {
  const tier = useTier(organizationId);

  const { data: taskCount } = useQuery({
    ...projectsOptions({ organizationId: organizationId! }),
    enabled: !!organizationId,
    select: (data) =>
      (data?.projects?.nodes ?? []).reduce(
        (total, project) => total + (project.allTasks.totalCount ?? 0),
        0,
      ),
  });

  if (!hasBilling || !organizationId) return false;

  const maxTasks = getMaxTasks(tier);
  if (!Number.isFinite(maxTasks)) return false;

  return (taskCount ?? 0) >= maxTasks;
};

export default useMaxTasksReached;
