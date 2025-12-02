import { createMiddleware } from "@tanstack/react-start";

import fetchSession from "@/lib/auth/fetchSession";
import { payments } from "@/lib/payments";

export const authMiddleware = createMiddleware().server(async ({ next }) => {
  const { session } = await fetchSession();

  if (!session) throw new Error("Unauthorized");

  return next({ context: { session } });
});

export const customerMiddleware = createMiddleware()
  .middleware([authMiddleware])
  .server(async ({ next, context }) => {
    const { data: customers } = await payments.customers.search({
      query: `metadata["externalId"]:"${context.session.user.hidraId!}"`,
    });

    return next({
      context: { customer: customers.length ? customers[0] : null },
    });
  });
