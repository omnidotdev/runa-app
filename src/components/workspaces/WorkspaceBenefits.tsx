import { Format } from "@ark-ui/react";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { getRouteApi, useRouter } from "@tanstack/react-router";
import dayjs from "dayjs";
import { AlertTriangleIcon } from "lucide-react";
import { Fragment } from "react";

import { Button } from "@/components/ui/button";
import {
  MenuContent,
  MenuItem,
  MenuItemGroup,
  MenuItemGroupLabel,
  MenuItemText,
  MenuPositioner,
  MenuRoot,
  MenuSeparator,
  MenuTrigger,
} from "@/components/ui/menu";
import { BASE_URL } from "@/lib/config/env.config";
import workspaceOptions from "@/lib/options/workspace.options";
import { isOwner } from "@/lib/permissions";
import firstLetterToUppercase from "@/lib/util/firstLetterToUppercase";
import { cn } from "@/lib/utils";
import { FREE_PRICE } from "@/routes/_public/pricing";
import {
  getBillingPortalUrl,
  getCreateSubscriptionUrl,
  renewSubscription,
} from "@/server/functions/subscriptions";

const routeApi = getRouteApi("/_auth/workspaces/$workspaceSlug/settings");

export default function WorkspaceBenefits() {
  const { session } = routeApi.useRouteContext();
  const { workspaceId, subscription, prices } = routeApi.useLoaderData();
  const router = useRouter();
  const navigate = routeApi.useNavigate();

  const { data: workspace } = useSuspenseQuery({
    ...workspaceOptions({
      rowId: workspaceId,
      userId: session?.user?.rowId!,
    }),
    select: (data) => data?.workspace,
  });

  const currentUserRole = workspace?.workspaceUsers?.nodes?.[0]?.role;
  const canDeleteWorkspace = currentUserRole && isOwner(currentUserRole);

  const { mutateAsync: openBillingPortal } = useMutation({
    mutationFn: async () =>
      await getBillingPortalUrl({
        data: {
          workspaceId: workspace?.rowId,
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
        data: { workspaceId: workspace?.rowId },
      }),
    onSuccess: () => router.invalidate(),
  });

  return (
    <div
      className={cn(
        "ml-2 hidden flex-col gap-8 lg:ml-0",
        canDeleteWorkspace && "flex",
      )}
    >
      <div className="flex flex-col gap-4 pt-2">
        <h3 className="font-medium text-base-700 text-sm lg:ml-0 dark:text-base-300">
          Workspace Benefits
        </h3>

        {!!subscription?.cancelAt && (
          <div className="flex items-center gap-1 text-sm text-yellow-600 dark:text-yellow-400">
            <AlertTriangleIcon className="size-4" />
            The current subscription is set to be canceled on{" "}
            {dayjs(subscription.cancelAt * 1000).format("MMM D, YYYY")}. To
            avoid losing the current workspace benefits, renew your subscription
            prior to this date.
          </div>
        )}

        <div className="border-t">
          <ul className="divide-y border-b">
            {(
              subscription?.product?.marketing_features ??
              FREE_PRICE.product.marketing_features
            ).map((feature) => (
              <li
                key={feature.name}
                className="flex h-10 items-center gap-2 pl-2"
              >
                <div className="size-1.5 shrink-0 rounded-full bg-primary" />
                <span className="text-sm leading-relaxed">{feature.name}</span>
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
              <Button className="w-fit" onClick={() => openBillingPortal()}>
                Manage Subscription
              </Button>
            )}

            <Button
              variant="outline"
              onClick={() => openBillingPortal()}
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
              <Button className="mt-2 w-fit">Upgrade Workspace</Button>
            </MenuTrigger>
            <MenuPositioner>
              <MenuContent className="w-60">
                {(["basic", "team"] as const).map((tier, index) => (
                  <Fragment key={tier}>
                    <MenuItemGroup>
                      <MenuItemGroupLabel className="text-muted-foreground">
                        {firstLetterToUppercase(tier)}
                      </MenuItemGroupLabel>

                      {prices
                        .filter((price) => price.metadata.tier === tier)
                        .map((price) => (
                          <MenuItem
                            key={price.id}
                            value={price.id}
                            className="cursor-pointer"
                          >
                            <MenuItemText className="flex w-full items-center justify-between">
                              <span className="font-medium text-sm">
                                {firstLetterToUppercase(
                                  price.recurring?.interval!,
                                )}
                                ly
                              </span>

                              <span className="font-semibold text-sm">
                                <Format.Number
                                  value={price.unit_amount! / 100}
                                  currency="USD"
                                  style="currency"
                                  notation="compact"
                                />
                                <span className="font-normal text-muted-foreground">
                                  /
                                  {price.recurring?.interval === "month"
                                    ? "mo"
                                    : "yr"}
                                </span>
                              </span>
                            </MenuItemText>
                          </MenuItem>
                        ))}
                    </MenuItemGroup>

                    {index < 1 && <MenuSeparator />}
                  </Fragment>
                ))}
              </MenuContent>
            </MenuPositioner>
          </MenuRoot>
        )}
      </div>
    </div>
  );
}
