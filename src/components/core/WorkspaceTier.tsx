import { match } from "ts-pattern";

import { Badge, badgeVariants } from "@/components/ui/badge";
import { Tier } from "@/generated/graphql";
import capitalizeFirstLetter from "@/lib/util/capitalizeFirstLetter";
import { cn } from "@/lib/utils";

import type { ComponentProps } from "react";

interface Props extends ComponentProps<typeof Badge> {
  /** Payment tier. */
  tier: Tier;
}

/**
 * Workspace tier indicator.
 */
const WorkspaceTier = ({ tier, className, variant, ...rest }: Props) => {
  const tierStyles = match(tier)
    .with(
      Tier.Free,
      () =>
        "bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300",
    )
    .with(
      Tier.Basic,
      () => "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
    )
    .with(
      Tier.Team,
      () =>
        "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
    )
    .with(
      Tier.Enterprise,
      () =>
        "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
    )
    .exhaustive();

  return (
    <Badge
      className={cn(badgeVariants({ variant }), tierStyles, className)}
      {...rest}
    >
      {capitalizeFirstLetter(tier!)}
    </Badge>
  );
};

export default WorkspaceTier;
