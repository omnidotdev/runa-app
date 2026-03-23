import { useQueryClient } from "@tanstack/react-query";
import {
  Link,
  useLocation,
  useParams,
  useRouteContext,
} from "@tanstack/react-router";
import {
  Grid2X2Icon,
  ListIcon,
  MoreHorizontalIcon,
  PinIcon,
  PinOffIcon,
  Settings2Icon,
} from "lucide-react";
import { useState } from "react";

import {
  MenuContent,
  MenuItem,
  MenuPositioner,
  MenuRoot,
  MenuTrigger,
} from "@/components/ui/menu";
import {
  SidebarMenuAction,
  SidebarMenuButton,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  useProjectsSidebarQuery,
  useUpdateUserPreferenceMutation,
  useUserPreferencesQuery,
} from "@/generated/graphql";
import { Hotkeys } from "@/lib/constants/hotkeys";
import projectsSidebarOptions from "@/lib/options/projectsSidebar.options";
import getQueryKeyPrefix from "@/lib/util/getQueryKeyPrefix";
import Shortcut from "./Shortcut";

import type { ProjectsSidebarQuery } from "@/generated/graphql";

type ProjectWithPreferences = NonNullable<
  ProjectsSidebarQuery["projects"]
>["nodes"][number];
interface Props {
  project: ProjectWithPreferences;
}

const AppSidebarProjectItem = ({ project }: Props) => {
  const { organizationId, session } = useRouteContext({ from: "/_app" });
  const { workspaceSlug } = useParams({ strict: false });

  const queryClient = useQueryClient();
  const { pathname } = useLocation();
  const { isMobile, closeMobileSidebar } = useSidebar();
  const [menuOpen, setMenuOpen] = useState(false);

  const userPref = project.userPreferences?.nodes?.[0];
  const { rowId, pinOrder, viewMode } = userPref ?? {};

  const isPinned = pinOrder != null;
  const isBoardView = viewMode !== "list";
  const isActive =
    pathname === `/workspaces/${workspaceSlug}/projects/${project.slug}`;

  const { mutate: updateUserPreference } = useUpdateUserPreferenceMutation({
    meta: {
      invalidates: [
        getQueryKeyPrefix(useUserPreferencesQuery),
        getQueryKeyPrefix(useProjectsSidebarQuery),
      ],
    },
    onMutate: (variables) => {
      // Optimistically update projects cache for sidebar UI
      queryClient.setQueryData(
        projectsSidebarOptions({
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
                          ...variables.patch,
                        },
                      ],
                    },
                  };
                }
                return project;
              }),
            },
          } as ProjectsSidebarQuery;
        },
      );
    },
  });

  if (!workspaceSlug) return null;

  return (
    <div className="group/menu-item relative">
      <Link
        to="/workspaces/$workspaceSlug/projects/$projectSlug"
        params={{
          workspaceSlug,
          projectSlug: project.slug,
        }}
        tabIndex={-1}
      >
        <SidebarMenuButton isActive={isActive} onClick={closeMobileSidebar}>
          {viewMode !== "list" ? (
            <Grid2X2Icon
              className="text-primary-500"
              style={{ color: project?.color ?? undefined }}
            />
          ) : (
            <ListIcon
              className="text-primary-500"
              style={{ color: project?.color ?? undefined }}
            />
          )}
          <span className="w-full truncate">{project?.name}</span>

          {isPinned && <PinIcon className="size-3 shrink-0 text-base-400" />}
        </SidebarMenuButton>
      </Link>

      <MenuRoot
        positioning={{
          strategy: "fixed",
          placement: isMobile ? "bottom-end" : "right-start",
        }}
        open={menuOpen}
        onOpenChange={({ open }) => setMenuOpen(open)}
      >
        <MenuTrigger
          asChild
          className="focus-visible:ring-offset-background [&[data-state=open]>svg]:rotate-0"
        >
          <SidebarMenuAction isActive={isActive} showOnHover>
            <MoreHorizontalIcon />
            <span className="sr-only">More</span>
          </SidebarMenuAction>
        </MenuTrigger>

        {/* TODO: Further look into this as it shouldn't be necessary */}
        {menuOpen && (
          <MenuPositioner>
            <MenuContent className="flex w-48 flex-col gap-0.5 rounded-lg">
              <MenuItem
                value="pin"
                onClick={() => {
                  setMenuOpen(false);
                  updateUserPreference({
                    rowId: rowId!,
                    patch: { pinOrder: isPinned ? null : 0 },
                  });
                }}
              >
                {isPinned ? <PinOffIcon /> : <PinIcon />}
                <span>{isPinned ? "Unpin Project" : "Pin Project"}</span>
              </MenuItem>

              <MenuItem
                value="viewMode"
                onClick={() =>
                  updateUserPreference({
                    rowId: rowId!,
                    patch: {
                      viewMode: isBoardView ? "list" : "board",
                    },
                  })
                }
              >
                {!isBoardView ? <Grid2X2Icon /> : <ListIcon />}

                <span>{!isBoardView ? "Board View" : "List View"}</span>

                <Shortcut>{Hotkeys.ToggleViewMode}</Shortcut>
              </MenuItem>

              <MenuItem value="settings" asChild>
                <Link
                  to="/workspaces/$workspaceSlug/projects/$projectSlug/settings"
                  params={{
                    workspaceSlug,
                    projectSlug: project.slug,
                  }}
                  onClick={closeMobileSidebar}
                >
                  <Settings2Icon />
                  Settings
                </Link>
              </MenuItem>
            </MenuContent>
          </MenuPositioner>
        )}
      </MenuRoot>
    </div>
  );
};

export default AppSidebarProjectItem;
