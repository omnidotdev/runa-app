import { useQuery } from "@tanstack/react-query";

import pricesOptions from "@/lib/options/prices.options";
import subscriptionOptions from "@/lib/options/subscription.options";
import { Tier, getTierFromSubscription } from "@/lib/types/tier";

/**
 * Resolve the active subscription tier for a workspace.
 *
 * Centralizes the subscription + prices fetch and `getTierFromSubscription`
 * derivation used across limit gating. Falls back to the free tier until the
 * subscription resolves (or when no `organizationId` is available).
 */
const useTier = (organizationId?: string): Tier => {
  const { data: subscription } = useQuery({
    ...subscriptionOptions(organizationId!),
    enabled: !!organizationId,
  });
  const { data: prices } = useQuery({ ...pricesOptions() });

  if (!organizationId) return Tier.Free;

  return getTierFromSubscription(subscription, prices, subscription?.priceId);
};

export default useTier;
