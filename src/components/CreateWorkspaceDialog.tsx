import { useNavigate, useRouteContext } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";

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
  useCreateWorkspaceMutation,
  useCreateWorkspaceUserMutation,
} from "@/generated/graphql";
import { Hotkeys } from "@/lib/constants/hotkeys";
import useDialogStore, { DialogType } from "@/lib/hooks/store/useDialogStore";
import workspacesOptions from "@/lib/options/workspaces.options";
import generateSlug from "@/lib/util/generateSlug";

import type { FormEvent } from "react";

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

  const [newWorkspaceName, setNewWorkspaceName] = useState("");

  const { mutate: createTeamMember } = useCreateWorkspaceUserMutation();

  const { mutateAsync: createNewWorkspace } = useCreateWorkspaceMutation({
    meta: {
      invalidates: [
        workspacesOptions({ userId: session?.user.rowId! }).queryKey,
      ],
    },
    onSuccess: ({ createWorkspace }) => {
      createTeamMember({
        input: {
          workspaceUser: {
            userId: session?.user?.rowId!,
            workspaceId: createWorkspace?.workspace?.rowId!,
          },
        },
      });

      navigate({
        to: "/workspaces/$workspaceSlug/projects",
        params: { workspaceSlug: createWorkspace?.workspace?.slug! },
      });
    },
  });

  const handleCreateWorkspace = async (e?: FormEvent) => {
    e?.preventDefault();
    if (!newWorkspaceName.trim()) return;

    await createNewWorkspace({
      input: {
        workspace: {
          name: newWorkspaceName,
          slug: generateSlug(newWorkspaceName),
        },
      },
    });

    setNewWorkspaceName("");
    setIsCreateWorkspaceOpen(false);
  };

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

          <form onSubmit={handleCreateWorkspace} className="p-2">
            <Input
              ref={nameRef}
              type="text"
              value={newWorkspaceName}
              onChange={(e) => setNewWorkspaceName(e.target.value)}
              placeholder="Workspace name"
            />

            <div className="mt-4 flex justify-end gap-2">
              <Button
                onClick={() => {
                  setNewWorkspaceName("");
                  setIsCreateWorkspaceOpen(false);
                }}
                variant="ghost"
              >
                Cancel
              </Button>

              <Button type="submit" disabled={!newWorkspaceName.trim()}>
                Create
              </Button>
            </div>
          </form>
        </DialogContent>
      </DialogPositioner>
    </DialogRoot>
  );
};

export default CreateWorkspaceDialog;
