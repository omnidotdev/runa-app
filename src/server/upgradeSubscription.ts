import { createServerFn } from "@tanstack/react-start";
import * as z from "zod/v4";

import polar from "@/lib/polar/polar";

const upgradeSubscriptionSchema = z.object({
  hidraId: z.guid(),
  subscriptionId: z.guid(),
  productId: z.guid(),
});

type UpgradeSubscription = z.infer<typeof upgradeSubscriptionSchema>;

export const upgradeSubscription = createServerFn({
  method: "POST",
})
  .validator((data: UpgradeSubscription) =>
    upgradeSubscriptionSchema.parse(data),
  )
  .handler(async ({ data }) => {
    const session = await polar.customerSessions.create({
      externalCustomerId: data.hidraId,
    });

    const result = await polar.customerPortal.subscriptions.update(
      { customerSession: session.token },
      {
        id: data.subscriptionId,
        customerSubscriptionUpdate: {
          productId: data.productId,
        },
      },
    );

    return result;
  });
