import { redirect } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { ArrowLeft, Check } from "lucide-react";

import Link from "@/components/core/Link";
import {
  AccordionItem,
  AccordionItemContent,
  AccordionItemTrigger,
  AccordionRoot,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { signIn } from "@/lib/auth/signIn";
import { API_BASE_URL, BASE_URL } from "@/lib/config/env.config";
import polar from "@/lib/polar/polar";
import RUNA_PRODUCT_IDS from "@/lib/polar/productIds";
import seo from "@/lib/util/seo";
import { cn } from "@/lib/utils";

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

// TODO: fetch from polar product info
const pricingPlans = [
  {
    id: "free",
    name: "Free Tier",
    price: "$0",
    priceNote: "/forever",
    description:
      "Try Runa for free and explore its features without any commitment.",
    features: ["Limited projects and tasks", "Community support"],
    action: {
      label: "Get Started",
      disabled: false,
    },
    highlight: false,
  },
  {
    id: "cloud",
    name: "Cloud",
    price: "$8",
    priceNote: "/user/month",
    description:
      "Let us handle the infrastructure while you focus on your projects.",
    features: [
      "Everything in Self-Hosted",
      "Managed cloud hosting",
      "Automatic backups & updates",
      "Priority support",
      "30-day free trial",
    ],
    action: {
      label: "Start Free Trial",
      href: "/signup",
      disabled: true,
    },
    highlight: true,
  },
];

const fetchRunaProducts = createServerFn().handler(async () => {
  const {
    result: { items: products },
  } = await polar.products.list({
    id: RUNA_PRODUCT_IDS,
    sorting: ["price_amount"],
  });

  return { products };
});

const fetchCustomerState = createServerFn()
  .validator((hidraId: string) => hidraId)
  .handler(async ({ data: hidraId }) => {
    try {
      const customer = await polar.customers.getStateExternal({
        externalId: hidraId,
      });

      return customer;
    } catch {
      return null;
    }
  });

export const Route = createFileRoute({
  head: () => ({
    meta: [...seo({ title: "Pricing" })],
  }),
  beforeLoad: async ({ context: { session } }) => {
    if (session) {
      const customer = await fetchCustomerState({
        data: session.user.hidraId!,
      });

      if (customer?.activeSubscriptions.length) {
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

        <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-2">
          {pricingPlans.map((plan) => (
            <div
              key={plan.id}
              className={cn(
                "rounded-lg bg-white shadow-lg dark:bg-muted",
                plan.highlight && "border-2 border-primary-500",
              )}
            >
              <div className="flex h-full flex-col p-8">
                <h2 className="mb-4 font-bold text-2xl text-foreground">
                  {plan.name}
                </h2>

                <div className="mb-8 flex items-baseline">
                  <span className="font-bold text-4xl text-foreground">
                    {plan.price}
                  </span>

                  <span className="ml-1 text-foreground">{plan.priceNote}</span>
                </div>

                <p className="mb-8 text-foreground">{plan.description}</p>

                <ul className="mb-8 flex-1 space-y-4">
                  {plan.features.map((feature, i) => (
                    // biome-ignore lint/suspicious/noArrayIndexKey: Allow for simplicity
                    <li key={i} className="flex items-center gap-2">
                      <Check
                        size={20}
                        className="flex-shrink-0 text-green-500"
                      />
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* TODO: fix implementation when support for multiple products is available. */}
                {plan.action && (
                  <Button
                    size="lg"
                    disabled={plan.action.disabled}
                    onClick={() => {
                      if (session) {
                        navigate({
                          href: `${API_BASE_URL}/checkout?products=${products[0].id}&customerExternalId=${session?.user?.hidraId}&customerEmail=${session?.user?.email}`,
                          reloadDocument: true,
                        });
                      } else {
                        signIn({ redirectUrl: `${BASE_URL}/pricing` });
                      }
                    }}
                  >
                    {plan.action.label}
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>

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
