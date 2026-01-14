import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  useLoaderData,
  useLocation,
  useNavigate,
  useParams,
  useRouteContext,
  useRouter,
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
} from "lucide-react";
import { useCallback, useId, useState } from "react";

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
  useSidebar,
} from "@/components/ui/sidebar";
import {
  useUpdateUserPreferenceMutation,
  useUserPreferencesQuery,
} from "@/generated/graphql";
import { Hotkeys } from "@/lib/constants/hotkeys";
import useDialogStore, { DialogType } from "@/lib/hooks/store/useDialogStore";
import { useCurrentUserRole } from "@/lib/hooks/useCurrentUserRole";
import useMaxProjectsReached from "@/lib/hooks/useMaxProjectsReached";
import projectColumnsOptions from "@/lib/options/projectColumns.options";
import projectsOptions from "@/lib/options/projects.options";
import tasksOptions from "@/lib/options/tasks.options";
import { Role } from "@/lib/permissions";
import getQueryKeyPrefix from "@/lib/util/getQueryKeyPrefix";
import Shortcut from "./Shortcut";
import Tooltip from "./Tooltip";

interface SidebarMenuItemType {
  isActive: boolean;
  tooltip: string;
  to: string;
  icon: React.ComponentType;
  label: string;
}

interface Props {
  setSelectedProject: (project: { rowId: string; name: string }) => void;
}

// TODO break up this behemoth

const AppSidebarContent = ({ setSelectedProject }: Props) => {
  const { organizationId } = useLoaderData({ from: "/_auth" });
  const { session } = useRouteContext({ from: "/_auth" });
  const queryClient = useQueryClient();
  const router = useRouter();
  const navigate = useNavigate();
  const { workspaceSlug } = useParams({ strict: false });
  const { pathname } = useLocation();

  // prefetch project data on hover
  const prefetchProject = useCallback(
    (projectSlug: string, projectId: string) => {
      // prefetch route (runs loader)
      router.preloadRoute({
        to: "/workspaces/$workspaceSlug/projects/$projectSlug",
        params: { workspaceSlug: workspaceSlug!, projectSlug },
      });
      queryClient.prefetchQuery(tasksOptions({ projectId }));
    },
    [router, queryClient, workspaceSlug],
  );

  // prefetch workspace routes on hover
  const prefetchWorkspaceRoute = useCallback(
    (to: string) => {
      router.preloadRoute({
        to,
        params: { workspaceSlug: workspaceSlug! },
      });
    },
    [router, workspaceSlug],
  );

  const [isProjectMenuOpen, setProjectMenuOpen] = useState(false);

  const { data: projects } = useQuery({
    ...projectsOptions({
      organizationId: organizationId!,
      userId: session?.user?.rowId!,
    }),
    enabled: !!organizationId,
    select: (data) => data.projects?.nodes,
  });

  const { data: projectColumns } = useQuery({
    ...projectColumnsOptions({
      organizationId: organizationId!,
    }),
    enabled: !!organizationId,
    select: (data) => data.projectColumns?.nodes,
  });

  // Get role from IDP organization claims
  const role = useCurrentUserRole(organizationId);
  const isMember = organizationId == null || role === Role.Member;

  const maxProjectsReached = useMaxProjectsReached();

  const { isMobile, open } = useSidebar();

  const { mutate: updateViewMode } = useUpdateUserPreferenceMutation({
    meta: {
      invalidates: [getQueryKeyPrefix(useUserPreferencesQuery)],
    },
    onMutate: (variables) => {
      // update projects cache for sidebar UI
      queryClient.setQueryData(
        projectsOptions({
          organizationId: organizationId!,
          userId: session?.user?.rowId!,
        }).queryKey,
        (old) => {
          if (!old?.projects) return old;
          return {
            ...old,
            projects: {
              ...old.projects,
              nodes: old.projects.nodes.map((project) => {
                const userPref = project.userPreferences?.nodes?.[0];
                if (userPref?.rowId === variables.rowId) {
                  return {
                    ...project,
                    userPreferences: {
                      ...project.userPreferences,
                      nodes: [
                        {
                          ...userPref,
                          viewMode: variables.patch?.viewMode!,
                        },
                      ],
                    },
                  };
                }
                return project;
              }),
            },
          };
        },
      );
    },
  });

  const { setIsOpen: setIsCreateProjectOpen } = useDialogStore({
    type: DialogType.CreateProject,
  });

  const sidebarMenuItems: SidebarMenuItemType[] = [
    {
      isActive: pathname === `/workspaces/${workspaceSlug}/projects`,
      tooltip: "Projects Overview",
      to: "/workspaces/$workspaceSlug/projects",
      icon: LayersIcon,
      label: "All Projects",
    },
    {
      isActive: pathname === `/workspaces/${workspaceSlug}/settings`,
      tooltip: "Workspace Settings",
      to: "/workspaces/$workspaceSlug/settings",
      icon: Settings2Icon,
      label: "Settings",
    },
  ];

  const triggerId = useId();

  return (
    <SidebarContent className="pt-2 group-data-[collapsible=icon]:gap-0">
      {workspaceSlug && (
        <>
          <SidebarMenu className="ml-2 hidden gap-1 group-data-[collapsible=icon]:flex">
            {sidebarMenuItems.map((item) => (
              <SidebarMenuButton
                key={item.to}
                isActive={item.isActive}
                tooltip={item.tooltip}
                onMouseEnter={() => prefetchWorkspaceRoute(item.to)}
                onClick={() =>
                  navigate({
                    to: item.to,
                    params: { workspaceSlug },
                  })
                }
              >
                <item.icon />
              </SidebarMenuButton>
            ))}

            {/* Mobile projects menu */}
            {!open && !!projects?.length && (
              <MenuRoot
                positioning={{ placement: "bottom-start" }}
                open={isProjectMenuOpen}
                onOpenChange={({ open }) => setProjectMenuOpen(open)}
                ids={{ trigger: triggerId }}
              >
                <Tooltip
                  positioning={{ placement: "right" }}
                  ids={{ trigger: triggerId }}
                  disabled={isProjectMenuOpen}
                  tooltip="Project List"
                  trigger={
                    <MenuTrigger asChild>
                      <SidebarMenuButton>
                        {isProjectMenuOpen ? (
                          <PackageOpenIcon className="rotate-none!" />
                        ) : (
                          <BoxIcon className="rotate-none!" />
                        )}
                      </SidebarMenuButton>
                    </MenuTrigger>
                  }
                />

                <MenuPositioner>
                  <MenuContent className="flex w-40 flex-col gap-1 rounded-lg">
                    {projects?.map((project) => {
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
              </CollapsibleTrigger>

              <CollapsibleContent className="-mx-2 p-0">
                <SidebarMenu className="my-1 px-2">
                  {sidebarMenuItems.map((item) => (
                    <SidebarMenuButton
                      key={item.to}
                      isActive={item.isActive}
                      onMouseEnter={() => prefetchWorkspaceRoute(item.to)}
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
              <CollapsibleTrigger className="mt-1 gap-2 p-0 px-1">
                <SidebarGroupLabel>Projects</SidebarGroupLabel>
                {!!projects?.length && (
                  <ChevronRightIcon
                    size={12}
                    className="mr-auto text-base-400"
                  />
                )}

                <Tooltip
                  disabled={!projectColumns?.length}
                  positioning={{ placement: "right" }}
                  tooltip={
                    isMember || maxProjectsReached
                      ? "Upgrade workspace to create more projects"
                      : "Create Project"
                  }
                  shortcut={
                    isMember || maxProjectsReached
                      ? undefined
                      : Hotkeys.CreateProject
                  }
                  trigger={
                    <SidebarGroupAction
                      disabled={isMember || maxProjectsReached}
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsCreateProjectOpen(true);
                      }}
                    >
                      <PlusIcon />
                      <span className="sr-only">Create Project</span>
                    </SidebarGroupAction>
                  }
                />
              </CollapsibleTrigger>

              <CollapsibleContent className="-mx-2 p-0">
                <SidebarMenu className="my-1 px-2">
                  {projects?.map((project) => {
                    const userPreferences =
                      project?.userPreferences?.nodes?.[0];

                    return (
                      <div
                        key={project?.rowId}
                        className="group/menu-item relative"
                      >
                        <SidebarMenuButton
                          isActive={
                            pathname ===
                            `/workspaces/${workspaceSlug}/projects/${project.slug}`
                          }
                          onMouseEnter={() =>
                            prefetchProject(project.slug, project.rowId)
                          }
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
                            className="focus-visible:ring-offset-background [&[data-state=open]>svg]:rotate-0"
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

                                <Shortcut>{Hotkeys.ToggleViewMode}</Shortcut>
                              </MenuItem>

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
                            </MenuContent>
                          </MenuPositioner>
                        </MenuRoot>
                      </div>
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
