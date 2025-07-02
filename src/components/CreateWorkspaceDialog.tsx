import { useNavigate } from "@tanstack/react-router";
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
import { useCreateWorkspaceMutation } from "@/generated/graphql";
import useDialogStore, { DialogType } from "@/lib/hooks/store/useDialogStore";
import workspacesOptions from "@/lib/options/workspaces.options";

const CreateWorkspaceDialog = () => {
  const navigate = useNavigate();
  const nameRef = useRef<HTMLInputElement>(null);

  const { isOpen: isCreateWorkspaceOpen, setIsOpen: setIsCreateWorkspaceOpen } =
    useDialogStore({
      type: DialogType.CreateWorkspace,
    });

  const [newWorkspaceName, setNewWorkspaceName] = useState("");

  const { mutateAsync: createNewWorkspace } = useCreateWorkspaceMutation({
    meta: {
      invalidates: [workspacesOptions.queryKey],
    },
    onSuccess: ({ createWorkspace }) => {
      navigate({
        to: "/workspaces/$workspaceId/projects",
        params: { workspaceId: createWorkspace?.workspace?.rowId! },
      });
    },
  });

  const handleCreateWorkspace = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!newWorkspaceName.trim()) return;

    await createNewWorkspace({
      input: {
        workspace: {
          name: newWorkspaceName,
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
