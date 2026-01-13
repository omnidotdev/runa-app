import { PlusIcon, XIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import type { OnboardingData } from "./OnboardingWizard";

interface InviteTeamStepProps {
  data: Partial<OnboardingData>;
  onUpdate: (data: Partial<OnboardingData>) => void;
  onNext: () => void;
  onBack: () => void;
}

const InviteTeamStep = ({
  data,
  onUpdate,
  onNext,
  onBack,
}: InviteTeamStepProps) => {
  const [emails, setEmails] = useState<string[]>(data.inviteEmails || [""]);
  const [currentEmail, setCurrentEmail] = useState("");
  const [isInviting, setIsInviting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addEmailField = () => {
    if (currentEmail.trim() && isValidEmail(currentEmail)) {
      setEmails([...emails.filter(Boolean), currentEmail.trim()]);
      setCurrentEmail("");
      setError(null);
    } else if (currentEmail.trim()) {
      setError("Please enter a valid email address");
    }
  };

  const removeEmail = (index: number) => {
    setEmails(emails.filter((_, i) => i !== index));
  };

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleNext = async () => {
    const validEmails = emails.filter(
      (email) => email.trim() && isValidEmail(email),
    );

    if (validEmails.length === 0) {
      // Skip invitations if none provided
      onUpdate({ inviteEmails: [] });
      onNext();
      return;
    }

    if (!data.organizationId) {
      setError("Workspace not created yet");
      return;
    }

    setIsInviting(true);
    setError(null);

    try {
      // Note: We can't get the access token here directly since we're in a client component.
      // The invitations will be sent in the final step or we store emails for later.
      // For now, store the emails and send invites after completion.
      onUpdate({ inviteEmails: validEmails });
      onNext();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to send invitations";
      setError(message);
      toast.error(message);
    } finally {
      setIsInviting(false);
    }
  };

  const handleSkip = () => {
    onUpdate({ inviteEmails: [] });
    onNext();
  };

  return (
    <div className="flex flex-col gap-6 py-4">
      <p className="text-center text-muted-foreground text-sm">
        Invite team members to collaborate in your workspace. You can also do
        this later from workspace settings.
      </p>

      <div className="flex flex-col gap-3">
        <span className="font-medium text-sm">Team Members</span>

        {/* Added emails */}
        {emails.map((email, index) => (
          <div key={index} className="flex items-center gap-2">
            <div className="flex h-9 flex-1 items-center rounded-md border bg-muted/50 px-3 text-sm">
              {email}
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => removeEmail(index)}
              className="shrink-0"
            >
              <XIcon className="size-4" />
            </Button>
          </div>
        ))}

        {/* New email input */}
        <div className="flex items-center gap-2">
          <Input
            type="email"
            placeholder="colleague@example.com"
            value={currentEmail}
            onChange={(e) => {
              setCurrentEmail(e.target.value);
              setError(null);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addEmailField();
              }
            }}
          />
          <Button
            variant="outline"
            size="icon"
            onClick={addEmailField}
            disabled={!currentEmail.trim()}
            className="shrink-0"
          >
            <PlusIcon className="size-4" />
          </Button>
        </div>

        {error && <p className="text-destructive text-xs">{error}</p>}

        <p className="text-muted-foreground text-xs">
          Press Enter or click + to add more team members
        </p>
      </div>

      <div className="flex justify-between gap-4 pt-4">
        <Button variant="outline" onClick={onBack} disabled={isInviting}>
          Back
        </Button>
        <div className="flex gap-2">
          <Button variant="ghost" onClick={handleSkip} disabled={isInviting}>
            Skip for now
          </Button>
          <Button onClick={handleNext} disabled={isInviting}>
            {isInviting ? "Saving..." : "Continue"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default InviteTeamStep;
