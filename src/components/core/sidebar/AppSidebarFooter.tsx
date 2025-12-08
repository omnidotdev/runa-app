import { useSuspenseQuery } from "@tanstack/react-query";
import {
  useLocation,
  useNavigate,
  useRouteContext,
} from "@tanstack/react-router";
import {
  LogOutIcon,
  MoonIcon,
  MoreHorizontalIcon,
  PanelLeftCloseIcon,
  PanelLeftIcon,
  SendIcon,
  SunIcon,
} from "lucide-react";
import { useHotkeys } from "react-hotkeys-hook";

import Tooltip from "@/components/core//Tooltip";
import Shortcut from "@/components/core/Shortcut";
import {
  AvatarFallback,
  AvatarImage,
  AvatarRoot,
} from "@/components/ui/avatar";
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
  useSidebar,
} from "@/components/ui/sidebar";
import { signOut } from "@/lib/auth/signOut";
import { Hotkeys } from "@/lib/constants/hotkeys";
import useTheme from "@/lib/hooks/useTheme";
import invitationsOptions from "@/lib/options/invitations.options";

const AppSidebarFooter = () => {
  const { session } = useRouteContext({ strict: false });
  const navigate = useNavigate();
  const pathname = useLocation();
  const { isMobile, setOpen, open, state } = useSidebar();
  const { theme, setTheme } = useTheme();

  const toggleTheme = () =>
    theme === "dark" ? setTheme("light") : setTheme("dark");

  useHotkeys(Hotkeys.ToggleTheme, toggleTheme, [toggleTheme]);

  const { data: invitations } = useSuspenseQuery({
    ...invitationsOptions({ email: session?.user.email! }),
    select: (data) => data?.invitations?.nodes ?? [],
  });

  return (
    <SidebarFooter className="flex justify-center border-t">
      <SidebarMenu className="gap-1 group-data-[collapsible=icon]:w-fit">
        <Tooltip
          positioning={{ placement: "right" }}
          tooltip="Expand Sidebar"
          shortcut={Hotkeys.ToggleSidebar}
          disabled={isMobile || state === "expanded"}
          trigger={
            <SidebarMenuButton onClick={() => setOpen(!open)}>
              {open ? <PanelLeftCloseIcon /> : <PanelLeftIcon />}
              <span className="flex w-full items-center">
                Collapse Sidebar
                <Shortcut>B</Shortcut>
              </span>
            </SidebarMenuButton>
          }
        />

        <Tooltip
          positioning={{ placement: "right" }}
          tooltip="Toggle Theme"
          shortcut={Hotkeys.ToggleTheme}
          disabled={isMobile || state === "expanded"}
          trigger={
            <SidebarMenuButton onClick={() => toggleTheme()}>
              {theme === "dark" ? <MoonIcon /> : <SunIcon />}
              <span className="flex w-full items-center">
                Toggle Theme
                <Shortcut>T</Shortcut>
              </span>
            </SidebarMenuButton>
          }
        />

        <Tooltip
          positioning={{ placement: "right" }}
          tooltip="Feedback"
          disabled={isMobile || state === "expanded"}
          trigger={
            <SidebarMenuButton asChild>
              <a
                href="https://backfeed.omni.dev/organizations/omni/projects/runa"
                target="_blank"
                rel="noopener noreferrer"
              >
                <SendIcon />
                <span className="flex w-full items-center">Feedback</span>
              </a>
            </SidebarMenuButton>
          }
        />

        <Tooltip
          positioning={{ placement: "right" }}
          tooltip="Profile"
          disabled={isMobile || state === "expanded"}
          trigger={
            <div className="group/menu-item relative">
              <SidebarMenuButton
                isActive={
                  pathname.pathname === `/profile/${session?.user.hidraId}`
                }
                tooltip="Profile"
                onClick={() =>
                  navigate({
                    to: "/profile/$userId",
                    params: { userId: session?.user.hidraId! },
                  })
                }
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
                <span>{session?.user.username}</span>
                {!!invitations.length && (
                  <div className="absolute top-2 left-5 size-1.5 rounded-full bg-red-500" />
                )}
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
            </div>
          }
        />
      </SidebarMenu>
    </SidebarFooter>
  );
};

export default AppSidebarFooter;
