import { describe, expect, it } from "bun:test";

import { Tier } from "@/lib/types/tier";
import getTierFromEntitlements from "@/lib/util/getTierFromEntitlements";
import resolveTier from "@/lib/util/resolveTier";

import type { EntitlementsResponse } from "@/lib/providers/billing";

/** Build a minimal entitlements response with an optional `tier` feature. */
const entitlementsWithTier = (
  tierValue: string | null,
): EntitlementsResponse => ({
  billingAccountId: "acct_1",
  entityType: "organization",
  entityId: "org_1",
  entitlementVersion: 1,
  entitlements:
    tierValue === null
      ? []
      : [
          {
            id: "ent_1",
            productId: "prod_1",
            featureKey: "tier",
            value: tierValue,
            source: "manual",
            validFrom: "2026-01-01T00:00:00Z",
            validUntil: null,
          },
        ],
});

describe("getTierFromEntitlements", () => {
  it("returns null for null/undefined entitlements", () => {
    expect(getTierFromEntitlements(null)).toBeNull();
    expect(getTierFromEntitlements(undefined)).toBeNull();
  });

  it("returns null when no tier entitlement is present", () => {
    expect(getTierFromEntitlements(entitlementsWithTier(null))).toBeNull();
  });

  it("strips JSONB quoting from the tier value", () => {
    expect(getTierFromEntitlements(entitlementsWithTier('"pro"'))).toBe(
      Tier.Pro,
    );
  });

  it("resolves an unquoted tier value", () => {
    expect(getTierFromEntitlements(entitlementsWithTier("team"))).toBe(
      Tier.Team,
    );
  });

  it("is case insensitive", () => {
    expect(getTierFromEntitlements(entitlementsWithTier('"Pro"'))).toBe(
      Tier.Pro,
    );
  });

  it("returns null for an unrecognized tier value", () => {
    expect(
      getTierFromEntitlements(entitlementsWithTier('"legacy"')),
    ).toBeNull();
  });
});

describe("resolveTier", () => {
  const prices = [
    { id: "price_pro", metadata: { tier: "pro" }, product: { id: "prod_pro" } },
    {
      id: "price_team",
      metadata: { tier: "team" },
      product: { id: "prod_team" },
    },
  ];

  it("prefers the live subscription tier over the entitlement tier", () => {
    const subscription = { product: { metadata: { tier: "team" } } };
    expect(
      resolveTier({
        subscription,
        entitlements: entitlementsWithTier('"pro"'),
        prices,
      }),
    ).toBe(Tier.Team);
  });

  it("falls back to the entitlement tier when there is no subscription", () => {
    expect(
      resolveTier({
        subscription: null,
        entitlements: entitlementsWithTier('"pro"'),
        prices,
      }),
    ).toBe(Tier.Pro);
  });

  it("returns Free when there is neither a subscription nor an entitlement tier", () => {
    expect(
      resolveTier({ subscription: null, entitlements: null, prices }),
    ).toBe(Tier.Free);
  });

  it("returns Free for an entitlement tier of free with no subscription", () => {
    expect(
      resolveTier({
        subscription: null,
        entitlements: entitlementsWithTier('"free"'),
        prices,
      }),
    ).toBe(Tier.Free);
  });

  it("derives the subscription tier from the price when product metadata is absent", () => {
    expect(
      resolveTier({
        subscription: { product: null },
        entitlements: null,
        prices,
        subscriptionPriceId: "price_team",
      }),
    ).toBe(Tier.Team);
  });
});
