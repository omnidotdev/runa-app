import { MessageSquareIcon, SparklesIcon, XIcon, ZapIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { TabsIndicator, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AgentSessionList } from "./AgentSessionList";
import { ModelBadge, SessionContextBar } from "./shared";

import type { AgentSessionNode } from "@/lib/options/agentSessions.options";

interface AgentPanelHeaderProps {
  onClose: () => void;
  sessions: AgentSessionNode[];
  currentSessionId: string | null;
  isSessionsLoading: boolean;
  onSelectSession: (id: string) => void;
  onNewSession: () => void;
  modelId?: string;
}

export function AgentPanelHeader({
  onClose,
  sessions,
  currentSessionId,
  isSessionsLoading,
  onSelectSession,
  onNewSession,
  modelId,
}: AgentPanelHeaderProps) {
  // Find current session to get title
  const currentSession = sessions.find((s) => s.rowId === currentSessionId);

  return (
    <div className="flex flex-col">
      {/* Title row */}
      <div className="flex items-center justify-between px-4 py-2.5">
        <div className="flex items-center gap-2">
          <div className="flex size-7 items-center justify-center rounded-md bg-primary/10">
            <SparklesIcon className="size-3.5 text-primary" />
          </div>
          <h2 className="font-semibold text-sm">Agent</h2>
        </div>

        <div className="flex items-center gap-2">
          {modelId && <ModelBadge modelId={modelId} />}
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            aria-label="Close agent panel"
            className="size-7"
          >
            <XIcon className="size-3.5" />
          </Button>
        </div>
      </div>

      {/* Tab row */}
      <div className="border-b px-4 pb-2">
        <TabsList className="h-8 w-full bg-muted/50">
          <TabsTrigger
            value="chat"
            className="flex-1 gap-1.5 px-3 py-1 text-xs"
          >
            <MessageSquareIcon className="size-3" />
            Chat
          </TabsTrigger>
          <TabsTrigger
            value="activity"
            className="flex-1 gap-1.5 px-3 py-1 text-xs"
          >
            <ZapIcon className="size-3" />
            Activity
          </TabsTrigger>
          <TabsIndicator />
        </TabsList>
      </div>

      {/* Session context bar */}
      <SessionContextBar sessionTitle={currentSession?.title ?? undefined}>
        <AgentSessionList
          sessions={sessions}
          currentSessionId={currentSessionId}
          isLoading={isSessionsLoading}
          onSelectSession={onSelectSession}
          onNewSession={onNewSession}
        />
      </SessionContextBar>
    </div>
  );
}
