import {
  useLocation,
  useNavigate,
  useRouteContext,
} from "@tanstack/react-router";
import {
  LogOutIcon,
  MoonIcon,
  MoreHorizontalIcon,
  PanelLeftIcon,
  SunIcon,
  UserIcon,
} from "lucide-react";
import { useHotkeys } from "react-hotkeys-hook";

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
  SidebarMenuItem,
  SidebarMenuShortcut,
  useSidebar,
} from "@/components/ui/sidebar";
import { signOut } from "@/lib/auth/signOut";
import { Hotkeys } from "@/lib/constants/hotkeys";
import useTheme from "@/lib/hooks/useTheme";

const AppSidebarFooter = () => {
  const { session } = useRouteContext({ strict: false });
  const navigate = useNavigate();
  const pathname = useLocation();
  const { isMobile, setOpen, open } = useSidebar();
  const { theme, setTheme } = useTheme();

  const toggleTheme = () =>
    theme === "dark" ? setTheme("light") : setTheme("dark");

  useHotkeys(Hotkeys.ToggleTheme, toggleTheme, [toggleTheme]);

  return (
    <SidebarFooter className="flex justify-center border-t">
      <SidebarMenu className="gap-1 group-data-[collapsible=icon]:w-fit">
        {/* TODO: Uncomment when runa project is added to backfeed */}
        {/* <SidebarMenuItem>
          <SidebarMenuButton
            tooltip="Feedback"
            onClick={() =>
              navigate({
                href: "https://backfeed.omni.dev/organizations/omni/projects/runa",
                
              })
            }
          >
            <SendIcon />
            <span className="flex w-full items-center">Feedback</span>
          </SidebarMenuButton>
        </SidebarMenuItem> */}

        <SidebarMenuItem>
          <SidebarMenuButton
            tooltip="Expand Sidebar"
            shortcut={Hotkeys.ToggleSidebar}
            onClick={() => setOpen(!open)}
          >
            <PanelLeftIcon />
            <span className="flex w-full items-center">
              Collapse Sidebar
              <SidebarMenuShortcut>B</SidebarMenuShortcut>
            </span>
          </SidebarMenuButton>
        </SidebarMenuItem>

        <SidebarMenuItem>
          <SidebarMenuButton
            tooltip="Toggle Theme"
            shortcut={Hotkeys.ToggleTheme}
            onClick={() => toggleTheme()}
          >
            {theme === "dark" ? <MoonIcon /> : <SunIcon />}
            <span className="flex w-full items-center">
              Toggle Theme
              <SidebarMenuShortcut>T</SidebarMenuShortcut>
            </span>
          </SidebarMenuButton>
        </SidebarMenuItem>

        <SidebarMenuItem>
          <SidebarMenuButton
            isActive={pathname.pathname === `/profile/${session?.user.hidraId}`}
            tooltip="Profile"
            onClick={() =>
              navigate({
                to: "/profile/$userId",
                params: { userId: session?.user.hidraId! },
              })
            }
          >
            <UserIcon />
            <span>{session?.user.username}</span>
          </SidebarMenuButton>

          <MenuRoot
            positioning={{
              strategy: "fixed",
              placement: isMobile ? "bottom-end" : "right-start",
            }}
          >
            <MenuTrigger asChild>
              <SidebarMenuAction
                isActive={
                  pathname.pathname === `/profile/${session?.user.hidraId}`
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
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarFooter>
  );
};

export default AppSidebarFooter;
