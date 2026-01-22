import { AlertTriangle } from "lucide-react";
import { useRef } from "react";

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
import useDialogStore from "@/lib/hooks/store/useDialogStore";
import ClipPathButton from "./ClipPathButton";

import type { ComponentProps, ReactNode } from "react";
import type { DialogType } from "@/lib/hooks/store/useDialogStore";

interface DestructiveActionDialogProps
  extends ComponentProps<typeof DialogRoot> {
  title: string;
  description: string | ReactNode;
  onConfirm: () => void;
  dialogType: DialogType;
}

const DestructiveActionDialog = ({
  title,
  description,
  onConfirm,
  dialogType,
  onOpenChange,
  ...rest
}: DestructiveActionDialogProps) => {
  const { isOpen, setIsOpen } = useDialogStore({ type: dialogType });
  const deleteButtonRef = useRef<HTMLButtonElement>(null);

  const handleConfirm = () => {
    onConfirm();
    setIsOpen(false);
  };

  return (
    <DialogRoot
      open={isOpen}
      onOpenChange={(details) => {
        setIsOpen(details.open);
        onOpenChange?.(details);
      }}
      initialFocusEl={() => deleteButtonRef.current}
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

          <div className="flex flex-col gap-2">
            <DialogCloseTrigger asChild>
              <Button variant="outline">Cancel</Button>
            </DialogCloseTrigger>

            <ClipPathButton onConfirm={handleConfirm} ref={deleteButtonRef} />
          </div>
        </DialogContent>
      </DialogPositioner>
    </DialogRoot>
  );
};

export default DestructiveActionDialog;
