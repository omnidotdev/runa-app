/** Agent chat panel component. */

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
import { RateLimitError } from "./RateLimitError";

import type { DynamicToolUIPart, UIMessage } from "ai";

/** Content part types from ModelMessage format (Vercel AI SDK). */
interface TextContentPart {
  type: "text";
  text: string;
}

interface ToolCallContentPart {
  type: "tool-call";
  toolCallId: string;
  toolName: string;
  args: unknown;
}

interface ToolResultContentPart {
  type: "tool-result";
  toolCallId: string;
  result: unknown;
}

type ContentPart =
  | TextContentPart
  | ToolCallContentPart
  | ToolResultContentPart;

/** Raw message type from database storage (ModelMessage format). */
interface RawStoredMessage {
  role: string;
  content: string | ContentPart[];
}

/**
 * Find a matching tool result in subsequent messages.
 *
 * Tool results are stored as separate "tool" role messages in ModelMessage format.
 * This function searches forward from the current message index to find the
 * matching tool-result content part.
 */
function findToolResult(
  messages: RawStoredMessage[],
  startIndex: number,
  toolCallId: string,
): ToolResultContentPart | null {
  for (let i = startIndex + 1; i < messages.length; i++) {
    const msg = messages[i];
    if (msg.role !== "tool") continue;

    const content = msg.content;
    if (!Array.isArray(content)) continue;

    for (const part of content) {
      if (
        typeof part === "object" &&
        part !== null &&
        part.type === "tool-result" &&
        part.toolCallId === toolCallId
      ) {
        return part as ToolResultContentPart;
      }
    }
  }
  return null;
}

/**
 * Converts server-side stored messages (ModelMessage format) to UIMessage format.
 *
 * The Vercel AI SDK stores messages in ModelMessage format:
 * - User: { role: "user", content: "text" | [{type: "text", text: "..."}] }
 * - Assistant: { role: "assistant", content: [{type: "text", text: "..."}, {type: "tool-call", ...}] }
 * - Tool: { role: "tool", content: [{type: "tool-result", toolCallId, result}] }
 *
 * The UI expects UIMessage format:
 * - { id, role, parts: [{type: "text", text}, {type: "tool-invocation", toolCallId, toolName, args, state, output}] }
 *
 * This function converts between the two formats, merging tool results into
 * their corresponding tool invocation parts.
 */
function normalizeStoredMessages(rawMessages: unknown[]): UIMessage[] {
  // Filter to valid message objects
  const messages = rawMessages.filter(
    (msg): msg is RawStoredMessage =>
      typeof msg === "object" &&
      msg !== null &&
      typeof (msg as Record<string, unknown>).role === "string",
  );

  const result: UIMessage[] = [];

  for (let i = 0; i < messages.length; i++) {
    const msg = messages[i];
    const role = msg.role;

    // Skip tool messages - their results are merged into assistant messages
    if (role === "tool") continue;

    // Only process user and assistant messages
    if (role !== "user" && role !== "assistant") continue;

    const content = msg.content;
    const parts: UIMessage["parts"] = [];

    if (typeof content === "string") {
      // Simple text content
      if (content) {
        parts.push({ type: "text", text: content });
      }
    } else if (Array.isArray(content)) {
      // Content parts array (ModelMessage format)
      for (const part of content) {
        if (typeof part !== "object" || part === null) continue;

        if (
          part.type === "text" &&
          typeof part.text === "string" &&
          part.text
        ) {
          parts.push({ type: "text", text: part.text });
        } else if (
          part.type === "tool-call" &&
          typeof part.toolCallId === "string" &&
          typeof part.toolName === "string"
        ) {
          // Find matching tool result in subsequent messages
          const toolResult = findToolResult(messages, i, part.toolCallId);

          // For historical messages, use DynamicToolUIPart which supports any toolName
          // If we have a result use "output-available", otherwise "input-available"
          if (toolResult) {
            const toolPart: DynamicToolUIPart = {
              type: "dynamic-tool",
              toolCallId: part.toolCallId,
              toolName: part.toolName,
              input: part.args ?? {},
              state: "output-available",
              output: toolResult.result,
            };
            parts.push(toolPart);
          } else {
            const toolPart: DynamicToolUIPart = {
              type: "dynamic-tool",
              toolCallId: part.toolCallId,
              toolName: part.toolName,
              input: part.args ?? {},
              state: "input-available",
            };
            parts.push(toolPart);
          }
        }
      }
    }

    // Only add messages that have content
    if (parts.length > 0) {
      result.push({
        id: `stored-${role}-${i}`,
        role: role as "user" | "assistant",
        parts,
      });
    }
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
      // Don't call selectSession here - it would change sessionKey and clear messages.
      // The sessionIdRef in useAgentChat already tracks the ID for subsequent requests.
      // Just refresh the sessions list so the new session appears in the sidebar.
      refreshSessions();
    },
    [refreshSessions],
  );

  const {
    messages,
    sendMessage,
    isLoading,
    stop,
    error,
    addToolApprovalResponse,
    setMessages,
    rateLimitState,
    clearRateLimit,
    sessionId: activeSessionId,
  } = useAgentChat({
    projectId,
    sessionId: currentSessionId,
    sessionKey,
    personaId: selectedPersonaId,
    onSessionId: handleSessionId,
    onFinish: refreshSessions,
  });

  // Use the active session ID (from chat) for display, falling back to selected session
  const displaySessionId = activeSessionId ?? currentSessionId;

  // Store the last message for retry after rate limit
  const lastMessageRef = useRef<string | null>(null);

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

  // Handle sending messages - convert string to V6 message format
  const handleSendMessage = useCallback(
    (message: string) => {
      lastMessageRef.current = message;
      sendMessage({
        role: "user",
        parts: [{ type: "text", text: message }],
      });
    },
    [sendMessage],
  );

  // Handle rate limit retry
  const handleRateLimitRetry = useCallback(() => {
    clearRateLimit();
    if (lastMessageRef.current) {
      handleSendMessage(lastMessageRef.current);
    }
  }, [clearRateLimit, handleSendMessage]);

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
          currentSessionId={displaySessionId}
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
          {rateLimitState?.isLimited && (
            <div className="border-t px-3 py-2">
              <RateLimitError
                retryAfterSeconds={rateLimitState.retryAfterSeconds}
                limitType={rateLimitState.limitType}
                onRetry={handleRateLimitRetry}
                onDismiss={clearRateLimit}
              />
            </div>
          )}
          <ChatInput
            onSend={handleSendMessage}
            onStop={stop}
            isLoading={isLoading}
            disabled={rateLimitState?.isLimited}
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
