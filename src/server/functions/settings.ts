import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import getSdk from "@/lib/graphql/getSdk";
import { authMiddleware } from "@/server/middleware";

const provisionSettingsSchema = z.object({
  organizationId: z.string().min(1),
});

/**
 * Provision settings for an organization.
 * Settings are auto-provisioned on first access to a workspace.
 * This is called when a user visits an org that doesn't have settings yet.
 */
export const provisionSettings = createServerFn({ method: "POST" })
  .inputValidator((data) => provisionSettingsSchema.parse(data))
  .middleware([authMiddleware])
  .handler(async ({ data }) => {
    const sdk = await getSdk();

    const result = await sdk.CreateSetting({
      input: {
        setting: {
          organizationId: data.organizationId,
          viewMode: "board",
        },
      },
    });

    return result.createSetting?.setting ?? null;
  });
