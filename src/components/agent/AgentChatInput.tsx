import { SendIcon, SquareIcon } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";

import type { FormEvent, KeyboardEvent } from "react";

interface AgentChatInputProps {
  onSend: (message: string) => void | Promise<void>;
  onStop: () => void;
  isLoading: boolean;
}

export function AgentChatInput({
  onSend,
  onStop,
  isLoading,
}: AgentChatInputProps) {
  const [input, setInput] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;
    setInput("");
    Promise.resolve(onSend(trimmed)).catch(() => {
      // Error is surfaced via useChat's error state
    });
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="border-t px-4 py-3">
      <div className="flex items-end gap-2">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask about your project..."
          rows={1}
          className="max-h-32 min-h-[36px] flex-1 resize-none bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          disabled={isLoading}
        />
        {isLoading ? (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onStop}
            aria-label="Stop generating"
          >
            <SquareIcon className="size-4" />
          </Button>
        ) : (
          <Button
            type="submit"
            variant="ghost"
            size="icon"
            disabled={!input.trim()}
            aria-label="Send message"
          >
            <SendIcon className="size-4" />
          </Button>
        )}
      </div>
    </form>
  );
}
