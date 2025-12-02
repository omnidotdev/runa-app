import { Format } from "@ark-ui/react";
import { CheckIcon } from "lucide-react";

import {
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardRoot,
  CardTitle,
} from "@/components/ui/card";
import firstLetterToUppercase from "@/lib/util/firstLetterToUppercase";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";

import type Stripe from "stripe";

interface Props {
  price: {
    id: Stripe.Price["id"];
    unit_amount: Stripe.Price["unit_amount"];
    recurring?: Stripe.Price["recurring"];
    metadata: Stripe.Price["metadata"];
    product: {
      description: Stripe.Product["description"];
      marketing_features: Stripe.Product["marketing_features"];
    };
  };
}

export const PriceCard = ({ price }: Props) => (
  <CardRoot
    key={price?.id}
    className={cn(
      "relative flex flex-1 flex-col border-2",
      price?.metadata?.tier === "team" &&
        "border-primary-700 bg-primary-50 shadow-primary/20 dark:border-primary dark:bg-primary-1000",
    )}
  >
    {price?.metadata?.tier === "team" && (
      <div className="-top-3 -translate-x-1/2 absolute left-1/2">
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
        {firstLetterToUppercase(price.metadata?.tier as string)}
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
            {price.recurring
              ? `/workspace/${price.recurring.interval}`
              : "/forever"}
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
      <Button size="lg" className="w-full font-semibold" disabled>
        {price?.metadata?.title === "free" ? "Start for Free" : "Get Started"}
      </Button>
    </CardFooter>
  </CardRoot>
);
