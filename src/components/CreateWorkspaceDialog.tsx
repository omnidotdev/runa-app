import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";

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
import getQueryClient from "@/utils/getQueryClient";

const CreateWorkspaceDialog = () => {
  const queryClient = getQueryClient();
  const navigate = useNavigate();

  const { isOpen: isCreateWorkspaceOpen, setIsOpen: setIsCreateWorkspaceOpen } =
    useDialogStore({
      type: DialogType.CreateWorkspace,
    });

  const [newWorkspaceName, setNewWorkspaceName] = useState("");

  const { mutateAsync: createNewWorkspace } = useCreateWorkspaceMutation({
    onSettled: () => queryClient.invalidateQueries(workspacesOptions),
    onSuccess: ({ createWorkspace }) => {
      navigate({
        to: "/workspaces/$workspaceId",
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
    >
      <DialogBackdrop />
      <DialogPositioner>
        <DialogContent>
          <DialogCloseTrigger />
          <DialogTitle>Create Workspace</DialogTitle>
          <DialogDescription>Create a new workspace</DialogDescription>

          <form onSubmit={handleCreateWorkspace} className="p-2">
            <Input
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
