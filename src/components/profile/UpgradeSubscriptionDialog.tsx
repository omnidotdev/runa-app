import { useRouteContext, useRouter } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";

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
import useDialogStore, { DialogType } from "@/lib/hooks/store/useDialogStore";
import useSubscriptionStore from "@/lib/hooks/store/useSubscriptionStore";
import { upgradeSubscription } from "@/server/upgradeSubscription";

const UpgradeSubscriptionDialog = () => {
  const handleUpgradeSubscription = useServerFn(upgradeSubscription);

  const { session } = useRouteContext({
    from: "/_auth/profile/$userId",
  });

  const router = useRouter();

  const { isOpen, setIsOpen } = useDialogStore({
    type: DialogType.UpgradeSubscription,
  });

  const { subscriptionId, setSubscriptionId, productId, setProductId } =
    useSubscriptionStore();

  if (!productId || !subscriptionId) return null;

  return (
    <DialogRoot
      open={isOpen}
      onOpenChange={({ open }) => setIsOpen(open)}
      onExitComplete={() => {
        setProductId(null);
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
            <p>TODO: list of upgraded benefits</p>
            <div className="flex items-center gap-2 place-self-end">
              <DialogCloseTrigger asChild>
                <Button variant="outline">Cancel</Button>
              </DialogCloseTrigger>
              <Button
                onClick={async () => {
                  await handleUpgradeSubscription({
                    data: {
                      hidraId: session?.user.hidraId!,
                      subscriptionId,
                      productId,
                    },
                  });

                  // TODO: determine why this does not properly retrigger the `loader` in order to get the updated customer state. Still need to manually refresh
                  router.invalidate();

                  setIsOpen(false);
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
