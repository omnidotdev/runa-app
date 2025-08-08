import { useQuery } from "@tanstack/react-query";
import {
  useLoaderData,
  useLocation,
  useNavigate,
  useParams,
  useRouteContext,
} from "@tanstack/react-router";
import {
  BoxIcon,
  CheckIcon,
  ChevronRightIcon,
  Grid2X2Icon,
  LayersIcon,
  ListIcon,
  MoreHorizontalIcon,
  PackageOpenIcon,
  PlusIcon,
  Settings2,
  Settings2Icon,
  Trash2Icon,
} from "lucide-react";
import { useRef, useState } from "react";

import {
  CollapsibleContent,
  CollapsibleRoot,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  MenuContent,
  MenuItem,
  MenuPositioner,
  MenuRoot,
  MenuTrigger,
} from "@/components/ui/menu";
import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuShortcut,
  useSidebar,
} from "@/components/ui/sidebar";
import { Tooltip } from "@/components/ui/tooltip";
import { useUpdateUserPreferenceMutation } from "@/generated/graphql";
import useDialogStore, { DialogType } from "@/lib/hooks/store/useDialogStore";
import userPreferencesOptions from "@/lib/options/userPreferences.options";
import workspaceOptions from "@/lib/options/workspace.options";
import getQueryClient from "@/lib/util/getQueryClient";

interface SidebarMenuItemType {
  isActive: boolean;
  tooltip: string;
  to: string;
  icon: React.ComponentType;
  label: string;
}

interface Props {
  selectedProject?: { rowId: string; name: string };
  setSelectedProject: (project: { rowId: string; name: string }) => void;
}

const AppSidebarContent = ({ selectedProject, setSelectedProject }: Props) => {
  const { workspaceId } = useLoaderData({ from: "/_auth" });
  const { session } = useRouteContext({ strict: false });
  const { workspaceSlug } = useParams({ strict: false });
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const queryClient = getQueryClient();

  const [isProjectMenuOpen, setProjectMenuOpen] = useState(false);

  const menuButtonRef = useRef<HTMLButtonElement | null>(null);

  const { data: workspace } = useQuery({
    ...workspaceOptions({
      rowId: workspaceId!,
      userId: session?.user?.rowId!,
    }),
    enabled: !!workspaceId,
    select: (data) => data.workspace,
  });

  const { isMobile, open } = useSidebar();

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

  const sidebarMenuItems: SidebarMenuItemType[] = [
    {
      isActive: pathname === `/workspaces/${workspaceSlug}/settings`,
      tooltip: "Workspace Settings",
      to: "/workspaces/$workspaceSlug/settings",
      icon: Settings2Icon,
      label: "Settings",
    },
    {
      isActive: pathname === `/workspaces/${workspaceSlug}/projects`,
      tooltip: "Project Overview",
      to: "/workspaces/$workspaceSlug/projects",
      icon: LayersIcon,
      label: "Overview",
    },
  ];

  return (
    <SidebarContent className="pt-2 group-data-[collapsible=icon]:gap-0">
      {workspaceSlug && (
        <>
          <SidebarMenu className="ml-2 hidden gap-1 group-data-[collapsible=icon]:flex">
            {sidebarMenuItems.map((item) => (
              <SidebarMenuItem key={item.to}>
                <SidebarMenuButton
                  isActive={item.isActive}
                  tooltip={item.tooltip}
                  onClick={() =>
                    navigate({
                      to: item.to,
                      params: { workspaceSlug },
                    })
                  }
                >
                  <item.icon />
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}

            {/* Mobile projects menu */}
            {!open && !!workspace?.projects?.nodes?.length && (
              <SidebarMenuItem>
                <MenuRoot
                  positioning={{
                    strategy: "fixed",
                    placement: "bottom-start",
                    getAnchorRect: () =>
                      menuButtonRef.current?.getBoundingClientRect() ?? null,
                  }}
                  open={isProjectMenuOpen}
                  onOpenChange={({ open }) => setProjectMenuOpen(open)}
                >
                  <SidebarMenuButton
                    tooltip={!isProjectMenuOpen ? "Project List" : undefined}
                    asChild
                  >
                    <MenuTrigger
                      ref={menuButtonRef}
                      className="text-sidebar-foreground/70"
                    >
                      {isProjectMenuOpen ? <PackageOpenIcon /> : <BoxIcon />}
                    </MenuTrigger>
                  </SidebarMenuButton>

                  <MenuPositioner>
                    <MenuContent className="flex w-40 flex-col gap-1 rounded-lg">
                      {workspace?.projects.nodes.map((project) => {
                        const userPreferences =
                          project?.userPreferences?.nodes?.[0];

                        const isWorkspaceProjectSelected =
                          pathname ===
                          `/workspaces/${workspaceSlug}/projects/${project.slug}`;
                        return (
                          <MenuItem
                            key={project.rowId}
                            value={project.name}
                            className="flex w-full cursor-pointer items-center gap-1"
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
                            {userPreferences?.viewMode === "board" ? (
                              <Grid2X2Icon
                                className="size-4 text-primary-500"
                                style={{
                                  color: userPreferences?.color ?? undefined,
                                }}
                              />
                            ) : (
                              <ListIcon
                                className="size-4 text-primary-500"
                                style={{
                                  color: userPreferences?.color ?? undefined,
                                }}
                              />
                            )}
                            <span className="truncate">{project?.name}</span>

                            {isWorkspaceProjectSelected && (
                              <CheckIcon color="green" className="ml-auto" />
                            )}
                          </MenuItem>
                        );
                      })}
                    </MenuContent>
                  </MenuPositioner>
                </MenuRoot>
              </SidebarMenuItem>
            )}
          </SidebarMenu>

          <CollapsibleRoot
            defaultOpen
            className="group-data-[collapsible=icon]:hidden"
          >
            <SidebarGroup>
              <CollapsibleTrigger className="gap-2 p-0 px-1">
                <SidebarGroupLabel>Workspace</SidebarGroupLabel>
                <ChevronRightIcon size={12} className="mr-auto text-base-400" />

                <Tooltip
                  positioning={{ placement: "right" }}
                  tooltip="Create Workspace"
                  shortcut="W"
                >
                  <SidebarGroupAction
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsCreateWorkspaceOpen(true);
                    }}
                  >
                    <PlusIcon />
                  </SidebarGroupAction>
                </Tooltip>
              </CollapsibleTrigger>

              <CollapsibleContent className="mt-1 animate-none" asChild>
                <SidebarMenu className="my-1">
                  {sidebarMenuItems.map((item) => (
                    <SidebarMenuItem key={item.to}>
                      <SidebarMenuButton
                        isActive={item.isActive}
                        tooltip={item.tooltip}
                        onClick={() =>
                          navigate({
                            to: item.to,
                            params: { workspaceSlug },
                          })
                        }
                      >
                        <item.icon />
                        <span className="w-full truncate">{item.label}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </CollapsibleContent>
            </SidebarGroup>
          </CollapsibleRoot>

          <CollapsibleRoot
            defaultOpen
            className="group-data-[collapsible=icon]:hidden"
          >
            <SidebarGroup>
              <CollapsibleTrigger className="gap-2 p-0 px-1">
                <SidebarGroupLabel>Projects</SidebarGroupLabel>
                <ChevronRightIcon size={12} className="mr-auto text-base-400" />

                <Tooltip
                  disabled={!workspace?.projectColumns.nodes.length}
                  positioning={{ placement: "right" }}
                  tooltip="Create Project"
                  shortcut="P"
                >
                  <SidebarGroupAction
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsCreateProjectOpen(true);
                    }}
                  >
                    <PlusIcon />
                    <span className="sr-only">Add Project</span>
                  </SidebarGroupAction>
                </Tooltip>
              </CollapsibleTrigger>

              <CollapsibleContent className="-mx-2 animate-none">
                <SidebarMenu className="my-1 px-2">
                  {workspace?.projects.nodes.map((project) => {
                    const userPreferences =
                      project?.userPreferences?.nodes?.[0];

                    return (
                      <SidebarMenuItem key={project?.rowId}>
                        <SidebarMenuButton
                          isActive={
                            pathname ===
                            `/workspaces/${workspaceSlug}/projects/${project.slug}`
                          }
                          tooltip={project?.name}
                          onClick={() =>
                            navigate({
                              to: "/workspaces/$workspaceSlug/projects/$projectSlug",
                              params: {
                                workspaceSlug,
                                projectSlug: project.slug,
                              },
                            })
                          }
                        >
                          {userPreferences?.viewMode === "board" ? (
                            <Grid2X2Icon
                              className="text-primary-500"
                              style={{
                                color: userPreferences?.color ?? undefined,
                              }}
                            />
                          ) : (
                            <ListIcon
                              className="text-primary-500"
                              style={{
                                color: userPreferences?.color ?? undefined,
                              }}
                            />
                          )}
                          <span className="w-full truncate">
                            {project?.name}
                          </span>
                        </SidebarMenuButton>

                        <MenuRoot
                          positioning={{
                            strategy: "fixed",
                            placement: isMobile ? "bottom-end" : "right-start",
                          }}
                        >
                          <MenuTrigger
                            asChild
                            className="[&[data-state=open]>svg]:rotate-0"
                          >
                            <SidebarMenuAction
                              isActive={
                                pathname ===
                                `/workspaces/${workspaceSlug}/projects/${project.slug}`
                              }
                              showOnHover
                              onClick={() =>
                                setSelectedProject({
                                  rowId: project.rowId,
                                  name: project.name,
                                })
                              }
                            >
                              <MoreHorizontalIcon />
                              <span className="sr-only">More</span>
                            </SidebarMenuAction>
                          </MenuTrigger>

                          <MenuPositioner>
                            <MenuContent className="flex w-48 flex-col gap-0.5 rounded-lg">
                              <MenuItem
                                value="settings"
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
                                Settings
                              </MenuItem>

                              <MenuItem
                                value="viewMode"
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
                    );
                  })}
                </SidebarMenu>
              </CollapsibleContent>
            </SidebarGroup>
          </CollapsibleRoot>
        </>
      )}
    </SidebarContent>
  );
};

export default AppSidebarContent;
