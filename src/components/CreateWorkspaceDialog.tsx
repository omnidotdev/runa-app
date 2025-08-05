import { useNavigate, useRouteContext } from "@tanstack/react-router";
import { useRef } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { toast } from "sonner";

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
import {
  useCreateProjectColumnMutation,
  useCreateWorkspaceMutation,
  useCreateWorkspaceUserMutation,
} from "@/generated/graphql";
import { Hotkeys } from "@/lib/constants/hotkeys";
import useDialogStore, { DialogType } from "@/lib/hooks/store/useDialogStore";
import useForm from "@/lib/hooks/useForm";
import workspacesOptions from "@/lib/options/workspaces.options";
import generateSlug from "@/lib/util/generateSlug";

const DEFAULT_PROJECT_COLUMNS = [
  { title: "Planned", index: 0, emoji: "🗓️" },
  { title: "In Progress", index: 1, emoji: "🚧" },
  { title: "Completed", index: 2, emoji: "✅" },
];

const CreateWorkspaceDialog = () => {
  const navigate = useNavigate();
  const nameRef = useRef<HTMLInputElement>(null);

  const { session } = useRouteContext({ strict: false });

  const { isOpen: isCreateWorkspaceOpen, setIsOpen: setIsCreateWorkspaceOpen } =
    useDialogStore({
      type: DialogType.CreateWorkspace,
    });

  useHotkeys(
    Hotkeys.CreateWorkspace,
    () => setIsCreateWorkspaceOpen(!isCreateWorkspaceOpen),
    [setIsCreateWorkspaceOpen, isCreateWorkspaceOpen],
  );

  const { mutate: createTeamMember } = useCreateWorkspaceUserMutation();

  const { mutateAsync: createNewWorkspace } = useCreateWorkspaceMutation({
    meta: {
      invalidates: [
        workspacesOptions({ userId: session?.user.rowId! }).queryKey,
      ],
    },
    onSuccess: async ({ createWorkspace }) => {
      await Promise.all([
        ...DEFAULT_PROJECT_COLUMNS.map((column) =>
          createProjectColumn({
            input: {
              projectColumn: {
                ...column,
                workspaceId: createWorkspace?.workspace?.rowId!,
              },
            },
          }),
        ),
        createTeamMember({
          input: {
            workspaceUser: {
              userId: session?.user?.rowId!,
              workspaceId: createWorkspace?.workspace?.rowId!,
            },
          },
        }),
      ]);

      navigate({
        to: "/workspaces/$workspaceSlug/projects",
        params: { workspaceSlug: createWorkspace?.workspace?.slug! },
      });
    },
  });

  const { mutate: createProjectColumn } = useCreateProjectColumnMutation({
    meta: {
      invalidates: [["all"]],
    },
  });

  const form = useForm({
    defaultValues: {
      name: "",
    },
    onSubmit: ({ value, formApi }) => {
      if (!value.name.trim()) return;

      toast.promise(
        createNewWorkspace({
          input: {
            workspace: {
              name: value.name,
              slug: generateSlug(value.name),
            },
          },
        }),
        {
          loading: "Creating Workspace...",
          success: "Workspace created successfully!",
          error: "Something went wrong! Please try again.",
        },
      );

      setIsCreateWorkspaceOpen(false);
      formApi.reset();
    },
  });

  return (
    <DialogRoot
      open={isCreateWorkspaceOpen}
      onOpenChange={({ open }) => setIsCreateWorkspaceOpen(open)}
      initialFocusEl={() => nameRef.current}
    >
      <DialogBackdrop />
      <DialogPositioner>
        <DialogContent>
          <DialogCloseTrigger />
          <DialogTitle>Create Workspace</DialogTitle>
          <DialogDescription>Create a new workspace</DialogDescription>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
            className="flex flex-col gap-2"
          >
            <form.Field name="name">
              {(field) => (
                <Input
                  ref={nameRef}
                  type="text"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="Workspace name"
                />
              )}
            </form.Field>

            <div className="mt-4 flex justify-end gap-2">
              <Button
                onClick={() => {
                  setIsCreateWorkspaceOpen(false);
                  form.reset();
                }}
                variant="outline"
              >
                Cancel
              </Button>

              <form.Subscribe
                selector={(state) => [
                  state.canSubmit,
                  state.isSubmitting,
                  state.isDirty,
                ]}
              >
                {([canSubmit, isSubmitting, isDirty]) => (
                  <Button
                    type="submit"
                    disabled={!canSubmit || isSubmitting || !isDirty}
                  >
                    Create
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

export default CreateWorkspaceDialog;
