import { createServerFn } from "@tanstack/react-start";

import polar from "@/lib/polar/polar";

export const fetchProduct = createServerFn()
  .validator((productId: string) => productId)
  .handler(async ({ data: productId }) => {
    return await polar.products.get({
      id: productId,
    });
  });
