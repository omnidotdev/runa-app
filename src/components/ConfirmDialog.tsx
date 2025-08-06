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

interface ConfirmDialogProps extends ComponentProps<typeof DialogRoot> {
  title: string;
  description: string | ReactNode;
  onConfirm: () => void;
  dialogType: DialogType;
  confirmation?: string;
  inputProps?: ComponentProps<typeof Input>;
}

const ConfirmDialog = ({
  title,
  description,
  onConfirm,
  dialogType,
  confirmation = "",
  inputProps,
  onOpenChange,
  ...rest
}: ConfirmDialogProps) => {
  const { isOpen, setIsOpen } = useDialogStore({ type: dialogType });
  const [userInput, setUserInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleConfirm = () => {
    if (userInput === confirmation) {
      onConfirm();
      setUserInput("");
      setIsOpen(false);
    }
  };

  return (
    <DialogRoot
      open={isOpen}
      onOpenChange={(details) => {
        setIsOpen(details.open);
        onOpenChange?.(details);
      }}
      initialFocusEl={() => inputRef.current}
      {...rest}
    >
      <DialogBackdrop />
      <DialogPositioner>
        <DialogContent className="w-full max-w-md rounded-lg bg-background">
          <DialogCloseTrigger />

          <div className="mb-4 flex flex-col gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
              <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
            </div>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </div>

          <div className="grid gap-2">
            <label className="text-foreground text-sm" htmlFor="confirmation">
              Type <strong className="text-destructive">{confirmation}</strong>{" "}
              to confirm deletion
            </label>

            <Input
              ref={inputRef}
              id="confirmation"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Enter confirmation text..."
              autoComplete="off"
              autoCorrect="off"
              spellCheck="false"
              {...inputProps}
            />
          </div>

          <div className="flex justify-end gap-2">
            <DialogCloseTrigger asChild>
              <Button variant="outline">Cancel</Button>
            </DialogCloseTrigger>

            <Button
              onClick={handleConfirm}
              disabled={userInput !== confirmation}
              className="rounded-md bg-red-500 px-4 py-2 font-medium text-sm text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              Delete
            </Button>
          </div>
        </DialogContent>
      </DialogPositioner>
    </DialogRoot>
  );
};

export default ConfirmDialog;
