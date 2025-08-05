import {
  useLoaderData,
  useRouteContext,
  useRouter,
} from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { toast } from "sonner";
import { match, P } from "ts-pattern";

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
  TabsContent,
  TabsList,
  TabsRoot,
  TabsTrigger,
} from "@/components/ui/tabs";
import useDialogStore, { DialogType } from "@/lib/hooks/store/useDialogStore";
import useSubscriptionStore from "@/lib/hooks/store/useSubscriptionStore";
import {
  SandboxFree,
  SandboxMonthly,
  SandboxYearly,
} from "@/lib/polar/productIds";
import { upgradeSubscription } from "@/server/upgradeSubscription";

import type { Tier } from "@/lib/polar/productIds";

const UpgradeSubscriptionDialog = () => {
  const handleUpgradeSubscription = useServerFn(upgradeSubscription);

  const { session } = useRouteContext({
    from: "/_auth/profile/$userId",
  });

  const { currentProduct } = useLoaderData({
    from: "/_auth/profile/$userId",
  });

  // TODO: refactor for prod when prod IDs are available
  const upgradeTier = match(currentProduct?.id)
    .with(undefined, () => ({
      monthly: SandboxFree.Free,
      yearly: SandboxFree.Free,
    }))
    .with(SandboxFree.Free, () => ({
      monthly: SandboxMonthly.Basic,
      yearly: SandboxYearly.Basic,
    }))
    .with(P.union(SandboxMonthly.Basic, SandboxYearly.Basic), () => ({
      monthly: SandboxMonthly.Team,
      yearly: SandboxYearly.Team,
    }))
    .otherwise(() => ({
      monthly: null,
      yearly: null,
    }));

  const [productId, setProductId] = useState<Tier | null>(upgradeTier?.monthly);

  const router = useRouter();

  const { isOpen, setIsOpen } = useDialogStore({
    type: DialogType.UpgradeSubscription,
  });

  const { subscriptionId, setSubscriptionId, setIsProductUpdating } =
    useSubscriptionStore();

  if (!subscriptionId) return null;

  return (
    <DialogRoot
      open={isOpen}
      onOpenChange={({ open }) => setIsOpen(open)}
      onExitComplete={() => {
        setSubscriptionId(null);
      }}
    >
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
              defaultValue="monthly"
              onValueChange={({ value }) => {
                if (value === "monthly") {
                  setProductId(upgradeTier?.monthly);
                } else if (value === "yearly") {
                  setProductId(upgradeTier?.yearly);
                }
              }}
            >
              <TabsList>
                <TabsTrigger value="monthly">Monthly</TabsTrigger>
                <TabsTrigger value="yearly">Yearly</TabsTrigger>
              </TabsList>
              <TabsContent value="monthly">
                <p>TODO: list of upgraded benefits</p>
              </TabsContent>
              <TabsContent value="yearly">
                <p>TODO: list of upgraded benefits</p>
              </TabsContent>
            </TabsRoot>
            <div className="flex items-center gap-2 place-self-end">
              <DialogCloseTrigger asChild>
                <Button variant="outline">Cancel</Button>
              </DialogCloseTrigger>
              <Button
                disabled={!productId}
                onClick={async () => {
                  setIsProductUpdating(true);

                  const toastId = toast.loading("Upgrading subscription...");

                  await handleUpgradeSubscription({
                    data: {
                      hidraId: session?.user.hidraId!,
                      subscriptionId,
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
                    setIsOpen(false);
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
