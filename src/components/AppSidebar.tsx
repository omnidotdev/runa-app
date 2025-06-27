"use client";

import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "@tanstack/react-router";
import {
  ChevronsUpDown,
  Grid2X2Icon,
  List,
  LogOut,
  Moon,
  MoreHorizontal,
  Plus,
  Settings,
  Sun,
  Trash2,
} from "lucide-react";
import { useState } from "react";

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
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import { useDeleteProjectMutation } from "@/generated/graphql";
import useDialogStore, { DialogType } from "@/lib/hooks/store/useDialogStore";
import projectsOptions from "@/lib/options/projects.options";
import workspaceOptions from "@/lib/options/workspace.options";
import workspacesOptions from "@/lib/options/workspaces.options";
import { useTheme } from "@/providers/ThemeProvider";
import getQueryClient from "@/utils/getQueryClient";
import ConfirmDialog from "./ConfirmDialog";

import type * as React from "react";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { workspaceId } = useParams({ strict: false });
  const navigate = useNavigate();
  const queryClient = getQueryClient();
  const [selectedProject, setSelectedProject] = useState<{
    rowId: string;
    name: string;
  }>();

  const { theme, setTheme } = useTheme();

  const toggleTheme = () =>
    theme === "dark" ? setTheme("light") : setTheme("dark");

  const { data: workspaces } = useQuery({
    ...workspacesOptions,
    select: (data) => data.workspaces?.nodes,
  });

  const { data: workspace } = useQuery({
    ...workspaceOptions(workspaceId!),
    enabled: !!workspaceId,
    select: (data) => data.workspace,
  });

  const { isMobile } = useSidebar();

  const { mutate: deleteProject } = useDeleteProjectMutation({
    onSettled: () => {
      queryClient.invalidateQueries(projectsOptions);
      queryClient.invalidateQueries(workspaceOptions(workspaceId!));
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
      <Sidebar collapsible="icon" {...props}>
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <MenuRoot>
                <MenuTrigger asChild>
                  <SidebarMenuButton>
                    <div className="group-data-[collapsible=icon]:hidden">
                      <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate font-medium">
                          {workspace?.name}
                        </span>
                      </div>
                    </div>
                    <ChevronsUpDown className="ml-auto" />
                  </SidebarMenuButton>
                </MenuTrigger>

                <MenuPositioner>
                  <MenuContent className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg">
                    {workspaces?.map((workspace) => (
                      <MenuItem
                        key={workspace?.rowId}
                        onClick={() => {
                          navigate({
                            to: "/workspaces/$workspaceId/projects",
                            params: { workspaceId: workspace?.rowId! },
                          });
                        }}
                        className="gap-2 p-2"
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

        <SidebarContent className="flex flex-col gap-0">
          <SidebarGroup className="group-data-[collapsible=icon]:hidden">
            <SidebarGroupLabel>Workspace</SidebarGroupLabel>
            <SidebarGroupAction onClick={() => setIsCreateWorkspaceOpen(true)}>
              <Plus /> <span className="sr-only">Add Workspace</span>
            </SidebarGroupAction>

            <SidebarMenuButton asChild>
              <Link
                to="/workspaces/$workspaceId/settings"
                params={{ workspaceId: workspaceId! }}
                variant="ghost"
                className="justify-start"
                activeProps={{
                  variant: "outline",
                }}
              >
                <Settings />
                Settings
              </Link>
            </SidebarMenuButton>
          </SidebarGroup>

          {workspaceId && (
            <SidebarGroup className="group-data-[collapsible=icon]:hidden">
              <SidebarGroupLabel>Projects</SidebarGroupLabel>
              <SidebarGroupAction onClick={() => setIsCreateProjectOpen(true)}>
                <Plus /> <span className="sr-only">Add Project</span>
              </SidebarGroupAction>
              <SidebarMenu>
                {workspace?.projects.nodes.map((project) => (
                  <SidebarMenuItem key={project?.rowId}>
                    <SidebarMenuButton asChild>
                      <Link
                        key={project?.rowId}
                        to="/workspaces/$workspaceId/projects/$projectId"
                        params={{
                          workspaceId: workspaceId!,
                          projectId: project?.rowId!,
                        }}
                        variant="ghost"
                        size="sm"
                        activeProps={{
                          variant: "outline",
                        }}
                        className="justify-start"
                      >
                        {project?.viewMode === "board" ? (
                          <List className="h-4 w-4" />
                        ) : (
                          <Grid2X2Icon className="h-4 w-4" />
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
                          <MoreHorizontal />
                          <span className="sr-only">More</span>
                        </SidebarMenuAction>
                      </MenuTrigger>

                      <MenuPositioner>
                        <MenuContent className="w-48 rounded-lg bg-background">
                          <MenuItem
                            value="delete"
                            className="flex items-center gap-2"
                            onClick={() => {
                              setSelectedProject({
                                rowId: project?.rowId!,
                                name: project?.name!,
                              });
                              setIsDeleteProjectOpen(true);
                            }}
                          >
                            <Trash2
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

        <SidebarFooter>
          <SidebarMenu>
            {/* TODO: Handle open transtions with labels */}
            <SidebarMenuItem>
              <SidebarMenuButton tooltip="Toggle Theme" onClick={toggleTheme}>
                <Moon className="hidden h-4 w-4 text-base-600 dark:block dark:text-base-300" />
                <Sun className="h-4 w-4 text-base-600 dark:hidden dark:text-base-300" />
                Theme Toggle
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton tooltip="Sign Out">
                <LogOut className="h-4 w-4" />
                Sign Out
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
        }}
        dialogType={DialogType.DeleteProject}
        confirmation={`permanently delete ${selectedProject?.name}`}
      />
    </>
  );
}
