import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import app from "@/lib/config/app.config";
import billing from "@/lib/providers/billing";
import { authMiddleware } from "@/server/middleware";

const organizationSchema = z.object({
  organizationId: z.string().min(1),
});

const billingPortalSchema = z.object({
  organizationId: z.string().min(1),
  returnUrl: z.string().url(),
});

const createSubscriptionSchema = z.object({
  organizationId: z.string().min(1),
  priceId: z.string().startsWith("price_"),
  successUrl: z.string().url(),
});

const checkoutWithWorkspaceSchema = z
  .object({
    priceId: z.string().startsWith("price_"),
    successUrl: z.string().url(),
    cancelUrl: z.string().url(),
    // Either workspaceId or createWorkspace must be provided
    workspaceId: z.string().uuid().optional(),
    createWorkspace: z
      .object({
        name: z.string().min(1).max(100),
        slug: z.string().min(1).max(100).optional(),
      })
      .optional(),
  })
  .refine((data) => data.workspaceId || data.createWorkspace, {
    message: "Either workspaceId or createWorkspace is required",
  });

/**
 * Validate access token or throw.
 */
const requireAccessToken = (accessToken: string | undefined): string => {
  if (!accessToken) {
    throw new Error("Access token required");
  }
  return accessToken;
};

/**
 * Get subscription details for an organization.
 */
export const getSubscription = createServerFn()
  .middleware([authMiddleware])
  .inputValidator((data) => organizationSchema.parse(data))
  .handler(async ({ data, context }) => {
    return billing.getSubscription(
      "organization",
      data.organizationId,
      requireAccessToken(context.session.accessToken),
    );
  });

/**
 * Cancel a subscription for an organization.
 * @knipignore
 */
export const revokeSubscription = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .inputValidator((data) => organizationSchema.parse(data))
  .handler(async ({ data, context }) => {
    return billing.cancelSubscription(
      "organization",
      data.organizationId,
      requireAccessToken(context.session.accessToken),
    );
  });

/**
 * Get billing portal URL.
 */
export const getBillingPortalUrl = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .inputValidator((data) => billingPortalSchema.parse(data))
  .handler(async ({ data, context }) => {
    return billing.getBillingPortalUrl(
      "organization",
      data.organizationId,
      app.name.toLowerCase(),
      data.returnUrl,
      requireAccessToken(context.session.accessToken),
    );
  });

/**
 * Create a checkout session for a new subscription.
 */
export const getCreateSubscriptionUrl = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .inputValidator((data) => createSubscriptionSchema.parse(data))
  .handler(async ({ data, context }) => {
    return billing.createCheckoutSession({
      priceId: data.priceId,
      successUrl: data.successUrl,
      customerEmail: context.session.user.email!,
      customerName: context.session.user.name ?? undefined,
      metadata: {
        externalId: context.session.user.identityProviderId!,
        app_id: app.name.toLowerCase(),
        entity_type: "organization",
        entity_id: data.organizationId,
      },
    });
  });

/**
 * Renew a subscription (remove scheduled cancellation).
 */
export const renewSubscription = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .inputValidator((data) => organizationSchema.parse(data))
  .handler(async ({ data, context }) => {
    return billing.renewSubscription(
      "organization",
      data.organizationId,
      requireAccessToken(context.session.accessToken),
    );
  });

/**
 * Create a checkout session with workspace creation/selection.
 * Routes through Aether for orchestration.
 */
export const createCheckoutWithWorkspace = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .inputValidator((data) => checkoutWithWorkspaceSchema.parse(data))
  .handler(async ({ data, context }) => {
    return billing.createCheckoutWithWorkspace({
      appId: app.name.toLowerCase(),
      priceId: data.priceId,
      successUrl: data.successUrl,
      cancelUrl: data.cancelUrl,
      accessToken: requireAccessToken(context.session.accessToken),
      workspaceId: data.workspaceId,
      createWorkspace: data.createWorkspace,
    });
  });
