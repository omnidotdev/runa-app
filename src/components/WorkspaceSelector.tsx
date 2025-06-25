import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "@tanstack/react-router";
import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";

import ConfirmDialog from "@/components/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectItemIndicator,
  SelectItemText,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useCreateWorkspaceMutation,
  useDeleteWorkspaceMutation,
} from "@/generated/graphql";
import workspaceOptions from "@/lib/options/workspace.options";
import workspacesOptions from "@/lib/options/workspaces.options";
import getQueryClient from "@/utils/getQueryClient";

const WorkspaceSelector = () => {
  const { workspaceId } = useParams({ strict: false });

  const navigate = useNavigate();

  const queryClient = getQueryClient();
  const [isCreating, setIsCreating] = useState(false);
  const [newWorkspaceName, setNewWorkspaceName] = useState("");
  const [workspaceToDelete, setWorkspaceToDelete] = useState<string | null>(
    null,
  );

  const { data: workspaces } = useQuery({
    ...workspacesOptions,
    select: (data) => data.workspaces?.nodes,
  });

  const { data: currentWorkspace } = useQuery({
    ...workspaceOptions(workspaceId!),
    enabled: !!workspaceId,
    select: (data) => data?.workspace,
  });

  const { mutateAsync: createNewWorkspace } = useCreateWorkspaceMutation({
    onSettled: () => queryClient.invalidateQueries(workspacesOptions),
  });

  const { mutate: deleteWorkspace } = useDeleteWorkspaceMutation({
    onMutate: () => navigate({ to: "/workspaces", replace: true }),
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
    setIsCreating(false);
  };

  return (
    <div>
      <Select
        value={String(currentWorkspace?.rowId)}
        onValueChange={(value) => {
          navigate({
            to: "/workspaces/$workspaceId",
            params: { workspaceId: value },
          });
        }}
      >
        <SelectTrigger className="w-full">
          <SelectValue>
            {currentWorkspace?.name || "Select Workspace"}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {isCreating ? (
            <form onSubmit={handleCreateWorkspace} className="p-2">
              <Input
                type="text"
                value={newWorkspaceName}
                onChange={(e) => setNewWorkspaceName(e.target.value)}
                placeholder="Workspace name"
              />
              <div className="mt-2 flex justify-end gap-2">
                <Button
                  onClick={() => {
                    setIsCreating(false);
                    setNewWorkspaceName("");
                  }}
                  size="xs"
                  variant="ghost"
                  className="text-xs"
                >
                  Cancel
                </Button>

                <Button
                  type="submit"
                  disabled={!newWorkspaceName.trim()}
                  size="xs"
                  className="text-xs"
                >
                  Create
                </Button>
              </div>
            </form>
          ) : (
            <>
              <SelectGroup className="flex flex-col gap-1">
                {workspaces?.map((workspace) => (
                  <SelectItem key={workspace?.rowId} value={workspace?.rowId!}>
                    <SelectItemText>{workspace?.name}</SelectItemText>

                    {workspaces.length > 1 &&
                      workspace?.rowId === currentWorkspace?.rowId && (
                        <SelectItemIndicator
                          onPointerDown={(e) => {
                            e.preventDefault();
                            setWorkspaceToDelete(workspace?.rowId!);
                          }}
                          className="hover:text-red-500"
                        >
                          <Trash2 className="size-3 opacity-0 group-hover:opacity-100 dark:hover:text-red-400" />
                        </SelectItemIndicator>
                      )}
                  </SelectItem>
                ))}
              </SelectGroup>

              <SelectSeparator />

              <Button
                onClick={() => setIsCreating(true)}
                variant="ghost"
                className="w-full"
              >
                <Plus className="h-4 w-4" />
                New Workspace
              </Button>
            </>
          )}
        </SelectContent>
      </Select>

      {workspaceToDelete && (
        <ConfirmDialog
          title="Delete Workspace"
          message="Are you sure you want to delete this workspace? This will delete all projects and tasks within it."
          onConfirm={() => {
            deleteWorkspace({
              rowId: workspaceToDelete,
            });
            setWorkspaceToDelete(null);
          }}
          onCancel={() => setWorkspaceToDelete(null)}
        />
      )}
    </div>
  );
};

export default WorkspaceSelector;
