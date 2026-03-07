import { useHotkeys } from "react-hotkeys-hook";

import { Sidebar, SidebarRail, useSidebar } from "@/components/ui/sidebar";
import { Hotkeys } from "@/lib/constants/hotkeys";
import AppSidebarContent from "./AppSidebarContent";
import AppSidebarFooter from "./AppSidebarFooter";
import AppSidebarHeader from "./AppSidebarHeader";

import type { ComponentProps } from "react";

const AppSidebar = ({ ...props }: ComponentProps<typeof Sidebar>) => {
  const { toggleSidebar } = useSidebar();

  useHotkeys(Hotkeys.ToggleSidebar, toggleSidebar, [toggleSidebar]);

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
