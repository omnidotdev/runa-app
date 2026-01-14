/**
 * Subscription tier levels.
 * Note: This is defined locally since tier is now determined by subscription status,
 * not stored in the database schema.
 */
export enum Tier {
  Free = "free",
  Basic = "basic",
  Team = "team",
  Enterprise = "enterprise",
}

/**
 * Derive tier from subscription data.
 * If no subscription exists, the workspace is on the free tier.
 */
export function getTierFromSubscription(
  subscription: unknown,
  prices?: {
    id: string;
    metadata?: { tier?: string };
    product?: { id: string };
  }[],
  subscriptionPriceId?: string,
): Tier {
  if (!subscription) {
    return Tier.Free;
  }

  // Try to get tier from subscription's product metadata
  const sub = subscription as {
    product?: { metadata?: { tier?: string } } | null;
  };
  if (sub.product?.metadata?.tier) {
    return (sub.product.metadata.tier as Tier) ?? Tier.Basic;
  }

  // Fallback: find the price and get tier from its metadata
  if (prices && subscriptionPriceId) {
    const price = prices.find((p) => p.id === subscriptionPriceId);
    if (price?.metadata?.tier) {
      return (price.metadata.tier as Tier) ?? Tier.Basic;
    }
  }

  // Default to basic if subscription exists but tier can't be determined
  return Tier.Basic;
}
