import { SidebarProvider as Sidebar } from "@/components/ui/sidebar";

import type { PropsWithChildren } from "react";

const SidebarProvider = ({ children }: PropsWithChildren) => {
  const cookies = document.cookie.split(";").map((cookie) => cookie.trim());
  const sidebarState = cookies
    .find((cookie) => cookie.startsWith("sidebar:state="))
    ?.split("=")[1];

  const sidebarWidth = cookies
    .find((cookie) => cookie.startsWith("sidebar:width="))
    ?.split("=")[1];

  let defaultOpen = true;

  if (sidebarState) {
    defaultOpen = sidebarState === "true";
  }

  return (
    <Sidebar defaultOpen={defaultOpen} defaultWidth={sidebarWidth}>
      {children}
    </Sidebar>
  );
};

export default SidebarProvider;
