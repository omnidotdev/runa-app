import { createServerFn } from "@tanstack/react-start";
import * as z from "zod/v4";

import { isDevEnv } from "@/lib/config/env.config";
import polar from "@/lib/polar/polar";
import { ProductionFree, SandboxFree } from "@/lib/polar/productIds";

const createWorkspaceSubscriptionSchema = z.object({
  hidraId: z.guid(),
  userEmail: z.email(),
  workspaceId: z.guid(),
});

export const createWorkspaceSubscription = createServerFn({ method: "POST" })
  .inputValidator((data) => createWorkspaceSubscriptionSchema.parse(data))
  .handler(async ({ data }) => {
    const checkout = await polar.checkouts.create({
      products: isDevEnv ? [SandboxFree.Free] : [ProductionFree.Free],
      externalCustomerId: data.hidraId,
      metadata: {
        workspaceId: data.workspaceId,
      },
    });

    await polar.checkouts.clientConfirm({
      clientSecret: checkout.clientSecret,
      checkoutConfirmStripe: {
        productId: isDevEnv ? SandboxFree.Free : ProductionFree.Free,
        customerEmail: data.userEmail,
      },
    });
  });
