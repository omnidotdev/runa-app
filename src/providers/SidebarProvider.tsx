import { createIsomorphicFn } from "@tanstack/react-start";
import { getCookie } from "@tanstack/react-start/server";

import { SidebarProvider as DefaultSidebarProvider } from "@/components/ui/sidebar";

import type { PropsWithChildren } from "react";

const getSidebarCookies = createIsomorphicFn()
  .server(() => {
    const sidebarState = getCookie("sidebar:state");
    const sidebarWidth = getCookie("sidebar:width");

    let defaultOpen = true;

    if (sidebarState) {
      defaultOpen = sidebarState === "true";
    }

    return { defaultOpen, sidebarWidth };
  })
  .client(() => {
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

    return { defaultOpen, sidebarWidth };
  });

const SidebarProvider = ({ children }: PropsWithChildren) => {
  const { defaultOpen, sidebarWidth } = getSidebarCookies();

  return (
    <DefaultSidebarProvider
      defaultOpen={defaultOpen}
      defaultWidth={sidebarWidth}
    >
      {children}
    </DefaultSidebarProvider>
  );
};

export default SidebarProvider;
