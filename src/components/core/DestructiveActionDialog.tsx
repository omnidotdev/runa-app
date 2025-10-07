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
import { Input } from "@/components/ui/input";
import useDialogStore from "@/lib/hooks/store/useDialogStore";
import useForm from "@/lib/hooks/useForm";

import type { ComponentProps, ReactNode } from "react";
import type { DialogType } from "@/lib/hooks/store/useDialogStore";

interface DestructiveActionDialogProps
  extends ComponentProps<typeof DialogRoot> {
  title: string;
  description: string | ReactNode;
  onConfirm: () => void;
  dialogType: DialogType;
  confirmation?: string;
}

const DestructiveActionDialog = ({
  title,
  description,
  onConfirm,
  dialogType,
  confirmation = "",
  onOpenChange,
  ...rest
}: DestructiveActionDialogProps) => {
  const { isOpen, setIsOpen } = useDialogStore({ type: dialogType });
  const inputRef = useRef<HTMLInputElement>(null);

  const form = useForm({
    defaultValues: {
      confirmationInput: "",
    },
    validators: {
      onChangeAsync: async ({ value }) =>
        value.confirmationInput !== confirmation,
    },
    onSubmit: async ({ formApi }) => {
      onConfirm();
      formApi.reset();
      setIsOpen(false);
    },
  });

  return (
    <DialogRoot
      open={isOpen}
      onOpenChange={(details) => {
        setIsOpen(details.open);
        onOpenChange?.(details);
        form.reset();
      }}
      initialFocusEl={() => inputRef.current}
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

          <form
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
            className="flex flex-col gap-2"
          >
            <form.Field name="confirmationInput">
              {(field) => (
                <div className="flex flex-col gap-2">
                  <label
                    className="text-foreground text-sm"
                    htmlFor={`confirmationInput-${confirmation}`}
                  >
                    Type{" "}
                    <strong className="text-destructive">{confirmation}</strong>{" "}
                    to confirm deletion
                  </label>

                  <Input
                    ref={inputRef}
                    id={`confirmationInput-${confirmation}`}
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="Enter confirmation text..."
                    autoComplete="off"
                    autoCorrect="off"
                    spellCheck="false"
                    variant="destructive"
                  />
                </div>
              )}
            </form.Field>

            <div className="mt-4 flex justify-end gap-2">
              <DialogCloseTrigger asChild>
                <Button variant="outline" onClick={() => form.reset()}>
                  Cancel
                </Button>
              </DialogCloseTrigger>

              <form.Subscribe
                selector={(state) => [
                  state.canSubmit,
                  state.isSubmitting,
                  state.isDefaultValue,
                ]}
              >
                {([canSubmit, isSubmitting, isDefaultValue]) => (
                  <Button
                    type="submit"
                    variant="destructive"
                    disabled={!canSubmit || isSubmitting || isDefaultValue}
                  >
                    Delete
                  </Button>
                )}
              </form.Subscribe>
            </div>
          </form>
        </DialogContent>
      </DialogPositioner>
    </DialogRoot>
  );
};

export default DestructiveActionDialog;
