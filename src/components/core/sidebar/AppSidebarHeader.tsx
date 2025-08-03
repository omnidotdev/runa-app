import { useQuery } from "@tanstack/react-query";
import {
  useLoaderData,
  useLocation,
  useNavigate,
  useRouteContext,
} from "@tanstack/react-router";
import { CheckIcon, ChevronsUpDown, PlusIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  MenuContent,
  MenuItem,
  MenuPositioner,
  MenuRoot,
  MenuTrigger,
} from "@/components/ui/menu";
import { SidebarHeader, SidebarMenuButton } from "@/components/ui/sidebar";
import useDialogStore, { DialogType } from "@/lib/hooks/store/useDialogStore";
import workspaceOptions from "@/lib/options/workspace.options";
import workspacesOptions from "@/lib/options/workspaces.options";
import { cn } from "@/lib/utils";

const AppSidebarHeader = () => {
  const { workspaceId } = useLoaderData({ from: "/_auth" });
  const { session } = useRouteContext({ strict: false });
  const navigate = useNavigate();
  const pathname = useLocation();

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
      {workspaces?.length ? (
        <MenuRoot>
          <MenuTrigger asChild>
            <SidebarMenuButton size="lg" className="bg-sidebar-accent">
              <div
                className={cn(
                  "flex aspect-square size-6 items-center justify-center rounded-md transition-transform group-data-[collapsible=icon]:size-8",
                  workspace
                    ? "bg-primary text-primary-foreground dark:bg-primary-400"
                    : "dark:bg-primary-400",
                )}
              >
                {workspace ? (
                  workspace.name[0]
                ) : (
                  <ChevronsUpDown className="size-4" />
                )}
              </div>

              <span className="truncate font-medium group-data-[collapsible=icon]:hidden">
                {workspace?.name ?? "Select Workspace"}
              </span>

              {workspace && (
                <ChevronsUpDown className="ml-auto group-data-[collapsible=icon]:hidden" />
              )}
            </SidebarMenuButton>
          </MenuTrigger>

          <MenuPositioner>
            <MenuContent className="no-scrollbar flex max-h-80 min-w-48 flex-col gap-1 overflow-auto rounded-lg focus:outline-none">
              {workspaces?.map((workspace) => {
                const isWorkspaceSelected =
                  workspace.slug === pathname.pathname.split("/")[2];

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
        <Button
          onClick={() => setIsCreateWorkspaceOpen(true)}
          className="text-foreground"
        >
          <PlusIcon />
          Create Workspace
        </Button>
      )}
    </SidebarHeader>
  );
};

export default AppSidebarHeader;
