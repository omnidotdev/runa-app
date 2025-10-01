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
  .inputValidator((data: UpgradeSubscription) =>
    upgradeSubscriptionSchema.parse(data),
  )
  .handler(async ({ data }) => {
    const result = await polar.subscriptions.update({
      id: data.subscriptionId,
      subscriptionUpdate: {
        productId: data.productId,
      },
    });

    return result;
  });
