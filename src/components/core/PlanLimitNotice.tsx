import { Link } from "@tanstack/react-router";

import { cn } from "@/lib/utils";

interface Props {
  /** Plan-limit message, e.g. "Your free plan allows 5 projects." */
  message: string;
  /** Call-to-action text for the upgrade link. */
  cta?: string;
  className?: string;
}

/**
 * Inline notice clarifying that something is a plan limit, with an upgrade
 * path to `/pricing`. The limits mirror the omni-api catalog SSOT and are
 * enforced server-side by runa-api; this is an in-context upsell affordance.
 */
const PlanLimitNotice = ({
  message,
  cta = "Upgrade for more",
  className,
}: Props) => (
  <p className={cn("px-1 text-base-500 text-xs", className)}>
    {message}{" "}
    <Link
      to="/pricing"
      className="text-primary underline-offset-2 hover:underline"
    >
      {cta}
    </Link>
  </p>
);

export default PlanLimitNotice;
