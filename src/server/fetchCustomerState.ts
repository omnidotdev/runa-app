import { createServerFn } from "@tanstack/react-start";

import polar from "@/lib/polar/polar";

export const fetchCustomerState = createServerFn()
  .inputValidator((hidraId: string) => hidraId)
  .handler(async ({ data: hidraId }) => {
    try {
      const customer = await polar.customers.getStateExternal({
        externalId: hidraId,
      });

      return customer;
    } catch {
      return null;
    }
  });
