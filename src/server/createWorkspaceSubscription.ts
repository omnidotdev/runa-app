import { createServerFn } from "@tanstack/react-start";
import * as z from "zod/v4";

import polar from "@/lib/polar/polar";
import { SandboxFree } from "@/lib/polar/productIds";

const createWorkspaceSubscriptionSchema = z.object({
  hidraId: z.guid(),
  userEmail: z.email(),
  workspaceId: z.guid(),
});

export const createWorkspaceSubscription = createServerFn({ method: "POST" })
  .inputValidator((data) => createWorkspaceSubscriptionSchema.parse(data))
  .handler(async ({ data }) => {
    const checkout = await polar.checkouts.create({
      products: [SandboxFree.Free],
      externalCustomerId: data.hidraId,
      metadata: {
        workspaceId: data.workspaceId,
      },
    });

    await polar.checkouts.clientConfirm({
      clientSecret: checkout.clientSecret,
      checkoutConfirmStripe: {
        // TODO: conditionalize
        productId: SandboxFree.Free,
        customerEmail: data.userEmail,
      },
    });
  });
