import { createIsomorphicFn } from "@tanstack/react-start";
import { getCookie } from "@tanstack/react-start/server";

import { SidebarProvider as DefaultSidebarProvider } from "@/components/ui/sidebar";

import type { PropsWithChildren } from "react";

export const getSidebarCookies = createIsomorphicFn()
  .server(() => {
    const sidebarState = getCookie("sidebar:state");
    const sidebarWidth = getCookie("sidebar:width");
    const sidebarOptions = getCookie("sidebar:options");

    let defaultOpen = true;
    let defaultSidebarOptions = true;

    if (sidebarState) {
      defaultOpen = sidebarState === "true";
    }

    if (sidebarOptions) {
      defaultSidebarOptions = sidebarOptions === "true";
    }

    return { defaultOpen, sidebarWidth, defaultSidebarOptions };
  })
  .client(() => {
    const cookies = document.cookie.split(";").map((cookie) => cookie.trim());
    const sidebarState = cookies
      .find((cookie) => cookie.startsWith("sidebar:state="))
      ?.split("=")[1];

    const sidebarWidth = cookies
      .find((cookie) => cookie.startsWith("sidebar:width="))
      ?.split("=")[1];

    const sidebarOptions = cookies
      .find((cookie) => cookie.startsWith("sidebar:options="))
      ?.split("=")[1];

    let defaultOpen = true;
    let defaultSidebarOptions = true;

    if (sidebarState) {
      defaultOpen = sidebarState === "true";
    }

    if (sidebarOptions) {
      defaultSidebarOptions = sidebarOptions === "true";
    }

    return { defaultOpen, sidebarWidth, defaultSidebarOptions };
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
