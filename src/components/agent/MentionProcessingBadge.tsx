/**
 * Badge indicating that an AI agent mention is being processed.
 *
 * Shows a pulsing indicator, elapsed time, and option to cancel
 * after 30 seconds of waiting.
 */

import { Loader2Icon, XIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface MentionProcessingBadgeProps {
  /** Whether the agent is currently processing the mention. */
  isPolling: boolean;
  /** Seconds elapsed since the mention was submitted. */
  elapsedSeconds: number;
  /** Whether the polling timed out without a response. */
  timedOut: boolean;
  /** Called when the user wants to cancel polling. */
  onCancel: () => void;
  className?: string;
}

/**
 * Format elapsed seconds as a human-readable string.
 */
function formatElapsed(seconds: number): string {
  if (seconds < 60) {
    return `${seconds}s`;
  }
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}m ${remainingSeconds}s`;
}

export function MentionProcessingBadge({
  isPolling,
  elapsedSeconds,
  timedOut,
  onCancel,
  className,
}: MentionProcessingBadgeProps): React.ReactElement | null {
  // Show nothing if not polling and didn't time out
  if (!isPolling && !timedOut) {
    return null;
  }

  // Timed out state
  if (timedOut) {
    return (
      <div
        className={cn(
          "flex items-center gap-2 rounded-md bg-amber-50 px-2.5 py-1.5 text-amber-700 text-xs dark:bg-amber-950/50 dark:text-amber-300",
          className,
        )}
        role="status"
        aria-label="Agent response timed out"
      >
        <span>No response received. The agent may still be processing.</span>
      </div>
    );
  }

  // Show cancel button after 30 seconds
  const showCancel = elapsedSeconds >= 30;

  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-md bg-primary/10 px-2.5 py-1.5 text-primary text-xs",
        className,
      )}
      role="status"
      aria-label="Agent is processing your mention"
    >
      {/* Pulsing dot and spinner */}
      <div className="relative">
        <Loader2Icon className="size-3.5 animate-spin" />
        <span className="absolute -top-0.5 -right-0.5 size-2 animate-pulse rounded-full bg-primary" />
      </div>

      {/* Status text */}
      <span className="font-medium">Runa is thinking...</span>

      {/* Elapsed time */}
      <span className="text-primary/70">({formatElapsed(elapsedSeconds)})</span>

      {/* Cancel button (after 30s) */}
      {showCancel && (
        <Button
          variant="ghost"
          size="icon"
          className="ml-1 size-5 text-primary/70 hover:text-primary"
          onClick={onCancel}
          aria-label="Cancel waiting for response"
        >
          <XIcon className="size-3" />
        </Button>
      )}
    </div>
  );
}
