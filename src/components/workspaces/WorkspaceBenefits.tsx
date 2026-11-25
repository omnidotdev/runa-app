import { Format } from "@ark-ui/react";
import { getRouteApi } from "@tanstack/react-router";
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
import useHubLoginHint from "@/lib/auth/useHubLoginHint";
import { manageSubscriptionUrl, upgradePlanUrl } from "@/lib/billing/hubLinks";
import { ACCOUNT_URL, BASE_URL, hasBilling } from "@/lib/config/env.config";
import { FREE_PRICE } from "@/lib/constants/tiers";
import { useCurrentUserRole } from "@/lib/hooks/useCurrentUserRole";
import { isOwner } from "@/lib/permissions";
import capitalizeFirstLetter from "@/lib/util/capitalizeFirstLetter";
import getTierFromEntitlements from "@/lib/util/getTierFromEntitlements";
import { cn } from "@/lib/utils";

const routeApi = getRouteApi("/_app/@{$workspaceSlug}/~/settings");

/**
 * A workspace's plan benefits. Upgrading and managing the plan (change,
 * cancel, renew, payment method, invoices) happen on the Omni account hub,
 * which returns to this workspace's settings
 */
export default function WorkspaceBenefits() {
  const { organizationId, subscription, entitlements, prices } =
    routeApi.useLoaderData();
  const { workspaceSlug } = routeApi.useParams();
  const loginHint = useHubLoginHint();

  // Resolve org slug from JWT claims (workspaceSlug in URL is already org slug)
  const orgSlug = workspaceSlug;

  // Get role from IDP organization claims
  const currentUserRole = useCurrentUserRole(organizationId);
  const canDeleteWorkspace = currentUserRole && isOwner(currentUserRole);

  const manageHref = manageSubscriptionUrl(
    ACCOUNT_URL,
    BASE_URL,
    orgSlug,
    loginHint,
  );

  // Buy the picked plan for this workspace on the account hub, which confirms
  // it, runs checkout, and returns here
  const upgradeToPrice = (priceId: string) => {
    const price = prices.find((p) => p.id === priceId);
    if (!price) return;

    const href = upgradePlanUrl(ACCOUNT_URL, BASE_URL, {
      plan: price.metadata.tier,
      interval: price.recurring?.interval === "year" ? "year" : "month",
      workspaceSlug: orgSlug,
      loginHint,
    });

    if (href) window.location.assign(href);
  };

  if (!hasBilling) return null;

  // Prefer the live subscription's features. When an entitlement grants a tier
  // without a Stripe subscription (comped or manually granted plan), show that
  // tier's features. Fall back to the free feature list otherwise.
  const entitlementTier = getTierFromEntitlements(entitlements);
  const features =
    subscription?.product?.marketing_features ??
    (entitlementTier
      ? prices.find((price) => price.metadata.tier === entitlementTier)?.product
          .marketing_features
      : undefined) ??
    FREE_PRICE.product.marketing_features;

  return (
    <div
      className={cn(
        "ml-2 hidden flex-col gap-8 lg:ml-0",
        canDeleteWorkspace && "flex",
      )}
    >
      <div className="flex flex-col gap-4 pt-2">
        <h3 className="text-base-700 dark:text-base-300 text-sm font-medium lg:ml-0">
          Workspace Benefits
        </h3>

        {!!subscription?.cancelAt && (
          <div className="flex items-center gap-1 text-sm text-yellow-600 dark:text-yellow-400">
            <AlertTriangleIcon className="size-4" />
            The current subscription is set to be canceled on{" "}
            {dayjs(subscription.cancelAt * 1000).format("MMM D, YYYY")}. To
            avoid losing the current workspace benefits, renew it from Manage
            Subscription prior to this date.
          </div>
        )}

        <div className="border-t">
          <ul className="divide-y border-b">
            {features.map((feature) => (
              <li
                key={feature.name}
                className="flex h-10 items-center gap-2 pl-2"
              >
                <div className="bg-primary size-1.5 shrink-0 rounded-full" />
                <span className="text-sm leading-relaxed">{feature.name}</span>
              </li>
            ))}
          </ul>
        </div>

        {subscription ? (
          manageHref ? (
            <Button className="w-fit" asChild>
              <a href={manageHref}>Manage Subscription</a>
            </Button>
          ) : (
            <p className="text-muted-foreground text-sm">
              Managing the plan is unavailable right now.
            </p>
          )
        ) : ACCOUNT_URL ? (
          <MenuRoot onSelect={({ value }) => upgradeToPrice(value)}>
            <MenuTrigger asChild>
              <Button className="mt-2 w-fit">Upgrade Workspace</Button>
            </MenuTrigger>
            <MenuPositioner>
              <MenuContent className="w-60">
                {(["pro", "team"] as const).map((tier, index) => (
                  <Fragment key={tier}>
                    <MenuItemGroup>
                      <MenuItemGroupLabel className="text-muted-foreground">
                        {capitalizeFirstLetter(tier)}
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
                              <span className="text-sm font-medium">
                                {capitalizeFirstLetter(
                                  price.recurring?.interval!,
                                )}
                                ly
                              </span>

                              <span className="text-sm font-semibold">
                                <Format.Number
                                  value={price.unit_amount! / 100}
                                  currency="USD"
                                  style="currency"
                                  notation="compact"
                                />
                                <span className="text-muted-foreground font-normal">
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
        ) : (
          <p className="text-muted-foreground text-sm">
            Upgrading the plan is unavailable right now.
          </p>
        )}
      </div>
    </div>
  );
}
