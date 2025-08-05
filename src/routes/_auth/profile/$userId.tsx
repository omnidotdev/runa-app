import { useSuspenseQuery } from "@tanstack/react-query";
import {
  Building2,
  CheckSquare,
  CreditCard,
  FolderOpen,
  HelpCircle,
  LogOut,
  Mail,
  Settings,
  User,
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { signOut } from "@/lib/auth/signOut";
import { API_BASE_URL, BASE_URL } from "@/lib/config/env.config";
import useDialogStore, { DialogType } from "@/lib/hooks/store/useDialogStore";
import useSubscriptionStore from "@/lib/hooks/store/useSubscriptionStore";
import usageMetricsOptions from "@/lib/options/usageMetrics.options";
import RUNA_PRODUCT_IDS, {
  SandboxFree,
  SandboxMonthly,
  SandboxYearly,
} from "@/lib/polar/productIds";
import firstLetterToUppercase from "@/lib/util/firstLetterToUppercase";
import getEnumKeyByValue from "@/lib/util/getEnumKeyByValue";
import { fetchAuthenticatedCustomer } from "@/server/fetchAuthenticatedCustomer";
import { fetchCustomerState } from "@/server/fetchCustomerState";
import { fetchProduct } from "@/server/fetchProduct";

import type { Product } from "@polar-sh/sdk/models/components/product.js";
import type { Tier } from "@/lib/polar/productIds";

export const Route = createFileRoute({
  loader: async ({ context: { queryClient, session } }) => {
    let currentProduct: Product | undefined;

    const [customer, payment] = await Promise.all([
      fetchCustomerState({
        data: session?.user.hidraId!,
      }),
      fetchAuthenticatedCustomer({ data: { hidraId: session?.user.hidraId! } }),
      queryClient.ensureQueryData(
        usageMetricsOptions({ userId: session?.user.rowId! }),
      ),
    ]);

    if (
      // NB: with updated logic in polar to allow for multiple subscriptions (across Omni apps) we need to validate that the user indeed has a *Runa* specific subscription before redirecting
      // TODO: update Backfeed to include similar logic
      customer?.activeSubscriptions?.some((sub) =>
        (RUNA_PRODUCT_IDS as string[]).includes(sub.productId),
      )
    ) {
      const productId = customer.activeSubscriptions.find((sub) =>
        RUNA_PRODUCT_IDS!.includes(sub.productId),
      )?.productId;

      currentProduct = await fetchProduct({ data: productId! });
    }

    return {
      customer,
      currentProduct,
      subscription: customer?.activeSubscriptions.find((sub) =>
        RUNA_PRODUCT_IDS!.includes(sub.productId),
      ),
      paymentId: payment?.defaultPaymentMethodId,
    };
  },
  component: RouteComponent,
});

// Mock usage metrics
const mockMetrics = {
  workspaces: { current: 3, limit: 5 },
  projects: { current: 12, limit: 15 },
  tasks: { current: 87, limit: 100 },
};

// Pro tier limits
const proLimits = {
  workspaces: 25,
  projects: 100,
  tasks: 1000,
};

// Mock plan features
const planFeatures = {
  Free: [
    {
      title: "5 Projects",
      description: "Create up to 5 projects",
      icon: "📁",
    },
    {
      title: "Basic Support",
      description: "Email support within 48h",
      icon: "💬",
    },
  ],
  Basic: [
    {
      title: "15 Projects",
      description: "Create up to 15 projects",
      icon: "📁",
    },
    {
      title: "Basic Support",
      description: "Email support within 48h",
      icon: "💬",
    },
  ],
  Pro: [
    {
      title: "Unlimited Projects",
      description: "Create unlimited projects",
      icon: "📁",
    },
    {
      title: "Advanced Analytics",
      description: "Detailed project insights",
      icon: "📊",
    },
    {
      title: "Team Collaboration",
      description: "Invite up to 10 team members",
      icon: "👥",
    },
  ],
  Enterprise: [
    {
      title: "Unlimited Everything",
      description: "No limits on projects or users",
      icon: "♾️",
    },
    {
      title: "24/7 Support",
      description: "Phone, email & chat support",
      icon: "📞",
    },
    {
      title: "Custom Analytics",
      description: "Custom reports and insights",
      icon: "📊",
    },
    {
      title: "Advanced Security",
      description: "SSO, audit logs, compliance",
      icon: "🔒",
    },
  ],
};

// TODO: revamp logic to handle monthly v yearly
const nextAvailableTier = (currentTier: Tier) =>
  match(currentTier)
    .with(SandboxFree.Free, () => SandboxMonthly.Basic)
    .with(
      P.union(SandboxMonthly.Basic, SandboxYearly.Basic),
      () => SandboxMonthly.Team,
    )
    .otherwise(() => null);

function RouteComponent() {
  const { customer, currentProduct, subscription, paymentId } =
    Route.useLoaderData();
  const { session } = Route.useRouteContext();

  const { data: metrics } = useSuspenseQuery({
    ...usageMetricsOptions({ userId: session?.user.rowId! }),
    select: (data) => ({
      workspaces: data?.workspaces?.totalCount ?? 0,
      projects: data?.projects?.totalCount ?? 0,
      tasks: data?.tasks?.totalCount ?? 0,
    }),
  });

  const [activeTab, setActiveTab] = useState<
    "account" | "customization" | "contact"
  >("account");

  const { setProductId, setSubscriptionId, isProductUpdating } =
    useSubscriptionStore();
  const { setIsOpen: setIsUpgradeSubscriptionDialogOpen } = useDialogStore({
    type: DialogType.UpgradeSubscription,
  });

  return (
    <div className="no-scrollbar min-h-dvh overflow-y-auto bg-gradient-to-br from-background via-background to-muted/20 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-6 lg:gap-8 xl:grid-cols-12">
          {/* Left Sidebar */}
          <div className="xl:col-span-4">
            {/* User Profile Section */}
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

            {/* Usage Metrics Section */}
            <Card className="mb-6 border">
              <CardHeader className="px-0">
                <CardTitle className="font-semibold text-lg">
                  Usage Metrics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 p-0">
                {/* Workspaces Metric */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex size-8 items-center justify-center rounded-lg bg-blue-500/10">
                        <Building2 className="size-4 text-blue-600" />
                      </div>
                      <span className="font-medium">Workspaces</span>
                    </div>
                    <span className="font-medium text-muted-foreground text-sm">
                      {metrics.workspaces}/{mockMetrics.workspaces.limit}
                    </span>
                  </div>
                  <div className="h-2.5 w-full overflow-hidden rounded-full bg-muted/50">
                    <div
                      className="h-full rounded-full border border-blue-400/30 bg-blue-600"
                      style={{
                        width: `${(metrics.workspaces / mockMetrics.workspaces.limit) * 100}%`,
                      }}
                    />
                  </div>
                </div>

                {/* Projects Metric */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex size-8 items-center justify-center rounded-lg bg-green-500/10">
                        <FolderOpen className="size-4 text-green-600" />
                      </div>
                      <span className="font-medium">Projects</span>
                    </div>
                    <span className="font-medium text-muted-foreground text-sm">
                      {metrics.projects}/{mockMetrics.projects.limit}
                    </span>
                  </div>
                  <div className="h-2.5 w-full overflow-hidden rounded-full bg-muted/50">
                    <div
                      className="h-full rounded-full border border-green-400/30 bg-green-600"
                      style={{
                        width: `${(metrics.projects / mockMetrics.projects.limit) * 100}%`,
                      }}
                    />
                  </div>
                </div>

                {/* Tasks Metric */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex size-8 items-center justify-center rounded-lg bg-purple-500/10">
                        <CheckSquare className="size-4 text-purple-600" />
                      </div>
                      <span className="font-medium">Tasks</span>
                    </div>
                    <span className="font-medium text-muted-foreground text-sm">
                      {metrics.tasks}/{mockMetrics.tasks.limit}
                    </span>
                  </div>
                  <div className="h-2.5 w-full overflow-hidden rounded-full bg-muted/50">
                    <div
                      className="h-full rounded-full border border-purple-400/30 bg-purple-600"
                      style={{
                        width: `${(metrics.tasks / mockMetrics.tasks.limit) * 100}%`,
                      }}
                    />
                  </div>
                </div>

                {/* Upgrade CTA */}
                <div className="mt-8 rounded-xl border border-primary/20 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 p-6">
                  <div className="text-center">
                    <h4 className="mb-2 font-bold text-base">
                      Upgrade to{" "}
                      {getEnumKeyByValue(
                        // TODO: make dynamic
                        SandboxMonthly,
                        nextAvailableTier(currentProduct?.id as Tier),
                      )}
                    </h4>
                    <p className="mb-4 text-muted-foreground text-sm leading-relaxed">
                      Get {proLimits.workspaces} workspaces,{" "}
                      {proLimits.projects} projects, and {proLimits.tasks} tasks
                    </p>
                    {/* TODO: better UI/UX when user doesn't have a default payment method on file */}
                    <Button
                      size="sm"
                      className="w-full border border-primary/20 font-medium transition-all duration-200 hover:border-primary/40"
                      disabled={isProductUpdating || !paymentId}
                      onClick={() => {
                        setProductId(
                          nextAvailableTier(currentProduct?.id as Tier),
                        );
                        setSubscriptionId(subscription?.id ?? null);
                        setIsUpgradeSubscriptionDialogOpen(true);
                      }}
                    >
                      <Zap className="mr-2 size-3" />
                      {isProductUpdating ? "Upgrading..." : "Upgrade Now"}
                    </Button>

                    {!paymentId && (
                      <p className="mt-2 text-xs">
                        Please add a payment method to upgrade.
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Content Area */}
          <div className="xl:col-span-8">
            {/* Tabs */}
            <div className="mb-8 rounded-xl bg-muted p-1">
              <nav className="flex gap-1">
                <Button
                  onClick={() => setActiveTab("account")}
                  variant={activeTab === "account" ? "solid" : "ghost"}
                >
                  <User className="size-4" />
                  Account
                </Button>
                <Button
                  onClick={() => setActiveTab("customization")}
                  variant={activeTab === "customization" ? "solid" : "ghost"}
                >
                  <Settings className="size-4" />
                  Customization
                </Button>
                <Button
                  onClick={() => setActiveTab("contact")}
                  variant={activeTab === "contact" ? "solid" : "ghost"}
                >
                  <HelpCircle className="size-4" />
                  Contact Us
                </Button>
              </nav>
            </div>

            {/* Tab Content */}
            {activeTab === "account" && (
              <div className="space-y-8">
                {/* Plan Benefits */}
                {currentProduct && (
                  <div>
                    <h3 className="mb-6 font-bold text-2xl tracking-tight">
                      {firstLetterToUppercase(
                        currentProduct.metadata.title as string,
                      )}{" "}
                      Plan Benefits
                    </h3>
                    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                      {planFeatures[
                        firstLetterToUppercase(
                          currentProduct.metadata.title as string,
                        ) as "Free" | "Basic" | "Pro" | "Enterprise"
                      ].map((feature) => (
                        <Card key={feature.title} className="border">
                          <CardContent className="p-6">
                            <div className="text-center">
                              <div className="mb-4 text-3xl">
                                {feature.icon}
                              </div>
                              <h4 className="mb-3 font-semibold text-lg">
                                {feature.title}
                              </h4>
                              <p className="text-muted-foreground text-sm leading-relaxed">
                                {feature.description}
                              </p>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col gap-4 sm:flex-row">
                  <Button variant="outline" asChild>
                    <a
                      href={
                        customer && currentProduct
                          ? `${API_BASE_URL}/portal?customerId=${customer.id}`
                          : `${BASE_URL}/pricing`
                      }
                      target={customer && currentProduct ? "_blank" : undefined}
                      rel={
                        customer && currentProduct
                          ? "noopener noreferrer"
                          : undefined
                      }
                    >
                      <CreditCard className="size-4" />
                      {currentProduct ? "Manage Subscription" : "Subscribe"}
                    </a>
                  </Button>
                </div>

                <div className="mt-16 rounded-xl border border-destructive/20 bg-destructive/5 p-6">
                  <div className="flex flex-col gap-4">
                    <h3 className="font-bold text-destructive text-xl">
                      Danger Zone
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      Permanently delete all of your associated data
                    </p>
                  </div>

                  <Button
                    variant="destructive"
                    className="mt-4 text-background"
                  >
                    Delete Account
                  </Button>
                </div>
              </div>
            )}

            {activeTab === "customization" && (
              <Card className="border">
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
            )}

            {activeTab === "contact" && (
              <Card className="border">
                <CardHeader className="px-6 pt-6">
                  <CardTitle className="flex items-center gap-3">
                    <div className="flex size-8 items-center justify-center rounded-lg bg-muted">
                      <Mail className="size-4" />
                    </div>
                    Contact Us
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-6 pb-6">
                  <form className="space-y-6">
                    <div className="grid gap-6 sm:grid-cols-2">
                      <div className="space-y-2">
                        <label
                          htmlFor="firstName"
                          className="block font-medium text-sm"
                        >
                          First Name
                        </label>
                        <Input
                          id="firstName"
                          placeholder="Enter your first name"
                          defaultValue="John"
                          className="transition-all duration-200 focus:border-primary/60"
                        />
                      </div>
                      <div className="space-y-2">
                        <label
                          htmlFor="lastName"
                          className="block font-medium text-sm"
                        >
                          Last Name
                        </label>
                        <Input
                          id="lastName"
                          placeholder="Enter your last name"
                          defaultValue="Doe"
                          className="transition-all duration-200 focus:border-primary/60"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label
                        htmlFor="email"
                        className="block font-medium text-sm"
                      >
                        Email
                      </label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        defaultValue={session?.user.email ?? undefined}
                        className="transition-all duration-200 focus:border-primary/60"
                      />
                    </div>
                    <div className="space-y-2">
                      <label
                        htmlFor="subject"
                        className="block font-medium text-sm"
                      >
                        Subject
                      </label>
                      <Input
                        id="subject"
                        placeholder="How can we help you?"
                        className="transition-all duration-200 focus:border-primary/60"
                      />
                    </div>
                    <div className="space-y-2">
                      <label
                        htmlFor="message"
                        className="block font-medium text-sm"
                      >
                        Message
                      </label>
                      <textarea
                        id="message"
                        rows={6}
                        className="flex w-full rounded-md border bg-transparent px-3 py-2 text-sm transition-all duration-200 placeholder:text-muted-foreground focus:border-primary/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="Describe your question or issue in detail..."
                      />
                    </div>
                    <Button type="submit">Send Message</Button>
                  </form>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      <UpgradeSubscriptionDialog />
    </div>
  );
}
