import { Tier } from "@/lib/types/tier";

import type { EntitlementsResponse } from "@/lib/providers/billing";

/**
 * Derive the plan tier from an Aether entitlements response.
 *
 * The granted tier is stored as the `tier` feature entitlement with a
 * JSONB-quoted value (e.g. `"pro"`). This covers comped or manually granted
 * plans that have no Stripe subscription. Returns null when no recognized tier
 * entitlement is present.
 */
const getTierFromEntitlements = (
  entitlements: EntitlementsResponse | null | undefined,
): Tier | null => {
  const raw = entitlements?.entitlements?.find(
    (entitlement) => entitlement.featureKey === "tier",
  )?.value;

  if (!raw) return null;

  // Strip JSONB quoting (e.g. `"pro"` to `pro`)
  const stripped = String(raw).replace(/^"|"$/g, "").toLowerCase();

  return Object.values(Tier).find((tier) => tier === stripped) ?? null;
};

export default getTierFromEntitlements;
