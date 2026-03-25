import { Link, useLocation, useParams } from "@tanstack/react-router";
import { ChevronRightIcon, LayersIcon, Settings2Icon } from "lucide-react";

import {
  CollapsibleContent,
  CollapsibleRoot,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  useSidebar,
} from "@/components/ui/sidebar";
import AppSidebarProjectList from "./AppSidebarProjectList";

interface SidebarMenuItemType {
  isActive: boolean;
  tooltip: string;
  to: string;
  icon: React.ComponentType;
  label: string;
}

const AppSidebarContent = () => {
  const { workspaceSlug } = useParams({ strict: false });
  const { pathname } = useLocation();

  const { closeMobileSidebar } = useSidebar();

  const workspaceMenuItems: SidebarMenuItemType[] = [
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

  return (
    <SidebarContent className="pt-2 group-data-[collapsible=icon]:gap-0">
      {workspaceSlug && (
        <>
          <SidebarMenu className="ml-2 hidden gap-1 group-data-[collapsible=icon]:flex">
            {/* Workspace menu items */}
            {workspaceMenuItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                params={{ workspaceSlug }}
                tabIndex={-1}
              >
                <SidebarMenuButton
                  isActive={item.isActive}
                  tooltip={item.tooltip}
                >
                  <item.icon />
                </SidebarMenuButton>
              </Link>
            ))}
          </SidebarMenu>

          {/* Desktop workspace collapsible */}
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
                  {workspaceMenuItems.map((item) => (
                    <Link
                      key={item.to}
                      to={item.to}
                      params={{ workspaceSlug }}
                      onClick={closeMobileSidebar}
                      tabIndex={-1}
                    >
                      <SidebarMenuButton isActive={item.isActive}>
                        <item.icon />
                        <span className="w-full truncate">{item.label}</span>
                      </SidebarMenuButton>
                    </Link>
                  ))}
                </SidebarMenu>
              </CollapsibleContent>
            </SidebarGroup>
          </CollapsibleRoot>

          <AppSidebarProjectList />
        </>
      )}
    </SidebarContent>
  );
};

export default AppSidebarContent;
