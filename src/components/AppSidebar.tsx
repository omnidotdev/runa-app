import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "@tanstack/react-router";
import {
  ChevronsUpDownIcon,
  Command,
  Grid2X2Icon,
  ListIcon,
  LogOutIcon,
  MoonIcon,
  MoreHorizontalIcon,
  PanelLeftIcon,
  PlusIcon,
  SettingsIcon,
  SunIcon,
  Trash2Icon,
} from "lucide-react";
import { useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";

import Link from "@/components/core/Link";
import {
  MenuContent,
  MenuItem,
  MenuPositioner,
  MenuRoot,
  MenuTrigger,
} from "@/components/ui/menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuShotcut,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import { useDeleteProjectMutation } from "@/generated/graphql";
import useDialogStore, { DialogType } from "@/lib/hooks/store/useDialogStore";
import projectsOptions from "@/lib/options/projects.options";
import workspaceOptions from "@/lib/options/workspace.options";
import workspacesOptions from "@/lib/options/workspaces.options";
import { useTheme } from "@/providers/ThemeProvider";
import ConfirmDialog from "./ConfirmDialog";

import type * as React from "react";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { workspaceId } = useParams({ strict: false });
  const navigate = useNavigate();
  const [selectedProject, setSelectedProject] = useState<{
    rowId: string;
    name: string;
  }>();

  const { theme, setTheme } = useTheme();

  const toggleTheme = () =>
    theme === "dark" ? setTheme("light") : setTheme("dark");
  useHotkeys("meta+k", toggleTheme, [toggleTheme]);

  const { data: workspaces } = useQuery({
    ...workspacesOptions,
    select: (data) => data.workspaces?.nodes,
  });

  const { data: workspace } = useQuery({
    ...workspaceOptions(workspaceId!),
    enabled: !!workspaceId,
    select: (data) => data.workspace,
  });

  const { isMobile, setOpen, open } = useSidebar();

  const { mutate: deleteProject } = useDeleteProjectMutation({
    meta: {
      invalidates: [
        projectsOptions.queryKey,
        workspaceOptions(workspaceId!).queryKey,
      ],
    },
  });

  const { setIsOpen: setIsCreateProjectOpen } = useDialogStore({
    type: DialogType.CreateProject,
  });

  const { setIsOpen: setIsCreateWorkspaceOpen } = useDialogStore({
    type: DialogType.CreateWorkspace,
  });

  const { setIsOpen: setIsDeleteProjectOpen } = useDialogStore({
    type: DialogType.DeleteProject,
  });

  return (
    <>
      <Sidebar collapsible="icon" className="relative" {...props}>
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <MenuRoot>
                <MenuTrigger asChild>
                  <SidebarMenuButton className="bg-base-200 hover:bg-base-300 dark:bg-base-700 dark:hover:bg-base-800">
                    <div className="group-data-[collapsible=icon]:hidden">
                      <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate font-medium">
                          {workspace?.name ?? "Select Workspace"}
                        </span>
                      </div>
                    </div>
                    <ChevronsUpDownIcon className="ml-auto" />
                  </SidebarMenuButton>
                </MenuTrigger>

                <MenuPositioner>
                  <MenuContent className="no-scrollbar max-h-80 w-(--radix-dropdown-menu-trigger-width) min-w-56 overflow-auto rounded-lg">
                    {workspaces?.map((workspace) => (
                      <MenuItem
                        key={workspace?.rowId}
                        onClick={() => {
                          navigate({
                            to: "/workspaces/$workspaceId/projects",
                            params: { workspaceId: workspace?.rowId! },
                          });
                        }}
                        className="cursor-pointer gap-2 p-2"
                        value={workspace?.name!}
                      >
                        {workspace?.name}
                      </MenuItem>
                    ))}
                  </MenuContent>
                </MenuPositioner>
              </MenuRoot>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Workspace</SidebarGroupLabel>
            <SidebarGroupAction onClick={() => setIsCreateWorkspaceOpen(true)}>
              <PlusIcon /> <span className="sr-only">Add Workspace</span>
            </SidebarGroupAction>

            {workspaceId && (
              <SidebarMenu className="gap-2">
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="Settings">
                    <Link
                      to="/workspaces/$workspaceId/settings"
                      params={{ workspaceId: workspaceId! }}
                      variant="ghost"
                      activeProps={{
                        // NB: changing to secondary variant because outline variant produces a border shift on the icon.
                        variant: "secondary",
                      }}
                      className="w-full justify-start"
                    >
                      <SettingsIcon className="size-4" />
                      <span className="w-full truncate">Settings</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            )}
          </SidebarGroup>

          {workspaceId && (
            <SidebarGroup>
              <SidebarGroupLabel>Projects</SidebarGroupLabel>
              <SidebarGroupAction onClick={() => setIsCreateProjectOpen(true)}>
                <PlusIcon /> <span className="sr-only">Add Project</span>
              </SidebarGroupAction>

              <SidebarMenu className="gap-2">
                {workspace?.projects.nodes.map((project) => (
                  <SidebarMenuItem key={project?.rowId}>
                    <SidebarMenuButton asChild tooltip={project?.name}>
                      <Link
                        to="/workspaces/$workspaceId/projects/$projectId"
                        params={{
                          workspaceId: workspaceId!,
                          projectId: project?.rowId!,
                        }}
                        variant="ghost"
                        activeProps={{
                          variant: "outline",
                        }}
                        // NB: border added to prevent layout shift when changing variants
                        className="justify-start border border-transparent"
                      >
                        {project?.viewMode === "board" ? (
                          <Grid2X2Icon
                            className="size-4"
                            style={{ color: project?.color ?? undefined }}
                          />
                        ) : (
                          <ListIcon
                            className="size-4"
                            style={{ color: project?.color ?? undefined }}
                          />
                        )}
                        <span className="truncate">{project?.name}</span>
                      </Link>
                    </SidebarMenuButton>

                    <MenuRoot
                      positioning={{
                        strategy: "fixed",
                        placement: isMobile ? "bottom-end" : "right-start",
                      }}
                    >
                      <MenuTrigger asChild>
                        <SidebarMenuAction showOnHover>
                          <MoreHorizontalIcon />
                          <span className="sr-only">More</span>
                        </SidebarMenuAction>
                      </MenuTrigger>

                      <MenuPositioner>
                        <MenuContent className="w-48 rounded-lg bg-background">
                          <MenuItem
                            value="delete"
                            className="flex cursor-pointer items-center gap-2"
                            onClick={() => {
                              setSelectedProject({
                                rowId: project?.rowId!,
                                name: project?.name!,
                              });
                              setIsDeleteProjectOpen(true);
                            }}
                          >
                            <Trash2Icon
                              size={14}
                              className="text-muted-foreground"
                            />
                            <span>Delete Project</span>
                          </MenuItem>
                        </MenuContent>
                      </MenuPositioner>
                    </MenuRoot>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroup>
          )}
        </SidebarContent>

        <SidebarFooter className="border-t">
          <SidebarMenu className="mt-1 gap-2">
            <SidebarMenuItem>
              <SidebarMenuButton
                tooltip="Expand Sidebar"
                onClick={() => setOpen(!open)}
                className="flex justify-start border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50"
              >
                <PanelLeftIcon />
                <span className="flex w-full justify-between">
                  Collapse Sidebar
                  <SidebarMenuShotcut>
                    {/* TODO: handle ctrl v command */}
                    <Command size={12} />
                    <span>B</span>
                  </SidebarMenuShotcut>
                </span>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton
                tooltip="Toggle Theme"
                onClick={() => toggleTheme()}
                className="justify-start border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50"
              >
                {theme === "dark" ? <MoonIcon /> : <SunIcon />}
                <span className="flex w-full justify-between">
                  Toggle Theme
                  <SidebarMenuShotcut>
                    {/* TODO: handle ctrl v command */}
                    <Command size={12} />
                    <span>K</span>
                  </SidebarMenuShotcut>
                </span>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton
                tooltip="Sign Out"
                onClick={() => navigate({ to: "/" })}
                className="justify-start border bg-background text-red-600 shadow-xs hover:bg-accent dark:border-input dark:bg-input/30 dark:text-red-400 dark:hover:bg-input/50"
              >
                <LogOutIcon />
                <span>Sign Out</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>

        <SidebarRail />
      </Sidebar>

      {/* Delete Project */}
      <ConfirmDialog
        title="Danger Zone"
        description={`This will delete the project "${selectedProject?.name}" from ${workspace?.name} workspace. This action cannot be undone.`}
        onConfirm={() => {
          deleteProject({ rowId: selectedProject?.rowId! });
          navigate({
            to: "/workspaces/$workspaceId/projects",
            params: { workspaceId: workspaceId! },
          });
        }}
        dialogType={DialogType.DeleteProject}
        confirmation={`permanently delete ${selectedProject?.name}`}
        inputProps={{
          className: "focus-visible:ring-red-500",
        }}
      />
    </>
  );
}
