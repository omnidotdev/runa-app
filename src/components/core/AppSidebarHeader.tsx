import {
  Link,
  useLoaderData,
  useLocation,
  useNavigate,
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
import { AUTH_BASE_URL, isSelfHosted } from "@/lib/config/env.config";
import { cn } from "@/lib/utils";
import { useOrganization } from "@/providers/OrganizationProvider";
import { setLastWorkspaceCookie } from "@/server/functions/lastWorkspace";
import { Badge } from "../ui/badge";

const AppSidebarHeader = () => {
  const { organizationId } = useLoaderData({ from: "/_auth" });
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { toggleSidebar, closeMobileSidebar } = useSidebar();
  const orgContext = useOrganization();

  // Get user's organizations from context
  const organizations = orgContext?.organizations ?? [];

  // Resolve current organization details from JWT claims
  const currentOrgName = organizationId
    ? orgContext?.getOrganizationById(organizationId)?.name
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
            <span>🌙</span>
          </SidebarMenuButton>

          <span className="font-semibold group-data-[collapsible=icon]:hidden">
            {app.name}
          </span>
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

                return (
                  <MenuItem
                    key={`${org?.id}-${index}`}
                    value={`${org?.name}-${index}`}
                    onClick={() => {
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

              <Link to="/workspaces" preload="intent" className="w-full">
                <MenuItem
                  value="view-all-workspaces"
                  onClick={() => {
                    closeMobileSidebar();
                  }}
                >
                  <LayoutGridIcon className="size-4" />
                  All Workspaces
                </MenuItem>
              </Link>

              {/* TODO: Implement in-app workspace creation for self-hosted */}
              {!isSelfHosted && AUTH_BASE_URL && (
                <MenuItem
                  asChild
                  className="cursor-pointer gap-2 px-2 py-1"
                  value="manage-organizations"
                >
                  <a href={AUTH_BASE_URL}>
                    <PlusIcon className="size-4" />
                    Manage Organizations
                  </a>
                </MenuItem>
              )}
            </MenuContent>
          </MenuPositioner>
        </MenuRoot>
      ) : (
        // TODO: Implement in-app workspace creation for self-hosted
        !isSelfHosted &&
        AUTH_BASE_URL && (
          <SidebarMenuButton
            asChild
            className="border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground"
          >
            <a href={AUTH_BASE_URL}>
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
