import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createOrganization } from "@/server/functions/organizations";
import { provisionWorkspace } from "@/server/functions/workspaces";

import type { OnboardingData } from "./OnboardingWizard";

interface CreateWorkspaceStepProps {
  data: Partial<OnboardingData>;
  onUpdate: (data: Partial<OnboardingData>) => void;
  onNext: () => void;
  onBack: () => void;
}

const CreateWorkspaceStep = ({
  data,
  onUpdate,
  onNext,
  onBack,
}: CreateWorkspaceStepProps) => {
  const [name, setName] = useState(data.workspaceName || "");
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreate = async () => {
    if (!name.trim()) {
      setError("Workspace name is required");
      return;
    }

    if (name.trim().length < 3) {
      setError("Workspace name must be at least 3 characters");
      return;
    }

    setError(null);
    setIsCreating(true);

    try {
      // Create organization in IDP
      const org = await createOrganization({
        data: { name: name.trim() },
      });

      // Provision workspace in Runa
      await provisionWorkspace({
        data: { organizationId: org.id },
      });

      onUpdate({
        workspaceName: name.trim(),
        organizationId: org.id,
        organizationSlug: org.slug,
      });

      onNext();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to create workspace";
      setError(message);
      toast.error(message);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 py-4">
      <p className="text-center text-muted-foreground text-sm">
        A workspace is where you and your team will manage projects. Choose a
        name that represents your team or organization.
      </p>

      <div className="flex flex-col gap-2">
        <label htmlFor="workspace-name" className="font-medium text-sm">
          Workspace Name
        </label>
        <Input
          id="workspace-name"
          type="text"
          placeholder="e.g., Acme Corp, Marketing Team"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setError(null);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !isCreating) {
              handleCreate();
            }
          }}
          autoFocus
        />
        {error && <p className="text-destructive text-xs">{error}</p>}
      </div>

      <div className="flex justify-between gap-4 pt-4">
        <Button variant="outline" onClick={onBack} disabled={isCreating}>
          Back
        </Button>
        <Button onClick={handleCreate} disabled={isCreating || !name.trim()}>
          {isCreating ? "Creating..." : "Create Workspace"}
        </Button>
      </div>
    </div>
  );
};

export default CreateWorkspaceStep;
