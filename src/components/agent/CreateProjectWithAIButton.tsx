import { useNavigate } from "@tanstack/react-router";
import { SparklesIcon } from "lucide-react";
import { useCallback, useState } from "react";

import { Tooltip } from "@/components/core";
import { Button } from "@/components/ui/button";
import { ProjectCreationPanel } from "./ProjectCreationPanel";

import type { CreatedProject } from "@/lib/ai/useProjectCreationChat";

interface CreateProjectWithAIButtonProps {
  organizationId: string;
  organizationName?: string;
  workspaceSlug: string;
  /** Whether to render as icon-only button (default: false) */
  iconOnly?: boolean;
  /** Whether button is disabled (e.g., max projects reached) */
  disabled?: boolean;
  /** Custom class name */
  className?: string;
}

/**
 * Button that opens the AI-assisted project creation panel.
 *
 * Can be rendered as a full button with text or as an icon-only button.
 * After successful project creation, navigates to the new project board.
 */
export function CreateProjectWithAIButton({
  organizationId,
  organizationName,
  workspaceSlug,
  iconOnly = false,
  disabled = false,
  className,
}: CreateProjectWithAIButtonProps) {
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const navigate = useNavigate();

  const handleProjectCreated = useCallback(
    (project: CreatedProject, boardUrl: string) => {
      // Close panel first
      setIsPanelOpen(false);

      // Navigate to the new project
      // boardUrl format: /workspaces/{orgSlug}/projects/{projectSlug}
      navigate({
        to: "/workspaces/$workspaceSlug/projects/$projectSlug",
        params: {
          workspaceSlug,
          projectSlug: project.slug,
        },
      });
    },
    [navigate, workspaceSlug],
  );

  const handleClose = useCallback(() => {
    setIsPanelOpen(false);
  }, []);

  const buttonContent = iconOnly ? (
    <SparklesIcon className="size-4" />
  ) : (
    <>
      <SparklesIcon className="size-4" />
      <span>Create with AI</span>
    </>
  );

  const button = (
    <Button
      variant="outline"
      size={iconOnly ? "icon" : "sm"}
      onClick={() => setIsPanelOpen(true)}
      disabled={disabled}
      aria-label="Create project with AI"
      className={className}
    >
      {buttonContent}
    </Button>
  );

  return (
    <>
      {iconOnly ? (
        <Tooltip
          positioning={{ placement: "bottom" }}
          tooltip="Create with AI"
          trigger={button}
        />
      ) : (
        button
      )}

      {isPanelOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="flex-1 bg-black/20"
            onClick={handleClose}
            onKeyDown={(e) => e.key === "Escape" && handleClose()}
            role="button"
            tabIndex={0}
            aria-label="Close panel"
          />
          {/* Panel */}
          <ProjectCreationPanel
            organizationId={organizationId}
            organizationName={organizationName}
            onClose={handleClose}
            onProjectCreated={handleProjectCreated}
          />
        </div>
      )}
    </>
  );
}
