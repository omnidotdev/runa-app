import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import {
  useLoaderData,
  useNavigate,
  useParams,
  useRouteContext,
} from "@tanstack/react-router";
import {
  ChevronsUpDown,
  FolderOpen,
  Grid2X2Icon,
  Layers,
  ListIcon,
  LogOutIcon,
  MoonIcon,
  MoreHorizontalIcon,
  PanelLeftIcon,
  PlusIcon,
  Settings2,
  SunIcon,
  Trash2Icon,
} from "lucide-react";
import { useRef, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";

import ConfirmDialog from "@/components/ConfirmDialog";
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
  SidebarMenuShortcut,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import { Tooltip } from "@/components/ui/tooltip";
import {
  useDeleteProjectMutation,
  useUpdateUserPreferenceMutation,
} from "@/generated/graphql";
import { signOut } from "@/lib/auth/signOut";
import { Hotkeys } from "@/lib/constants/hotkeys";
import useDialogStore, { DialogType } from "@/lib/hooks/store/useDialogStore";
import useTheme from "@/lib/hooks/useTheme";
import projectColumnsOptions from "@/lib/options/projectColumns.options";
import userPreferencesOptions from "@/lib/options/userPreferences.options";
import workspaceOptions from "@/lib/options/workspace.options";
import workspacesOptions from "@/lib/options/workspaces.options";
import getQueryClient from "@/lib/util/getQueryClient";
import { cn } from "@/lib/utils";

import type { ComponentProps } from "react";

export function AppSidebar({ ...props }: ComponentProps<typeof Sidebar>) {
  const { workspaceId } = useLoaderData({ from: "/_auth" });

  const { session } = useRouteContext({ strict: false });
  const { workspaceSlug } = useParams({ strict: false });
  const navigate = useNavigate();
  const [selectedProject, setSelectedProject] = useState<{
    rowId: string;
    name: string;
  }>();
  const queryClient = getQueryClient();
  const { theme, setTheme } = useTheme();

  const menuButtonRef = useRef<HTMLButtonElement | null>(null);

  const toggleTheme = () =>
    theme === "dark" ? setTheme("light") : setTheme("dark");

  useHotkeys(Hotkeys.ToggleTheme, toggleTheme, [toggleTheme]);

  const { data: workspaces } = useSuspenseQuery({
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

  const { isMobile, setOpen, open } = useSidebar();

  const { mutate: deleteProject } = useDeleteProjectMutation({
    meta: {
      invalidates: [
        ["Projects"],
        workspaceOptions({
          rowId: workspaceId!,
          userId: session?.user?.rowId!,
        }).queryKey,
        projectColumnsOptions({ workspaceId: workspaceId! }).queryKey,
      ],
    },
  });

  const { mutate: updateViewMode } = useUpdateUserPreferenceMutation({
    meta: {
      invalidates: [["all"]],
    },
    onMutate: (variables) => {
      queryClient.setQueryData(
        userPreferencesOptions({
          projectId: selectedProject?.rowId!,
          userId: session?.user?.rowId!,
        }).queryKey,
        (old) => ({
          userPreferenceByUserIdAndProjectId: {
            ...old?.userPreferenceByUserIdAndProjectId!,
            viewMode: variables.patch?.viewMode!,
          },
        }),
      );
    },
  });

  const { setIsOpen: setIsCreateProjectOpen } = useDialogStore({
      type: DialogType.CreateProject,
    }),
    { setIsOpen: setIsCreateWorkspaceOpen } = useDialogStore({
      type: DialogType.CreateWorkspace,
    }),
    { setIsOpen: setIsDeleteProjectOpen } = useDialogStore({
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
                  <SidebarMenuButton
                    size="lg"
                    className="bg-base-200 hover:bg-base-300 dark:bg-base-700 dark:hover:bg-base-800"
                  >
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
                  <MenuContent className="no-scrollbar max-h-80 min-w-56 overflow-auto rounded-lg focus:outline-none">
                    {workspaces?.map((workspace) => (
                      <MenuItem
                        key={workspace?.rowId}
                        onClick={() => {
                          navigate({
                            to: "/workspaces/$workspaceSlug/projects",
                            params: { workspaceSlug: workspace.slug },
                          });
                        }}
                        className="cursor-pointer gap-2 p-2"
                        value={workspace.name}
                      >
                        {workspace.name}
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
            <div className="flex items-center justify-between">
              <SidebarGroupLabel>Workspace</SidebarGroupLabel>
              <Tooltip
                positioning={{ placement: "right" }}
                tooltip={{
                  className: "bg-background text-foreground border",
                  children: (
                    <div className="inline-flex">
                      Create Workspace
                      <div className="ml-2 flex items-center gap-0.5">
                        <SidebarMenuShortcut>W</SidebarMenuShortcut>
                      </div>
                    </div>
                  ),
                }}
              >
                <SidebarGroupAction
                  onClick={() => setIsCreateWorkspaceOpen(true)}
                >
                  <PlusIcon /> <span className="sr-only">Add Workspace</span>
                </SidebarGroupAction>
              </Tooltip>
            </div>

            {workspaceSlug && (
              <SidebarMenu className="gap-2">
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="Workspace Settings">
                    <Link
                      to="/workspaces/$workspaceSlug/settings"
                      params={{ workspaceSlug }}
                      variant="ghost"
                      activeProps={{
                        variant: "outline",
                      }}
                      className="w-full justify-start border border-transparent"
                    >
                      <Settings2 className="size-4" />
                      <span className="w-full truncate">Settings</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            )}
          </SidebarGroup>

          {workspaceSlug && (
            <SidebarGroup>
              <div className="flex items-center justify-between">
                <SidebarGroupLabel>Projects</SidebarGroupLabel>
                <Tooltip
                  positioning={{ placement: "right" }}
                  tooltip={{
                    className: "bg-background text-foreground border",
                    children: (
                      <div className="inline-flex">
                        Create Project
                        <div className="ml-2 flex items-center gap-0.5">
                          <SidebarMenuShortcut>P</SidebarMenuShortcut>
                        </div>
                      </div>
                    ),
                  }}
                >
                  <SidebarGroupAction
                    onClick={() => setIsCreateProjectOpen(true)}
                  >
                    <PlusIcon /> <span className="sr-only">Add Project</span>
                  </SidebarGroupAction>
                </Tooltip>
              </div>

              <SidebarMenu className="gap-2">
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="Projects Overview">
                    <Link
                      to="/workspaces/$workspaceSlug/projects"
                      params={{ workspaceSlug }}
                      variant="ghost"
                      activeOptions={{
                        exact: true,
                      }}
                      activeProps={{
                        variant: "outline",
                      }}
                      className="w-full justify-start border border-transparent"
                    >
                      <Layers className="size-4" />
                      <span className="w-full truncate">Overview</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                <div className="-mt-1 flex flex-col gap-1 group-data-[collapsible=icon]:hidden">
                  {workspace?.projects.nodes.map((project) => (
                    <SidebarMenuItem key={project?.rowId}>
                      <SidebarMenuButton asChild tooltip={project?.name}>
                        <Link
                          to="/workspaces/$workspaceSlug/projects/$projectSlug"
                          params={{
                            workspaceSlug,
                            projectSlug: project.slug,
                          }}
                          variant="ghost"
                          activeProps={{
                            variant: "outline",
                          }}
                          className="justify-start border border-transparent"
                        >
                          {project?.userPreferences?.nodes?.[0]?.viewMode ===
                          "board" ? (
                            <Grid2X2Icon
                              className="size-4 text-primary-500"
                              style={{ color: project?.color ?? undefined }}
                            />
                          ) : (
                            <ListIcon
                              className="size-4 text-primary-500"
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
                          <SidebarMenuAction
                            showOnHover
                            onClick={() => {
                              setSelectedProject({
                                rowId: project.rowId,
                                name: project.name,
                              });
                            }}
                          >
                            <MoreHorizontalIcon />
                            <span className="sr-only">More</span>
                          </SidebarMenuAction>
                        </MenuTrigger>

                        <MenuPositioner>
                          <MenuContent className="flex w-48 flex-col gap-0.5 rounded-lg">
                            <MenuItem
                              value="settings"
                              className="flex cursor-pointer items-center gap-2"
                              onClick={() => {
                                navigate({
                                  to: "/workspaces/$workspaceSlug/projects/$projectSlug/settings",
                                  params: {
                                    workspaceSlug,
                                    projectSlug: project.slug,
                                  },
                                });
                              }}
                            >
                              <Settings2 />
                              <span>Settings</span>
                            </MenuItem>

                            <MenuItem
                              value="viewMode"
                              className="flex cursor-pointer items-center gap-2"
                              onClick={() =>
                                updateViewMode({
                                  rowId:
                                    project?.userPreferences?.nodes?.[0]
                                      ?.rowId!,
                                  patch: {
                                    viewMode:
                                      project?.userPreferences?.nodes?.[0]
                                        ?.viewMode === "board"
                                        ? "list"
                                        : "board",
                                  },
                                })
                              }
                            >
                              {project?.userPreferences?.nodes?.[0]
                                ?.viewMode === "list" ? (
                                <Grid2X2Icon />
                              ) : (
                                <ListIcon />
                              )}
                              <span>
                                {project?.userPreferences?.nodes?.[0]
                                  ?.viewMode === "list"
                                  ? "Board View"
                                  : "List View"}
                              </span>

                              <SidebarMenuShortcut>V</SidebarMenuShortcut>
                            </MenuItem>

                            <MenuItem
                              value="delete"
                              className="flex cursor-pointer items-center gap-2"
                              variant="destructive"
                              onClick={() => {
                                setSelectedProject({
                                  rowId: project.rowId,
                                  name: project.name,
                                });
                                setIsDeleteProjectOpen(true);
                              }}
                            >
                              <Trash2Icon />
                              <span>Delete Project</span>
                            </MenuItem>
                          </MenuContent>
                        </MenuPositioner>
                      </MenuRoot>
                    </SidebarMenuItem>
                  ))}
                </div>

                {/* Mobile projects menu */}
                {!open && !!workspace?.projects?.nodes?.length && (
                  <MenuRoot
                    positioning={{
                      strategy: "fixed",
                      placement: "right-start",
                      getAnchorRect: () =>
                        menuButtonRef.current?.getBoundingClientRect() ?? null,
                    }}
                  >
                    <SidebarMenuButton tooltip="Project List" asChild>
                      <MenuTrigger ref={menuButtonRef}>
                        <FolderOpen className="size-4" />
                      </MenuTrigger>
                    </SidebarMenuButton>

                    <MenuPositioner>
                      <MenuContent className="flex w-full min-w-56 flex-col gap-0.5 rounded-lg">
                        {workspace?.projects.nodes.map((project) => (
                          <MenuItem
                            key={project.rowId}
                            value={project.name}
                            className="flex cursor-pointer items-center gap-1"
                            onSelect={() =>
                              navigate({
                                to: "/workspaces/$workspaceSlug/projects/$projectSlug",
                                params: {
                                  workspaceSlug,
                                  projectSlug: project.slug,
                                },
                              })
                            }
                          >
                            {project?.userPreferences?.nodes?.[0]?.viewMode ===
                            "board" ? (
                              <Grid2X2Icon
                                className="size-4 text-primary-500"
                                style={{ color: project?.color ?? undefined }}
                              />
                            ) : (
                              <ListIcon
                                className="size-4 text-primary-500"
                                style={{ color: project?.color ?? undefined }}
                              />
                            )}
                            <span className="truncate">{project?.name}</span>
                          </MenuItem>
                        ))}
                      </MenuContent>
                    </MenuPositioner>
                  </MenuRoot>
                )}
              </SidebarMenu>
            </SidebarGroup>
          )}
        </SidebarContent>

        <SidebarFooter className="border-t">
          <SidebarMenu className="mt-1 gap-2">
            <SidebarMenuItem>
              <SidebarMenuButton
                tooltip="Expand Sidebar"
                shortcut={Hotkeys.ToggleSidebar}
                onClick={() => setOpen(!open)}
                className="flex justify-start border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50"
              >
                <PanelLeftIcon />
                <span className="flex w-full items-center justify-between">
                  Collapse Sidebar
                  <SidebarMenuShortcut>B</SidebarMenuShortcut>
                </span>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton
                tooltip="Toggle Theme"
                shortcut={Hotkeys.ToggleTheme}
                onClick={() => toggleTheme()}
                className="justify-start border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50"
              >
                {theme === "dark" ? <MoonIcon /> : <SunIcon />}
                <span className="flex w-full items-center justify-between">
                  Toggle Theme
                  <SidebarMenuShortcut>T</SidebarMenuShortcut>
                </span>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton
                tooltip="Sign Out"
                onClick={signOut}
                className="hover: justify-start border bg-background text-red-600 shadow-xs hover:bg-accent hover:text-red-600 dark:border-input dark:bg-input/30 dark:text-red-400 dark:hover:bg-input/50 dark:hover:text-red-400"
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
            to: "/workspaces/$workspaceSlug/projects",
            params: { workspaceSlug: workspaceSlug! },
          });
        }}
        dialogType={DialogType.DeleteProject}
        confirmation={`Permanently delete ${selectedProject?.name}`}
        inputProps={{
          className: "focus-visible:ring-red-500",
        }}
      />
    </>
  );
}
