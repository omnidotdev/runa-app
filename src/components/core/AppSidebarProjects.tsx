import { useQuery } from "@tanstack/react-query";
import {
  Link,
  notFound,
  useLocation,
  useParams,
  useRouteContext,
} from "@tanstack/react-router";
import {
  BoxIcon,
  CheckIcon,
  ChevronRightIcon,
  Grid2X2Icon,
  ListIcon,
  PinIcon,
  PlusIcon,
} from "lucide-react";
import { useId, useState } from "react";

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
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  useSidebar,
} from "@/components/ui/sidebar";
import { Hotkeys } from "@/lib/constants/hotkeys";
import useDialogStore, { DialogType } from "@/lib/hooks/store/useDialogStore";
import { useCurrentUserRole } from "@/lib/hooks/useCurrentUserRole";
import useMaxProjectsReached from "@/lib/hooks/useMaxProjectsReached";
import projectColumnsOptions from "@/lib/options/projectColumns.options";
import projectsSidebarOptions from "@/lib/options/projectsSidebar.options";
import { Role } from "@/lib/permissions";
import AppSidebarProject from "./AppSidebarProject";
import Tooltip from "./Tooltip";

interface ViewModeIconProps {
  color?: string | null;
  viewMode?: string;
  className?: string;
}

const ViewModeIcon = ({ color, viewMode, className }: ViewModeIconProps) => {
  const Icon = viewMode !== "list" ? Grid2X2Icon : ListIcon;
  return (
    <Icon
      className={className ?? "size-4 text-primary-500"}
      style={{ color: color ?? undefined }}
    />
  );
};

const AppSidebarProjects = () => {
  const { organizationId, session } = useRouteContext({ from: "/_app" });
  const { workspaceSlug } = useParams({ strict: false });
  const { pathname } = useLocation();
  const [isProjectMenuOpen, setProjectMenuOpen] = useState(false);
  const triggerId = useId();

  const { open, closeMobileSidebar } = useSidebar();
  const { setIsOpen: setIsCreateProjectOpen } = useDialogStore({
    type: DialogType.CreateProject,
  });

  const maxProjectsReached = useMaxProjectsReached();
  // Get role from IDP organization claims
  const role = useCurrentUserRole(organizationId);
  const isMember = organizationId == null || role === Role.Member;

  const { data: sortedProjects } = useQuery({
      ...projectsSidebarOptions({
        organizationId: organizationId!,
        userId: session?.user?.rowId!,
      }),
      enabled: !!organizationId && !!session?.user?.rowId,
      select: (data) => {
        const nodes = data.projects?.nodes;
        if (!nodes) return undefined;
        return [...nodes].sort((a, b) => {
          const aPinned = a.userPreferences?.nodes?.[0]?.pinned ?? false;
          const bPinned = b.userPreferences?.nodes?.[0]?.pinned ?? false;
          if (aPinned !== bPinned) return aPinned ? -1 : 1;
          return a.name.localeCompare(b.name, undefined, {
            sensitivity: "base",
          });
        }) as Array<(typeof nodes)[0] & { id: string }>;
      },
    }),
    { data: projectColumns } = useQuery({
      ...projectColumnsOptions({
        organizationId: organizationId!,
      }),
      enabled: !!organizationId,
      select: (data) => data.projectColumns?.nodes,
    });

  if (!workspaceSlug) throw notFound();

  if (!open && !!sortedProjects?.length)
    return (
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
              <SidebarMenuButton className="mt-1 ml-2">
                <BoxIcon className="rotate-none!" />
              </SidebarMenuButton>
            </MenuTrigger>
          }
        />

        <MenuPositioner>
          <MenuContent className="flex w-40 flex-col gap-1 rounded-lg">
            {sortedProjects?.map((project) => {
              const userPreferences = project?.userPreferences?.nodes?.[0];
              const isActive =
                pathname ===
                `/workspaces/${workspaceSlug}/projects/${project.slug}`;

              return (
                <MenuItem
                  key={project.rowId}
                  value={project.name}
                  className="flex w-full cursor-pointer items-center gap-1"
                  asChild
                >
                  <Link
                    to="/workspaces/$workspaceSlug/projects/$projectSlug"
                    params={{
                      workspaceSlug,
                      projectSlug: project.slug,
                    }}
                    onClick={closeMobileSidebar}
                  >
                    <ViewModeIcon
                      color={project?.color}
                      viewMode={userPreferences?.viewMode}
                    />
                    <span className="truncate">{project?.name}</span>

                    {userPreferences?.pinned && (
                      <PinIcon className="ml-auto size-3 text-base-400" />
                    )}

                    {isActive && (
                      <CheckIcon color="green" className="ml-auto" />
                    )}
                  </Link>
                </MenuItem>
              );
            })}
          </MenuContent>
        </MenuPositioner>
      </MenuRoot>
    );

  return (
    <CollapsibleRoot
      defaultOpen
      className="group-data-[collapsible=icon]:hidden"
    >
      <SidebarGroup>
        <CollapsibleTrigger className="mt-1 gap-2 p-0 px-1">
          <SidebarGroupLabel>Projects</SidebarGroupLabel>
          {!!sortedProjects?.length && (
            <ChevronRightIcon size={12} className="mr-auto text-base-400" />
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
              isMember || maxProjectsReached ? undefined : Hotkeys.CreateProject
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
            {sortedProjects?.map((project) => (
              <AppSidebarProject key={project.rowId} project={project} />
            ))}
          </SidebarMenu>
        </CollapsibleContent>
      </SidebarGroup>
    </CollapsibleRoot>
  );
};

export default AppSidebarProjects;
