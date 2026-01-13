import { useState } from "react";

import {
  CardContent,
  CardDescription,
  CardHeader,
  CardRoot,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import ChoosePlanStep from "./ChoosePlanStep";
import CreateWorkspaceStep from "./CreateWorkspaceStep";
import InviteTeamStep from "./InviteTeamStep";
import WelcomeStep from "./WelcomeStep";

export interface OnboardingData {
  workspaceName: string;
  organizationId: string;
  organizationSlug: string;
  inviteEmails: string[];
  selectedPlan: "free" | "basic" | "team";
}

const STEPS = [
  { id: "welcome", title: "Welcome", description: "Get started with Runa" },
  {
    id: "workspace",
    title: "Create Workspace",
    description: "Set up your first workspace",
  },
  {
    id: "invite",
    title: "Invite Team",
    description: "Add your team members",
  },
  {
    id: "plan",
    title: "Choose Plan",
    description: "Select a plan that fits your needs",
  },
] as const;

type StepId = (typeof STEPS)[number]["id"];

const OnboardingWizard = () => {
  const [currentStep, setCurrentStep] = useState<StepId>("welcome");
  const [data, setData] = useState<Partial<OnboardingData>>({
    inviteEmails: [],
    selectedPlan: "free",
  });

  const currentStepIndex = STEPS.findIndex((s) => s.id === currentStep);
  const currentStepInfo = STEPS[currentStepIndex];

  const goToNextStep = () => {
    const nextIndex = currentStepIndex + 1;
    if (nextIndex < STEPS.length) {
      setCurrentStep(STEPS[nextIndex].id);
    }
  };

  const goToPrevStep = () => {
    const prevIndex = currentStepIndex - 1;
    if (prevIndex >= 0) {
      setCurrentStep(STEPS[prevIndex].id);
    }
  };

  const updateData = (updates: Partial<OnboardingData>) => {
    setData((prev) => ({ ...prev, ...updates }));
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case "welcome":
        return <WelcomeStep onNext={goToNextStep} />;
      case "workspace":
        return (
          <CreateWorkspaceStep
            data={data}
            onUpdate={updateData}
            onNext={goToNextStep}
            onBack={goToPrevStep}
          />
        );
      case "invite":
        return (
          <InviteTeamStep
            data={data}
            onUpdate={updateData}
            onNext={goToNextStep}
            onBack={goToPrevStep}
          />
        );
      case "plan":
        return (
          <ChoosePlanStep
            data={data as OnboardingData}
            onUpdate={updateData}
            onBack={goToPrevStep}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-2xl">
        {/* Progress indicator */}
        <div className="mb-8 flex justify-center gap-2">
          {STEPS.map((step, index) => (
            <div
              key={step.id}
              className={cn(
                "flex items-center gap-2",
                index < STEPS.length - 1 && "flex-1",
              )}
            >
              <div
                className={cn(
                  "flex size-8 items-center justify-center rounded-full font-medium text-sm transition-colors",
                  index < currentStepIndex
                    ? "bg-primary text-primary-foreground"
                    : index === currentStepIndex
                      ? "bg-primary text-primary-foreground ring-2 ring-primary ring-offset-2"
                      : "bg-muted text-muted-foreground",
                )}
              >
                {index < currentStepIndex ? (
                  <CheckIcon className="size-4" />
                ) : (
                  index + 1
                )}
              </div>
              {index < STEPS.length - 1 && (
                <div
                  className={cn(
                    "h-0.5 flex-1 transition-colors",
                    index < currentStepIndex ? "bg-primary" : "bg-muted",
                  )}
                />
              )}
            </div>
          ))}
        </div>

        <CardRoot>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">{currentStepInfo.title}</CardTitle>
            <CardDescription>{currentStepInfo.description}</CardDescription>
          </CardHeader>
          <CardContent>{renderStepContent()}</CardContent>
        </CardRoot>
      </div>
    </div>
  );
};

const CheckIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    role="img"
    aria-label="Completed"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

export default OnboardingWizard;
