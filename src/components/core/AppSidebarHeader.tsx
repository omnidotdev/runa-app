import {
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
      <div className="mb-4 flex justify-between">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={toggleSidebar}
            className="ml-2 cursor-pointer"
          >
            🌙
          </button>
          <span className="font-semibold group-data-[collapsible=icon]:hidden">
            {app.name}
          </span>
        </div>

        <Badge className="border-primary-500/20 bg-primary-500/10 text-primary-500 text-xs group-data-[collapsible=icon]:hidden">
          Alpha
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
            <MenuContent className="no-scrollbar flex max-h-80 w-full flex-col gap-1 overflow-auto rounded-lg focus:outline-none">
              {organizations?.map((org) => {
                const orgSlug = org?.slug ?? org.id;
                const isWorkspaceSelected = orgSlug === pathname.split("/")[2];

                return (
                  <MenuItem
                    key={org?.id}
                    onClick={() => {
                      closeMobileSidebar();
                      setLastWorkspaceCookie({ data: orgSlug });
                      navigate({
                        to: "/workspaces/$workspaceSlug/projects",
                        params: { workspaceSlug: orgSlug },
                      });
                    }}
                    className={cn(
                      "cursor-pointer justify-between gap-1 px-2 py-1",
                      isWorkspaceSelected && "bg-sidebar-accent",
                    )}
                    value={org.name}
                  >
                    {org.name}

                    {isWorkspaceSelected && <CheckIcon color="green" />}
                  </MenuItem>
                );
              })}

              <MenuSeparator />

              <MenuItem
                onClick={() => {
                  closeMobileSidebar();
                  navigate({ to: "/workspaces" });
                }}
                className="cursor-pointer gap-2 px-2 py-1"
                value="view-all-workspaces"
              >
                <LayoutGridIcon className="size-4" />
                All Workspaces
              </MenuItem>

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
