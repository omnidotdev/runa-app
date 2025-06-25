import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectItemText,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCreateWorkspaceMutation } from "@/generated/graphql";
import workspaceOptions from "@/lib/options/workspace.options";
import workspacesOptions from "@/lib/options/workspaces.options";
import getQueryClient from "@/utils/getQueryClient";

const WorkspaceSelector = () => {
  const { workspaceId } = useParams({ strict: false });
  const navigate = useNavigate();
  const queryClient = getQueryClient();

  const [isCreating, setIsCreating] = useState(false);
  const [newWorkspaceName, setNewWorkspaceName] = useState("");

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
        <SelectTrigger className="w-full max-w-40">
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
    </div>
  );
};

export default WorkspaceSelector;
