import {
  Link,
  useLocation,
  useNavigate,
  useRouteContext,
} from "@tanstack/react-router";
import {
  BookOpenIcon,
  LogOutIcon,
  MessageSquareIcon,
  MoonIcon,
  MoreHorizontalIcon,
  PanelLeftCloseIcon,
  PanelLeftIcon,
  SunIcon,
  TagIcon,
} from "lucide-react";
import { useCallback, useId, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { RiDiscordLine as DiscordIcon } from "react-icons/ri";

import {
  AvatarFallback,
  AvatarImage,
  AvatarRoot,
} from "@/components/ui/avatar";
import {
  CollapsibleContent,
  CollapsibleRoot,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  MenuContent,
  MenuItem,
  MenuPositioner,
  MenuRoot,
  MenuTrigger,
} from "@/components/ui/menu";
import {
  SidebarFooter,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarSeparator,
  useSidebar,
} from "@/components/ui/sidebar";
import signOut from "@/lib/auth/signOut";
import app from "@/lib/config/app.config";
import { Hotkeys } from "@/lib/constants/hotkeys";
import { getSidebarCookies } from "@/providers/SidebarProvider";
import { useTheme } from "@/providers/ThemeProvider";
import Shortcut from "./Shortcut";
import Tooltip from ".//Tooltip";

const SIDEBAR_OPTIONS_COOKIE_NAME = "sidebar:options";
const SIDEBAR_OPTIONS_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;

const AppSidebarFooter = () => {
  const { session } = useRouteContext({ strict: false });
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { toggleSidebar, isMobile, open, closeMobileSidebar } = useSidebar();
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

  useHotkeys(Hotkeys.ToggleTheme, toggleTheme, [toggleTheme]);
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
                  <div className="mx-auto h-1 w-full max-w-24 rounded-full bg-border" />
                </SidebarMenuButton>
              </CollapsibleTrigger>
            }
          >
            test
          </Tooltip>

          <CollapsibleContent className="-mx-2 p-0">
            <SidebarMenu className="my-1 px-2">
              <Tooltip
                positioning={{ placement: "right" }}
                tooltip="Expand Sidebar"
                shortcut={Hotkeys.ToggleSidebar}
                disabled={isMobile || open}
                trigger={
                  <SidebarMenuButton onClick={toggleSidebar}>
                    {open ? <PanelLeftCloseIcon /> : <PanelLeftIcon />}
                    <span className="flex w-full items-center">
                      Collapse Sidebar
                      <Shortcut>{Hotkeys.ToggleSidebar}</Shortcut>
                    </span>
                  </SidebarMenuButton>
                }
              />

              <Tooltip
                positioning={{ placement: "right" }}
                tooltip="Toggle Theme"
                shortcut={Hotkeys.ToggleTheme}
                disabled={isMobile || open}
                trigger={
                  <SidebarMenuButton onClick={toggleTheme}>
                    {theme === "dark" ? <MoonIcon /> : <SunIcon />}
                    <span className="flex w-full items-center">
                      Toggle Theme
                      <Shortcut>{Hotkeys.ToggleTheme}</Shortcut>
                    </span>
                  </SidebarMenuButton>
                }
              />

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
                    <SidebarMenuButton onClick={closeMobileSidebar}>
                      <TagIcon />
                      <span className="flex w-full items-center">Pricing</span>
                    </SidebarMenuButton>
                  </Link>
                }
              />

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

        <Tooltip
          positioning={{ placement: "right" }}
          tooltip="Profile"
          disabled={isMobile || open}
          trigger={
            <div className="group/menu-item relative">
              <SidebarMenuButton
                isActive={
                  pathname === `/profile/${session?.user.identityProviderId}`
                }
                tooltip="Profile"
                onClick={() => {
                  closeMobileSidebar();
                  navigate({
                    to: "/profile/$userId",
                    params: {
                      userId: session?.user.identityProviderId!,
                    },
                  });
                }}
              >
                <AvatarRoot className="size-4">
                  <AvatarImage
                    src={session?.user.image ?? undefined}
                    alt={session?.user.username}
                  />

                  <AvatarFallback className="font-semibold text-xs">
                    {session?.user.username?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </AvatarRoot>

                <span className="text-primary-500">
                  {session?.user.username}
                </span>
              </SidebarMenuButton>

              <MenuRoot
                positioning={{
                  strategy: "fixed",
                  placement: isMobile ? "bottom-end" : "right-start",
                }}
              >
                <MenuTrigger
                  asChild
                  className="focus-visible:ring-offset-background [&[data-state=open]>svg]:rotate-0"
                >
                  <SidebarMenuAction
                    isActive={
                      pathname ===
                      `/profile/${session?.user.identityProviderId}`
                    }
                    showOnHover
                  >
                    <MoreHorizontalIcon />
                    <span className="sr-only">More</span>
                  </SidebarMenuAction>
                </MenuTrigger>

                <MenuPositioner>
                  <MenuContent className="flex w-48 flex-col gap-0.5 rounded-lg">
                    <MenuItem
                      value="signout"
                      variant="destructive"
                      onClick={signOut}
                    >
                      <LogOutIcon />
                      <span>Sign Out</span>
                    </MenuItem>
                  </MenuContent>
                </MenuPositioner>
              </MenuRoot>
            </div>
          }
        />
      </SidebarMenu>
    </SidebarFooter>
  );
};

export default AppSidebarFooter;
