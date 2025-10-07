import { createServerFn } from "@tanstack/react-start";
import * as z from "zod/v4";

import polar from "@/lib/polar/polar";

const subscriptionSchema = z.object({
  id: z.guid(),
});

export const getSubscription = createServerFn()
  .inputValidator((data) => subscriptionSchema.parse(data))
  .handler(async ({ data }) => {
    return await polar.subscriptions.get({
      id: data.id,
    });
  });
