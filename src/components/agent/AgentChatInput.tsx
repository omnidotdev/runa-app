import { SendIcon, SquareIcon } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";

import type { ChangeEvent, FormEvent, KeyboardEvent } from "react";

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
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const wasLoadingRef = useRef(false);

  useEffect(() => {
    if (wasLoadingRef.current && !isLoading) {
      textareaRef.current?.focus();
    }
    wasLoadingRef.current = isLoading;
  }, [isLoading]);

  const resizeTextarea = useCallback(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, []);

  const resetTextarea = useCallback(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
  }, []);

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    resizeTextarea();
  };

  const submitMessage = useCallback(() => {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;
    setInput("");
    resetTextarea();
    Promise.resolve(onSend(trimmed)).catch(() => {
      // Error is surfaced via useChat's error state
    });
  }, [input, isLoading, onSend, resetTextarea]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    submitMessage();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submitMessage();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="border-t px-4 py-3">
      <div className="flex items-end gap-2">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Ask about your project..."
          aria-label="Message to AI agent"
          rows={1}
          // biome-ignore lint/a11y/noAutofocus: Chat input should auto-focus for immediate typing
          autoFocus
          className="max-h-32 min-h-[36px] w-full flex-1 resize-none bg-transparent text-sm outline-none placeholder:text-muted-foreground"
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
