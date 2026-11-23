import { GLOBAL_HOTKEYS } from "@omnidotdev/thornberry/use-hotkeys";
import { useHotkeys } from "react-hotkeys-hook";

import { Sidebar, SidebarRail, useSidebar } from "@/components/ui/sidebar";
import AppSidebarContent from "./AppSidebarContent";
import AppSidebarFooter from "./AppSidebarFooter";
import AppSidebarHeader from "./AppSidebarHeader";

import type { ComponentProps } from "react";

const AppSidebar = ({ ...props }: ComponentProps<typeof Sidebar>) => {
  const { toggleSidebar } = useSidebar();

  useHotkeys(GLOBAL_HOTKEYS.toggleSidebar, toggleSidebar, [toggleSidebar]);

  return (
    <Sidebar collapsible="icon" {...props}>
      <AppSidebarHeader />

      <AppSidebarContent />

      <AppSidebarFooter />

      <SidebarRail />
    </Sidebar>
  );
};

export default AppSidebar;
