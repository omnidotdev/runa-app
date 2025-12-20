import { useQuery } from "@tanstack/react-query";
import {
  useLoaderData,
  useLocation,
  useNavigate,
  useRouteContext,
} from "@tanstack/react-router";
import { CheckIcon, ChevronsUpDown, PlusIcon } from "lucide-react";

import {
  MenuContent,
  MenuItem,
  MenuPositioner,
  MenuRoot,
  MenuTrigger,
} from "@/components/ui/menu";
import { SidebarHeader, SidebarMenuButton } from "@/components/ui/sidebar";
import app from "@/lib/config/app.config";
import useDialogStore, { DialogType } from "@/lib/hooks/store/useDialogStore";
import workspaceOptions from "@/lib/options/workspace.options";
import workspacesOptions from "@/lib/options/workspaces.options";
import { cn } from "@/lib/utils";
import { Badge } from "../ui/badge";

const AppSidebarHeader = () => {
  const { workspaceId } = useLoaderData({ from: "/_auth" });
  const { session } = useRouteContext({ strict: false });
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const { data: workspaces } = useQuery({
    ...workspacesOptions({ userId: session?.user.rowId! }),
    select: (data) => data.workspaces?.nodes,
  });

  const { data: workspace } = useQuery({
    ...workspaceOptions({
      rowId: workspaceId!,
      userId: session?.user?.rowId!,
    }),
    enabled: !!workspaceId,
    select: (data) => data.workspace,
  });

  const { setIsOpen: setIsCreateWorkspaceOpen } = useDialogStore({
    type: DialogType.CreateWorkspace,
  });

  return (
    <SidebarHeader>
      <div className="mb-4 flex justify-between">
        <div className="flex gap-2">
          <span className="ml-2">🌙</span>
          <span className="font-semibold group-data-[collapsible=icon]:hidden">
            {app.name}
          </span>
        </div>

        <Badge className="border-primary-500/20 bg-primary-500/10 text-primary-500 text-xs group-data-[collapsible=icon]:hidden">
          Alpha
        </Badge>
      </div>

      {workspaces?.length ? (
        <MenuRoot>
          <MenuTrigger asChild>
            <SidebarMenuButton className="bg-sidebar-accent focus-visible:ring-offset-background">
              <ChevronsUpDown className="rotate-none!" />

              <span className="flex w-full items-center group-data-[collapsible=icon]:hidden">
                {workspace?.name ?? "Select Workspace"}
              </span>
            </SidebarMenuButton>
          </MenuTrigger>

          <MenuPositioner>
            <MenuContent className="no-scrollbar flex max-h-80 min-w-48 flex-col gap-1 overflow-auto rounded-lg focus:outline-none">
              {workspaces?.map((workspace) => {
                const isWorkspaceSelected =
                  workspace.slug === pathname.split("/")[2];

                return (
                  <MenuItem
                    key={workspace?.rowId}
                    onClick={() => {
                      navigate({
                        to: "/workspaces/$workspaceSlug/projects",
                        params: { workspaceSlug: workspace.slug },
                      });
                    }}
                    className={cn(
                      "cursor-pointer justify-between gap-1 px-2 py-1",
                      isWorkspaceSelected && "bg-sidebar-accent",
                    )}
                    value={workspace.name}
                  >
                    {workspace.name}

                    {isWorkspaceSelected && <CheckIcon color="green" />}
                  </MenuItem>
                );
              })}
            </MenuContent>
          </MenuPositioner>
        </MenuRoot>
      ) : (
        <SidebarMenuButton
          onClick={() => setIsCreateWorkspaceOpen(true)}
          className="border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground"
        >
          <PlusIcon />

          <span>Create Workspace</span>
        </SidebarMenuButton>
      )}
    </SidebarHeader>
  );
};

export default AppSidebarHeader;
