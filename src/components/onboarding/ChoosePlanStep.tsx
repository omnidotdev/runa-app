import { CheckIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import type { OnboardingData } from "./OnboardingWizard";

interface ChoosePlanStepProps {
  data: OnboardingData;
  onUpdate: (data: Partial<OnboardingData>) => void;
  onBack: () => void;
}

const PLANS = [
  {
    id: "free" as const,
    name: "Free",
    price: "$0",
    period: "forever",
    description: "For individuals and small projects",
    features: [
      "Up to 3 team members",
      "3 projects",
      "Basic task management",
      "Community support",
    ],
  },
  {
    id: "basic" as const,
    name: "Basic",
    price: "$10",
    period: "per month",
    description: "For growing teams",
    features: [
      "Up to 10 team members",
      "Unlimited projects",
      "Advanced task views",
      "Email support",
    ],
    popular: true,
  },
  {
    id: "team" as const,
    name: "Team",
    price: "$25",
    period: "per month",
    description: "For larger organizations",
    features: [
      "Unlimited team members",
      "Unlimited projects",
      "Priority support",
      "Advanced analytics",
      "Custom integrations",
    ],
  },
];

const ChoosePlanStep = ({ data, onUpdate, onBack }: ChoosePlanStepProps) => {
  const [selectedPlan, setSelectedPlan] = useState<"free" | "basic" | "team">(
    data.selectedPlan || "free",
  );
  const [isCompleting, setIsCompleting] = useState(false);

  const handleComplete = async () => {
    setIsCompleting(true);

    try {
      onUpdate({ selectedPlan });

      // For paid plans, redirect to checkout
      // For free plan, navigate directly to workspace
      if (selectedPlan !== "free") {
        // TODO: Integrate with Aether for subscription creation
        // For now, just show a toast and continue
        toast.info(
          "Subscription setup coming soon. Starting with free plan for now.",
        );
      }

      // Navigate to the new workspace
      // Force page reload to refresh JWT claims with new org
      window.location.href = `/workspaces/${data.organizationSlug}/projects`;
    } catch (err) {
      toast.error("Failed to complete setup. Please try again.");
      setIsCompleting(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 py-4">
      <p className="text-center text-muted-foreground text-sm">
        Select a plan that fits your team's needs. You can upgrade or downgrade
        at any time.
      </p>

      <div className="grid gap-4 md:grid-cols-3">
        {PLANS.map((plan) => (
          <button
            key={plan.id}
            type="button"
            onClick={() => setSelectedPlan(plan.id)}
            className={cn(
              "relative flex flex-col rounded-lg border p-4 text-left transition-all hover:border-primary/50",
              selectedPlan === plan.id
                ? "border-primary ring-2 ring-primary ring-offset-2"
                : "border-border",
            )}
          >
            {plan.popular && (
              <span className="absolute -top-2.5 right-3 rounded-full bg-primary px-2 py-0.5 text-primary-foreground text-xs">
                Popular
              </span>
            )}

            <h4 className="font-semibold">{plan.name}</h4>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="font-bold text-2xl">{plan.price}</span>
              <span className="text-muted-foreground text-xs">
                {plan.period}
              </span>
            </div>
            <p className="mt-2 text-muted-foreground text-xs">
              {plan.description}
            </p>

            <ul className="mt-4 space-y-2">
              {plan.features.map((feature) => (
                <li
                  key={feature}
                  className="flex items-center gap-2 text-muted-foreground text-xs"
                >
                  <CheckIcon className="size-3 shrink-0 text-primary" />
                  {feature}
                </li>
              ))}
            </ul>
          </button>
        ))}
      </div>

      <div className="flex justify-between gap-4 pt-4">
        <Button variant="outline" onClick={onBack} disabled={isCompleting}>
          Back
        </Button>
        <Button onClick={handleComplete} disabled={isCompleting}>
          {isCompleting
            ? "Setting up..."
            : selectedPlan === "free"
              ? "Start with Free"
              : `Continue with ${PLANS.find((p) => p.id === selectedPlan)?.name}`}
        </Button>
      </div>
    </div>
  );
};

export default ChoosePlanStep;
