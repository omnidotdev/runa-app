import { useCallback, useEffect, useRef, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";

import { TabsContent, TabsRoot } from "@/components/ui/tabs";
import { useAgentPersonas } from "@/lib/ai/hooks/useAgentPersonas";
import { useAgentSessions } from "@/lib/ai/hooks/useAgentSessions";
import { useCurrentSession } from "@/lib/ai/hooks/useCurrentSession";
import {
  useRollbackByMatch,
  type RollbackByMatchParams,
} from "@/lib/ai/hooks/useRollback";
import { useAgentChat } from "@/lib/ai/useAgentChat";
import { cn } from "@/lib/utils";

import { AgentActivityFeed } from "./AgentActivityFeed";
import { AgentChatInput } from "./AgentChatInput";
import { AgentChatMessages } from "./AgentChatMessages";
import { AgentPanelHeader } from "./AgentPanelHeader";
import { AgentPersonaSelector } from "./AgentPersonaSelector";

interface AgentChatPanelProps {
  projectId: string;
  organizationId: string;
  userId: string;
  onClose: () => void;
  className?: string;
}

export function AgentChatPanel({
  projectId,
  organizationId,
  userId,
  onClose,
  className,
}: AgentChatPanelProps) {
  const {
    sessions,
    isLoading: isSessionsLoading,
    refreshSessions,
  } = useAgentSessions({ projectId, userId });

  const { currentSessionId, sessionKey, selectSession, startNewSession } =
    useCurrentSession(sessions);

  // Persona selection — changing persona starts a new session
  const [selectedPersonaId, setSelectedPersonaId] = useState<string | null>(
    null,
  );
  const { data: personas = [] } = useAgentPersonas(organizationId);

  const handlePersonaChange = useCallback(
    (personaId: string | null) => {
      setSelectedPersonaId(personaId);
      startNewSession();
    },
    [startNewSession],
  );

  const handleSessionId = useCallback(
    (sid: string) => {
      selectSession(sid);
      refreshSessions();
    },
    [selectSession, refreshSessions],
  );

  const {
    messages,
    sendMessage,
    isLoading,
    stop,
    error,
    addToolApprovalResponse,
  } = useAgentChat({
    projectId,
    sessionId: currentSessionId,
    sessionKey,
    personaId: selectedPersonaId,
    onSessionId: handleSessionId,
  });

  // Undo tool calls via match-based rollback
  const {
    mutate: rollbackByMatch,
    isPending: isUndoingToolCall,
    variables: undoingToolCallVars,
  } = useRollbackByMatch();

  // Only expose variables while the mutation is in-flight so ToolCallBubble
  // can identify which specific tool call is being undone.
  const undoingToolCall: RollbackByMatchParams | undefined =
    isUndoingToolCall ? undoingToolCallVars : undefined;

  const handleUndoToolCall = useCallback(
    (toolName: string, toolInput: unknown) => {
      if (!currentSessionId) return;
      rollbackByMatch({
        sessionId: currentSessionId,
        toolName,
        toolInput,
      });
    },
    [currentSessionId, rollbackByMatch],
  );

  const panelRef = useRef<HTMLDivElement>(null);

  // Focus the panel on mount so keyboard users land inside
  useEffect(() => {
    const textarea = panelRef.current?.querySelector("textarea");
    if (textarea instanceof HTMLElement) {
      textarea.focus();
    }
  }, []);

  useHotkeys("escape", onClose, { enableOnFormTags: ["TEXTAREA"] });

  return (
    <div
      ref={panelRef}
      className={cn(
        "flex h-full w-[400px] shrink-0 flex-col border-l bg-background",
        className,
      )}
      role="complementary"
      aria-label="AI Agent Panel"
    >
      <TabsRoot defaultValue="chat" className="flex flex-1 flex-col overflow-hidden">
        <AgentPanelHeader
          onClose={onClose}
          sessions={sessions}
          currentSessionId={currentSessionId}
          isSessionsLoading={isSessionsLoading}
          onSelectSession={selectSession}
          onNewSession={startNewSession}
        />

        <TabsContent value="chat" className="mt-0 flex flex-1 flex-col overflow-hidden">
          {personas.length > 0 && (
            <div className="flex items-center border-b px-3 py-1">
              <AgentPersonaSelector
                personas={personas}
                selectedPersonaId={selectedPersonaId}
                onSelect={handlePersonaChange}
              />
            </div>
          )}
          <AgentChatMessages
            messages={messages}
            isLoading={isLoading}
            error={error}
            onApprovalResponse={addToolApprovalResponse}
            onUndoToolCall={currentSessionId ? handleUndoToolCall : undefined}
            undoingToolCall={undoingToolCall}
          />
          <AgentChatInput onSend={sendMessage} onStop={stop} isLoading={isLoading} />
        </TabsContent>

        <TabsContent value="activity" className="mt-0 flex flex-1 flex-col overflow-hidden">
          <AgentActivityFeed projectId={projectId} />
        </TabsContent>
      </TabsRoot>
    </div>
  );
}
