import { useQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useRef, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";

import { TabsContent, TabsRoot } from "@/components/ui/tabs";
import { useAccessToken } from "@/lib/ai/hooks/useAccessToken";
import { useAgentSessions } from "@/lib/ai/hooks/useAgentSessions";
import { useCurrentSession } from "@/lib/ai/hooks/useCurrentSession";
import { useRollbackByMatch } from "@/lib/ai/hooks/useRollback";
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
import type { RollbackByMatchParams } from "@/lib/ai/hooks/useRollback";

/**
 * Converts server-side ModelMessage format to client-side UIMessage format.
 *
 * Server stores messages as: { role, content: string, toolCallId? }
 * Client expects UIMessage:  { id, role, parts: [{ type, content }] }
 *
 * Tool calls are stored as separate assistant/tool message pairs on the server,
 * but the client merges them into the assistant message's parts array.
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
      // Flush any pending assistant message
      if (currentAssistantId !== null) {
        result.push({
          id: currentAssistantId,
          role: "assistant",
          parts: currentAssistantParts,
        } as UIMessage);
        currentAssistantParts = [];
        currentAssistantId = null;
      }

      // Add user message
      result.push({
        id: `stored-user-${i}`,
        role: "user",
        parts: content ? [{ type: "text", content }] : [],
      } as UIMessage);
    } else if (role === "assistant") {
      // Check if this is a tool call placeholder (empty content with toolCallId)
      if (toolCallId && !content) {
        // Start or continue collecting assistant parts
        if (currentAssistantId === null) {
          currentAssistantId = `stored-assistant-${i}`;
        }
        // The actual tool call info would need to be extracted from the next tool message
        // For now, we'll handle this when we see the tool result
      } else if (content) {
        // Regular assistant text response
        if (currentAssistantId === null) {
          currentAssistantId = `stored-assistant-${i}`;
        }
        currentAssistantParts.push({ type: "text", content });
      }
    } else if (role === "tool") {
      // Tool result - add to current assistant's parts
      if (currentAssistantId === null) {
        currentAssistantId = `stored-assistant-${i}`;
      }
      if (toolCallId) {
        // Add a simplified tool-result part
        currentAssistantParts.push({
          type: "tool-result",
          toolCallId,
          result: content,
        });
      }
    }
  }

  // Flush any remaining assistant message
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
}: AgentChatPanelProps) {
  const accessToken = useAccessToken();
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

  // Fetch session data when selecting a previous session
  const { data: sessionData } = useQuery({
    ...agentSessionOptions({ rowId: currentSessionId ?? "" }),
    enabled: !!currentSessionId,
  });

  // Load messages from session when selecting a previous session
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
      // Reset when starting a new session
      loadedSessionIdRef.current = null;
    }
  }, [currentSessionId, sessionData, setMessages]);

  // Undo tool calls via match-based rollback
  const {
    mutate: rollbackByMatch,
    isPending: isUndoingToolCall,
    variables: undoingToolCallVars,
  } = useRollbackByMatch();

  // Only expose variables while the mutation is in-flight so ToolCallBubble
  // can identify which specific tool call is being undone.
  const undoingToolCall: RollbackByMatchParams | undefined = isUndoingToolCall
    ? undoingToolCallVars
    : undefined;

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
            onUndoToolCall={currentSessionId ? handleUndoToolCall : undefined}
            undoingToolCall={undoingToolCall}
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
