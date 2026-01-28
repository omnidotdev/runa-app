import { useCallback } from "react";
import { useHotkeys } from "react-hotkeys-hook";

import { TabsContent, TabsRoot } from "@/components/ui/tabs";
import { useAgentSessions } from "@/lib/ai/hooks/useAgentSessions";
import { useCurrentSession } from "@/lib/ai/hooks/useCurrentSession";
import { useAgentChat } from "@/lib/ai/useAgentChat";
import { cn } from "@/lib/utils";

import { AgentActivityFeed } from "./AgentActivityFeed";
import { AgentChatInput } from "./AgentChatInput";
import { AgentChatMessages } from "./AgentChatMessages";
import { AgentPanelHeader } from "./AgentPanelHeader";

interface AgentChatPanelProps {
  projectId: string;
  userId: string;
  accessToken: string;
  onClose: () => void;
  className?: string;
}

export function AgentChatPanel({
  projectId,
  userId,
  accessToken,
  onClose,
  className,
}: AgentChatPanelProps) {
  const {
    sessions,
    isLoading: isSessionsLoading,
    refreshSessions,
  } = useAgentSessions({ projectId, userId });

  const { currentSessionId, selectSession, startNewSession } =
    useCurrentSession(sessions);

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
    accessToken,
    sessionId: currentSessionId,
    onSessionId: handleSessionId,
  });

  useHotkeys("escape", onClose, { enableOnFormTags: ["TEXTAREA"] });

  return (
    <div
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
          <AgentChatMessages
            messages={messages}
            isLoading={isLoading}
            error={error}
            onApprovalResponse={addToolApprovalResponse}
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
