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
  TabsContent,
  TabsList,
  TabsRoot,
  TabsTrigger,
} from "@/components/ui/tabs";
import useDialogStore, { DialogType } from "@/lib/hooks/store/useDialogStore";
import useSubscriptionStore from "@/lib/hooks/store/useSubscriptionStore";
import firstLetterToUppercase from "@/lib/util/firstLetterToUppercase";
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

  const [productId, setProductId] = useState(products[0].id);

  const router = useRouter();

  const { isOpen, setIsOpen } = useDialogStore({
    type: DialogType.UpgradeSubscription,
  });

  const { isProductUpdating, setIsProductUpdating } = useSubscriptionStore();

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
              defaultValue={products[0].id}
              onValueChange={({ value }) => setProductId(value)}
            >
              <TabsList className="mb-2 w-full">
                {products.map((product) => (
                  <TabsTrigger
                    key={product.id}
                    value={product.id}
                    className="flex-1"
                    tabIndex={0}
                  >{`${firstLetterToUppercase(product.recurringInterval!)}ly`}</TabsTrigger>
                ))}
              </TabsList>
              {products.map((product) => (
                // TODO: figure out why the tabIndex is not applying
                <TabsContent key={product.id} value={product.id} tabIndex={-1}>
                  <div className="space-y-4">
                    <div className="flex items-end justify-between">
                      <div>
                        <h2 className="font-semibold text-lg">
                          {product.name}
                        </h2>
                        <p className="text-muted-foreground text-sm">
                          {product.description}
                        </p>
                      </div>

                      <div className="flex text-sm">
                        <Format.Number
                          value={
                            (product.prices[0] as ProductPriceFixed)
                              .priceAmount / 100
                          }
                          style="currency"
                          currency="USD"
                        />
                        <p>{`/${product.recurringInterval}`}</p>
                      </div>
                    </div>

                    <div className="rounded-lg border bg-primary-300/5 p-4 dark:bg-primary-950/5">
                      <h4 className="mb-3 font-semibold">Benefits</h4>
                      <ul className="space-y-2">
                        {product.benefits.map((benefit) => (
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
                </TabsContent>
              ))}
            </TabsRoot>
            <div className="flex items-center gap-2 place-self-end">
              <DialogCloseTrigger asChild>
                <Button variant="outline">Cancel</Button>
              </DialogCloseTrigger>
              <Button
                disabled={!productId || isProductUpdating}
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
