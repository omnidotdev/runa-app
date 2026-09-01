import { useQuery } from "@tanstack/react-query";

import entitlementsOptions from "@/lib/options/entitlements.options";
import pricesOptions from "@/lib/options/prices.options";
import subscriptionOptions from "@/lib/options/subscription.options";
import { Tier } from "@/lib/types/tier";
import resolveTier from "@/lib/util/resolveTier";

/**
 * Resolve the active subscription tier for a workspace.
 *
 * Centralizes the subscription + entitlements + prices fetch and the
 * `resolveTier` derivation used across limit gating. Prefers the live
 * subscription tier, then falls back to the granted entitlement tier (comped or
 * manually granted plans with no Stripe subscription), then the free tier (until
 * data resolves, or when no `organizationId` is available).
 */
const useTier = (organizationId?: string): Tier => {
  const { data: subscription } = useQuery({
    ...subscriptionOptions(organizationId!),
    enabled: !!organizationId,
  });
  const { data: entitlements } = useQuery({
    ...entitlementsOptions(organizationId!),
    enabled: !!organizationId,
  });
  const { data: prices } = useQuery({ ...pricesOptions() });

  if (!organizationId) return Tier.Free;

  return resolveTier({
    subscription,
    entitlements,
    prices,
    subscriptionPriceId: subscription?.priceId,
  });
};

export default useTier;
