import { Format } from "@ark-ui/react";
import { useMutation } from "@tanstack/react-query";
import {
  useNavigate,
  useRouteContext,
  useSearch,
} from "@tanstack/react-router";
import { BuildingIcon, CheckIcon, PlusIcon } from "lucide-react";
import { useState } from "react";

import CreateWorkspaceModal from "@/components/pricing/CreateWorkspaceModal";
import { Button } from "@/components/ui/button";
import {
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardRoot,
  CardTitle,
} from "@/components/ui/card";
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
import { BASE_URL } from "@/lib/config/env.config";
import useDialogStore, { DialogType } from "@/lib/hooks/store/useDialogStore";
import capitalizeFirstLetter from "@/lib/util/capitalizeFirstLetter";
import { cn } from "@/lib/utils";
import { createCheckoutWithWorkspace } from "@/server/functions/subscriptions";

import type { OrganizationClaim } from "@/lib/auth/getAuth";
import type { Price, Subscription } from "@/lib/providers/billing";

interface Props {
  price: Price;
  orgSubscriptions?: Record<string, Subscription | null>;
}

export const PriceCard = ({ price, orgSubscriptions = {} }: Props) => {
  const { session } = useRouteContext({ strict: false });
  const navigate = useNavigate();
  const search = useSearch({ strict: false }) as { tier?: string };
  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);

  const { setIsOpen: setCreateWorkspaceOpen } = useDialogStore({
    type: DialogType.CreateWorkspace,
  });

  const tier = price.metadata?.tier as string;
  const isTeamTier = tier === "team";
  const isFreeTier = tier === "free";
  const isBasicTier = tier === "basic";

  // Helper to get tier from subscription
  const getOrgTier = (orgId: string): string | null => {
    const subscription = orgSubscriptions[orgId];
    if (!subscription) return "free";
    // Product name is like "Runa Basic" or "Runa Team"
    const productName = subscription.product?.name?.toLowerCase() ?? "";
    if (productName.includes("team")) return "team";
    if (productName.includes("basic")) return "basic";
    return "free";
  };

  // Filter organizations that can upgrade to this tier
  const upgradeableOrgs =
    session?.organizations?.filter((org: OrganizationClaim) => {
      const orgTier = getOrgTier(org.id);
      // Free tier card: no upgrades shown (use "Get Started" flow)
      if (isFreeTier) return false;
      // Basic tier card: only show free orgs
      if (isBasicTier) return orgTier === "free";
      // Team tier card: show free and basic orgs
      if (isTeamTier) return orgTier === "free" || orgTier === "basic";
      return false;
    }) ?? [];

  // Check if this card's tier matches the URL param (for post-sign-in auto-open)
  const shouldAutoOpen = search.tier === tier && !!session;

  const { mutateAsync: initiateCheckout } = useMutation({
    mutationFn: async (params: {
      workspaceId?: string;
      createWorkspace?: { name: string; slug: string };
    }) => {
      setIsCheckoutLoading(true);
      return createCheckoutWithWorkspace({
        data: {
          priceId: price.id,
          successUrl: `${BASE_URL}/workspaces/__SLUG__/settings`,
          cancelUrl: `${BASE_URL}/pricing`,
          ...params,
        },
      });
    },
    onSuccess: (result) => {
      // Redirect to Stripe checkout
      window.location.href = result.checkoutUrl;
    },
    onError: () => {
      setIsCheckoutLoading(false);
    },
  });

  // Handle workspace selection from dropdown
  const handleWorkspaceSelect = (workspaceId: string) => {
    if (workspaceId === "create-new") {
      setCreateWorkspaceOpen(true);
    } else {
      initiateCheckout({ workspaceId });
    }
  };

  // Handle new workspace creation from modal
  const handleCreateWorkspace = (name: string, slug: string) => {
    setCreateWorkspaceOpen(false);
    initiateCheckout({ createWorkspace: { name, slug } });
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
          to: "/workspaces/$workspaceSlug/projects",
          params: { workspaceSlug: firstOrg.slug },
        });
      }
      return;
    }

    // Paid tier without orgs - open create workspace modal
    if (!session.organizations?.length) {
      setCreateWorkspaceOpen(true);
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
    <>
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
            <span className="rounded-full bg-primary-700 px-3 py-1 font-medium text-primary-foreground text-sm dark:bg-primary">
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
          <CardTitle className="font-bold text-2xl">
            {capitalizeFirstLetter(tier)}
          </CardTitle>
          <CardDescription className="mt-2 text-muted-foreground">
            {price.product?.description}
          </CardDescription>
        </CardHeader>
        <CardContent className="pb-8 text-center">
          <div className="mb-8">
            <div className="flex items-baseline justify-center font-bold text-4xl">
              <Format.Number
                value={price.unit_amount! / 100}
                style="currency"
                notation="compact"
                currency="USD"
              />
              <span className="ml-1 font-medium text-lg text-muted-foreground">
                {price.recurring && `/workspace/${price.recurring.interval}`}
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

                <span className="text-foreground leading-6">
                  {feature.name}
                </span>
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
                  disabled={isCheckoutLoading}
                >
                  {isCheckoutLoading ? "Loading..." : buttonContent}
                </Button>
              </MenuTrigger>
              <MenuPositioner className="!w-[var(--reference-width)]">
                <MenuContent className="w-full">
                  {upgradeableOrgs.length > 0 && (
                    <>
                      <MenuItemGroup>
                        <MenuItemGroupLabel className="text-muted-foreground">
                          Upgrade existing workspace
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
                              <span className="flex-1 truncate font-medium text-sm">
                                {org.name}
                              </span>
                            </MenuItemText>
                          </MenuItem>
                        ))}
                      </MenuItemGroup>

                      <MenuSeparator />
                    </>
                  )}

                  <MenuItemGroup>
                    <MenuItemGroupLabel className="text-muted-foreground">
                      Create new workspace
                    </MenuItemGroupLabel>

                    <MenuItem value="create-new" className="cursor-pointer">
                      <MenuItemText className="flex w-full items-center gap-2">
                        <PlusIcon size={16} className="text-muted-foreground" />
                        <span className="font-medium text-sm">
                          New workspace
                        </span>
                      </MenuItemText>
                    </MenuItem>
                  </MenuItemGroup>
                </MenuContent>
              </MenuPositioner>
            </MenuRoot>
          ) : (
            <Button
              variant={isTeamTier ? undefined : "outline"}
              size="lg"
              className="w-full font-semibold"
              onClick={handleClick}
              disabled={isCheckoutLoading}
            >
              {isCheckoutLoading ? "Loading..." : buttonContent}
            </Button>
          )}
        </CardFooter>
      </CardRoot>

      {/* Modal for creating new workspace */}
      <CreateWorkspaceModal
        tierName={capitalizeFirstLetter(tier)}
        onSubmit={handleCreateWorkspace}
        isLoading={isCheckoutLoading}
      />
    </>
  );
};
