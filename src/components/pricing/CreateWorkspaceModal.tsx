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
import useDialogStore, { DialogType } from "@/lib/hooks/store/useDialogStore";
import useForm from "@/lib/hooks/useForm";
import generateSlug from "@/lib/util/generateSlug";

interface Props {
  tierName: string;
  onSubmit: (workspaceName: string, slug: string) => void;
  isLoading?: boolean;
}

/**
 * Modal for creating a new workspace from the pricing page.
 * Collects workspace name and generates slug before checkout.
 */
const CreateWorkspaceModal = ({ tierName, onSubmit, isLoading }: Props) => {
  const nameRef = useRef<HTMLInputElement>(null);

  const { isOpen, setIsOpen } = useDialogStore({
    type: DialogType.CreateWorkspace,
  });

  const form = useForm({
    defaultValues: {
      name: "",
    },
    validators: {
      onSubmitAsync: async ({ value }) => {
        if (value.name.trim().length < 2) {
          return {
            fields: {
              name: "Workspace name must be at least 2 characters",
            },
          };
        }

        if (value.name.trim().length > 50) {
          return {
            fields: {
              name: "Workspace name must be less than 50 characters",
            },
          };
        }

        return null;
      },
    },
    onSubmit: async ({ value, formApi }) => {
      const slug = generateSlug(value.name.trim());
      onSubmit(value.name.trim(), slug);
      formApi.reset();
    },
  });

  const currentName = form.state.values.name;
  const previewSlug = currentName ? generateSlug(currentName.trim()) : "";

  return (
    <DialogRoot
      open={isOpen}
      onOpenChange={({ open }) => {
        setIsOpen(open);
        if (!open) {
          form.reset();
        }
      }}
      initialFocusEl={() => nameRef.current}
      trapFocus
    >
      <DialogBackdrop />
      <DialogPositioner>
        <DialogContent>
          <DialogCloseTrigger />
          <DialogTitle>Create Workspace</DialogTitle>
          <DialogDescription>
            Create a new workspace with the{" "}
            <strong className="text-primary">{tierName}</strong> plan.
          </DialogDescription>

          <form
            onSubmit={async (e) => {
              e.preventDefault();
              e.stopPropagation();
              await form.handleSubmit();
            }}
            className="flex flex-col gap-4"
          >
            <form.Field name="name">
              {(field) => (
                <div className="flex flex-col gap-2">
                  <Input
                    ref={nameRef}
                    name="name"
                    type="text"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="Workspace Name"
                    autoComplete="off"
                  />

                  {previewSlug && (
                    <p className="text-muted-foreground text-xs">
                      URL: <span className="font-mono">{previewSlug}</span>
                    </p>
                  )}

                  {field.state.meta.errors.map((error, index) => (
                    // biome-ignore lint/suspicious/noArrayIndexKey: index key for errors
                    <p key={index} className="text-destructive text-xs">
                      {error}
                    </p>
                  ))}
                </div>
              )}
            </form.Field>

            <div className="mt-2 flex justify-end gap-2">
              <Button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  form.reset();
                }}
                variant="outline"
                disabled={isLoading}
              >
                Cancel
              </Button>

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
                    disabled={
                      !canSubmit || isSubmitting || isDefaultValue || isLoading
                    }
                  >
                    {isLoading ? "Creating..." : "Continue to Checkout"}
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

export default CreateWorkspaceModal;
