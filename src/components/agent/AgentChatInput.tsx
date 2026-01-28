import { MicIcon, MicOffIcon, SendIcon, SquareIcon } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { useVoiceInput } from "@/lib/ai/hooks/useVoiceInput";
import { cn } from "@/lib/utils";

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
  // Captures text typed before voice starts so voice output appends rather than overwrites
  const voicePrefixRef = useRef("");

  const {
    transcript,
    interimTranscript,
    isListening,
    isSupported: isVoiceSupported,
    start: startVoice,
    stop: stopVoice,
    reset: resetVoice,
  } = useVoiceInput();

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

  // Sync voice transcript into the text input, preserving any pre-existing typed text
  useEffect(() => {
    const combined = transcript + interimTranscript;
    if (combined) {
      setInput(voicePrefixRef.current + combined);
      resizeTextarea();
    }
  }, [transcript, interimTranscript, resizeTextarea]);

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    resizeTextarea();
  };

  const submitMessage = useCallback(() => {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;
    setInput("");
    resetTextarea();
    if (isListening) {
      stopVoice();
    }
    resetVoice();
    voicePrefixRef.current = "";
    Promise.resolve(onSend(trimmed)).catch(() => {
      // Error is surfaced via useChat's error state
    });
  }, [input, isLoading, isListening, onSend, resetTextarea, resetVoice, stopVoice]);

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

  const handleVoiceToggle = () => {
    if (isListening) {
      stopVoice();
    } else {
      // Capture any existing typed text so voice output appends after it
      voicePrefixRef.current = input ? `${input} ` : "";
      startVoice();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="border-t px-4 py-3">
      <div className="flex items-end gap-2">
        <div className="relative flex-1">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder={
              isListening ? "Listening..." : "Ask about your project..."
            }
            aria-label="Message to AI agent"
            rows={1}
            autoFocus
            className={cn(
              "max-h-32 min-h-[36px] w-full resize-none bg-transparent text-sm outline-none placeholder:text-muted-foreground",
              isListening && "placeholder:text-primary",
            )}
            disabled={isLoading}
          />
          {isListening && (
            <span
              className="absolute right-0 top-1/2 size-2 -translate-y-1/2 animate-pulse rounded-full bg-red-500"
              aria-hidden="true"
            />
          )}
        </div>
        {/* Screen reader announcement for voice state changes */}
        <span className="sr-only" aria-live="polite" role="status">
          {isListening ? "Voice input is active. Speak now." : ""}
        </span>
        {isVoiceSupported && !isLoading && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={handleVoiceToggle}
            aria-label={isListening ? "Stop voice input" : "Start voice input"}
            className={cn(isListening && "text-red-500 hover:text-red-600")}
          >
            {isListening ? (
              <MicOffIcon className="size-4" />
            ) : (
              <MicIcon className="size-4" />
            )}
          </Button>
        )}
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
