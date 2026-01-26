import { Trash2Icon } from "lucide-react";
import { useRef, useState } from "react";
import { useTimeout } from "usehooks-ts";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import type { ButtonProps } from "@/components/ui/button";

const HOLD_DURATION = 2000;

interface Props extends ButtonProps {
  onConfirm: () => void;
}

const HoldToDeleteButton = ({ onConfirm, className, ...props }: Props) => {
  const [isActive, setIsActive] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  const resetConfirmation = () => setIsConfirmed(false);
  useTimeout(resetConfirmation, isConfirmed ? HOLD_DURATION : null);

  const startHold = () => {
    if (isConfirmed) return;
    setIsActive(true);
    timeoutRef.current = window.setTimeout(() => {
      setIsConfirmed(true);
      setIsActive(false);
      onConfirm();
    }, HOLD_DURATION);
  };

  const cancelHold = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (!isConfirmed) setIsActive(false);
  };

  return (
    <Button
      variant="destructive"
      aria-label="Hold to delete"
      aria-pressed={isActive}
      className={cn(
        "relative flex w-full select-none items-center gap-2 overflow-hidden rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 text-destructive text-sm transition-transform duration-150 ease-out hover:bg-destructive/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-destructive active:scale-[0.97] disabled:pointer-events-none disabled:opacity-50",
        className,
      )}
      onPointerDown={startHold}
      onPointerUp={cancelHold}
      onPointerLeave={cancelHold}
      onPointerCancel={cancelHold}
      {...props}
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 flex items-center justify-center gap-2 rounded-md bg-destructive/20 transition-[clip-path]"
        style={{
          clipPath: isActive ? "inset(0% 0% 0% 0%)" : "inset(0% 100% 0% 0%)",
          transition: isActive
            ? `clip-path ${HOLD_DURATION}ms linear`
            : "clip-path 200ms ease-out",
        }}
      >
        <Trash2Icon className="size-4" aria-hidden />
        Hold to Delete
      </div>
      <Trash2Icon className="size-4" aria-hidden />
      Hold to Delete
    </Button>
  );
};

export default HoldToDeleteButton;
