import { Sidebar, SidebarRail } from "@omnidotdev/thornberry/sidebar";

import AppSidebarContent from "./AppSidebarContent";
import AppSidebarFooter from "./AppSidebarFooter";
import AppSidebarHeader from "./AppSidebarHeader";

import type { ComponentProps } from "react";

// thornberry's `SidebarProvider` binds the toggle-sidebar hotkey
const AppSidebar = ({ ...props }: ComponentProps<typeof Sidebar>) => {
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
