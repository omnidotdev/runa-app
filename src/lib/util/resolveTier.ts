import { Tier, getTierFromSubscription } from "@/lib/types/tier";
import getTierFromEntitlements from "@/lib/util/getTierFromEntitlements";

import type { EntitlementsResponse } from "@/lib/providers/billing";

interface ResolveTierArgs {
  subscription: unknown;
  entitlements?: EntitlementsResponse | null;
  prices?: {
    id: string;
    metadata?: { tier?: string };
    product?: { id: string };
  }[];
  subscriptionPriceId?: string;
}

/**
 * Resolve the effective tier for a workspace.
 *
 * Prefers the live subscription tier, then falls back to the entitlement tier
 * (e.g. a comped or manually granted plan with no Stripe subscription), then the
 * free tier. Deriving the tier solely from the subscription would render Free
 * for accounts that hold a paid entitlement without an active subscription.
 */
const resolveTier = ({
  subscription,
  entitlements,
  prices,
  subscriptionPriceId,
}: ResolveTierArgs): Tier => {
  if (subscription) {
    return getTierFromSubscription(subscription, prices, subscriptionPriceId);
  }

  return getTierFromEntitlements(entitlements) ?? Tier.Free;
};

export default resolveTier;
