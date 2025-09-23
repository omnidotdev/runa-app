import { CustomerCancellationReason } from "@polar-sh/sdk/models/components/customercancellationreason.js";
import { createServerFn } from "@tanstack/react-start";
import * as z from "zod/v4";

import getSdk from "@/lib/graphql/getSdk";
import polar from "@/lib/polar/polar";

const deleteUserDataSchema = z.object({
  rowId: z.guid(),
  subscriptionId: z.guid(),
  cancellationReason: z.enum(CustomerCancellationReason).optional(),
  cancellationComment: z.string().optional(),
});

type DeleteUserData = z.infer<typeof deleteUserDataSchema>;

export const deleteUserData = createServerFn({
  method: "POST",
})
  .inputValidator((data: DeleteUserData) => deleteUserDataSchema.parse(data))
  .handler(async ({ data }) => {
    const sdk = await getSdk();

    if (!sdk) {
      throw new Error("Failed to create SDK");
    }

    const [result] = await Promise.all([
      polar.subscriptions.update({
        id: data.subscriptionId,
        subscriptionUpdate: {
          revoke: true,
          customerCancellationReason: data.cancellationReason,
          customerCancellationComment: data.cancellationComment,
        },
      }),
      sdk.DeleteUser({ id: data.rowId }),
    ]);

    return result;
  });
