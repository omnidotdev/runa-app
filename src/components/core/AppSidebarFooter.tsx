import { accountUrl } from "@omnidotdev/providers/react";
import {
  AccountMenu,
  AccountMenuItem,
} from "@omnidotdev/thornberry/account-menu";
import {
  CollapsibleContent,
  CollapsibleRoot,
  CollapsibleTrigger,
} from "@omnidotdev/thornberry/collapsible";
import {
  SidebarFooter,
  SidebarMenu,
  SidebarMenuButton,
  SidebarSeparator,
  useSidebar,
} from "@omnidotdev/thornberry/sidebar";
import { GLOBAL_HOTKEYS } from "@omnidotdev/thornberry/use-hotkeys";
import { Link, useRouteContext } from "@tanstack/react-router";
import {
  BookOpenIcon,
  MessageSquareIcon,
  MoonIcon,
  PanelLeftCloseIcon,
  PanelLeftIcon,
  SunIcon,
  TagIcon,
} from "lucide-react";
import { useCallback, useId, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { RiDiscordLine as DiscordIcon } from "react-icons/ri";

import signOut from "@/lib/auth/signOut";
import app from "@/lib/config/app.config";
import { ACCOUNT_URL, hasBilling } from "@/lib/config/env.config";
import { Hotkeys } from "@/lib/constants/hotkeys";
import { getSidebarCookies } from "@/providers/SidebarProvider";
import { useTheme } from "@/providers/ThemeProvider";
import Shortcut from "./Shortcut";
import Tooltip from "./Tooltip";

const SIDEBAR_OPTIONS_COOKIE_NAME = "sidebar:options";
const SIDEBAR_OPTIONS_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;

const AppSidebarFooter = () => {
  const { session } = useRouteContext({ strict: false });
  const { toggleSidebar, isMobile, open, setOpenMobile } = useSidebar();
  const { theme, setTheme } = useTheme();
  const triggerId = useId();
  const { defaultSidebarOptions } = getSidebarCookies();

  const [isOptionsOpen, setIsOptionsOpen] = useState(defaultSidebarOptions);

  const setOpen = useCallback(
    (value: boolean | ((value: boolean) => boolean)) => {
      const openState =
        typeof value === "function" ? value(isOptionsOpen) : value;

      setIsOptionsOpen(openState);

      // This sets the cookie to keep the sidebar state.
      // biome-ignore lint/suspicious/noDocumentCookie: Boiler
      document.cookie = `${SIDEBAR_OPTIONS_COOKIE_NAME}=${openState}; path=/; max-age=${SIDEBAR_OPTIONS_COOKIE_MAX_AGE}`;
    },
    [isOptionsOpen],
  );

  const toggleTheme = () =>
    theme === "dark" ? setTheme("light") : setTheme("dark");

  const toggleSidebarOptions = () => setOpen(!isOptionsOpen);

  useHotkeys(Hotkeys.ToggleSidebarOptions, toggleSidebarOptions, [
    isOptionsOpen,
  ]);

  return (
    <SidebarFooter className="flex justify-center">
      <SidebarMenu className="gap-1 group-data-[collapsible=icon]:w-fit">
        <CollapsibleRoot
          open={isOptionsOpen}
          onOpenChange={({ open }) => setOpen(open)}
        >
          <Tooltip
            positioning={{ placement: "top" }}
            ids={{ trigger: triggerId }}
            tooltip="Toggle sidebar options"
            shortcut={Hotkeys.ToggleSidebarOptions}
            trigger={
              <CollapsibleTrigger asChild>
                <SidebarMenuButton
                  className="cursor-ns-resize hover:bg-transparent!"
                  aria-label="Toggle sidebar options"
                >
                  <div className="bg-border mx-auto h-1 w-full max-w-24 rounded-full" />
                </SidebarMenuButton>
              </CollapsibleTrigger>
            }
          />

          <CollapsibleContent className="-mx-2 p-0">
            <SidebarMenu className="my-1 px-2">
              <Tooltip
                positioning={{ placement: "right" }}
                tooltip="Expand Sidebar"
                shortcut={GLOBAL_HOTKEYS.toggleSidebar}
                disabled={isMobile || open}
                trigger={
                  <SidebarMenuButton onClick={toggleSidebar}>
                    {open ? <PanelLeftCloseIcon /> : <PanelLeftIcon />}
                    <span className="flex w-full items-center">
                      Collapse Sidebar
                      <Shortcut>{GLOBAL_HOTKEYS.toggleSidebar}</Shortcut>
                    </span>
                  </SidebarMenuButton>
                }
              />

              <Tooltip
                positioning={{ placement: "right" }}
                tooltip="Toggle Theme"
                shortcut={GLOBAL_HOTKEYS.toggleTheme}
                disabled={isMobile || open}
                trigger={
                  <SidebarMenuButton onClick={toggleTheme}>
                    {theme === "dark" ? <MoonIcon /> : <SunIcon />}
                    <span className="flex w-full items-center">
                      Toggle Theme
                      <Shortcut>{GLOBAL_HOTKEYS.toggleTheme}</Shortcut>
                    </span>
                  </SidebarMenuButton>
                }
              />

              {hasBilling && (
                <Tooltip
                  positioning={{ placement: "right" }}
                  tooltip="Pricing"
                  disabled={isMobile || open}
                  trigger={
                    <Link
                      to="/pricing"
                      preload="intent"
                      className="w-full"
                      tabIndex={-1}
                    >
                      <SidebarMenuButton onClick={() => setOpenMobile(false)}>
                        <TagIcon />
                        <span className="flex w-full items-center">
                          Pricing
                        </span>
                      </SidebarMenuButton>
                    </Link>
                  }
                />
              )}

              <Tooltip
                positioning={{ placement: "right" }}
                tooltip="Documentation"
                disabled={isMobile || open}
                trigger={
                  <SidebarMenuButton asChild>
                    <a
                      href={app.links.docs}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <BookOpenIcon />
                      <span className="flex w-full items-center">Docs</span>
                    </a>
                  </SidebarMenuButton>
                }
              />

              <Tooltip
                positioning={{ placement: "right" }}
                tooltip="Send Feedback"
                disabled={isMobile || open}
                trigger={
                  <SidebarMenuButton asChild>
                    <a
                      href={app.links.feedback}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <MessageSquareIcon />
                      <span className="flex w-full items-center">
                        Provide Feedback
                      </span>
                    </a>
                  </SidebarMenuButton>
                }
              />

              <Tooltip
                positioning={{ placement: "right" }}
                tooltip="Join Discord"
                disabled={isMobile || open}
                trigger={
                  <SidebarMenuButton asChild>
                    <a
                      href={app.organization.discord}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <DiscordIcon />
                      <span className="flex w-full items-center">
                        Join Omni Discord
                      </span>
                    </a>
                  </SidebarMenuButton>
                }
              />
            </SidebarMenu>
          </CollapsibleContent>
        </CollapsibleRoot>

        <SidebarSeparator className="my-1" />

        <AccountMenu
          variant="sidebar"
          user={{
            name: session?.user.name,
            email: session?.user.email,
            image: session?.user.image,
          }}
          onSignOut={() => void signOut()}
          manageAccountUrl={accountUrl(ACCOUNT_URL) || undefined}
          // Fixed, so the menu escapes the sidebar's overflow
          positioning={{
            strategy: "fixed",
            placement: isMobile ? "top" : "right-end",
          }}
        >
          {session?.user.identityProviderId && (
            <AccountMenuItem value="profile" asChild>
              <Link
                to="/profile/$userId"
                params={{ userId: session.user.identityProviderId }}
                onClick={() => setOpenMobile(false)}
              >
                Profile
              </Link>
            </AccountMenuItem>
          )}
        </AccountMenu>
      </SidebarMenu>
    </SidebarFooter>
  );
};

export default AppSidebarFooter;
