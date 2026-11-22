import { normalizeWorkspaceLinks } from "@omnidotdev/providers/workspace-links";
import { Badge } from "@omnidotdev/thornberry/badge";
import { LogoLockup } from "@omnidotdev/thornberry/logo-lockup";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "@tanstack/react-router";

import { Favicon } from "@/components/core";
import {
  SidebarHeader,
  SidebarMenuButton,
  useSidebar,
} from "@/components/ui/sidebar";
import app from "@/lib/config/app.config";
import organizationBySlugOptions from "@/lib/options/organizationBySlug.options";
import getDomainLabel from "@/lib/util/getDomainLabel";
import { useWorkspace } from "@/providers/WorkspaceProvider";
import AppSidebarWorkspaceSwitcher from "./AppSidebarWorkspaceSwitcher";
import Logo from "./Logo";

const AppSidebarHeader = () => {
  const { workspaceSlug } = useParams({ strict: false });
  const { toggleSidebar } = useSidebar();
  const organizations = useWorkspace()?.workspaces ?? [];

  // Resolve current org from URL slug. Sidebar is rendered by `_app.tsx`
  // (above `$workspaceSlug.tsx` in the chain), so we cannot read the
  // resolved organizationId from the workspace layout's context here.
  const currentOrg = workspaceSlug
    ? organizations.find((org) => org.slug === workspaceSlug)
    : undefined;

  // Prefer freshly fetched links over the cached JWT claim so account-hub edits
  // show quickly; fall back to the claim while the live fetch loads.
  const { data: liveOrg } = useQuery(organizationBySlugOptions(workspaceSlug));
  const workspaceLinks = normalizeWorkspaceLinks(
    liveOrg?.links ?? currentOrg?.links,
  );

  return (
    <SidebarHeader>
      <div className="mb-4 flex items-center gap-2 overflow-hidden">
        <div className="flex items-center gap-2">
          <SidebarMenuButton
            onClick={toggleSidebar}
            className="focus-visible:border-primary cursor-pointer border border-transparent focus-visible:border focus-visible:ring-0! focus-visible:ring-offset-0"
            aria-label="Toggle sidebar"
          >
            <LogoLockup
              logo={
                <Logo aria-hidden className="text-primary-500 h-5 w-auto" />
              }
              name={app.name}
              nameClassName="group-data-[collapsible=icon]:hidden"
            />
          </SidebarMenuButton>
        </div>

        <Badge className="border-primary-500/20 bg-primary-500/10 text-primary-500 ml-auto text-xs group-data-[collapsible=icon]:hidden">
          Early Access
        </Badge>
      </div>

      <AppSidebarWorkspaceSwitcher />

      {workspaceLinks.length ? (
        <div className="mt-2 flex flex-col gap-0.5 group-data-[collapsible=icon]:hidden">
          {workspaceLinks.map((link) => (
            <a
              key={link.url}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-base-500 hover:bg-sidebar-accent hover:text-foreground dark:text-base-400 flex items-center gap-2 rounded-md px-2 py-1 text-sm"
            >
              <Favicon url={link.url} />
              <span className="truncate">
                {link.title || getDomainLabel(link.url)}
              </span>
            </a>
          ))}
        </div>
      ) : null}
    </SidebarHeader>
  );
};

export default AppSidebarHeader;
