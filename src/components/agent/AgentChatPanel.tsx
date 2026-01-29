import { useQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useRef, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";

import { TabsContent, TabsRoot } from "@/components/ui/tabs";
import { useAccessToken } from "@/lib/ai/hooks/useAccessToken";
import { useAgentSessions } from "@/lib/ai/hooks/useAgentSessions";
import { useCurrentSession } from "@/lib/ai/hooks/useCurrentSession";
import { useAgentChat } from "@/lib/ai/useAgentChat";
import agentPersonasOptions from "@/lib/options/agentPersonas.options";
import agentSessionOptions from "@/lib/options/agentSession.options";
import { cn } from "@/lib/utils";
import { AgentActivityFeed } from "./AgentActivityFeed";
import { AgentChatMessages } from "./AgentChatMessages";
import { AgentPanelHeader } from "./AgentPanelHeader";
import { AgentPersonaSelector } from "./AgentPersonaSelector";
import { ChatInput } from "./ChatInput";

import type { UIMessage } from "@tanstack/ai-client";

/**
 * Converts server-side ModelMessage format to client-side UIMessage format.
 */
function normalizeStoredMessages(rawMessages: unknown[]): UIMessage[] {
  const messages = rawMessages.filter(
    (msg): msg is Record<string, unknown> =>
      typeof msg === "object" &&
      msg !== null &&
      typeof (msg as Record<string, unknown>).role === "string",
  );

  const result: UIMessage[] = [];
  let currentAssistantParts: Array<{ type: string; [key: string]: unknown }> =
    [];
  let currentAssistantId: string | null = null;

  for (let i = 0; i < messages.length; i++) {
    const msg = messages[i];
    const role = msg.role as string;
    const content = typeof msg.content === "string" ? msg.content : "";
    const toolCallId =
      typeof msg.toolCallId === "string" ? msg.toolCallId : undefined;

    if (role === "user") {
      if (currentAssistantId !== null) {
        result.push({
          id: currentAssistantId,
          role: "assistant",
          parts: currentAssistantParts,
        } as UIMessage);
        currentAssistantParts = [];
        currentAssistantId = null;
      }

      result.push({
        id: `stored-user-${i}`,
        role: "user",
        parts: content ? [{ type: "text", content }] : [],
      } as UIMessage);
    } else if (role === "assistant") {
      if (toolCallId && !content) {
        if (currentAssistantId === null) {
          currentAssistantId = `stored-assistant-${i}`;
        }
      } else if (content) {
        if (currentAssistantId === null) {
          currentAssistantId = `stored-assistant-${i}`;
        }
        currentAssistantParts.push({ type: "text", content });
      }
    } else if (role === "tool") {
      if (currentAssistantId === null) {
        currentAssistantId = `stored-assistant-${i}`;
      }
      if (toolCallId) {
        currentAssistantParts.push({
          type: "tool-result",
          toolCallId,
          result: content,
        });
      }
    }
  }

  if (currentAssistantId !== null && currentAssistantParts.length > 0) {
    result.push({
      id: currentAssistantId,
      role: "assistant",
      parts: currentAssistantParts,
    } as UIMessage);
  }

  return result;
}

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
}: AgentChatPanelProps): React.ReactElement {
  const accessToken = useAccessToken();
  const {
    sessions,
    isLoading: isSessionsLoading,
    refreshSessions,
  } = useAgentSessions({ projectId, userId });

  const { currentSessionId, sessionKey, selectSession, startNewSession } =
    useCurrentSession(sessions);

  const [selectedPersonaId, setSelectedPersonaId] = useState<string | null>(
    null,
  );
  const { data: personas = [] } = useQuery({
    ...agentPersonasOptions({ organizationId, accessToken }),
    select: (data) => data ?? [],
  });

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
    setMessages,
  } = useAgentChat({
    projectId,
    sessionId: currentSessionId,
    sessionKey,
    personaId: selectedPersonaId,
    onSessionId: handleSessionId,
  });

  const { data: sessionData } = useQuery({
    ...agentSessionOptions({ rowId: currentSessionId ?? "" }),
    enabled: !!currentSessionId,
  });

  const loadedSessionIdRef = useRef<string | null>(null);
  useEffect(() => {
    if (
      currentSessionId &&
      sessionData?.agentSession?.messages &&
      loadedSessionIdRef.current !== currentSessionId
    ) {
      const rawMessages = sessionData.agentSession.messages;
      if (Array.isArray(rawMessages) && rawMessages.length > 0) {
        const normalizedMessages = normalizeStoredMessages(rawMessages);
        if (normalizedMessages.length > 0) {
          setMessages(normalizedMessages);
        }
      }
      loadedSessionIdRef.current = currentSessionId;
    } else if (!currentSessionId) {
      loadedSessionIdRef.current = null;
    }
  }, [currentSessionId, sessionData, setMessages]);

  // Handle suggestion clicks - send the message directly
  const handleSendMessage = useCallback(
    (message: string) => {
      sendMessage(message);
    },
    [sendMessage],
  );

  const panelRef = useRef<HTMLDivElement>(null);

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
      <TabsRoot
        defaultValue="chat"
        className="flex flex-1 flex-col overflow-hidden"
      >
        <AgentPanelHeader
          onClose={onClose}
          sessions={sessions}
          currentSessionId={currentSessionId}
          isSessionsLoading={isSessionsLoading}
          onSelectSession={selectSession}
          onNewSession={startNewSession}
        />

        <TabsContent
          value="chat"
          className="mt-0 flex flex-1 flex-col overflow-hidden"
        >
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
            onSendMessage={handleSendMessage}
          />
          <ChatInput
            onSend={sendMessage}
            onStop={stop}
            isLoading={isLoading}
            placeholder="Ask about your project..."
            ariaLabel="Message to AI agent"
          />
        </TabsContent>

        <TabsContent
          value="activity"
          className="mt-0 flex flex-1 flex-col overflow-hidden"
        >
          <AgentActivityFeed projectId={projectId} />
        </TabsContent>
      </TabsRoot>
    </div>
  );
}
