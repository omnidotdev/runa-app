import { Format } from "@ark-ui/react";
import { useNavigate, useRouteContext } from "@tanstack/react-router";
import { CheckIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardRoot,
  CardTitle,
} from "@/components/ui/card";
import signIn from "@/lib/auth/signIn";
import { AUTH_BASE_URL, BASE_URL } from "@/lib/config/env.config";
import capitalizeFirstLetter from "@/lib/util/capitalizeFirstLetter";
import { cn } from "@/lib/utils";

import type { Price } from "@/lib/providers/billing";

interface Props {
  price: Price;
}

export const PriceCard = ({ price }: Props) => {
  const { session } = useRouteContext({ strict: false });
  const navigate = useNavigate();

  const isTeamTier = price.metadata?.tier === "team";

  const handleClick = () => {
    if (!session) {
      // Not logged in - sign in first, redirect back to pricing
      signIn({ redirectUrl: `${BASE_URL}/pricing` });
      return;
    }

    if (!session.organizations?.length) {
      // Logged in but no orgs - redirect to Gatekeeper to create one
      window.location.href = `${AUTH_BASE_URL}/profile`;
      return;
    }

    // Has orgs - go to their first workspace (settings auto-provisioned)
    // For paid tiers, they can upgrade from workspace settings
    const firstOrg = session.organizations[0];
    navigate({
      to: "/workspaces/$workspaceSlug/projects",
      params: { workspaceSlug: firstOrg.slug },
    });
  };

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
          <span className="rounded-full bg-primary-700 px-3 py-1 font-medium text-primary-foreground text-sm dark:bg-primary">
            Recommended
          </span>
        </div>
      )}
      <CardHeader
        className={cn(
          "mb-4 rounded-xl rounded-b-none bg-muted pb-8 text-center",
          price.metadata?.tier === "team" &&
            "bg-primary-400/10 dark:bg-primary-950/80",
        )}
      >
        <CardTitle className="font-bold text-2xl">
          {capitalizeFirstLetter(price.metadata?.tier as string)}
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

              <span className="text-foreground leading-6">{feature.name}</span>
            </li>
          ))}
        </ul>
      </CardContent>

      <CardFooter className="mt-auto pt-8">
        <Button
          variant={isTeamTier ? undefined : "outline"}
          size="lg"
          className="w-full font-semibold"
          onClick={handleClick}
        >
          {price.metadata.tier === "free"
            ? "Get Started"
            : `Continue with ${capitalizeFirstLetter(price.metadata.tier)}`}
        </Button>
      </CardFooter>
    </CardRoot>
  );
};
