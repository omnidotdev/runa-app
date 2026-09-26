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
  /** Whether the dialog is open. */
  open: boolean;
  /** Called when the open state should change. */
  onOpenChange: (open: boolean) => void;
  /** Dialog heading, e.g. `Delete checklist "QA"?`. */
  title: string;
  /** Supporting copy; state clearly when an action cannot be undone. */
  description?: ReactNode;
  /** Confirm button label. */
  confirmLabel?: string;
  /** Cancel button label. */
  cancelLabel?: string;
  /** Style the confirm button as a destructive action. */
  destructive?: boolean;
  /** Whether the action is in flight (disables buttons and dismissal). */
  isPending?: boolean;
  /** Fired when the user confirms. */
  onConfirm: () => void;
}

/**
 * Shared confirmation dialog for destructive or irreversible actions. Built on the
 * app dialog primitive: it cannot be dismissed while the action is in flight, names
 * its target in the copy, and carries destructive styling on the confirm button.
 * This is UX only; the underlying permission is always enforced server-side
 */
const ConfirmDialog = ({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  destructive = false,
  isPending = false,
  onConfirm,
}: ConfirmDialogProps) => (
  <DialogRoot
    open={open}
    onOpenChange={(details) => {
      if (isPending) return;
      onOpenChange(details.open);
    }}
    closeOnInteractOutside={!isPending}
    closeOnEscape={!isPending}
  >
    <DialogBackdrop />
    <DialogPositioner>
      <DialogContent className="w-full max-w-md rounded-lg bg-background">
        <div className="mb-2 flex flex-col gap-2">
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </div>

        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            disabled={isPending}
            onClick={() => onOpenChange(false)}
          >
            {cancelLabel}
          </Button>
          <Button
            type="button"
            variant={destructive ? "destructive" : "solid"}
            disabled={isPending}
            onClick={onConfirm}
          >
            {confirmLabel}
          </Button>
        </div>
      </DialogContent>
    </DialogPositioner>
  </DialogRoot>
);

export default ConfirmDialog;
