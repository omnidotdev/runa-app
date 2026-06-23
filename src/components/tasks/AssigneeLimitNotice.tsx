import { Link } from "@tanstack/react-router";

import type { Tier } from "@/lib/types/tier";

interface Props {
  tier: Tier;
  maxAssignees: number;
}

/**
 * Inline notice clarifying that assignees-per-task is a plan limit, with an
 * upgrade path. Hidden on unlimited tiers. The limit mirrors the omni-api
 * catalog SSOT and is enforced server-side by runa-api.
 */
const AssigneeLimitNotice = ({ tier, maxAssignees }: Props) => {
  if (!Number.isFinite(maxAssignees)) return null;

  return (
    <p className="px-1 text-base-500 text-xs">
      Your {tier} plan allows {maxAssignees} assignee
      {maxAssignees === 1 ? "" : "s"} per task.{" "}
      <Link
        to="/pricing"
        className="text-primary underline-offset-2 hover:underline"
      >
        Upgrade for more
      </Link>
    </p>
  );
};

export default AssigneeLimitNotice;
