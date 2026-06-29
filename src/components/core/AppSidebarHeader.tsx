import { Badge } from "@omnidotdev/thornberry/badge";
import { LogoLockup } from "@omnidotdev/thornberry/logo-lockup";
import {
  useLocation,
  useNavigate,
  useParams,
  useRouter,
} from "@tanstack/react-router";
import {
  CheckIcon,
  ChevronsUpDown,
  LayoutGridIcon,
  PlusIcon,
} from "lucide-react";

import {
  MenuContent,
  MenuItem,
  MenuPositioner,
  MenuRoot,
  MenuSeparator,
  MenuTrigger,
} from "@/components/ui/menu";
import {
  SidebarHeader,
  SidebarMenuButton,
  useSidebar,
} from "@/components/ui/sidebar";
import app from "@/lib/config/app.config";
import { AUTH_BASE_URL, CONSOLE_URL } from "@/lib/config/env.config";
import { cn } from "@/lib/utils";
import { useOrganization } from "@/providers/OrganizationProvider";
import { setLastWorkspaceCookie } from "@/server/functions/lastWorkspace";
import Logo from "./Logo";

const AppSidebarHeader = () => {
  const { workspaceSlug } = useParams({ strict: false });
  const { pathname } = useLocation();
  const router = useRouter();
  const navigate = useNavigate();
  const { toggleSidebar, closeMobileSidebar } = useSidebar();
  const orgContext = useOrganization();

  // Get user's organizations from context
  const organizations = orgContext?.organizations ?? [];

  // Resolve current org from URL slug. Sidebar is rendered by `_app.tsx`
  // (above `$workspaceSlug.tsx` in the chain), so we cannot read the
  // resolved organizationId from the workspace layout's context here.
  const currentOrgName = workspaceSlug
    ? organizations.find((org) => org.slug === workspaceSlug)?.name
    : undefined;

  return (
    <SidebarHeader>
      <div className="mb-4 flex items-center gap-2 overflow-auto">
        <div className="flex items-center gap-2">
          <SidebarMenuButton
            onClick={toggleSidebar}
            className="cursor-pointer border border-transparent focus-visible:border focus-visible:border-primary focus-visible:ring-0! focus-visible:ring-offset-0"
            aria-label="Toggle sidebar"
          >
            <LogoLockup
              logo={<Logo aria-hidden className="size-5 text-primary-500" />}
              name={app.name}
              nameClassName="group-data-[collapsible=icon]:hidden"
            />
          </SidebarMenuButton>
        </div>

        <Badge className="ml-auto border-primary-500/20 bg-primary-500/10 text-primary-500 text-xs group-data-[collapsible=icon]:hidden">
          Early Access
        </Badge>
      </div>

      {organizations?.length ? (
        <MenuRoot>
          <MenuTrigger asChild>
            <SidebarMenuButton className="bg-sidebar-accent focus-visible:ring-offset-background">
              <ChevronsUpDown className="rotate-none!" />

              <span className="flex w-full items-center group-data-[collapsible=icon]:hidden">
                {currentOrgName ?? "Select Workspace"}
              </span>
            </SidebarMenuButton>
          </MenuTrigger>

          <MenuPositioner className="w-(--reference-width)!">
            <MenuContent className="no-scrollbar flex max-h-80 w-full flex-col gap-0 overflow-auto rounded-lg focus:outline-none">
              {organizations?.map((org, index) => {
                const orgSlug = org?.slug ?? org.id;
                const isWorkspaceSelected = orgSlug === pathname.split("/")[2];

                // Preload programmatically rather than wrapping the item in
                // `<Link preload="intent">`. Link's per-item render cost
                // (`useLinkProps` + `buildLocation` + store subscriptions)
                // multiplied across menu items caused visible jank during
                // the open/close animation. The destination resolves
                // correctly because `$workspaceSlug.tsx` owns the segment
                const preloadWorkspace = () => {
                  void router.preloadRoute({
                    to: "/workspaces/$workspaceSlug/projects",
                    params: { workspaceSlug: orgSlug },
                  });
                };

                return (
                  <MenuItem
                    key={`${org?.id}-${index}`}
                    value={`${org?.name}-${index}`}
                    onMouseEnter={preloadWorkspace}
                    onFocus={preloadWorkspace}
                    onSelect={() => {
                      closeMobileSidebar();
                      setLastWorkspaceCookie({ data: orgSlug });
                      navigate({
                        to: "/workspaces/$workspaceSlug/projects",
                        params: { workspaceSlug: orgSlug },
                      });
                    }}
                    className={cn(isWorkspaceSelected && "bg-sidebar-accent")}
                  >
                    {org.name}

                    {isWorkspaceSelected && <CheckIcon color="green" />}
                  </MenuItem>
                );
              })}

              <MenuSeparator />

              <MenuItem
                value="view-all-workspaces"
                onMouseEnter={() => {
                  void router.preloadRoute({ to: "/workspaces" });
                }}
                onFocus={() => {
                  void router.preloadRoute({ to: "/workspaces" });
                }}
                onSelect={() => {
                  closeMobileSidebar();
                  navigate({ to: "/workspaces" });
                }}
              >
                <LayoutGridIcon className="size-4" />
                All Workspaces
              </MenuItem>

              {AUTH_BASE_URL && (
                <MenuItem
                  asChild
                  className="mt-1 cursor-pointer gap-2 px-2 py-1"
                  value="manage-organizations"
                >
                  <a href={CONSOLE_URL || AUTH_BASE_URL}>
                    <PlusIcon className="size-4" />
                    Manage Organizations
                  </a>
                </MenuItem>
              )}
            </MenuContent>
          </MenuPositioner>
        </MenuRoot>
      ) : (
        AUTH_BASE_URL && (
          <SidebarMenuButton
            asChild
            className="border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground"
          >
            <a href={CONSOLE_URL || AUTH_BASE_URL}>
              <PlusIcon />

              <span>Manage Organizations</span>
            </a>
          </SidebarMenuButton>
        )
      )}
    </SidebarHeader>
  );
};

export default AppSidebarHeader;
