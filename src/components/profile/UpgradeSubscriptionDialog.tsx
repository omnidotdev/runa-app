import { Format } from "@ark-ui/react";
import { useRouteContext, useRouter } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { CheckIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  DialogBackdrop,
  DialogCloseTrigger,
  DialogContent,
  DialogDescription,
  DialogPositioner,
  DialogRoot,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  RadioGroupItem,
  RadioGroupItemControl,
  RadioGroupItemHiddenInput,
  RadioGroupItemText,
  RadioGroupRoot,
} from "@/components/ui/radio-group";
import {
  TabsContent,
  TabsList,
  TabsRoot,
  TabsTrigger,
} from "@/components/ui/tabs";
import useDialogStore, { DialogType } from "@/lib/hooks/store/useDialogStore";
import useSubscriptionStore from "@/lib/hooks/store/useSubscriptionStore";
import { upgradeSubscription } from "@/server/upgradeSubscription";

import type { Product } from "@polar-sh/sdk/models/components/product.js";
import type { ProductPriceFixed } from "@polar-sh/sdk/models/components/productpricefixed.js";
import type { Subscription } from "@polar-sh/sdk/models/components/subscription.js";

interface Props {
  subscription: Subscription;
  products: Product[];
}

const UpgradeSubscriptionDialog = ({ subscription, products }: Props) => {
  const handleUpgradeSubscription = useServerFn(upgradeSubscription);

  const { session } = useRouteContext({
    from: "/_auth",
  });

  const [selectedTier, setSelectedTier] = useState<
    "Free" | "Basic" | "Team" | null
  >(null);
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">(
    "monthly",
  );
  const [productId, setProductId] = useState<string | null>(null);

  const router = useRouter();

  const { isOpen, setIsOpen } = useDialogStore({
    type: DialogType.UpgradeSubscription,
  });

  const { isProductUpdating, setIsProductUpdating } = useSubscriptionStore();

  // Group products by tier
  const productsByTier = products.reduce(
    (acc, product) => {
      if (product.name.toLowerCase().includes("free")) {
        acc.Free = product;
      } else if (product.name.toLowerCase().includes("basic")) {
        if (product.recurringInterval === "month") {
          acc.BasicMonthly = product;
        } else {
          acc.BasicYearly = product;
        }
      } else if (product.name.toLowerCase().includes("team")) {
        if (product.recurringInterval === "month") {
          acc.TeamMonthly = product;
        } else {
          acc.TeamYearly = product;
        }
      }
      return acc;
    },
    {} as {
      Free?: Product;
      BasicMonthly?: Product;
      BasicYearly?: Product;
      TeamMonthly?: Product;
      TeamYearly?: Product;
    },
  );

  // Check which tier and billing cycle the current subscription matches
  const getCurrentTierAndCycle = () => {
    const currentProductId = subscription.product.id;

    if (productsByTier.Free?.id === currentProductId) {
      return { tier: "Free" as const, cycle: null };
    }
    if (productsByTier.BasicMonthly?.id === currentProductId) {
      return { tier: "Basic" as const, cycle: "monthly" as const };
    }
    if (productsByTier.BasicYearly?.id === currentProductId) {
      return { tier: "Basic" as const, cycle: "yearly" as const };
    }
    if (productsByTier.TeamMonthly?.id === currentProductId) {
      return { tier: "Team" as const, cycle: "monthly" as const };
    }
    if (productsByTier.TeamYearly?.id === currentProductId) {
      return { tier: "Team" as const, cycle: "yearly" as const };
    }
    return { tier: null, cycle: null };
  };

  const currentSubscription = getCurrentTierAndCycle();

  // Update productId when tier or billing cycle changes
  const updateProductId = (
    tier: "Free" | "Basic" | "Team",
    cycle: "monthly" | "yearly",
  ) => {
    if (tier === "Free" && productsByTier.Free) {
      setProductId(productsByTier.Free.id);
    } else if (tier === "Basic") {
      const product =
        cycle === "monthly"
          ? productsByTier.BasicMonthly
          : productsByTier.BasicYearly;
      if (product) setProductId(product.id);
    } else if (tier === "Team") {
      const product =
        cycle === "monthly"
          ? productsByTier.TeamMonthly
          : productsByTier.TeamYearly;
      if (product) setProductId(product.id);
    }
  };

  // Check if a specific product option is the current subscription
  const isCurrentSubscription = (
    tier: "Free" | "Basic" | "Team",
    cycle?: "monthly" | "yearly",
  ) => {
    if (tier === "Free") {
      return currentSubscription.tier === "Free";
    }
    return (
      currentSubscription.tier === tier && currentSubscription.cycle === cycle
    );
  };

  // TODO: revamp how products are displayed and handled with updates to moving subscription management to workspace level
  return (
    <DialogRoot open={isOpen} onOpenChange={({ open }) => setIsOpen(open)}>
      <DialogBackdrop />
      <DialogPositioner>
        <DialogContent>
          <DialogCloseTrigger />
          <DialogTitle>Upgrade Subscription</DialogTitle>
          <DialogDescription>
            Upgrade your subscription to access exclusive features and benefits.
          </DialogDescription>

          <div className="flex flex-col gap-4">
            <TabsRoot
              deselectable={false}
              defaultValue={currentSubscription.tier || "Free"}
              value={selectedTier || undefined}
              onValueChange={({ value }) => {
                const tier = value as "Free" | "Basic" | "Team";
                setSelectedTier(tier);
                if (tier && tier !== "Free") {
                  updateProductId(tier, billingCycle);
                } else if (tier === "Free") {
                  updateProductId(tier, "monthly");
                }
              }}
            >
              <TabsList className="mb-2 w-full">
                <TabsTrigger value="Free" className="flex-1" tabIndex={0}>
                  Free
                </TabsTrigger>
                <TabsTrigger value="Basic" className="flex-1" tabIndex={0}>
                  Basic
                </TabsTrigger>
                <TabsTrigger value="Team" className="flex-1" tabIndex={0}>
                  Team
                </TabsTrigger>
              </TabsList>

              {/* Free Tier */}
              <TabsContent value="Free" tabIndex={-1}>
                {productsByTier.Free && (
                  <div className="space-y-4">
                    <div className="flex items-end justify-between">
                      <div>
                        <h2 className="font-semibold text-lg">Free</h2>
                        <p className="text-muted-foreground text-sm">
                          {productsByTier.Free.description}
                        </p>
                      </div>
                    </div>

                    {/* Free Plan Selection */}
                    <RadioGroupRoot
                      value={selectedTier === "Free" ? "free" : undefined}
                      onValueChange={() => {
                        setSelectedTier("Free");
                        updateProductId("Free", "monthly");
                      }}
                      className="space-y-2"
                    >
                      <RadioGroupItem
                        value="free"
                        disabled={isCurrentSubscription("Free")}
                        className={`flex items-center justify-between rounded-lg border p-3 ${isCurrentSubscription("Free") ? "opacity-50" : ""}`}
                      >
                        <RadioGroupItemHiddenInput />
                        <div className="flex items-center gap-3">
                          <RadioGroupItemControl />
                          <RadioGroupItemText>
                            <div>
                              <p className="font-medium">
                                Free{" "}
                                {isCurrentSubscription("Free") && "(Current)"}
                              </p>
                              <p className="text-muted-foreground text-sm">
                                Forever free
                              </p>
                            </div>
                          </RadioGroupItemText>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">$0/forever</div>
                        </div>
                      </RadioGroupItem>
                    </RadioGroupRoot>

                    <div className="rounded-lg border bg-primary-300/5 p-4 dark:bg-primary-950/5">
                      <h4 className="mb-3 font-semibold">Benefits</h4>
                      <ul className="space-y-2">
                        {productsByTier.Free.benefits.map((benefit) => (
                          <li
                            key={benefit.id}
                            className="flex items-start gap-3"
                          >
                            <div className="mt-0.5 flex-shrink-0">
                              <CheckIcon className="size-4 text-green-500" />
                            </div>
                            <span className="text-muted-foreground text-sm">
                              {benefit.description}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </TabsContent>

              {/* Basic Tier */}
              <TabsContent value="Basic" tabIndex={-1}>
                <div className="space-y-4">
                  <div className="flex items-end justify-between">
                    <div>
                      <h2 className="font-semibold text-lg">Basic</h2>
                      <p className="text-muted-foreground text-sm">
                        {productsByTier.BasicMonthly?.description ||
                          productsByTier.BasicYearly?.description}
                      </p>
                    </div>
                  </div>

                  {/* Billing Cycle Selection */}
                  <RadioGroupRoot
                    value={billingCycle}
                    onValueChange={({ value }) => {
                      const cycle = value as "monthly" | "yearly";
                      setBillingCycle(cycle);
                      if (selectedTier) {
                        updateProductId(selectedTier, cycle);
                      }
                    }}
                    className="space-y-2"
                  >
                    {productsByTier.BasicMonthly && (
                      <RadioGroupItem
                        value="monthly"
                        disabled={isCurrentSubscription("Basic", "monthly")}
                        className={`flex items-center justify-between rounded-lg border p-3 ${isCurrentSubscription("Basic", "monthly") ? "opacity-50" : ""}`}
                      >
                        <RadioGroupItemHiddenInput />
                        <div className="flex items-center gap-3">
                          <RadioGroupItemControl />
                          <RadioGroupItemText>
                            <div>
                              <p className="font-medium">
                                Monthly{" "}
                                {isCurrentSubscription("Basic", "monthly") &&
                                  "(Current)"}
                              </p>
                              <p className="text-muted-foreground text-sm">
                                Billed monthly
                              </p>
                            </div>
                          </RadioGroupItemText>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">
                            <Format.Number
                              value={
                                (
                                  productsByTier.BasicMonthly
                                    .prices[0] as ProductPriceFixed
                                ).priceAmount / 100
                              }
                              style="currency"
                              currency="USD"
                            />
                            /month
                          </div>
                        </div>
                      </RadioGroupItem>
                    )}

                    {productsByTier.BasicYearly && (
                      <RadioGroupItem
                        value="yearly"
                        disabled={isCurrentSubscription("Basic", "yearly")}
                        className={`flex items-center justify-between rounded-lg border p-3 ${isCurrentSubscription("Basic", "yearly") ? "opacity-50" : ""}`}
                      >
                        <RadioGroupItemHiddenInput />
                        <div className="flex items-center gap-3">
                          <RadioGroupItemControl />
                          <RadioGroupItemText>
                            <div>
                              <p className="font-medium">
                                Yearly{" "}
                                {isCurrentSubscription("Basic", "yearly") &&
                                  "(Current)"}
                              </p>
                              <p className="text-muted-foreground text-sm">
                                Billed annually
                              </p>
                            </div>
                          </RadioGroupItemText>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">
                            <Format.Number
                              value={
                                (
                                  productsByTier.BasicYearly
                                    .prices[0] as ProductPriceFixed
                                ).priceAmount / 100
                              }
                              style="currency"
                              currency="USD"
                            />
                            /year
                          </div>
                        </div>
                      </RadioGroupItem>
                    )}
                  </RadioGroupRoot>

                  <div className="rounded-lg border bg-primary-300/5 p-4 dark:bg-primary-950/5">
                    <h4 className="mb-3 font-semibold">Benefits</h4>
                    <ul className="space-y-2">
                      {(
                        productsByTier.BasicMonthly?.benefits ||
                        productsByTier.BasicYearly?.benefits ||
                        []
                      ).map((benefit) => (
                        <li key={benefit.id} className="flex items-start gap-3">
                          <div className="mt-0.5 flex-shrink-0">
                            <CheckIcon className="size-4 text-green-500" />
                          </div>
                          <span className="text-muted-foreground text-sm">
                            {benefit.description}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </TabsContent>

              {/* Team Tier */}
              <TabsContent value="Team" tabIndex={-1}>
                <div className="space-y-4">
                  <div className="flex items-end justify-between">
                    <div>
                      <h2 className="font-semibold text-lg">Team</h2>
                      <p className="text-muted-foreground text-sm">
                        {productsByTier.TeamMonthly?.description ||
                          productsByTier.TeamYearly?.description}
                      </p>
                    </div>
                  </div>

                  {/* Billing Cycle Selection */}
                  <RadioGroupRoot
                    value={billingCycle}
                    onValueChange={({ value }) => {
                      const cycle = value as "monthly" | "yearly";
                      setBillingCycle(cycle);
                      if (selectedTier) {
                        updateProductId(selectedTier, cycle);
                      }
                    }}
                    className="space-y-2"
                  >
                    {productsByTier.TeamMonthly && (
                      <RadioGroupItem
                        value="monthly"
                        disabled={isCurrentSubscription("Team", "monthly")}
                        className={`flex items-center justify-between rounded-lg border p-3 ${isCurrentSubscription("Team", "monthly") ? "opacity-50" : ""}`}
                      >
                        <RadioGroupItemHiddenInput />
                        <div className="flex items-center gap-3">
                          <RadioGroupItemControl />
                          <RadioGroupItemText>
                            <div>
                              <p className="font-medium">
                                Monthly{" "}
                                {isCurrentSubscription("Team", "monthly") &&
                                  "(Current)"}
                              </p>
                              <p className="text-muted-foreground text-sm">
                                Billed monthly
                              </p>
                            </div>
                          </RadioGroupItemText>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">
                            <Format.Number
                              value={
                                (
                                  productsByTier.TeamMonthly
                                    .prices[0] as ProductPriceFixed
                                ).priceAmount / 100
                              }
                              style="currency"
                              currency="USD"
                            />
                            /month
                          </div>
                        </div>
                      </RadioGroupItem>
                    )}

                    {productsByTier.TeamYearly && (
                      <RadioGroupItem
                        value="yearly"
                        disabled={isCurrentSubscription("Team", "yearly")}
                        className={`flex items-center justify-between rounded-lg border p-3 ${isCurrentSubscription("Team", "yearly") ? "opacity-50" : ""}`}
                      >
                        <RadioGroupItemHiddenInput />
                        <div className="flex items-center gap-3">
                          <RadioGroupItemControl />
                          <RadioGroupItemText>
                            <div>
                              <p className="font-medium">
                                Yearly{" "}
                                {isCurrentSubscription("Team", "yearly") &&
                                  "(Current)"}
                              </p>
                              <p className="text-muted-foreground text-sm">
                                Billed annually
                              </p>
                            </div>
                          </RadioGroupItemText>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">
                            <Format.Number
                              value={
                                (
                                  productsByTier.TeamYearly
                                    .prices[0] as ProductPriceFixed
                                ).priceAmount / 100
                              }
                              style="currency"
                              currency="USD"
                            />
                            /year
                          </div>
                        </div>
                      </RadioGroupItem>
                    )}
                  </RadioGroupRoot>

                  <div className="rounded-lg border bg-primary-300/5 p-4 dark:bg-primary-950/5">
                    <h4 className="mb-3 font-semibold">Benefits</h4>
                    <ul className="space-y-2">
                      {(
                        productsByTier.TeamMonthly?.benefits ||
                        productsByTier.TeamYearly?.benefits ||
                        []
                      ).map((benefit) => (
                        <li key={benefit.id} className="flex items-start gap-3">
                          <div className="mt-0.5 flex-shrink-0">
                            <CheckIcon className="size-4 text-green-500" />
                          </div>
                          <span className="text-muted-foreground text-sm">
                            {benefit.description}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </TabsContent>
            </TabsRoot>
            <div className="flex items-center gap-2 place-self-end">
              <DialogCloseTrigger asChild>
                <Button variant="outline">Cancel</Button>
              </DialogCloseTrigger>
              <Button
                disabled={
                  !productId ||
                  isProductUpdating ||
                  productId === subscription.product.id
                }
                onClick={async () => {
                  setIsProductUpdating(true);
                  setIsOpen(false);

                  const toastId = toast.loading("Upgrading subscription...");

                  await handleUpgradeSubscription({
                    data: {
                      hidraId: session?.user.hidraId!,
                      subscriptionId: subscription.id,
                      productId: productId!,
                    },
                  });

                  // TODO: figure out best way to approach this. If router is invalidated right away, polar endpoints aren't invalidated / updated yet so customer state is stale
                  // TODO: remove product updating state when better approach is determined
                  setTimeout(async () => {
                    toast.success("Subscription upgraded successfully!", {
                      id: toastId,
                    });
                    await router.invalidate({ sync: true });
                    setIsProductUpdating(false);
                  }, 1500);
                }}
              >
                Upgrade
              </Button>
            </div>
          </div>
        </DialogContent>
      </DialogPositioner>
    </DialogRoot>
  );
};

export default UpgradeSubscriptionDialog;
