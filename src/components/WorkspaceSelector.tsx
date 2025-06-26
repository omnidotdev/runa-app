import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
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
import useDialogStore, { DialogType } from "@/lib/hooks/store/useDialogStore";
import workspaceOptions from "@/lib/options/workspace.options";
import workspacesOptions from "@/lib/options/workspaces.options";
import CreateWorkspaceDialog from "./CreateWorkspaceDialog";

const WorkspaceSelector = () => {
  // NB: We control the select's open state manually to ensure it closes properly before opening the "Create Workspace" dialog from within the select content.
  const [isSelectOpen, setIsSelectOpen] = useState(false);

  const { workspaceId } = useParams({ strict: false });
  const navigate = useNavigate();

  const { data: workspaces } = useQuery({
    ...workspacesOptions,
    select: (data) => data.workspaces?.nodes,
  });

  const { data: currentWorkspace } = useQuery({
    ...workspaceOptions(workspaceId!),
    enabled: !!workspaceId,
    select: (data) => data?.workspace,
  });

  const { setIsOpen: setIsCreateWorkspaceOpen } = useDialogStore({
    type: DialogType.CreateWorkspace,
  });

  return (
    <>
      <Select
        open={isSelectOpen}
        onOpenChange={setIsSelectOpen}
        value={String(currentWorkspace?.rowId)}
        onValueChange={(value) => {
          navigate({
            to: "/workspaces/$workspaceId/projects",
            params: { workspaceId: value },
          });
          setIsSelectOpen(false);
        }}
      >
        <SelectTrigger className="w-full max-w-40 flex-1">
          <SelectValue>
            {currentWorkspace?.name || "Select Workspace"}
          </SelectValue>
        </SelectTrigger>
        {/* TODO: handle overflow with maxH. Also will need to look into "New Workspace" button since its on the bottom of the list. */}
        <SelectContent>
          <SelectGroup className="flex flex-col gap-1">
            {workspaces?.map((workspace) => (
              <SelectItem key={workspace?.rowId} value={workspace?.rowId!}>
                <SelectItemText>{workspace?.name}</SelectItemText>
              </SelectItem>
            ))}
          </SelectGroup>

          <SelectSeparator />

          <Button
            onClick={() => {
              setIsSelectOpen(false);
              setIsCreateWorkspaceOpen(true);
            }}
            variant="ghost"
            className="w-full"
            size="sm"
          >
            <Plus className="h-4 w-4" />
            New Workspace
          </Button>
        </SelectContent>
      </Select>

      <CreateWorkspaceDialog />
    </>
  );
};

export default WorkspaceSelector;
