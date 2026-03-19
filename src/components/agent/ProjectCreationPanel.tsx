import { RotateCcwIcon, SparklesIcon, XIcon } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";

import { Button } from "@/components/ui/button";
import { useProjectCreationChat } from "@/lib/ai/useProjectCreationChat";
import { cn } from "@/lib/utils";
import { ChatInput } from "./ChatInput";
import { ProjectCreationErrorBoundary } from "./ProjectCreationErrorBoundary";
import { ProjectCreationMessages } from "./ProjectCreationMessages";
import { TemplateSelector } from "./TemplateSelector";

import type { CreatedProject } from "@/lib/ai/useProjectCreationChat";
import type { ProjectTemplate } from "./TemplateSelector";

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
  const [showTemplates, setShowTemplates] = useState(true);
  const sessionKey = `new-${sessionGeneration}`;

  const handleProjectCreated = useCallback(
    (project: CreatedProject, boardUrl: string) => {
      onProjectCreated(project, boardUrl);
    },
    [onProjectCreated],
  );

  const [selectedTemplate, setSelectedTemplate] =
    useState<ProjectTemplate | null>(null);

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
    template: selectedTemplate,
  });

  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const textarea = panelRef.current?.querySelector("textarea");
    if (textarea instanceof HTMLElement) {
      textarea.focus();
    }
  }, []);

  useHotkeys("escape", onClose, { enableOnFormTags: ["TEXTAREA"] });

  const handleStartOver = useCallback(() => {
    setSessionGeneration((prev) => prev + 1);
    setSelectedTemplate(null);
    setShowTemplates(true);
  }, []);

  const handleTemplateSelect = useCallback(
    (template: ProjectTemplate) => {
      const message = `I'd like to create a ${template.name} project`;
      setSelectedTemplate(template);
      setShowTemplates(false);
      sendMessage({
        role: "user",
        parts: [{ type: "text", text: message }],
      });
    },
    [sendMessage],
  );

  const handleSkipTemplates = useCallback(() => {
    setShowTemplates(false);
  }, []);

  // Handle sending messages - convert string to V6 message format
  const handleSendMessage = useCallback(
    (message: string) => {
      sendMessage({
        role: "user",
        parts: [{ type: "text", text: message }],
      });
    },
    [sendMessage],
  );

  return (
    <div
      ref={panelRef}
      className={cn(
        "flex h-full w-[400px] shrink-0 flex-col border-l bg-background lg:w-[460px] xl:w-[520px] 2xl:w-[580px]",
        className,
      )}
      role="complementary"
      aria-label="Create Project with AI"
    >
      {/* Header */}
      <header className="flex items-center justify-between border-b px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex size-8 items-center justify-center rounded-md bg-primary/10">
            <SparklesIcon className="size-4 text-primary" />
          </div>
          <div>
            <h2 className="font-semibold text-sm">Create Project</h2>
            <p className="text-muted-foreground text-xs">AI-assisted setup</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          {messages.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleStartOver}
              className="gap-1.5 text-xs"
            >
              <RotateCcwIcon className="size-3" />
              Start Over
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            aria-label="Close panel"
            className="size-8"
          >
            <XIcon className="size-4" />
          </Button>
        </div>
      </header>

      {/* Content wrapped in error boundary */}
      <ProjectCreationErrorBoundary onReset={handleStartOver}>
        {showTemplates && messages.length === 0 ? (
          /* Template selection before chat starts */
          <TemplateSelector
            onSelect={handleTemplateSelect}
            onSkip={handleSkipTemplates}
            className="flex-1"
          />
        ) : (
          <>
            {/* Messages */}
            <ProjectCreationMessages
              messages={messages}
              isLoading={isLoading}
              error={error}
              onApprovalResponse={addToolApprovalResponse}
              onSendMessage={handleSendMessage}
            />

            {/* Input */}
            <ChatInput
              onSend={handleSendMessage}
              onStop={stop}
              isLoading={isLoading}
              placeholder="Describe your project..."
              ariaLabel="Describe your project"
            />
          </>
        )}
      </ProjectCreationErrorBoundary>
    </div>
  );
}
