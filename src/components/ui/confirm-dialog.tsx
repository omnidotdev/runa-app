import { Loader2Icon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DialogBackdrop,
  DialogContent,
  DialogDescription,
  DialogPositioner,
  DialogRoot,
  DialogTitle,
} from "@/components/ui/dialog";

import type { ReactNode } from "react";

interface ConfirmDialogProps {
  /** Whether the dialog is open (controlled). */
  open: boolean;
  /** Called with the next open state; close by passing false. */
  onOpenChange: (open: boolean) => void;
  /** Short question naming the target, e.g. "Revoke calendar feed?". */
  title: string;
  /** What the action does and that it cannot be undone. */
  description?: ReactNode;
  /** Confirm button label (defaults to "Confirm"). */
  confirmLabel?: string;
  /** Cancel button label (defaults to "Cancel"). */
  cancelLabel?: string;
  /** Whether the confirmed action is in flight (locks the dialog open). */
  isPending?: boolean;
  /** Invoked when the user confirms. */
  onConfirm: () => void;
}

/**
 * Confirmation dialog for destructive or otherwise irreversible actions, so a
 * single misclick cannot revoke, delete, or discard something. The confirm
 * button is styled destructive, and the dialog cannot be dismissed (backdrop,
 * Escape, or Cancel) while the confirmed action is in flight.
 */
const ConfirmDialog = ({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  isPending = false,
  onConfirm,
}: ConfirmDialogProps) => (
  <DialogRoot
    open={open}
    onOpenChange={(details) => {
      // never dismiss mid-action
      if (isPending) return;
      onOpenChange(details.open);
    }}
  >
    <DialogBackdrop />
    <DialogPositioner>
      <DialogContent className="bg-background w-full max-w-md rounded-lg">
        <div className="mb-4 flex flex-col gap-4">
          <DialogTitle>{title}</DialogTitle>
          {description ? (
            <DialogDescription>{description}</DialogDescription>
          ) : null}
        </div>

        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            disabled={isPending}
            onClick={() => onOpenChange(false)}
          >
            {cancelLabel}
          </Button>
          <Button
            variant="destructive"
            disabled={isPending}
            onClick={onConfirm}
          >
            {isPending && <Loader2Icon className="animate-spin" />}
            {confirmLabel}
          </Button>
        </div>
      </DialogContent>
    </DialogPositioner>
  </DialogRoot>
);

export default ConfirmDialog;
