import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  createListCollection,
  Select,
  SelectContent,
  SelectItem,
  SelectItemGroup,
  SelectItemText,
  SelectSeparator,
  SelectTrigger,
  SelectValueText,
} from "@/components/ui/select";
import useDialogStore, { DialogType } from "@/lib/hooks/store/useDialogStore";
import workspaceOptions from "@/lib/options/workspace.options";
import workspacesOptions from "@/lib/options/workspaces.options";
import CreateWorkspaceDialog from "./CreateWorkspaceDialog";

// TODO: Handle situation where there are no workspaces available, within the Route handlers.
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

  const collection = createListCollection({
    items:
      workspaces?.map((workspace) => ({
        label: workspace?.name || "",
        value: workspace?.rowId || "",
      })) ?? [],
  });

  return (
    <>
      <Select
        // @ts-ignore TODO type issues
        collection={collection}
        open={isSelectOpen}
        onOpenChange={({ open }) => setIsSelectOpen(open)}
        value={currentWorkspace?.rowId ? [String(currentWorkspace.rowId)] : []}
        onValueChange={(details) => {
          if (details.value[0]) {
            navigate({
              to: "/workspaces/$workspaceId/projects",
              params: { workspaceId: details.value[0] },
            });
          }
          setIsSelectOpen(false);
        }}
      >
        <SelectTrigger className="flex w-full flex-1">
          <SelectValueText>
            {currentWorkspace?.name || "Select Workspace"}
          </SelectValueText>
        </SelectTrigger>
        {/* TODO: handle overflow with maxH. Also will need to look into "New Workspace" button since its on the bottom of the list. */}
        <SelectContent>
          <SelectItemGroup className="flex flex-col gap-1">
            {collection.items.map((item) => (
              <SelectItem key={item.value} item={item}>
                <SelectItemText>{item.label}</SelectItemText>
              </SelectItem>
            ))}
          </SelectItemGroup>

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
