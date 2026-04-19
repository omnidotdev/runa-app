import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

import { PriceCard } from "@/components/pricing";
import {
  AccordionItem,
  AccordionItemContent,
  AccordionItemTrigger,
  AccordionRoot,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import {
  TabsContent,
  TabsList,
  TabsRoot,
  TabsTrigger,
} from "@/components/ui/tabs";
import { BASE_URL } from "@/lib/config/env.config";
import { FREE_PRICE as FREE_PRICE_FALLBACK } from "@/lib/constants/tiers";
import pricesOptions from "@/lib/options/prices.options";
import createMetaTags from "@/lib/util/createMetaTags";
import { getSubscription } from "@/server/functions/subscriptions";

import type { Subscription } from "@/lib/providers/billing";

const faqItems = [
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

const searchSchema = z.object({
  tier: z.enum(["free", "pro", "team"]).optional(),
});

export const Route = createFileRoute("/_public/pricing")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      ...createMetaTags({
        title: "Pricing",
        description: "Simple and transparent pricing.",
        url: `${BASE_URL}/pricing`,
      }),
    ],
  }),
  loader: async ({ context: { queryClient, session } }) => {
    const prices = await queryClient.ensureQueryData(pricesOptions());

    // Fetch subscriptions for all user organizations to determine current tiers
    const orgSubscriptions: Record<string, Subscription | null> = {};

    if (session?.organizations) {
      const subscriptionPromises = session.organizations.map(async (org) => {
        try {
          const subscription = await getSubscription({
            data: { organizationId: org.id },
          });
          return { orgId: org.id, subscription };
        } catch {
          return { orgId: org.id, subscription: null };
        }
      });

      const results = await Promise.all(subscriptionPromises);
      for (const { orgId, subscription } of results) {
        orgSubscriptions[orgId] = subscription;
      }
    }

    // Use free tier from Stripe/Aether if available, otherwise fall back
    const freePrice =
      prices.find((p) => p.metadata?.tier === "free") ?? FREE_PRICE_FALLBACK;

    return { prices, freePrice, orgSubscriptions };
  },
  component: PricingPage,
});

function PricingPage() {
  const { prices, freePrice, orgSubscriptions } = Route.useLoaderData();

  return (
    <div className="size-full pt-8">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <h1 className="mb-4 font-bold text-4xl text-foreground">
            Simple, transparent pricing
          </h1>

          <p className="text-muted-foreground">
            Free and open source. Pay only for what you need.
          </p>
        </div>

        <TabsRoot defaultValue="month" className="flex w-full flex-col">
          <TabsList className="place-self-center">
            <TabsTrigger value="month" className="rounded-lg">
              Monthly
            </TabsTrigger>

            <TabsTrigger value="year" className="relative rounded-lg">
              Yearly{" "}
              <Badge className="absolute -top-4 -right-4 rotate-12 px-1">
                save 20%
              </Badge>
            </TabsTrigger>
          </TabsList>

          <div className="pt-2">
            {(["month", "year"] as const).map((tab) => (
              <TabsContent
                key={tab}
                value={tab}
                className="flex flex-wrap gap-4"
              >
                <PriceCard
                  price={freePrice}
                  orgSubscriptions={orgSubscriptions}
                />

                {prices
                  .filter((price) => price.recurring?.interval === tab)
                  .map((price) => (
                    <PriceCard
                      key={price.id}
                      price={price}
                      orgSubscriptions={orgSubscriptions}
                    />
                  ))}
              </TabsContent>
            ))}
          </div>
        </TabsRoot>

        <div className="mt-24 text-center">
          <h2 className="mb-4 font-bold text-2xl text-foreground">
            Frequently Asked Questions
          </h2>

          <AccordionRoot multiple className="mx-auto mt-8 grid max-w-3xl">
            {faqItems.map((item) => (
              <AccordionItem
                key={item.question}
                value={item.question}
                className="border-0"
              >
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
