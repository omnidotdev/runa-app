/**
 * Rate limit error display with countdown timer.
 *
 * Shows when the user or organization has hit the rate limit,
 * with a visual countdown and retry button.
 */

import { AlertTriangleIcon, RefreshCwIcon } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface RateLimitErrorProps {
  /** Seconds until rate limit resets. */
  retryAfterSeconds: number;
  /** Whether this is a user or organization limit. */
  limitType: "user" | "organization";
  /** Called when the user clicks retry after countdown completes. */
  onRetry: () => void;
  /** Called to dismiss the error without retrying. */
  onDismiss?: () => void;
}

export function RateLimitError({
  retryAfterSeconds,
  limitType,
  onRetry,
  onDismiss,
}: RateLimitErrorProps): React.ReactElement {
  const [secondsRemaining, setSecondsRemaining] = useState(retryAfterSeconds);

  // Countdown timer
  useEffect(() => {
    if (secondsRemaining <= 0) return;

    const timer = setInterval(() => {
      setSecondsRemaining((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [secondsRemaining]);

  const handleRetry = useCallback(() => {
    if (secondsRemaining <= 0) {
      onRetry();
    }
  }, [secondsRemaining, onRetry]);

  const canRetry = secondsRemaining <= 0;
  const progressPercent = Math.max(
    0,
    ((retryAfterSeconds - secondsRemaining) / retryAfterSeconds) * 100,
  );

  const limitMessage =
    limitType === "organization"
      ? "Your organization has sent too many messages."
      : "You've sent too many messages.";

  return (
    <div
      role="alert"
      className="flex flex-col gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-950/50"
    >
      <div className="flex items-start gap-3">
        <AlertTriangleIcon className="mt-0.5 size-5 shrink-0 text-amber-600 dark:text-amber-400" />
        <div className="flex-1">
          <h3 className="font-medium text-amber-900 text-sm dark:text-amber-100">
            Rate Limit Reached
          </h3>
          <p className="mt-1 text-amber-700 text-xs dark:text-amber-300">
            {limitMessage} Please wait before trying again.
          </p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="relative h-2 w-full overflow-hidden rounded-full bg-amber-200 dark:bg-amber-800">
        <div
          className="absolute inset-y-0 left-0 bg-amber-500 transition-all duration-1000 ease-linear dark:bg-amber-400"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      <div className="flex items-center justify-between">
        <span
          className={cn(
            "text-xs",
            canRetry
              ? "text-green-600 dark:text-green-400"
              : "text-amber-600 dark:text-amber-400",
          )}
        >
          {canRetry ? "Ready to retry!" : `Try again in ${secondsRemaining}s`}
        </span>

        <div className="flex items-center gap-2">
          {onDismiss && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onDismiss}
              className="h-7 px-2 text-xs"
            >
              Dismiss
            </Button>
          )}
          <Button
            variant={canRetry ? "solid" : "outline"}
            size="sm"
            onClick={handleRetry}
            disabled={!canRetry}
            className="h-7 gap-1 px-3 text-xs"
          >
            <RefreshCwIcon className="size-3" />
            Retry
          </Button>
        </div>
      </div>
    </div>
  );
}
