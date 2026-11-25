import { Format } from "@ark-ui/react";
import { workspacesUrl } from "@omnidotdev/providers/react";
import {
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardRoot,
  CardTitle,
} from "@omnidotdev/thornberry/card";
import {
  useNavigate,
  useRouteContext,
  useSearch,
} from "@tanstack/react-router";
import { BuildingIcon, CheckIcon, PlusIcon } from "lucide-react";

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
import signIn from "@/lib/auth/signIn";
import { upgradePlanUrl } from "@/lib/billing/hubLinks";
import { ACCOUNT_URL, BASE_URL } from "@/lib/config/env.config";
import capitalizeFirstLetter from "@/lib/util/capitalizeFirstLetter";
import { cn } from "@/lib/utils";

import type { OrganizationClaim } from "@omnidotdev/providers/auth";
import type { Price, Subscription } from "@/lib/providers/billing";

interface Props {
  price: Price;
  orgSubscriptions?: Record<string, Subscription | null>;
}

/**
 * Price card. A paid plan is bought on the Omni account hub, the one place
 * Omni plans are sold: picking a workspace opens the hub's confirm step for
 * that plan and workspace, which runs checkout and returns here
 */
export const PriceCard = ({ price, orgSubscriptions = {} }: Props) => {
  const { session } = useRouteContext({ strict: false });
  // Hub links open the hub as the account Runa is signed in as
  const loginHint = session?.user.identityProviderId;
  const navigate = useNavigate();
  const search = useSearch({ strict: false }) as { tier?: string };

  const TIER_ORDER = ["free", "pro", "team"] as const;
  const getTierIndex = (t: string | null): number =>
    TIER_ORDER.indexOf((t ?? "free") as (typeof TIER_ORDER)[number]);

  const tier = price.metadata?.tier as string;
  const isTeamTier = tier === "team";
  const isFreeTier = tier === "free";

  // Helper to get tier from subscription
  const getOrgTier = (orgId: string): string => {
    const subscription = orgSubscriptions[orgId];
    if (!subscription) return "free";
    // Product name is like "Runa Pro" or "Runa Team"
    const productName = subscription.product?.name?.toLowerCase() ?? "";
    if (productName.includes("team")) return "team";
    if (productName.includes("pro")) return "pro";
    return "free";
  };

  // Categorize organizations by their upgrade eligibility for this tier
  const allOrgs = (session?.organizations ?? []) as OrganizationClaim[];
  const upgradeableOrgs = allOrgs.filter(
    (org) => getTierIndex(getOrgTier(org.id)) < getTierIndex(tier),
  );
  const nonUpgradeableOrgs = allOrgs.filter(
    (org) => getTierIndex(getOrgTier(org.id)) >= getTierIndex(tier),
  );

  // Check if this card's tier matches the URL param (for post-sign-in auto-open)
  const shouldAutoOpen = search.tier === tier && !!session;

  const interval = price.recurring?.interval === "year" ? "year" : "month";

  // The account hub's confirm step for this plan, for a workspace or (none
  // given) letting the hub ask
  const planUrl = (workspaceSlug?: string) =>
    upgradePlanUrl(ACCOUNT_URL, BASE_URL, {
      plan: tier,
      interval,
      workspaceSlug,
      loginHint,
    });

  // A new workspace is created on the account hub's workspaces console, the
  // one place workspaces are made
  const newWorkspaceHref = workspacesUrl(ACCOUNT_URL, { loginHint });

  // Handle workspace selection from dropdown
  const handleWorkspaceSelect = (workspaceId: string) => {
    const href =
      workspaceId === "create-new"
        ? newWorkspaceHref
        : planUrl(allOrgs.find((org) => org.id === workspaceId)?.slug);

    if (href) window.location.assign(href);
  };

  const handleClick = () => {
    if (!session) {
      signIn({
        redirectUrl: `${BASE_URL}/pricing?tier=${tier}`,
        providerId: "omni",
      });
      return;
    }

    // Free tier - just go to workspaces
    if (isFreeTier) {
      if (!session.organizations?.length) {
        navigate({ to: "/workspaces" });
      } else {
        const firstOrg = session.organizations[0];
        navigate({
          to: "/@{$workspaceSlug}",
          params: { workspaceSlug: firstOrg.slug },
        });
      }
      return;
    }

    // Paid tier without orgs: the hub explains a plan needs a workspace
    if (!session.organizations?.length) {
      const href = planUrl();
      if (href) window.location.assign(href);
      return;
    }

    // Has orgs - dropdown handles the rest (menu opens automatically)
  };

  // Show dropdown if authenticated, has orgs, paid tier
  const showDropdown =
    !!session && !isFreeTier && !!session.organizations?.length;

  const buttonContent = isFreeTier
    ? "Get Started"
    : `Continue with ${capitalizeFirstLetter(tier)}`;

  return (
    <CardRoot
      key={price?.id}
      className={cn(
        "relative flex flex-1 flex-col border-2",
        isTeamTier &&
          "border-primary-700 bg-primary-50 shadow-primary/20 dark:border-primary dark:bg-primary-1000",
      )}
    >
      {isTeamTier && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="bg-primary-700 text-primary-foreground dark:bg-primary rounded-full px-3 py-1 text-sm font-medium">
            Recommended
          </span>
        </div>
      )}
      <CardHeader
        className={cn(
          "mb-4 rounded-xl rounded-b-none bg-muted pb-8 text-center",
          isTeamTier && "bg-primary-400/10 dark:bg-primary-950/80",
        )}
      >
        <CardTitle className="text-2xl font-bold">
          {capitalizeFirstLetter(tier)}
        </CardTitle>
        <CardDescription className="text-muted-foreground mt-2">
          {price.product?.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-8 text-center">
        <div className="mb-8">
          <div className="flex items-baseline justify-center text-4xl font-bold">
            <Format.Number
              value={price.unit_amount! / 100}
              style="currency"
              notation="compact"
              currency="USD"
            />
            <span className="text-muted-foreground ml-1 text-lg font-medium">
              {price.recurring && !isFreeTier && `/${price.recurring.interval}`}
            </span>
          </div>
        </div>

        <ul className="space-y-4 text-left">
          {price.product?.marketing_features.map((feature) => (
            <li key={feature.name} className="flex items-start gap-3">
              <div className="rounded-full bg-green-100 p-1 dark:bg-green-900">
                <CheckIcon
                  size={14}
                  className="text-green-600 dark:text-green-400"
                />
              </div>

              <span className="text-foreground leading-6">{feature.name}</span>
            </li>
          ))}
        </ul>
      </CardContent>

      <CardFooter className="mt-auto pt-8">
        {showDropdown ? (
          <MenuRoot
            defaultOpen={shouldAutoOpen}
            onSelect={({ value }) => handleWorkspaceSelect(value)}
          >
            <MenuTrigger asChild>
              <Button
                variant={isTeamTier ? undefined : "outline"}
                size="lg"
                className="w-full font-semibold"
              >
                {buttonContent}
              </Button>
            </MenuTrigger>
            <MenuPositioner className="!w-[var(--reference-width)]">
              <MenuContent className="w-full">
                {allOrgs.length > 0 && (
                  <>
                    <MenuItemGroup>
                      <MenuItemGroupLabel className="text-muted-foreground">
                        Your workspaces
                      </MenuItemGroupLabel>

                      {upgradeableOrgs.map((org: OrganizationClaim) => (
                        <MenuItem
                          key={org.id}
                          value={org.id}
                          className="cursor-pointer"
                        >
                          <MenuItemText className="flex w-full items-center gap-2">
                            <BuildingIcon
                              size={16}
                              className="text-muted-foreground"
                            />
                            <span className="flex-1 truncate text-sm font-medium">
                              {org.name}
                            </span>
                            <span className="bg-primary/10 text-primary rounded px-1.5 py-0.5 text-xs">
                              Upgrade
                            </span>
                          </MenuItemText>
                        </MenuItem>
                      ))}

                      {nonUpgradeableOrgs.map((org: OrganizationClaim) => {
                        const orgTier = getOrgTier(org.id);
                        const isSameTier = orgTier === tier;

                        return (
                          <MenuItem
                            key={org.id}
                            value={org.id}
                            disabled
                            className="opacity-60"
                          >
                            <MenuItemText className="flex w-full items-center gap-2">
                              <BuildingIcon
                                size={16}
                                className="text-muted-foreground"
                              />
                              <span className="flex-1 truncate text-sm font-medium">
                                {org.name}
                              </span>
                              <span className="bg-muted text-muted-foreground rounded px-1.5 py-0.5 text-xs">
                                {isSameTier
                                  ? "Current plan"
                                  : capitalizeFirstLetter(orgTier)}
                              </span>
                            </MenuItemText>
                          </MenuItem>
                        );
                      })}
                    </MenuItemGroup>

                    <MenuSeparator />
                  </>
                )}

                {newWorkspaceHref && (
                  <MenuItemGroup>
                    <MenuItem value="create-new" className="cursor-pointer">
                      <MenuItemText className="flex w-full items-center gap-2">
                        <PlusIcon size={16} className="text-muted-foreground" />
                        <span className="text-sm font-medium">
                          New workspace
                        </span>
                      </MenuItemText>
                    </MenuItem>
                  </MenuItemGroup>
                )}
              </MenuContent>
            </MenuPositioner>
          </MenuRoot>
        ) : session && !isFreeTier && planUrl() ? (
          // Paid tier without workspaces: the hub asks which workspace
          <Button
            variant={isTeamTier ? undefined : "outline"}
            size="lg"
            className="w-full font-semibold"
            asChild
          >
            <a href={planUrl()}>{buttonContent}</a>
          </Button>
        ) : (
          <Button
            variant={isTeamTier ? undefined : "outline"}
            size="lg"
            className="w-full font-semibold"
            onClick={handleClick}
          >
            {buttonContent}
          </Button>
        )}
      </CardFooter>
    </CardRoot>
  );
};
