import { Format } from "@ark-ui/react";
import { SubscriptionRecurringInterval } from "@polar-sh/sdk/models/components/subscriptionrecurringinterval.js";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { ArrowLeft, Check } from "lucide-react";

import Link from "@/components/core/Link";
import {
  AccordionItem,
  AccordionItemContent,
  AccordionItemTrigger,
  AccordionRoot,
} from "@/components/ui/accordion";
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
  TabsContent,
  TabsList,
  TabsRoot,
  TabsTrigger,
} from "@/components/ui/tabs";
import { signIn } from "@/lib/auth/signIn";
import { API_BASE_URL, BASE_URL } from "@/lib/config/env.config";
import RUNA_PRODUCT_IDS from "@/lib/polar/productIds";
import firstLetterToUppercase from "@/lib/util/firstLetterToUppercase";
import seo from "@/lib/util/seo";
import { cn } from "@/lib/utils";
import { fetchCustomerState } from "@/server/fetchCustomerState";
import { fetchRunaProducts } from "@/server/fetchRunaProducts";

import type { ProductPriceFixed } from "@polar-sh/sdk/models/components/productpricefixed.js";

const faqItems = [
  {
    question: "What's included in the free trial?",
    answer:
      "The 30-day free trial includes all Cloud features with no limitations. No credit card required.",
  },
  {
    question: "Can I cancel at any time?",
    answer:
      "Yes, you can cancel your subscription at any time. You'll continue to have access until the end of your billing period.",
  },
  {
    question: "What happens to my data if I cancel?",
    answer:
      "You can export all your data at any time. After cancellation, your data will be retained for 30 days before being permanently deleted.",
  },
];

export const Route = createFileRoute("/_anon/pricing")({
  head: () => ({
    meta: [...seo({ title: "Pricing" })],
  }),
  beforeLoad: async ({ context: { session } }) => {
    if (session) {
      const customer = await fetchCustomerState({
        data: session.user.hidraId!,
      });

      if (
        // NB: with updated logic in polar to allow for multiple subscriptions (across Omni apps) we need to validate that the user indeed has a *Runa* specific subscription before redirecting
        // TODO: update Backfeed to include similar logic
        customer?.activeSubscriptions?.some((sub) =>
          RUNA_PRODUCT_IDS.includes(sub.productId),
        )
      ) {
        throw redirect({
          to: "/profile/$userId",
          params: { userId: session.user.hidraId! },
        });
      }
    }
  },
  loader: async () => {
    const { products } = await fetchRunaProducts();

    return { products };
  },
  component: PricingPage,
});

function PricingPage() {
  const { session } = Route.useRouteContext();
  const { products } = Route.useLoaderData();

  const navigate = Route.useNavigate();

  const freeTier = products.find(
    (product) => product.metadata.title === "free",
  );

  const monthlyTiers = [
    freeTier,
    ...products.filter(
      (product) =>
        product.recurringInterval === SubscriptionRecurringInterval.Month &&
        !product.metadata.isFree,
    ),
  ];
  const yearlyTiers = [
    freeTier,
    ...products.filter(
      (product) =>
        product.recurringInterval === SubscriptionRecurringInterval.Year,
    ),
  ];

  return (
    <div className="size-full pt-8">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-12">
          <Link
            to="/"
            variant="ghost"
            className="inline-flex items-center gap-2 text-muted-foreground text-sm hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </Link>
        </div>

        <div className="mb-16 text-center">
          <h1 className="mb-4 font-bold text-4xl text-foreground">
            Simple, transparent pricing
          </h1>

          <p className="text-muted-foreground">
            Free and open source forever. Pay only for what you need.
          </p>
        </div>

        <TabsRoot defaultValue="monthly">
          <TabsList>
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
            <TabsTrigger value="yearly">Yearly</TabsTrigger>
          </TabsList>
          {(["monthly", "yearly"] as const).map((tab) => (
            <TabsContent key={tab} value={tab} className="flex gap-4">
              {(tab === "monthly" ? monthlyTiers : yearlyTiers).map((tier) => (
                <CardRoot
                  key={tier?.id}
                  className={cn(
                    "relative flex flex-1 flex-col border-2",
                    tier?.metadata?.isRecommended &&
                      "border-primary-700 bg-primary-50 shadow-primary/20 dark:border-primary dark:bg-primary-1000",
                  )}
                >
                  {tier?.metadata?.isRecommended && (
                    <div className="-top-3 -translate-x-1/2 absolute left-1/2">
                      <span className="rounded-full bg-primary-700 px-3 py-1 font-medium text-primary-foreground text-sm dark:bg-primary">
                        Recommended
                      </span>
                    </div>
                  )}
                  <CardHeader
                    className={cn(
                      "mb-4 rounded-xl rounded-b-none bg-muted pb-8 text-center",
                      tier?.metadata?.isRecommended &&
                        "bg-primary-400/10 dark:bg-primary-950/80",
                    )}
                  >
                    <CardTitle className="font-bold text-2xl">
                      {firstLetterToUppercase(tier?.metadata?.title as string)}
                    </CardTitle>
                    <CardDescription className="mt-2 text-muted-foreground">
                      {tier?.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pb-8 text-center">
                    <div className="mb-8">
                      <div className="flex items-baseline justify-center font-bold text-4xl">
                        <Format.Number
                          value={
                            tier?.prices?.[0]?.amountType === "free"
                              ? 0
                              : (tier?.prices[0] as ProductPriceFixed)
                                  .priceAmount / 100
                          }
                          style="currency"
                          currency="USD"
                        />
                        <span className="ml-1 font-medium text-lg text-muted-foreground">
                          /
                          {tier?.prices?.[0]?.amountType === "free"
                            ? "forever"
                            : tier?.recurringInterval}
                        </span>
                      </div>
                      {tier?.recurringInterval ===
                        SubscriptionRecurringInterval.Year && (
                        <p className="mt-1 font-medium text-green-600 text-sm">
                          Save 25%
                        </p>
                      )}
                    </div>

                    <ul className="space-y-4 text-left">
                      {tier?.benefits.map((benefit) => (
                        <li key={benefit.id} className="flex items-start gap-3">
                          <div className="rounded-full bg-green-100 p-1 dark:bg-green-900">
                            <Check
                              size={14}
                              className="text-green-600 dark:text-green-400"
                            />
                          </div>
                          <span className="text-foreground leading-6">
                            {benefit.description}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter className="mt-auto pt-8">
                    <Button
                      size="lg"
                      className="w-full font-semibold"
                      onClick={() => {
                        if (session) {
                          navigate({
                            href: `${API_BASE_URL}/checkout?products=${tier?.id}&customerExternalId=${session?.user?.hidraId}&customerEmail=${session?.user?.email}`,
                            reloadDocument: true,
                          });
                        } else {
                          signIn({ redirectUrl: `${BASE_URL}/pricing` });
                        }
                      }}
                    >
                      {tier?.metadata?.title === "free"
                        ? "Start for Free"
                        : "Get Started"}
                    </Button>
                  </CardFooter>
                </CardRoot>
              ))}
            </TabsContent>
          ))}
        </TabsRoot>

        <div className="mt-24 text-center">
          <h2 className="mb-4 font-bold text-2xl text-foreground">
            Frequently Asked Questions
          </h2>

          <AccordionRoot
            multiple
            className="mx-auto mt-8 grid max-w-3xl bg-background"
          >
            {faqItems.map((item) => (
              <AccordionItem key={item.question} value={item.question}>
                <AccordionItemTrigger className="text-lg">
                  {item.question}
                </AccordionItemTrigger>

                <AccordionItemContent className="text-left text-muted-foreground">
                  {item.answer}
                </AccordionItemContent>
              </AccordionItem>
            ))}
          </AccordionRoot>
        </div>
      </div>
    </div>
  );
}
