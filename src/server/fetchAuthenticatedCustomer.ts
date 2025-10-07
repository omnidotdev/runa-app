import { createServerFn } from "@tanstack/react-start";
import * as z from "zod/v4";

import polar from "@/lib/polar/polar";

const customerSchema = z.object({
  hidraId: z.guid(),
});

type AuthenticatedCustomer = z.infer<typeof customerSchema>;

export const fetchAuthenticatedCustomer = createServerFn({
  method: "POST",
})
  .inputValidator((data: AuthenticatedCustomer) => customerSchema.parse(data))
  .handler(async ({ data }) => {
    try {
      const session = await polar.customerSessions.create({
        externalCustomerId: data.hidraId,
      });

      const result = await polar.customerPortal.customers.get({
        customerSession: session.token,
      });

      return result;
    } catch {
      return null;
    }
  });
