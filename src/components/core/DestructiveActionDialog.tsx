import { AlertTriangle } from "lucide-react";
import { useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  DialogBackdrop,
  DialogCloseTrigger,
  DialogContent,
  DialogDescription,
  DialogPositioner,
  DialogRoot,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import useDialogStore from "@/lib/hooks/store/useDialogStore";

import type { ComponentProps, ReactNode } from "react";
import type { DialogType } from "@/lib/hooks/store/useDialogStore";

interface Props extends ComponentProps<typeof DialogRoot> {
  title: string;
  description: string | ReactNode;
  onConfirm: () => void;
  dialogType: DialogType;
  /** When provided, the user must type this string to enable the delete button. */
  confirmation?: string;
}

const DestructiveActionDialog = ({
  title,
  description,
  onConfirm,
  dialogType,
  confirmation,
  onOpenChange,
  ...rest
}: Props) => {
  const { isOpen, setIsOpen } = useDialogStore({ type: dialogType });
  const [confirmationInput, setConfirmationInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);

  const requiresTextConfirmation = !!confirmation;
  const isConfirmed =
    !requiresTextConfirmation || confirmationInput === confirmation;

  const handleClose = () => {
    setConfirmationInput("");
  };

  const handleConfirm = () => {
    if (!isConfirmed) return;
    onConfirm();
    setConfirmationInput("");
    setIsOpen(false);
  };

  return (
    <DialogRoot
      open={isOpen}
      onOpenChange={(details) => {
        setIsOpen(details.open);
        onOpenChange?.(details);

        if (!details.open) {
          handleClose();
        }
      }}
      initialFocusEl={() =>
        requiresTextConfirmation ? inputRef.current : cancelRef.current
      }
      {...rest}
    >
      <DialogBackdrop />
      <DialogPositioner>
        <DialogContent className="w-full max-w-md rounded-lg bg-background">
          <DialogCloseTrigger />

          <div className="mb-4 flex flex-col gap-4">
            <div className="flex size-10 items-center justify-center rounded-full border border-destructive bg-destructive/10">
              <AlertTriangle className="size-5 text-destructive" />
            </div>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </div>

          {requiresTextConfirmation && (
            <div className="mb-4 flex flex-col gap-2">
              <label
                className="text-foreground text-sm"
                htmlFor="destructive-confirmation-input"
              >
                Type{" "}
                <strong className="text-destructive">{confirmation}</strong> to
                confirm deletion
              </label>

              <Input
                ref={inputRef}
                id="destructive-confirmation-input"
                value={confirmationInput}
                onChange={(e) => setConfirmationInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && isConfirmed) {
                    e.preventDefault();
                    handleConfirm();
                  }
                }}
                placeholder="Enter confirmation text..."
                autoComplete="off"
                autoCorrect="off"
                spellCheck="false"
                className="focus-visible:ring-red-500"
              />
            </div>
          )}

          <div className="flex justify-end gap-2">
            <DialogCloseTrigger asChild>
              <Button ref={cancelRef} variant="outline">
                Cancel
              </Button>
            </DialogCloseTrigger>

            <Button
              variant="destructive"
              disabled={!isConfirmed}
              onClick={handleConfirm}
            >
              Delete
            </Button>
          </div>
        </DialogContent>
      </DialogPositioner>
    </DialogRoot>
  );
};

export default DestructiveActionDialog;
