import { workspacesUrl } from "@omnidotdev/providers/react";
import { WorkspaceSwitcher } from "@omnidotdev/thornberry/workspace-switcher";
import { useNavigate, useParams, useRouter } from "@tanstack/react-router";
import { LayoutGridIcon, PlusIcon } from "lucide-react";

import { useSidebar } from "@/components/ui/sidebar";
import { ACCOUNT_URL } from "@/lib/config/env.config";
import {
  routeSlugForId,
  toWorkspaceOptions,
  workspaceIdForSlug,
} from "@/lib/util/workspaceSwitcher";
import { useWorkspace } from "@/providers/WorkspaceProvider";
import { setLastWorkspaceCookie } from "@/server/functions/lastWorkspace";

import type { WorkspaceSwitcherAction } from "@omnidotdev/thornberry/workspace-switcher";

/**
 * Sidebar workspace switcher, built on the shared Omni switcher. Selecting a
 * workspace remembers it and opens its overview; the menu also links to every
 * workspace and to the account hub, where workspaces are created and managed.
 */
const AppSidebarWorkspaceSwitcher = () => {
  // Sidebar is rendered by `_app.tsx` (above `$workspaceSlug.tsx` in the
  // chain), so the active workspace comes from the route param, not from the
  // workspace layout's context
  const { workspaceSlug } = useParams({ strict: false });
  const router = useRouter();
  const navigate = useNavigate();
  const { closeMobileSidebar } = useSidebar();
  const workspaces = useWorkspace()?.workspaces ?? [];

  // Workspace lifecycle lives on the account hub
  const manageWorkspacesUrl = ACCOUNT_URL ? workspacesUrl(ACCOUNT_URL) : "";

  const preloadAllWorkspaces = () => {
    void router.preloadRoute({ to: "/workspaces" });
  };

  // Preload programmatically rather than rendering items as
  // `<Link preload="intent">`. Link's per-item render cost (`useLinkProps` +
  // `buildLocation` + store subscriptions) multiplied across menu items caused
  // visible jank during the open/close animation. The destination resolves
  // correctly because `$workspaceSlug.tsx` owns the segment
  const preloadWorkspace = (id: string) => {
    const slug = routeSlugForId(workspaces, id);
    if (!slug) return;

    void router.preloadRoute({
      to: "/@{$workspaceSlug}",
      params: { workspaceSlug: slug },
    });
  };

  const selectWorkspace = (id: string) => {
    const slug = routeSlugForId(workspaces, id);
    if (!slug) return;

    closeMobileSidebar();
    setLastWorkspaceCookie({ data: slug });
    navigate({ to: "/@{$workspaceSlug}", params: { workspaceSlug: slug } });
  };

  const actions: WorkspaceSwitcherAction[] = [
    {
      id: "all-workspaces",
      label: "All workspaces",
      icon: <LayoutGridIcon />,
      onSelect: () => {
        closeMobileSidebar();
        navigate({ to: "/workspaces" });
      },
    },
    ...(manageWorkspacesUrl
      ? [
          {
            id: "manage-workspaces",
            label: "Manage workspaces",
            icon: <PlusIcon />,
            href: manageWorkspacesUrl,
          },
        ]
      : []),
  ];

  return (
    // Action entries carry no highlight intent, so warm the all-workspaces
    // route as the switcher is approached instead
    <div onPointerEnter={preloadAllWorkspaces} onFocus={preloadAllWorkspaces}>
      <WorkspaceSwitcher
        variant="sidebar"
        workspaces={toWorkspaceOptions(workspaces)}
        currentWorkspaceId={workspaceIdForSlug(workspaces, workspaceSlug)}
        onSelect={selectWorkspace}
        onItemIntent={preloadWorkspace}
        actions={actions}
      />
    </div>
  );
};

export default AppSidebarWorkspaceSwitcher;
