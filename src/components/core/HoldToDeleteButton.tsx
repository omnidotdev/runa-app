import { Trash2Icon } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import type { ButtonProps } from "@/components/ui/button";

interface Props extends ButtonProps {
  onConfirm: () => void;
  holdDuration?: number;
  className?: string;
  disabled?: boolean;
  label?: string;
}

const HoldToDeleteButton = ({
  onConfirm,
  holdDuration = 1200,
  className,
  disabled,
  label = "Hold to delete",
}: Props) => {
  const [progress, setProgress] = useState(0);
  const [holding, setHolding] = useState(false);

  const rafRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);

  const reset = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
    startTimeRef.current = null;
    setHolding(false);
    setProgress(0);
  }, []);

  const tick = useCallback(
    (timestamp: number) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const elapsed = timestamp - startTimeRef.current;
      const nextProgress = Math.min(elapsed / holdDuration, 1);
      setProgress(nextProgress);

      if (nextProgress >= 1) {
        onConfirm();
        reset();
        return;
      }

      rafRef.current = requestAnimationFrame(tick);
    },
    [holdDuration, onConfirm, reset],
  );

  const startHold = () => {
    if (disabled) return;
    setHolding(true);
    rafRef.current = requestAnimationFrame(tick);
  };

  const stopHold = () => {
    if (!holding) return;
    reset();
  };

  useEffect(() => reset, [reset]);

  return (
    <Button
      disabled={disabled}
      variant="destructive"
      aria-label={`${label}. Press and hold to confirm deletion.`}
      aria-describedby="hold-to-delete-instructions"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(progress * 100)}
      role="progressbar"
      onMouseDown={startHold}
      onMouseUp={stopHold}
      onMouseLeave={stopHold}
      onTouchStart={startHold}
      onTouchEnd={stopHold}
      onKeyDown={(e) => {
        if (e.key === " " || e.key === "Enter") {
          e.preventDefault();
          startHold();
        }
      }}
      onKeyUp={(e) => {
        if (e.key === " " || e.key === "Enter") {
          stopHold();
        }
      }}
      className={cn(
        "relative flex w-full select-none items-center gap-2 overflow-hidden rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 text-destructive text-sm transition",
        "hover:bg-destructive/10",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-destructive",
        "disabled:pointer-events-none disabled:opacity-50",
        className,
      )}
    >
      {/* Progress bar */}
      <div
        className="absolute inset-y-0 left-0 bg-destructive/20"
        style={{ width: `${progress * 100}%` }}
        aria-hidden
      />

      <Trash2Icon className="relative z-10 size-4" aria-hidden />
      <span className="relative z-10">{label}</span>

      <span id="hold-to-delete-instructions" className="sr-only">
        Press and hold to delete. Release to cancel.
      </span>
    </Button>
  );
};

export default HoldToDeleteButton;
