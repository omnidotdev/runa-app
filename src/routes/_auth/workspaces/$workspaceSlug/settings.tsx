import { Format } from "@ark-ui/react";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, notFound, useRouter } from "@tanstack/react-router";
import { format } from "date-fns";
import { AlertTriangleIcon, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { useDebounceCallback } from "usehooks-ts";
import { z } from "zod";

import {
  DestructiveActionDialog,
  Link,
  RichTextEditor,
} from "@/components/core";
import { NotFound } from "@/components/layout";
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
import { Projects, Team, WorkspaceColumnsForm } from "@/components/workspaces";
import {
  Role,
  useDeleteWorkspaceMutation,
  useUpdateWorkspaceMutation,
} from "@/generated/graphql";
import { BASE_URL } from "@/lib/config/env.config";
import getSdk from "@/lib/graphql/getSdk";
import useDialogStore, { DialogType } from "@/lib/hooks/store/useDialogStore";
import projectColumnsOptions from "@/lib/options/projectColumns.options";
import workspaceOptions from "@/lib/options/workspace.options";
import workspacesOptions from "@/lib/options/workspaces.options";
import createMetaTags from "@/lib/util/createMetaTags";
import firstLetterToUppercase from "@/lib/util/firstLetterToUppercase";
import generateSlug from "@/lib/util/generateSlug";
import { cn } from "@/lib/utils";
import { FREE_PRICE } from "@/routes/_public/pricing";
import { getPrices } from "@/server/functions/prices";
import {
  getCancelSubscriptionUrl,
  getCreateSubscriptionUrl,
  getManageSubscriptionUrl,
  getSubscription,
  renewSubscription,
  revokeSubscription,
} from "@/server/functions/subscriptions";

export const Route = createFileRoute(
  "/_auth/workspaces/$workspaceSlug/settings",
)({
  loader: async ({ context: { queryClient, workspaceBySlug } }) => {
    if (!workspaceBySlug) {
      throw notFound();
    }

    const [subscription, prices] = await Promise.all([
      getSubscription({
        data: { subscriptionId: workspaceBySlug.subscriptionId },
      }),
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
      subscription,
      prices,
    };
  },
  head: ({ loaderData, params }) => ({
    meta: loaderData
      ? [
          ...createMetaTags({
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
  const { workspaceId, subscription, prices } = Route.useLoaderData();
  const { workspaceSlug } = Route.useParams();
  const router = useRouter();
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

  const { mutateAsync: cancelSubscription } = useMutation({
    mutationFn: async () =>
      await getCancelSubscriptionUrl({
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

  const { mutateAsync: handleRenewSubscription } = useMutation({
    mutationFn: async () =>
      await renewSubscription({
        data: { subscriptionId: workspace?.subscriptionId },
      }),
    onSuccess: () => router.invalidate(),
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
          <Badge className="bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300">
            {firstLetterToUppercase(workspace?.tier!)}
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

            {!!subscription?.cancelAt && (
              <div className="flex items-center gap-1 text-sm text-yellow-600 dark:text-yellow-400">
                <AlertTriangleIcon className="size-4" />
                The current subscription is set to be canceled on{" "}
                {format(new Date(subscription.cancelAt * 1000), "MMM d, yyyy")}.
                To avoid losing the current workspace benefits, renew your
                subscription prior to this date.
              </div>
            )}

            <div className="rounded-lg border border-border bg-card p-4">
              <h4 className="mb-3 font-medium text-muted-foreground text-sm">
                Current Workspace Benefits
              </h4>
              <ul className="space-y-2">
                {(
                  subscription?.product?.marketing_features ??
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

            {subscription ? (
              <div className="flex gap-2">
                {subscription.cancelAt ? (
                  <Button onClick={() => handleRenewSubscription()}>
                    Renew Subscription
                  </Button>
                ) : (
                  <Button
                    className="w-fit"
                    onClick={() => manageSubscription()}
                  >
                    Manage Subscription
                  </Button>
                )}

                <Button
                  variant="outline"
                  onClick={() => cancelSubscription()}
                  disabled={!!subscription.cancelAt}
                >
                  Cancel Subscription
                </Button>
              </div>
            ) : (
              <MenuRoot
                onSelect={({ value }) => createSubscription({ priceId: value })}
              >
                <MenuTrigger asChild>
                  <Button className="w-fit">Upgrade Workspace</Button>
                </MenuTrigger>
                <MenuPositioner>
                  <MenuContent className="min-w-64">
                    {(["basic", "team"] as const).map((tier) => (
                      <MenuItemGroup key={tier}>
                        <MenuItemGroupLabel className="text-muted-foreground">
                          {firstLetterToUppercase(tier)}
                        </MenuItemGroupLabel>
                        {prices
                          .filter((price) => price.metadata.tier === tier)
                          .map((price) => (
                            <MenuItem key={price.id} value={price.id}>
                              <div className="flex w-full items-center justify-between">
                                {firstLetterToUppercase(
                                  price.recurring?.interval!,
                                )}
                                ly
                                <p>
                                  <Format.Number
                                    value={price.unit_amount! / 100}
                                    currency="USD"
                                    style="currency"
                                    notation="compact"
                                  />
                                  /
                                  {price.recurring?.interval === "month"
                                    ? "mo"
                                    : "yr"}
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
          confirmation={`permanently delete ${workspace?.name}`}
        />
      </div>
    </div>
  );
}
