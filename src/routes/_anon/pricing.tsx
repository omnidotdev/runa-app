import { Format } from "@ark-ui/react";
import { SubscriptionRecurringInterval } from "@polar-sh/sdk/models/components/subscriptionrecurringinterval.js";
import { redirect } from "@tanstack/react-router";
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

export const Route = createFileRoute({
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
        product.recurringInterval === SubscriptionRecurringInterval.Month,
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
            <TabsContent key={tab} value={tab} className="flex gap-2">
              {(tab === "monthly" ? monthlyTiers : yearlyTiers).map((tier) => (
                <CardRoot key={tier?.id} className="flex-1">
                  <CardHeader>
                    <CardTitle>
                      {firstLetterToUppercase(tier?.metadata?.title as string)}{" "}
                      Tier
                    </CardTitle>
                    <CardDescription>{tier?.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-baseline font-semibold text-xl">
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
                      <p className="font-normal text-sm">{`/${tier?.recurringInterval ?? "forever"}`}</p>
                    </div>

                    <ul className="mt-8 flex-1 space-y-4">
                      {tier?.benefits.map((benefit) => (
                        <li
                          key={benefit.id}
                          className="flex items-center gap-2"
                        >
                          <Check
                            size={20}
                            className="flex-shrink-0 text-green-500"
                          />
                          <span className="text-muted-foreground">
                            {benefit.description}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button
                      size="lg"
                      className="w-full"
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
                      Get Started
                    </Button>
                  </CardFooter>
                </CardRoot>
              ))}
            </TabsContent>
          ))}
        </TabsRoot>

        <div className="mt-16 text-center">
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
