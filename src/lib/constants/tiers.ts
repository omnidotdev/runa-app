import type { Price } from "@/lib/providers/billing";

/**
 * Free tier placeholder price for display.
 * FALLBACK ONLY -- source of truth is Omni API plan_feature
 */
export const FREE_PRICE: Price = {
  id: "free",
  active: true,
  currency: "usd",
  unit_amount: 0,
  recurring: null,
  metadata: { tier: "free" },
  product: {
    id: "free-product",
    name: "Free",
    description: "Project management to get started",
    marketing_features: [
      { name: "Up to 5 projects" },
      { name: "1,500 tasks" },
      { name: "Up to 5 members" },
      { name: "1 GB file storage" },
    ],
  },
};
