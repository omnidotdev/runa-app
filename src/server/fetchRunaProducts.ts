import { createServerFn } from "@tanstack/react-start";

import polar from "@/lib/polar/polar";
import RUNA_PRODUCT_IDS from "@/lib/polar/productIds";

export const fetchRunaProducts = createServerFn().handler(async () => {
  const {
    result: { items: products },
  } = await polar.products.list({
    id: RUNA_PRODUCT_IDS,
    sorting: ["price_amount"],
  });

  return { products };
});
