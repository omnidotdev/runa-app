import { Format } from "@ark-ui/react";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, notFound } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { useDebounceCallback } from "usehooks-ts";
import * as z from "zod/v4";

import DestructiveActionDialog from "@/components/core/DestructiveActionDialog";
import Link from "@/components/core/Link";
import RichTextEditor from "@/components/core/RichTextEditor";
import NotFound from "@/components/layout/NotFound";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  MenuContent,
  MenuItem,
  MenuItemGroup,
  MenuItemGroupLabel,
  MenuPositioner,
  MenuRoot,
  MenuTrigger,
} from "@/components/ui/menu";
import WorkspaceColumnsForm from "@/components/workspaces/settings/columns/WorkspaceColumnsForm";
import Projects from "@/components/workspaces/settings/Projects";
import Team from "@/components/workspaces/settings/Team";
import {
  Role,
  useDeleteWorkspaceMutation,
  useUpdateWorkspaceMutation,
} from "@/generated/graphql";
import { BASE_URL, STRIPE_PORTAL_CONFIG_ID } from "@/lib/config/env.config";
import getSdk from "@/lib/graphql/getSdk";
import useDialogStore, { DialogType } from "@/lib/hooks/store/useDialogStore";
import projectColumnsOptions from "@/lib/options/projectColumns.options";
import workspaceOptions from "@/lib/options/workspace.options";
import workspacesOptions from "@/lib/options/workspaces.options";
import { payments } from "@/lib/payments";
import firstLetterToUppercase from "@/lib/util/firstLetterToUppercase";
import generateSlug from "@/lib/util/generateSlug";
import seo from "@/lib/util/seo";
import { cn } from "@/lib/utils";
import { FREE_PRICE, getPrices } from "@/routes/_anon/pricing";
import { customerMiddleware } from "@/server/middleware";

import type Stripe from "stripe";

const subscriptionSchema = z.object({
  subscriptionId: z.string().startsWith("sub_").nullable(),
});

const manageSubscriptionSchema = z.object({
  subscriptionId: z.string().startsWith("sub_"),
  returnUrl: z.url(),
});

const createSubscriptionSchema = z.object({
  workspaceId: z.guid(),
  priceId: z.string().startsWith("price_"),
  successUrl: z.url(),
});

const getProduct = createServerFn()
  .inputValidator((data) => subscriptionSchema.parse(data))
  .handler(async ({ data }) => {
    if (!data.subscriptionId) return null;

    const subscription = await payments.subscriptions.retrieve(
      data.subscriptionId,
      {
        expand: ["items.data.price.product"],
      },
    );

    return subscription.items.data[0].price.product as Stripe.Product;
  });

const revokeSubscription = createServerFn({ method: "POST" })
  .inputValidator((data) => subscriptionSchema.parse(data))
  .middleware([customerMiddleware])
  .handler(async ({ data, context }) => {
    if (!context.customer) throw new Error("Unauthorized");

    const subscription = await payments.subscriptions.cancel(
      data.subscriptionId!,
    );

    return subscription.id;
  });

const getManageSubscriptionUrl = createServerFn({ method: "POST" })
  .inputValidator((data) => manageSubscriptionSchema.parse(data))
  .middleware([customerMiddleware])
  .handler(async ({ data, context }) => {
    if (!context.customer) throw new Error("Unauthorized");

    const portal = await payments.billingPortal.sessions.create({
      customer: context.customer.id,
      configuration: STRIPE_PORTAL_CONFIG_ID,
      flow_data: {
        type: "subscription_update",
        subscription_update: {
          subscription: data.subscriptionId,
        },
        after_completion: {
          type: "redirect",
          redirect: {
            return_url: data.returnUrl,
          },
        },
      },
      return_url: data.returnUrl,
    });

    return portal.url;
  });

const getCreateSubscriptionUrl = createServerFn({ method: "POST" })
  .inputValidator((data) => createSubscriptionSchema.parse(data))
  .middleware([customerMiddleware])
  .handler(async ({ data, context }) => {
    let customer = context.customer;

    if (!customer) {
      customer = await payments.customers.create({
        email: context.session.user.email!,
        name: context.session.user.name ?? undefined,
        metadata: {
          externalId: context.session.user.hidraId!,
        },
      });
    }

    const checkout = await payments.checkout.sessions.create({
      mode: "subscription",
      customer: customer.id,
      success_url: data.successUrl,
      line_items: [{ price: data.priceId, quantity: 1 }],
      subscription_data: {
        metadata: {
          workspaceId: data.workspaceId,
          // TODO: extract to app config
          omniProduct: "runa",
        },
      },
    });

    return checkout.url!;
  });

export const Route = createFileRoute(
  "/_auth/workspaces/$workspaceSlug/settings",
)({
  loader: async ({ context: { queryClient, workspaceBySlug } }) => {
    if (!workspaceBySlug) {
      throw notFound();
    }

    const [product, prices] = await Promise.all([
      getProduct({ data: { subscriptionId: workspaceBySlug.subscriptionId } }),
      getPrices(),
      queryClient.ensureQueryData(
        projectColumnsOptions({
          workspaceId: workspaceBySlug.rowId!,
        }),
      ),
    ]);

    return {
      name: workspaceBySlug.name,
      workspaceId: workspaceBySlug.rowId,
      product,
      prices,
    };
  },
  head: ({ loaderData, params }) => ({
    meta: loaderData
      ? [
          ...seo({
            title: `${loaderData.name} Settings`,
            description: `Settings for the ${loaderData.name} workspace.`,
            url: `${BASE_URL}/workspaces/${params.workspaceSlug}/settings`,
          }),
        ]
      : undefined,
  }),
  notFoundComponent: () => <NotFound>Workspace Not Found</NotFound>,
  component: SettingsPage,
});

function SettingsPage() {
  const { session } = Route.useRouteContext();
  const { workspaceId, product, prices } = Route.useLoaderData();
  const { workspaceSlug } = Route.useParams();
  const navigate = Route.useNavigate();

  const [nameError, setNameError] = useState<string | null>(null);

  const { data: workspace } = useSuspenseQuery({
    ...workspaceOptions({
      rowId: workspaceId,
      userId: session?.user?.rowId!,
    }),
    select: (data) => data?.workspace,
  });

  const { mutateAsync: manageSubscription } = useMutation({
    mutationFn: async () =>
      await getManageSubscriptionUrl({
        data: {
          subscriptionId: workspace?.subscriptionId,
          returnUrl: `${BASE_URL}/workspaces/${workspace?.slug}/settings`,
        },
      }),
    onSuccess: (url) => navigate({ href: url, reloadDocument: true }),
  });

  const { mutateAsync: createSubscription } = useMutation({
    mutationFn: async ({ priceId }: { priceId: string }) =>
      await getCreateSubscriptionUrl({
        data: {
          workspaceId: workspace?.rowId,
          priceId,
          successUrl: `${BASE_URL}/workspaces/${workspace?.slug}/settings`,
        },
      }),
    onSuccess: (url) => navigate({ href: url, reloadDocument: true }),
  });

  const isOwner = workspace?.workspaceUsers?.nodes?.[0]?.role === Role.Owner;

  const editNameSchema = z
    .object({
      name: z
        .string()
        .min(3, { error: "Name must be at least 3 characters." })
        .default(workspace?.name!),
      currentSlug: z.string().default(workspace?.slug!),
    })
    .check(async (ctx) => {
      const sdk = await getSdk();

      const updatedSlug = generateSlug(ctx.value.name);

      if (!updatedSlug?.length || updatedSlug === ctx.value.currentSlug)
        return z.NEVER;

      const { workspaceBySlug } = await sdk.WorkspaceBySlug({
        slug: workspaceSlug,
        projectSlug: updatedSlug,
      });

      if (workspaceBySlug?.projects.nodes.length) {
        ctx.issues.push({
          code: "custom",
          message: "Slug already exists.",
          input: ctx.value.name,
        });
      }
    });

  const { mutate: deleteWorkspace } = useDeleteWorkspaceMutation({
    meta: {
      invalidates: [
        workspacesOptions({ userId: session?.user.rowId! }).queryKey,
      ],
    },
    onMutate: () => navigate({ to: "/workspaces", replace: true }),
    onSettled: () => setIsDeleteWorkspaceOpen(false),
  });

  const { setIsOpen: setIsDeleteWorkspaceOpen } = useDialogStore({
    type: DialogType.DeleteWorkspace,
  });

  const { mutate: updateWorkspace } = useUpdateWorkspaceMutation({
    meta: {
      invalidates: [["all"]],
    },
    onSuccess: (_data, variables) => {
      if (variables.patch.slug) {
        navigate({
          to: "/workspaces/$workspaceSlug/settings",
          params: { workspaceSlug: variables.patch.slug },
          replace: true,
        });
      }
    },
  });

  const handleWorkspaceUpdate = useDebounceCallback(updateWorkspace, 300);

  return (
    <div className="no-scrollbar relative h-full overflow-auto py-8 lg:p-12">
      {/* Header */}
      <div className="mb-10 ml-2 flex items-center justify-between lg:ml-0">
        <div className="flex items-center gap-3">
          <Link
            to="/workspaces/$workspaceSlug/projects"
            params={{ workspaceSlug: workspaceSlug }}
            variant="ghost"
            size="icon"
            aria-label="Back to projects"
          >
            <ArrowLeft className="size-4" />
          </Link>
          <div className="flex flex-col gap-2">
            <RichTextEditor
              defaultContent={workspace?.name}
              className="min-h-0 border-0 bg-transparent p-0 text-2xl dark:bg-transparent"
              skeletonClassName="h-8 w-80"
              editable={isOwner}
              onUpdate={async ({ editor }) => {
                const text = editor.getText().trim();

                const result = await editNameSchema.safeParseAsync({
                  name: text,
                });

                if (!result.success) {
                  setNameError(result.error.issues[0].message);
                  return;
                }

                setNameError(null);
                handleWorkspaceUpdate({
                  rowId: workspaceId,
                  patch: {
                    name: text,
                    slug: generateSlug(text),
                  },
                });
              }}
            />

            {nameError && (
              <p className="mt-1 text-red-500 text-sm">{nameError}</p>
            )}
          </div>
          <Badge variant="subtle">
            <p className="first-letter:uppercase">{workspace?.tier}</p>
          </Badge>
        </div>
      </div>

      <div className="flex flex-col gap-12">
        <Team />

        <Projects />

        <WorkspaceColumnsForm />

        <div
          className={cn(
            "ml-2 hidden flex-col gap-8 lg:ml-0",
            isOwner && "flex",
          )}
        >
          <div className="flex flex-col gap-4">
            <h3 className="font-medium text-sm">Manage Subscription</h3>

            <div className="rounded-lg border border-border bg-card p-4">
              <h4 className="mb-3 font-medium text-muted-foreground text-sm">
                Current Workspace Benefits
              </h4>
              <ul className="space-y-2">
                {(
                  product?.marketing_features ??
                  FREE_PRICE.product.marketing_features
                ).map((feature) => (
                  <li key={feature.name} className="flex items-center gap-2">
                    <div className="size-1.5 flex-shrink-0 rounded-full bg-primary" />
                    <span className="text-sm leading-relaxed">
                      {feature.name}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {product ? (
              <Button className="w-fit" onClick={() => manageSubscription()}>
                Manage Subscription
              </Button>
            ) : (
              <MenuRoot
                onSelect={({ value }) => createSubscription({ priceId: value })}
              >
                <MenuTrigger asChild>
                  <Button className="w-fit">Upgrade Workspace</Button>
                </MenuTrigger>
                <MenuPositioner>
                  <MenuContent className="min-w-64">
                    {(["month", "year"] as const).map((interval) => (
                      <MenuItemGroup key={interval}>
                        <MenuItemGroupLabel>
                          {firstLetterToUppercase(interval)}ly
                        </MenuItemGroupLabel>
                        {prices
                          .filter(
                            (price) => price.recurring?.interval === interval,
                          )
                          .map((price) => (
                            <MenuItem key={price.id} value={price.id}>
                              <div className="flex w-full items-center justify-between">
                                {firstLetterToUppercase(price.metadata.tier!)}

                                <p>
                                  <Format.Number
                                    value={price.unit_amount! / 100}
                                    currency="USD"
                                    style="currency"
                                    notation="compact"
                                  />
                                  /{interval === "month" ? "mo" : "yr"}
                                </p>
                              </div>
                            </MenuItem>
                          ))}
                      </MenuItemGroup>
                    ))}
                  </MenuContent>
                </MenuPositioner>
              </MenuRoot>
            )}
          </div>
          <div className="flex flex-col gap-4">
            <h3 className="font-medium text-sm">Danger Zone</h3>

            <Button
              variant="destructive"
              className="w-fit text-background"
              onClick={() => setIsDeleteWorkspaceOpen(true)}
            >
              Delete Workspace
            </Button>
          </div>
        </div>

        <DestructiveActionDialog
          title="Danger Zone"
          description={
            <span>
              This will delete{" "}
              <strong className="font-medium text-base-900 dark:text-base-100">
                {workspace?.name}
              </strong>{" "}
              and all associated data. Any subscription associated with this
              workspace will be revoked. This action cannot be undone.
            </span>
          }
          onConfirm={async () => {
            if (workspace?.subscriptionId) {
              const revokedSubscriptionId = await revokeSubscription({
                data: { subscriptionId: workspace.subscriptionId },
              });

              if (!revokedSubscriptionId)
                throw new Error("Issue revoking subscription");
            }

            deleteWorkspace({ rowId: workspace?.rowId! });
            navigate({ to: "/workspaces", replace: true });
          }}
          dialogType={DialogType.DeleteWorkspace}
          confirmation={`Permanently delete ${workspace?.name}`}
        />
      </div>
    </div>
  );
}
