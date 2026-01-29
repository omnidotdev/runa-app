import { useCallback, useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

import type { ReactNode } from "react";

interface ChatMessagesContainerProps {
  children: ReactNode;
  isLoading: boolean;
  messageCount: number;
  className?: string;
  ariaLabel?: string;
}

/**
 * Unified scroll container for chat messages with streaming-aware auto-scroll.
 *
 * Key behaviors:
 * - Always scrolls to bottom during streaming unless user explicitly scrolled away
 * - Uses requestAnimationFrame for smooth updates during streaming
 * - Tracks user scroll intent separately from scroll position
 * - Resets scroll state when new streaming begins
 */
export function ChatMessagesContainer({
  children,
  isLoading,
  messageCount,
  className,
  ariaLabel = "Chat messages",
}: ChatMessagesContainerProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isUserScrolledAway, setIsUserScrolledAway] = useState(false);
  const wasLoadingRef = useRef(false);
  const rafRef = useRef<number | null>(null);
  const lastScrollHeightRef = useRef(0);

  // Scroll to bottom helper
  const scrollToBottom = useCallback((smooth = false) => {
    const container = scrollRef.current;
    if (!container) return;

    if (smooth) {
      container.scrollTo({
        top: container.scrollHeight,
        behavior: "smooth",
      });
    } else {
      container.scrollTop = container.scrollHeight;
    }
  }, []);

  // Detect user scroll intent (scrolling up while streaming)
  const handleWheel = useCallback(
    (e: WheelEvent) => {
      if (!isLoading) return;

      const container = scrollRef.current;
      if (!container) return;

      // User scrolled up while streaming - respect their intent
      if (e.deltaY < 0) {
        setIsUserScrolledAway(true);
      }

      // User scrolled down to near bottom - resume auto-scroll
      const distanceFromBottom =
        container.scrollHeight - container.scrollTop - container.clientHeight;
      if (e.deltaY > 0 && distanceFromBottom < 50) {
        setIsUserScrolledAway(false);
      }
    },
    [isLoading],
  );

  // Attach wheel listener
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    container.addEventListener("wheel", handleWheel, { passive: true });
    return () => container.removeEventListener("wheel", handleWheel);
  }, [handleWheel]);

  // Reset scroll state when streaming starts (new message being generated)
  useEffect(() => {
    if (isLoading && !wasLoadingRef.current) {
      // Streaming just started - reset user scroll intent
      setIsUserScrolledAway(false);
    }
    wasLoadingRef.current = isLoading;
  }, [isLoading]);

  // Auto-scroll during streaming using requestAnimationFrame
  // Only scrolls when content height actually changes to optimize performance
  useEffect(() => {
    if (!isLoading || isUserScrolledAway) {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      return;
    }

    const tick = () => {
      const container = scrollRef.current;
      if (container && container.scrollHeight !== lastScrollHeightRef.current) {
        lastScrollHeightRef.current = container.scrollHeight;
        scrollToBottom(false);
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [isLoading, isUserScrolledAway, scrollToBottom]);

  // Scroll to bottom when new messages are added (not during streaming)
  // biome-ignore lint/correctness/useExhaustiveDependencies: messageCount triggers scroll on new messages
  useEffect(() => {
    if (!isLoading) {
      scrollToBottom(true);
    }
  }, [messageCount, isLoading, scrollToBottom]);

  return (
    <div
      ref={scrollRef}
      className={cn(
        "custom-scrollbar flex-1 overflow-y-auto px-4 py-3",
        className,
      )}
      role="log"
      aria-live="polite"
      aria-busy={isLoading}
      aria-label={ariaLabel}
    >
      <div className="flex flex-col gap-4">{children}</div>
    </div>
  );
}
