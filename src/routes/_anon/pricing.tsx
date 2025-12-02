import { useTabs } from "@ark-ui/react";
import {
  createFileRoute,
  useCanGoBack,
  useRouter,
} from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

import { PriceCard } from "@/components/pricing/PriceCard";
import {
  AccordionItem,
  AccordionItemContent,
  AccordionItemTrigger,
  AccordionRoot,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  TabsContent,
  TabsList,
  TabsProvider,
  TabsTrigger,
} from "@/components/ui/tabs";
import { BASE_URL } from "@/lib/config/env.config";
import seo from "@/lib/util/seo";
import { getPrices } from "@/server/functions/prices";

export const FREE_PRICE = {
  id: "free",
  unit_amount: 0,
  metadata: { tier: "free" },
  product: {
    description: "Start for free.",
    marketing_features: [{ name: "2 projects" }, { name: "500 total tasks" }],
  },
};

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

export const Route = createFileRoute("/_anon/pricing")({
  head: () => ({
    meta: [
      ...seo({
        title: "Pricing",
        description: "Simple and transparent pricing.",
        url: `${BASE_URL}/pricing`,
      }),
    ],
  }),
  loader: async () => {
    const prices = await getPrices();

    return { prices };
  },
  component: PricingPage,
});

function PricingPage() {
  const router = useRouter();
  const canGoBack = useCanGoBack();
  const { prices } = Route.useLoaderData();
  const { session } = Route.useRouteContext();
  const navigate = Route.useNavigate();

  const tabs = useTabs({ defaultValue: "month" });

  const filteredPrices = prices.filter(
    (price) => price.recurring?.interval === tabs.value,
  );

  return (
    <div className="size-full pt-8">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-12">
          <Button
            variant="ghost"
            className="inline-flex items-center gap-2 text-muted-foreground text-sm hover:text-foreground"
            onClick={() =>
              canGoBack
                ? router.history.back()
                : navigate({ to: session ? "/workspaces" : "/" })
            }
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </div>

        <div className="mb-16 text-center">
          <h1 className="mb-4 font-bold text-4xl text-foreground">
            Simple, transparent pricing
          </h1>

          <p className="text-muted-foreground">
            Free and open source forever. Pay only for what you need.
          </p>
        </div>

        <TabsProvider value={tabs} className="flex w-full flex-col">
          <TabsList className="place-self-center">
            <TabsTrigger value="month">Monthly</TabsTrigger>
            <TabsTrigger value="year" className="relative">
              Yearly{" "}
              <Badge
                size="sm"
                className="-top-3.5 -right-4 absolute rotate-[12deg] px-1"
              >
                save 25%
              </Badge>
            </TabsTrigger>
          </TabsList>
          {(["month", "year"] as const).map((tab) => (
            <TabsContent key={tab} value={tab} className="flex gap-4">
              <PriceCard price={FREE_PRICE} />

              {filteredPrices.map((price) => (
                <PriceCard key={price.id} price={price} />
              ))}
            </TabsContent>
          ))}
        </TabsProvider>

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
