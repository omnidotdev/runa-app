import { createServerFn } from "@tanstack/react-start";

import { payments } from "@/lib/payments";

import type Stripe from "stripe";

// NB: we expand the product details in the server function below. This interface narrows the type for `product` on that return
export interface ExpandedProductPrice extends Stripe.Price {
  product: Stripe.Product;
}

export const getPrices = createServerFn().handler(async () => {
  const prices = await payments.prices.search({
    query: "metadata['app']:'runa'",
    expand: ["data.product"],
  });

  return prices.data.sort(
    (a, b) => a.unit_amount! - b.unit_amount!,
  ) as ExpandedProductPrice[];
});
