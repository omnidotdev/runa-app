import {
  HistoryIcon,
  MessageSquareIcon,
  SparklesIcon,
  XIcon,
  ZapIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  PopoverContent,
  PopoverPositioner,
  PopoverRoot,
  PopoverTrigger,
} from "@/components/ui/popover";
import { TabsIndicator, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AgentSessionList } from "./AgentSessionList";

import type { AgentSessionNode } from "@/lib/options/agentSessions.options";

interface AgentPanelHeaderProps {
  onClose: () => void;
  sessions: AgentSessionNode[];
  currentSessionId: string | null;
  isSessionsLoading: boolean;
  onSelectSession: (id: string) => void;
  onNewSession: () => void;
}

export function AgentPanelHeader({
  onClose,
  sessions,
  currentSessionId,
  isSessionsLoading,
  onSelectSession,
  onNewSession,
}: AgentPanelHeaderProps) {
  return (
    <div className="flex flex-col gap-0 border-b">
      <div className="flex items-center justify-between px-4 py-2">
        <div className="flex items-center gap-2">
          <SparklesIcon className="size-4 text-primary" />
          <h2 className="font-semibold text-sm">Agent</h2>
        </div>

        <div className="flex items-center gap-1">
          <PopoverRoot positioning={{ placement: "bottom-end" }}>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Browse sessions"
                className="size-7"
              >
                <HistoryIcon className="size-3.5" />
              </Button>
            </PopoverTrigger>
            <PopoverPositioner>
              <PopoverContent className="w-72 p-3">
                <AgentSessionList
                  sessions={sessions}
                  currentSessionId={currentSessionId}
                  isLoading={isSessionsLoading}
                  onSelectSession={onSelectSession}
                  onNewSession={onNewSession}
                />
              </PopoverContent>
            </PopoverPositioner>
          </PopoverRoot>

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

      <TabsList className="mx-4 mb-2 h-8 bg-muted/50">
        <TabsTrigger value="chat" className="flex-1 gap-1.5 px-3 py-1 text-xs">
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
  );
}
