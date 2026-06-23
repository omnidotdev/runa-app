/**
 * Subscription tier levels.
 * Note: This is defined locally since tier is now determined by subscription status,
 * not stored in the database schema.
 */
export enum Tier {
  Free = "free",
  Pro = "pro",
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
    return (sub.product.metadata.tier as Tier) ?? Tier.Pro;
  }

  // Fallback: find the price and get tier from its metadata
  if (prices && subscriptionPriceId) {
    const price = prices.find((p) => p.id === subscriptionPriceId);
    if (price?.metadata?.tier) {
      return (price.metadata.tier as Tier) ?? Tier.Pro;
    }
  }

  // Default to pro if subscription exists but tier can't be determined
  return Tier.Pro;
}

/**
 * Per-tier operational limits for runa.
 *
 * Mirrors the omni-api catalog SSOT (planConfigs.ts `runa` `operationalLimits`)
 * and the server-side enforcement in runa-api. A value of -1 in the catalog
 * means unlimited and is represented here as `Number.POSITIVE_INFINITY`. Team
 * and Enterprise share the Team caps. Keep in sync with the catalog: edit
 * planConfigs.ts first, then propagate here.
 */
interface TierLimits {
  maxProjects: number;
  maxTasks: number;
  maxColumns: number;
  maxLabels: number;
  maxAssignees: number;
  maxMembers: number;
  maxAdmins: number;
  maxAttachmentBytes: number;
  maxStorageBytes: number;
}

const TIER_LIMITS: Record<Tier.Free | Tier.Pro | Tier.Team, TierLimits> = {
  [Tier.Free]: {
    maxProjects: 5,
    maxTasks: 1500,
    maxColumns: 10,
    maxLabels: 25,
    maxAssignees: 2,
    maxMembers: 5,
    maxAdmins: 1,
    maxAttachmentBytes: 26_214_400,
    maxStorageBytes: 1_073_741_824,
  },
  [Tier.Pro]: {
    maxProjects: 50,
    maxTasks: 25_000,
    maxColumns: 50,
    maxLabels: 100,
    maxAssignees: 5,
    maxMembers: 25,
    maxAdmins: Number.POSITIVE_INFINITY,
    maxAttachmentBytes: 104_857_600,
    maxStorageBytes: 53_687_091_200,
  },
  [Tier.Team]: {
    maxProjects: Number.POSITIVE_INFINITY,
    maxTasks: Number.POSITIVE_INFINITY,
    maxColumns: Number.POSITIVE_INFINITY,
    maxLabels: Number.POSITIVE_INFINITY,
    maxAssignees: Number.POSITIVE_INFINITY,
    maxMembers: Number.POSITIVE_INFINITY,
    maxAdmins: Number.POSITIVE_INFINITY,
    maxAttachmentBytes: 262_144_000,
    maxStorageBytes: Number.POSITIVE_INFINITY,
  },
};

/** Resolve the limit set for a tier (Enterprise inherits Team). */
const limitsForTier = (tier: Tier): TierLimits =>
  tier === Tier.Enterprise ? TIER_LIMITS[Tier.Team] : TIER_LIMITS[tier];

/** Maximum assignees allowed per task for a tier. */
export function getMaxAssignees(tier: Tier): number {
  return limitsForTier(tier).maxAssignees;
}

/** Maximum projects allowed per workspace for a tier. */
export function getMaxProjects(tier: Tier): number {
  return limitsForTier(tier).maxProjects;
}

/** Maximum tasks allowed per workspace for a tier. */
export function getMaxTasks(tier: Tier): number {
  return limitsForTier(tier).maxTasks;
}

/** Maximum columns allowed per project for a tier. */
export function getMaxColumns(tier: Tier): number {
  return limitsForTier(tier).maxColumns;
}

/** Maximum labels allowed per project for a tier. */
export function getMaxLabels(tier: Tier): number {
  return limitsForTier(tier).maxLabels;
}

/** Maximum members allowed per workspace for a tier. */
export function getMaxMembers(tier: Tier): number {
  return limitsForTier(tier).maxMembers;
}

/** Maximum admins allowed per workspace for a tier. */
export function getMaxAdmins(tier: Tier): number {
  return limitsForTier(tier).maxAdmins;
}

/** Maximum size in bytes for a single attachment for a tier. */
export function getMaxAttachmentBytes(tier: Tier): number {
  return limitsForTier(tier).maxAttachmentBytes;
}
