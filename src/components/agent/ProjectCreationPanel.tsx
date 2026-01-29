import { SparklesIcon, XIcon } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";

import { Button } from "@/components/ui/button";
import { useProjectCreationChat } from "@/lib/ai/useProjectCreationChat";
import { cn } from "@/lib/utils";
import { ChatInput } from "./ChatInput";
import { ProjectCreationErrorBoundary } from "./ProjectCreationErrorBoundary";
import { ProjectCreationMessages } from "./ProjectCreationMessages";

import type { CreatedProject } from "@/lib/ai/useProjectCreationChat";

interface ProjectCreationPanelProps {
  organizationId: string;
  organizationName?: string;
  onClose: () => void;
  onProjectCreated: (project: CreatedProject, boardUrl: string) => void;
  className?: string;
}

/**
 * Slide-in panel for AI-assisted project creation.
 *
 * Guides users through a discovery conversation to create
 * well-structured projects with columns, labels, and initial tasks.
 */
export function ProjectCreationPanel({
  organizationId,
  organizationName,
  onClose,
  onProjectCreated,
  className,
}: ProjectCreationPanelProps) {
  const [sessionGeneration, setSessionGeneration] = useState(0);
  const sessionKey = `new-${sessionGeneration}`;

  const handleProjectCreated = useCallback(
    (project: CreatedProject, boardUrl: string) => {
      onProjectCreated(project, boardUrl);
    },
    [onProjectCreated],
  );

  const {
    messages,
    sendMessage,
    isLoading,
    stop,
    error,
    addToolApprovalResponse,
  } = useProjectCreationChat({
    organizationId,
    organizationName,
    sessionKey,
    onProjectCreated: handleProjectCreated,
  });

  const panelRef = useRef<HTMLDivElement>(null);

  // Focus textarea on mount
  useEffect(() => {
    const textarea = panelRef.current?.querySelector("textarea");
    if (textarea instanceof HTMLElement) {
      textarea.focus();
    }
  }, []);

  // Escape to close
  useHotkeys("escape", onClose, { enableOnFormTags: ["TEXTAREA"] });

  const handleStartOver = useCallback(() => {
    setSessionGeneration((prev) => prev + 1);
  }, []);

  return (
    <div
      ref={panelRef}
      className={cn(
        "flex h-full w-[420px] shrink-0 flex-col border-l bg-background",
        className,
      )}
      role="complementary"
      aria-label="Create Project with AI"
    >
      {/* Header */}
      <header className="flex items-center justify-between border-b px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-md bg-primary/10 text-primary">
            <SparklesIcon className="size-4" />
          </div>
          <div>
            <h2 className="font-semibold text-sm">Create Project with AI</h2>
            <p className="text-muted-foreground text-xs">
              Describe your project to get started
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          {messages.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleStartOver}
              className="text-xs"
            >
              Start Over
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            aria-label="Close panel"
          >
            <XIcon className="size-4" />
          </Button>
        </div>
      </header>

      {/* Content wrapped in error boundary */}
      <ProjectCreationErrorBoundary onReset={handleStartOver}>
        {/* Messages */}
        <ProjectCreationMessages
          messages={messages}
          isLoading={isLoading}
          error={error}
          onApprovalResponse={addToolApprovalResponse}
        />

        {/* Input */}
        <ChatInput
          onSend={sendMessage}
          onStop={stop}
          isLoading={isLoading}
          placeholder="Describe your project..."
          ariaLabel="Describe your project"
        />
      </ProjectCreationErrorBoundary>
    </div>
  );
}
