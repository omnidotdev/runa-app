import { RocketIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

interface WelcomeStepProps {
  onNext: () => void;
}

const WelcomeStep = ({ onNext }: WelcomeStepProps) => {
  return (
    <div className="flex flex-col items-center gap-6 py-8">
      <div className="flex size-20 items-center justify-center rounded-full bg-primary/10">
        <RocketIcon className="size-10 text-primary" />
      </div>

      <div className="max-w-md text-center">
        <h3 className="mb-3 font-semibold text-lg">Welcome to Runa</h3>
        <p className="text-muted-foreground">
          Runa helps you manage projects and collaborate with your team
          efficiently. Let's get you set up with your first workspace in just a
          few steps.
        </p>
      </div>

      <ul className="mt-4 space-y-3 text-left">
        <FeatureItem>
          Create and organize projects with customizable boards
        </FeatureItem>
        <FeatureItem>
          Invite team members and collaborate in real-time
        </FeatureItem>
        <FeatureItem>Track progress with flexible task management</FeatureItem>
      </ul>

      <Button size="lg" className="mt-6" onClick={onNext}>
        Get Started
      </Button>
    </div>
  );
};

const FeatureItem = ({ children }: { children: React.ReactNode }) => (
  <li className="flex items-center gap-3 text-sm">
    <div className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/20">
      <CheckIcon className="size-3 text-primary" />
    </div>
    <span className="text-muted-foreground">{children}</span>
  </li>
);

const CheckIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    role="img"
    aria-label="Included"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

export default WelcomeStep;
