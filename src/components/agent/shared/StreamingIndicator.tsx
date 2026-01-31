import { cn } from "@/lib/utils";

interface StreamingIndicatorProps {
  className?: string;
}

/**
 * Animated thinking dots indicator for streaming responses.
 *
 * Uses opacity-only CSS animations for smooth performance.
 * Respects prefers-reduced-motion by disabling animation.
 */
export function StreamingIndicator({ className }: StreamingIndicatorProps) {
  return (
    <div
      className={cn("flex items-center gap-2 px-4 py-3", className)}
      role="status"
      aria-label="Agent is thinking"
    >
      <div className="thinking-dots text-primary">
        <span />
        <span />
        <span />
      </div>
      <span className="sr-only">Thinking...</span>
    </div>
  );
}
