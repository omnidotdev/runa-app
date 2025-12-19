import { useSuspenseQuery } from "@tanstack/react-query";
import {
  useLocation,
  useNavigate,
  useRouteContext,
} from "@tanstack/react-router";
import {
  LogOutIcon,
  MessageSquareIcon,
  MoonIcon,
  MoreHorizontalIcon,
  PanelLeftCloseIcon,
  PanelLeftIcon,
  SunIcon,
  TagIcon,
} from "lucide-react";
import { useHotkeys } from "react-hotkeys-hook";
import { RiDiscordLine as DiscordIcon } from "react-icons/ri";

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
import signOut from "@/lib/auth/signOut";
import app from "@/lib/config/app.config";
import { Hotkeys } from "@/lib/constants/hotkeys";
import invitationsOptions from "@/lib/options/invitations.options";
import { useTheme } from "@/providers/ThemeProvider";
import Shortcut from "./Shortcut";
import Tooltip from ".//Tooltip";

const AppSidebarFooter = () => {
  const { session } = useRouteContext({ strict: false });
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { isMobile, setOpen, open } = useSidebar();
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
          disabled={isMobile || open}
          trigger={
            <SidebarMenuButton onClick={() => setOpen(!open)}>
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
            <SidebarMenuButton onClick={() => toggleTheme()}>
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
            <SidebarMenuButton onClick={() => navigate({ to: "/pricing" })}>
              <TagIcon />
              <span className="flex w-full items-center">Pricing</span>
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
                href={app.socials.feedback}
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

        <Tooltip
          positioning={{ placement: "right" }}
          tooltip="Profile"
          disabled={isMobile || open}
          trigger={
            <div className="group/menu-item relative border-t">
              <SidebarMenuButton
                isActive={
                  pathname === `/profile/${session?.user.identityProviderId}`
                }
                tooltip="Profile"
                onClick={() =>
                  navigate({
                    to: "/profile/$userId",
                    params: { userId: session?.user.identityProviderId! },
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

                <span className="text-primary-500">
                  {session?.user.username}
                </span>

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
