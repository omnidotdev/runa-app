import { SparklesIcon, XIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useAgentChat } from "@/lib/ai/useAgentChat";

import { AgentChatInput } from "./AgentChatInput";
import { AgentChatMessages } from "./AgentChatMessages";

interface AgentChatPanelProps {
  projectId: string;
  accessToken: string;
  onClose: () => void;
}

export function AgentChatPanel({
  projectId,
  accessToken,
  onClose,
}: AgentChatPanelProps) {
  const { messages, sendMessage, isLoading, stop, error } = useAgentChat({
    projectId,
    accessToken,
  });

  return (
    <div className="flex h-full w-[400px] shrink-0 flex-col border-l bg-background">
      <div className="flex items-center justify-between border-b px-4 py-3">
        <div className="flex items-center gap-2">
          <SparklesIcon className="size-4 text-primary" />
          <h2 className="font-semibold text-sm">Agent</h2>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          aria-label="Close agent panel"
        >
          <XIcon className="size-4" />
        </Button>
      </div>

      <AgentChatMessages
        messages={messages}
        isLoading={isLoading}
        error={error}
      />

      <AgentChatInput onSend={sendMessage} onStop={stop} isLoading={isLoading} />
    </div>
  );
}
