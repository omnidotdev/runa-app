import { CustomerCancellationReason } from "@polar-sh/sdk/models/components/customercancellationreason.js";
import { useSuspenseQuery } from "@tanstack/react-query";
import {
  AlertTriangle,
  Building2,
  CheckSquare,
  CreditCard,
  FolderOpen,
  LogOut,
  Settings,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { match, P } from "ts-pattern";

import UpgradeSubscriptionDialog from "@/components/profile/UpgradeSubscriptionDialog";
import {
  AvatarFallback,
  AvatarImage,
  AvatarRoot,
} from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardRoot,
  CardTitle,
} from "@/components/ui/card";
import {
  DialogBackdrop,
  DialogCloseTrigger,
  DialogContent,
  DialogDescription,
  DialogPositioner,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  RadioGroupIndicator,
  RadioGroupItem,
  RadioGroupItemControl,
  RadioGroupItemHiddenInput,
  RadioGroupItemText,
  RadioGroupRoot,
} from "@/components/ui/radio-group";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  TabsContent,
  TabsList,
  TabsRoot,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  useCreateUserPreferenceMutation,
  useCreateWorkspaceUserMutation,
  useDeleteInvitationMutation,
} from "@/generated/graphql";
import { signOut } from "@/lib/auth/signOut";
import { API_BASE_URL, isDevEnv } from "@/lib/config/env.config";
import useDialogStore, { DialogType } from "@/lib/hooks/store/useDialogStore";
import useSubscriptionStore from "@/lib/hooks/store/useSubscriptionStore";
import invitationsOptions from "@/lib/options/invitations.options";
import usageMetricsOptions from "@/lib/options/usageMetrics.options";
import RUNA_PRODUCT_IDS, {
  SandboxFree,
  SandboxMonthly,
  SandboxYearly,
} from "@/lib/polar/productIds";
import firstLetterToUppercase from "@/lib/util/firstLetterToUppercase";
import { cn } from "@/lib/utils";
import { deleteUserData } from "@/server/deleteUserData";
import { fetchAuthenticatedCustomer } from "@/server/fetchAuthenticatedCustomer";
import { fetchCustomerState } from "@/server/fetchCustomerState";
import { fetchProduct } from "@/server/fetchProduct";
import { fetchRunaProducts } from "@/server/fetchRunaProducts";

import type { Product } from "@polar-sh/sdk/models/components/product.js";

export const Route = createFileRoute({
  loader: async ({ context: { queryClient, session } }) => {
    let currentProduct: Product | undefined;

    const [customer, payment, { products }] = await Promise.all([
      fetchCustomerState({
        data: session?.user.hidraId!,
      }),
      fetchAuthenticatedCustomer({ data: { hidraId: session?.user.hidraId! } }),
      fetchRunaProducts(),
      queryClient.ensureQueryData(
        usageMetricsOptions({ userId: session?.user.rowId! }),
      ),
    ]);

    if (
      // NB: with updated logic in polar to allow for multiple subscriptions (across Omni apps) we need to validate that the user indeed has a *Runa* specific subscription before redirecting
      // TODO: update Backfeed to include similar logic
      customer?.activeSubscriptions?.some((sub) =>
        RUNA_PRODUCT_IDS.includes(sub.productId),
      )
    ) {
      const productId = customer.activeSubscriptions.find((sub) =>
        RUNA_PRODUCT_IDS.includes(sub.productId),
      )?.productId;

      currentProduct = await fetchProduct({ data: productId! });
    }

    const upgradeProducts = currentProduct
      ? currentProduct.metadata?.title !== "team"
        ? products.filter((product) =>
            match(currentProduct.metadata.title)
              .with("free", () => product.metadata.title === "basic")
              .with("basic", () => product.metadata.title === "team")
              .otherwise(() => product.metadata.title === "free"),
          )
        : null
      : products.filter((product) => product.metadata.title === "free");

    return {
      customer,
      currentProduct,
      upgradeProducts,
      subscription: customer?.activeSubscriptions.find((sub) =>
        RUNA_PRODUCT_IDS.includes(sub.productId),
      ),
      paymentId: payment?.defaultPaymentMethodId,
    };
  },
  component: RouteComponent,
});

function RouteComponent() {
  const [reasonForLeaving, setReasonForLeaving] = useState<
    CustomerCancellationReason | undefined
  >(undefined);
  const [reasonForLeavingComment, setReasonForLeavingComment] =
    useState<string>("");

  const { customer, currentProduct, upgradeProducts, subscription, paymentId } =
    Route.useLoaderData();
  const { session } = Route.useRouteContext();
  const navigate = Route.useNavigate();

  // NB: used when monthly v yearly pricing does not matter
  const upgradeProductDetails = upgradeProducts?.[0];

  // TODO: update for prod when productIds are added
  const isTeamTier = match({ productId: currentProduct?.id, isDevEnv })
    .with(
      {
        productId: P.union(SandboxMonthly.Team, SandboxYearly.Team),
        isDevEnv: true,
      },
      () => true,
    )
    .otherwise(() => false);

  const { data: metrics } = useSuspenseQuery({
    ...usageMetricsOptions({ userId: session?.user.rowId! }),
    select: (data) => ({
      workspaces: data?.workspaces?.totalCount ?? 0,
      projects: data?.projects?.totalCount ?? 0,
      tasks: data?.tasks?.totalCount ?? 0,
    }),
  });

  const { data: invitations } = useSuspenseQuery({
    ...invitationsOptions({ email: session?.user.email! }),
    select: (data) => data?.invitations?.nodes ?? [],
  });

  const { mutateAsync: createUserPreferences } =
    useCreateUserPreferenceMutation();
  const { mutateAsync: deleteInvation } = useDeleteInvitationMutation({
    meta: {
      invalidates: [["all"]],
    },
  });
  const { mutateAsync: acceptInvitation } = useCreateWorkspaceUserMutation();

  const { setSubscriptionId, isProductUpdating } = useSubscriptionStore();
  const { setIsOpen: setIsUpgradeSubscriptionDialogOpen } = useDialogStore({
    type: DialogType.UpgradeSubscription,
  });

  const metricLimits = {
    workspaces: currentProduct?.benefits
      ?.find((b) => b.description.includes("workspace"))
      ?.description?.split(" ")[0],
    projects: currentProduct?.benefits
      ?.find((b) => b.description.includes("project"))
      ?.description?.split(" ")[0],
    tasks: currentProduct?.benefits
      ?.find((b) => b.description.includes("task"))
      ?.description?.split(" ")[0],
  };

  const upgradeLimits = {
    workspaces: upgradeProductDetails?.benefits
      ?.find((b) => b.description.includes("workspace"))
      ?.description?.split(" ")[0],
    projects: upgradeProductDetails?.benefits
      ?.find((b) => b.description.includes("project"))
      ?.description?.split(" ")[0],
    tasks: upgradeProductDetails?.benefits
      ?.find((b) => b.description.includes("task"))
      ?.description?.split(" ")[0],
  };

  const upgradeTier = match(currentProduct?.metadata?.title)
    .with("free", () => "Basic")
    .with("basic", () => "Team")
    .with("team", () => "Enterprise")
    .otherwise(() => "Free");

  return (
    <div className="no-scrollbar min-h-dvh overflow-y-auto bg-gradient-to-br from-background via-background to-muted/20 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-6 lg:gap-8 xl:grid-cols-12">
          <div className="xl:col-span-4">
            <div className="mb-8 flex flex-col items-center gap-6 rounded-2xl p-6">
              <div className="relative">
                <AvatarRoot className="size-28 ring-4 ring-primary/10">
                  <AvatarImage
                    src={session?.user.image ?? undefined}
                    alt={session?.user.username}
                  />
                  <AvatarFallback className="font-semibold text-2xl">
                    {session?.user.username?.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </AvatarRoot>
                <Button
                  variant="destructive"
                  className="absolute right-0 bottom-0 size-8 rounded-full border-2 border-background p-0 text-background has-[>svg]:px-0"
                  onClick={signOut}
                >
                  <LogOut className="size-4" />
                </Button>
              </div>
              <div className="text-center">
                <h2 className="font-bold text-xl tracking-tight">
                  {session?.user.name}
                </h2>
                <p className="mt-1 text-muted-foreground text-sm">
                  {session?.user.email}
                </p>

                {currentProduct && (
                  <Badge
                    variant="outline"
                    className="mt-3 px-3 py-1 font-medium"
                  >
                    {firstLetterToUppercase(
                      currentProduct.metadata.title as string,
                    )}{" "}
                    Plan
                  </Badge>
                )}
              </div>
            </div>

            <Card className="mb-6 border">
              <CardHeader className="px-0">
                <CardTitle className="font-semibold text-lg">
                  Usage Metrics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 p-0">
                {currentProduct && (
                  <>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex size-8 items-center justify-center rounded-lg bg-blue-500/10">
                            <Building2 className="size-4 text-blue-600" />
                          </div>
                          <span className="font-medium">Workspaces</span>
                        </div>
                        <span className="font-medium text-muted-foreground text-sm">
                          {metrics.workspaces}/
                          {Number.isInteger(Number(metricLimits.workspaces))
                            ? metricLimits.workspaces
                            : "∞"}
                        </span>
                      </div>
                      <div className="h-2.5 w-full overflow-hidden rounded-full bg-muted/50">
                        <div
                          className="h-full rounded-full border border-blue-400/30 bg-blue-600"
                          style={{
                            width: Number.isInteger(
                              Number(metricLimits.workspaces),
                            )
                              ? `${
                                  (metrics.workspaces /
                                    Number(metricLimits.workspaces)) *
                                  100
                                }%`
                              : "100%",
                          }}
                        />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex size-8 items-center justify-center rounded-lg bg-green-500/10">
                            <FolderOpen className="size-4 text-green-600" />
                          </div>
                          <span className="font-medium">Projects</span>
                        </div>
                        <span className="font-medium text-muted-foreground text-sm">
                          {metrics.projects}/
                          {Number.isInteger(Number(metricLimits.projects))
                            ? metricLimits.projects
                            : "∞"}
                        </span>
                      </div>
                      <div className="h-2.5 w-full overflow-hidden rounded-full bg-muted/50">
                        <div
                          className="h-full rounded-full border border-green-400/30 bg-green-600"
                          style={{
                            width: Number.isInteger(
                              Number(metricLimits.projects),
                            )
                              ? `${
                                  (metrics.projects /
                                    Number(metricLimits.projects)) *
                                  100
                                }%`
                              : "100%",
                          }}
                        />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex size-8 items-center justify-center rounded-lg bg-purple-500/10">
                            <CheckSquare className="size-4 text-purple-600" />
                          </div>
                          <span className="font-medium">Tasks</span>
                        </div>
                        <span className="font-medium text-muted-foreground text-sm">
                          {metrics.tasks}/
                          {Number.isInteger(Number(metricLimits.tasks))
                            ? metricLimits.tasks
                            : "∞"}
                        </span>
                      </div>
                      <div className="h-2.5 w-full overflow-hidden rounded-full bg-muted/50">
                        <div
                          className="h-full rounded-full border border-purple-400/30 bg-purple-600"
                          style={{
                            width: Number.isInteger(Number(metricLimits.tasks))
                              ? `${
                                  (metrics.tasks / Number(metricLimits.tasks)) *
                                  100
                                }%`
                              : "100%",
                          }}
                        />
                      </div>
                    </div>
                  </>
                )}

                <div
                  className={cn(
                    "rounded-xl border border-primary/20 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 p-6",
                    currentProduct && "mt-8",
                    isTeamTier &&
                      "border-gray-800/20 bg-gradient-to-r from-gray-800/5 via-gray-800/10 to-gray-800/5",
                  )}
                >
                  <div className="text-center">
                    <h4 className="mb-2 font-bold text-base">
                      {upgradeTier === "Free"
                        ? "Get Started for Free"
                        : `Upgrade to ${upgradeTier} Tier`}
                    </h4>
                    {isTeamTier ? (
                      <p className="mb-4 text-muted-foreground text-sm leading-relaxed">
                        Currently under development
                      </p>
                    ) : (
                      <p className="mb-4 text-muted-foreground text-sm leading-relaxed">
                        Get {upgradeLimits.workspaces?.toLowerCase()}{" "}
                        workspaces, {upgradeLimits.projects?.toLowerCase()}{" "}
                        projects, and {upgradeLimits.tasks?.toLowerCase()} tasks
                      </p>
                    )}
                    {customer ? (
                      <Button
                        size="sm"
                        className={cn(
                          "w-full font-medium duration-200 hover:border-primary/40 hover:transition-colors",
                          isTeamTier && "border bg-muted text-muted-foreground",
                        )}
                        disabled={
                          isProductUpdating ||
                          isTeamTier ||
                          (currentProduct && !paymentId)
                        }
                        onClick={() => {
                          if (currentProduct) {
                            setSubscriptionId(subscription?.id ?? null);
                            setIsUpgradeSubscriptionDialogOpen(true);
                          } else {
                            navigate({
                              href: `${API_BASE_URL}/checkout?products=${SandboxFree.Free}&customerExternalId=${session?.user?.hidraId}&customerEmail=${session?.user?.email}`,
                              reloadDocument: true,
                            });
                          }
                        }}
                      >
                        <Zap className="mr-2 size-3" />
                        {isProductUpdating
                          ? "Upgrading..."
                          : upgradeTier === "Free"
                            ? "Get Started"
                            : isTeamTier
                              ? "Coming Soon"
                              : "Upgrade Now"}
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        className="w-full font-medium duration-200 hover:border-primary/40 hover:transition-colors"
                        onClick={() =>
                          navigate({
                            href: `${API_BASE_URL}/checkout?products=${SandboxFree.Free}&customerExternalId=${session?.user?.hidraId}&customerEmail=${session?.user?.email}`,
                            reloadDocument: true,
                          })
                        }
                      >
                        <Zap className="mr-2 size-3" />
                        Get Started
                      </Button>
                    )}

                    {/* TODO: determine best way to go about managing customer portal to only showcase Runa products */}
                    {currentProduct && !paymentId && (
                      <p className="mt-2 text-xs">
                        Please add a payment method to upgrade. This can be done
                        through the Settings tab of your{" "}
                        <span>
                          <a
                            href={`${API_BASE_URL}/portal?customerId=${customer?.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary underline"
                          >
                            customer portal
                          </a>
                        </span>
                        .
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="xl:col-span-8">
            <TabsRoot defaultValue="account">
              <TabsList>
                <TabsTrigger value="account">Account</TabsTrigger>
                <TabsTrigger value="customization" disabled>
                  Customization
                </TabsTrigger>
              </TabsList>
              <TabsContent value="account">
                <div className="mt-4 space-y-8">
                  {currentProduct ? (
                    <>
                      <h3 className="mb-6 font-bold text-2xl tracking-tight">
                        {firstLetterToUppercase(
                          currentProduct.metadata.title as string,
                        )}{" "}
                        Plan Benefits
                      </h3>
                      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                        {/* TODO: clean this up with better list of dynamic benefits. Shouldn't need to reiterate the limit benefits because they are described in the usage metrics, show other benefits from current subscription */}
                        {currentProduct.benefits.map((benefit) => (
                          <CardRoot key={benefit.id}>
                            <CardContent className="flex flex-col items-center justify-between pt-6 text-center">
                              {benefit.description.includes("workspace") && (
                                <Building2 className="mb-4 text-3xl text-primary" />
                              )}
                              {benefit.description.includes("project") && (
                                <FolderOpen className="mb-4 text-3xl text-primary" />
                              )}
                              {benefit.description.includes("task") && (
                                <CheckSquare className="mb-4 text-3xl text-primary" />
                              )}
                              <h4 className="mb-3 font-semibold text-lg">
                                {benefit.description}
                              </h4>
                            </CardContent>
                          </CardRoot>
                        ))}
                      </div>
                      {/* TODO: determine best way to go about managing customer portal to only showcase Runa products */}
                      <Button variant="outline" asChild>
                        <a
                          href={`${API_BASE_URL}/portal?customerId=${customer?.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <CreditCard className="size-4" />
                          Customer Portal
                        </a>
                      </Button>
                    </>
                  ) : (
                    <div className="flex min-h-48 w-full flex-col items-center justify-center gap-6 rounded-xl border-2 border-gray-200 border-dashed bg-primary-300/5 p-8 dark:border-gray-700 dark:bg-primary-800/5">
                      <div className="flex flex-col items-center gap-3 text-center">
                        <div className="flex size-12 items-center justify-center rounded-full bg-primary/10 dark:bg-primary/20">
                          <CreditCard className="size-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 text-lg/6 dark:text-gray-100">
                            No Active Subscription
                          </h3>
                          <p className="text-gray-600 text-sm/5 dark:text-gray-400">
                            Get started with a subscription to unlock features
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        onClick={() =>
                          navigate({
                            href: `${API_BASE_URL}/checkout?${RUNA_PRODUCT_IDS.map((id) => `products=${id}`).join("&")}&customerExternalId=${session?.user?.hidraId}&customerEmail=${session?.user?.email}`,
                            reloadDocument: true,
                          })
                        }
                      >
                        <CreditCard className="size-4" />
                        Subscribe
                      </Button>
                    </div>
                  )}

                  {!!invitations.length && (
                    <div className="space-y-4">
                      <h2 className="font-bold text-lg">
                        Workspace Invitations
                      </h2>
                      <Table containerProps="rounded-md border">
                        <TableHeader>
                          <TableRow className="bg-muted hover:bg-muted">
                            <TableHead className="pl-3 font-semibold">
                              Workspace
                            </TableHead>
                            <TableHead className="font-semibold">
                              Members
                            </TableHead>
                            <TableHead className="pr-3 text-right font-semibold">
                              Actions
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {invitations.map((invitation) => (
                            <TableRow
                              key={invitation.rowId}
                              className="hover:bg-background"
                            >
                              <TableCell className="py-4 pl-3">
                                <div className="flex items-center gap-3">
                                  <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10">
                                    <Building2 className="size-4 text-primary" />
                                  </div>
                                  <span className="font-medium">
                                    {invitation.workspace?.name}
                                  </span>
                                </div>
                              </TableCell>
                              <TableCell className="py-4 pl-1">
                                <span className="text-muted-foreground text-sm">
                                  {invitation.workspace?.workspaceUsers
                                    .totalCount ?? 0}{" "}
                                  member
                                  {invitation.workspace?.workspaceUsers
                                    .totalCount === 1
                                    ? ""
                                    : "s"}
                                </span>
                              </TableCell>
                              <TableCell className="py-4 pr-3 text-right">
                                <div className="flex justify-end gap-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="hover:border-green-200 hover:bg-green-50 hover:text-green-700 dark:hover:border-green-800 dark:hover:bg-green-950 dark:hover:text-green-300"
                                    onClick={async () => {
                                      await Promise.all([
                                        acceptInvitation({
                                          input: {
                                            workspaceUser: {
                                              userId: session?.user.rowId!,
                                              workspaceId:
                                                invitation.workspace?.rowId!,
                                            },
                                          },
                                        }),
                                        invitation.workspace?.projects.nodes.map(
                                          (project) =>
                                            createUserPreferences({
                                              input: {
                                                userPreference: {
                                                  userId: session?.user.rowId!,
                                                  projectId: project.rowId,
                                                },
                                              },
                                            }),
                                        ),
                                      ]);

                                      await deleteInvation({
                                        rowId: invitation.rowId,
                                      });
                                    }}
                                  >
                                    Accept
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="hover:border-red-200 hover:bg-red-50 hover:text-red-700 dark:hover:border-red-800 dark:hover:bg-red-950 dark:hover:text-red-300"
                                    onClick={async () =>
                                      await deleteInvation({
                                        rowId: invitation.rowId,
                                      })
                                    }
                                  >
                                    Reject
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}

                  <div className="mt-8 rounded-xl border border-destructive/20 bg-destructive/5 p-6">
                    <div className="flex flex-col gap-4">
                      <h3 className="font-bold text-destructive text-xl">
                        Danger Zone
                      </h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        Permanently delete all of your associated data
                      </p>
                    </div>

                    <DialogRoot>
                      <DialogTrigger asChild>
                        <Button
                          variant="destructive"
                          className="mt-4 text-background"
                          disabled={!subscription}
                        >
                          Delete Account
                        </Button>
                      </DialogTrigger>
                      <DialogBackdrop />
                      <DialogPositioner>
                        <DialogContent className="w-full max-w-md rounded-lg bg-background">
                          <DialogCloseTrigger />

                          <div className="mb-1 flex flex-col gap-4">
                            <div className="flex size-10 items-center justify-center rounded-full border border-destructive bg-destructive/10">
                              <AlertTriangle className="size-5 text-destructive" />
                            </div>
                            <DialogTitle>Are you absolutely sure?</DialogTitle>
                            <DialogDescription>
                              This will permanently cancel your subscription and
                              delete all associated data. This action cannot be
                              undone. If you are sure, please provide a reason
                              for leaving.
                            </DialogDescription>
                          </div>

                          <RadioGroupRoot
                            value={reasonForLeaving}
                            onValueChange={({ value }) =>
                              setReasonForLeaving(
                                value as CustomerCancellationReason,
                              )
                            }
                          >
                            <RadioGroupIndicator />
                            {Object.values(CustomerCancellationReason).map(
                              (reason) => (
                                <RadioGroupItem key={reason} value={reason}>
                                  <RadioGroupItemControl
                                    className="ring-destructive data-[state=checked]:bg-destructive"
                                    tabIndex={0}
                                  />
                                  <RadioGroupItemText>
                                    {reason
                                      .split("_")
                                      .filter(Boolean)
                                      .map((word) =>
                                        firstLetterToUppercase(word),
                                      )
                                      .join(" ")}
                                  </RadioGroupItemText>
                                  <RadioGroupItemHiddenInput />
                                </RadioGroupItem>
                              ),
                            )}
                          </RadioGroupRoot>

                          {reasonForLeaving ===
                            CustomerCancellationReason.Other && (
                            <textarea
                              className="rounded-md border p-1.5 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-destructive focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                              placeholder="Reason for leaving..."
                              value={reasonForLeavingComment}
                              onChange={(e) =>
                                e.target.value.length
                                  ? setReasonForLeavingComment(e.target.value)
                                  : setReasonForLeavingComment("")
                              }
                            />
                          )}

                          <div className="mt-4 flex justify-end gap-2">
                            <DialogCloseTrigger asChild>
                              <Button variant="outline">Cancel</Button>
                            </DialogCloseTrigger>

                            <DialogCloseTrigger asChild>
                              <Button
                                type="submit"
                                variant="destructive"
                                disabled={
                                  !subscription ||
                                  (reasonForLeaving ===
                                    CustomerCancellationReason.Other &&
                                    !reasonForLeavingComment)
                                }
                                onClick={async () => {
                                  if (!subscription) return;

                                  await deleteUserData({
                                    data: {
                                      hidraId: session?.user.hidraId!,
                                      subscriptionId: subscription.id,
                                      cancellationReason: reasonForLeaving,
                                      cancellationComment:
                                        reasonForLeaving ===
                                        CustomerCancellationReason.Other
                                          ? reasonForLeavingComment
                                          : undefined,
                                    },
                                  });
                                  await signOut();
                                }}
                              >
                                Delete Account
                              </Button>
                            </DialogCloseTrigger>
                          </div>
                        </DialogContent>
                      </DialogPositioner>
                    </DialogRoot>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="customization">
                <Card className="mt-4 border">
                  <CardHeader className="px-6 pt-6">
                    <CardTitle className="flex items-center gap-3">
                      <div className="flex size-8 items-center justify-center rounded-lg bg-muted">
                        <Settings className="size-4" />
                      </div>
                      Customization Settings
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="px-6 pb-6">
                    <div className="p-8 text-center">
                      <div className="mx-auto mb-6 flex size-16 items-center justify-center rounded-full bg-muted/50">
                        <Settings className="size-8 text-muted-foreground" />
                      </div>
                      <h3 className="mb-3 font-bold text-xl">Coming Soon</h3>
                      <p className="mx-auto max-w-md text-muted-foreground text-sm leading-relaxed">
                        Customization options will be available in a future
                        update. You'll be able to personalize your workspace,
                        themes, and preferences.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </TabsRoot>
          </div>
        </div>
      </div>

      {upgradeProducts && (
        <UpgradeSubscriptionDialog products={upgradeProducts} />
      )}
    </div>
  );
}
