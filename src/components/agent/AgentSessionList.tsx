import { Loader2Icon, PlusIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { AgentSessionItem } from "./AgentSessionItem";

import type { AgentSessionNode } from "@/lib/ai/hooks/useAgentSessions";

interface AgentSessionListProps {
  sessions: AgentSessionNode[];
  currentSessionId: string | null;
  isLoading: boolean;
  onSelectSession: (id: string) => void;
  onNewSession: () => void;
}

export function AgentSessionList({
  sessions,
  currentSessionId,
  isLoading,
  onSelectSession,
  onNewSession,
}: AgentSessionListProps) {
  return (
    <div
      className="flex flex-col gap-2"
      role="listbox"
      aria-label="Chat sessions"
    >
      <Button
        variant="outline"
        size="sm"
        onClick={onNewSession}
        className="w-full justify-start gap-2"
      >
        <PlusIcon className="size-3.5" />
        New Session
      </Button>

      {isLoading && (
        <div className="flex items-center justify-center py-4">
          <Loader2Icon className="size-4 animate-spin text-muted-foreground" />
        </div>
      )}

      {!isLoading && sessions.length === 0 && (
        <p className="py-4 text-center text-muted-foreground text-xs">
          No previous sessions
        </p>
      )}

      <div className="custom-scrollbar flex max-h-64 flex-col gap-0.5 overflow-y-auto">
        {sessions.map((session) => (
          <AgentSessionItem
            key={session.rowId}
            session={session}
            isActive={session.rowId === currentSessionId}
            onSelect={onSelectSession}
          />
        ))}
      </div>
    </div>
  );
}
