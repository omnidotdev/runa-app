import { useQuery } from "@tanstack/react-query";
import { useNavigate, useRouteContext } from "@tanstack/react-router";
import { useRef } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  DialogBackdrop,
  DialogCloseTrigger,
  DialogContent,
  DialogPositioner,
  DialogRoot,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Role,
  useCreateProjectColumnMutation,
  useCreateWorkspaceMutation,
  useCreateWorkspaceUserMutation,
  useProjectColumnsQuery,
  useWorkspacesQuery,
} from "@/generated/graphql";
import { BASE_URL } from "@/lib/config/env.config";
import { Hotkeys } from "@/lib/constants/hotkeys";
import useDialogStore, { DialogType } from "@/lib/hooks/store/useDialogStore";
import useForm from "@/lib/hooks/useForm";
import workspacesOptions from "@/lib/options/workspaces.options";
import generateSlug from "@/lib/util/generateSlug";
import getQueryKeyPrefix from "@/lib/util/getQueryKeyPrefix";
import { useOrganization } from "@/providers/OrganizationProvider";
import { getCreateSubscriptionUrl } from "@/server/functions/subscriptions";

const DEFAULT_PROJECT_COLUMNS = [
  { title: "Planned", index: 0, emoji: "🗓" },
  { title: "In Progress", index: 1, emoji: "🚧" },
  { title: "Completed", index: 2, emoji: "✅" },
];

interface Props {
  /** Price ID. When not provided the workspace created will default to a free tier workspace. */
  priceId?: string;
  /** State management for the dialog. Used when global state management is not ideal. */
  state?: {
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
  };
}

const CreateWorkspaceDialog = ({ priceId, state }: Props) => {
  const navigate = useNavigate();
  const nameRef = useRef<HTMLInputElement>(null);

  const { session } = useRouteContext({ strict: false });
  const { currentOrganization } = useOrganization();

  const { isOpen: isCreateWorkspaceOpen, setIsOpen: setIsCreateWorkspaceOpen } =
    useDialogStore({
      type: DialogType.CreateWorkspace,
    });

  useHotkeys(
    Hotkeys.CreateWorkspace,
    () => setIsCreateWorkspaceOpen(!isCreateWorkspaceOpen),
    {
      enabled: !state,
    },
    [setIsCreateWorkspaceOpen, isCreateWorkspaceOpen, state],
  );

  const { mutateAsync: createTeamMember } = useCreateWorkspaceUserMutation();

  const { mutateAsync: createNewWorkspace } = useCreateWorkspaceMutation({
    meta: {
      invalidates: [
        workspacesOptions({ userId: session?.user.rowId! }).queryKey,
      ],
    },
    onSuccess: async ({ createWorkspace }) => {
      // NB: important to create team member first, as being an "owner" is required to create project columns
      await createTeamMember({
        input: {
          workspaceUser: {
            userId: session?.user?.rowId!,
            workspaceId: createWorkspace?.workspace?.rowId!,
            role: Role.Owner,
          },
        },
      });

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
      ]);

      if (priceId) {
        const checkoutUrl = await getCreateSubscriptionUrl({
          data: {
            workspaceId: createWorkspace?.workspace?.rowId,
            priceId,
            successUrl: `${BASE_URL}/workspaces/${createWorkspace?.workspace?.slug}/projects`,
          },
        });

        navigate({ href: checkoutUrl, reloadDocument: true });
      } else {
        navigate({
          to: "/workspaces/$workspaceSlug/projects",
          params: { workspaceSlug: createWorkspace?.workspace?.slug! },
        });
      }
    },
  });

  const { mutate: createProjectColumn } = useCreateProjectColumnMutation({
    meta: {
      invalidates: [
        getQueryKeyPrefix(useWorkspacesQuery),
        getQueryKeyPrefix(useProjectColumnsQuery),
      ],
    },
  });

  const { data: workspaces } = useQuery({
    ...workspacesOptions({ userId: session?.user.rowId! }),
    select: (data) => data.workspaces?.nodes,
  });

  const isWorkspaceNameAvailable = async (name: string) => {
    if (!workspaces) return true;

    return !workspaces.some(
      (workspace) => workspace.name.toLowerCase() === name.toLowerCase(),
    );
  };

  const form = useForm({
    defaultValues: {
      name: "",
    },
    validators: {
      onSubmitAsync: async ({ value }) => {
        if (value.name.trim().length < 3) {
          return {
            fields: {
              name: "Workspace name must be at least 3 characters long",
            },
          };
        }

        const isAvailable = await isWorkspaceNameAvailable(value.name);

        if (!isAvailable) {
          return {
            fields: {
              name: "This workspace name is already taken",
            },
          };
        }

        return null;
      },
    },
    onSubmit: ({ value, formApi }) => {
      if (!value.name.trim()) return;

      toast.promise(
        createNewWorkspace({
          input: {
            workspace: {
              name: value.name,
              slug: generateSlug(value.name),
              organizationId: currentOrganization.id,
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
      open={state ? state.isOpen : isCreateWorkspaceOpen}
      onOpenChange={({ open }) => {
        state ? state.setIsOpen(open) : setIsCreateWorkspaceOpen(open);
        form.reset();
      }}
      initialFocusEl={() => nameRef.current}
    >
      <DialogBackdrop />
      <DialogPositioner>
        <DialogContent>
          <DialogCloseTrigger />
          <DialogTitle>Create Workspace</DialogTitle>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
            className="mt-4 flex flex-col gap-2"
          >
            <form.Field name="name">
              {(field) => (
                <div className="flex flex-col gap-2">
                  <label className="text-foreground text-sm" htmlFor="name">
                    Name
                  </label>

                  <Input
                    ref={nameRef}
                    type="text"
                    id="name"
                    autoComplete="off"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="Workspace name"
                  />

                  <div className="h-4">
                    {field.state.meta.errors.map((error, index) => (
                      // biome-ignore lint/suspicious/noArrayIndexKey: Allow index key for error messages
                      <p key={index} className="text-destructive text-xs">
                        {error}
                      </p>
                    ))}
                  </div>
                </div>
              )}
            </form.Field>

            <div className="mt-4 flex justify-end gap-2">
              <Button
                onClick={() => {
                  state
                    ? state.setIsOpen(false)
                    : setIsCreateWorkspaceOpen(false);
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
                  state.isDefaultValue,
                ]}
              >
                {([canSubmit, isSubmitting, isDefaultValue]) => (
                  <Button
                    type="submit"
                    disabled={!canSubmit || isSubmitting || isDefaultValue}
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
