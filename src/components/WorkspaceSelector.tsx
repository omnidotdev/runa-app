import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "@tanstack/react-router";

import {
  createListCollection,
  Select,
  SelectContent,
  SelectItem,
  SelectItemGroup,
  SelectItemText,
  SelectTrigger,
  SelectValueText,
} from "@/components/ui/select";
import workspaceOptions from "@/lib/options/workspace.options";
import workspacesOptions from "@/lib/options/workspaces.options";
import CreateWorkspaceDialog from "./CreateWorkspaceDialog";

// TODO: Handle situation where there are no workspaces available, within the Route handlers.
const WorkspaceSelector = () => {
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

  const collection = createListCollection({
    items:
      workspaces?.map((workspace) => ({
        label: workspace?.name || "",
        value: workspace?.rowId || "",
      })) ?? [],
  });

  return (
    <div className="w-full">
      <Select
        // @ts-ignore TODO type issues
        collection={collection}
        value={currentWorkspace?.rowId ? [String(currentWorkspace.rowId)] : []}
        onValueChange={(details) => {
          if (details.value[0]) {
            navigate({
              to: "/workspaces/$workspaceId/projects",
              params: { workspaceId: details.value[0] },
            });
          }
        }}
      >
        <SelectTrigger className="w-full max-w-40">
          <SelectValueText className="overflow-hidden truncate text-ellipsis whitespace-nowrap">
            {currentWorkspace?.name || "Select Workspace"}
          </SelectValueText>
        </SelectTrigger>

        <SelectContent className="items-center gap-2">
          <SelectItemGroup className="flex min-w-36 flex-col gap-1">
            {collection.items.map((item) => (
              <SelectItem
                key={item.value}
                item={item}
                // className="w-full min-w-40"
              >
                <SelectItemText className="overflow-hidden truncate text-ellipsis whitespace-nowrap">
                  {item.label}
                </SelectItemText>
              </SelectItem>
            ))}
          </SelectItemGroup>
        </SelectContent>
      </Select>

      <CreateWorkspaceDialog />
    </div>
  );
};

export default WorkspaceSelector;
