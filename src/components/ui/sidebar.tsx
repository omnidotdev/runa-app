import { ark } from "@ark-ui/react/factory";
import { TooltipContext } from "@ark-ui/react/tooltip";
import { PanelLeftIcon } from "lucide-react";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  SheetContent,
  SheetDescription,
  SheetRoot,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  TooltipContent,
  TooltipPositioner,
  TooltipRoot,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import useIsMobile from "@/lib/hooks/useIsMobile";
import { useSidebarResize } from "@/lib/hooks/useSidebarResize";
import { cn } from "@/lib/utils";

import type {
  CSSProperties,
  ComponentProps,
  MouseEvent,
  PointerEvent,
} from "react";

const SIDEBAR_COOKIE_NAME = "sidebar:state";
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;
const SIDEBAR_WIDTH = "16rem";
const SIDEBAR_WIDTH_ICON = "3rem";
const MIN_SIDEBAR_WIDTH = "14rem";
const MAX_SIDEBAR_WIDTH = "22rem";

interface SidebarContextProps {
  state: "expanded" | "collapsed";
  open: boolean;
  setOpen: (open: boolean) => void;
  openMobile: boolean;
  setOpenMobile: (open: boolean) => void;
  isMobile: boolean | null;
  toggleSidebar: () => void;
  width: string;
  setWidth: (width: string) => void;
  isDraggingRail: boolean;
  setIsDraggingRail: (isDraggingRail: boolean) => void;
}

const SidebarContext = createContext<SidebarContextProps | null>(null);

const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider.");
  }

  return context;
};

const SidebarProvider = ({
  defaultOpen = true,
  open: openProp,
  onOpenChange: setOpenProp,
  className,
  style,
  children,
  defaultWidth = SIDEBAR_WIDTH,
  ...rest
}: ComponentProps<"div"> & {
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  defaultWidth?: string;
}) => {
  const isMobile = useIsMobile();
  const [width, setWidth] = useState(defaultWidth);
  const [openMobile, setOpenMobile] = useState(false);
  const [isDraggingRail, setIsDraggingRail] = useState(false);

  // This is the internal state of the sidebar.
  // We use openProp and setOpenProp for control from outside the component.
  const [_open, _setOpen] = useState(defaultOpen);
  const open = openProp ?? _open;
  const setOpen = useCallback(
    (value: boolean | ((value: boolean) => boolean)) => {
      const openState = typeof value === "function" ? value(open) : value;
      if (setOpenProp) {
        setOpenProp(openState);
      } else {
        _setOpen(openState);
      }

      // This sets the cookie to keep the sidebar state.
      // biome-ignore lint/suspicious/noDocumentCookie: Boiler
      document.cookie = `${SIDEBAR_COOKIE_NAME}=${openState}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`;
    },
    [setOpenProp, open],
  );

  // Helper to toggle the sidebar.
  const toggleSidebar = useCallback(() => {
    return isMobile ? setOpenMobile((open) => !open) : setOpen((open) => !open);
  }, [isMobile, setOpen]);

  const state = open ? "expanded" : "collapsed";

  const contextValue = useMemo<SidebarContextProps>(
    () => ({
      state,
      open,
      setOpen,
      isMobile,
      openMobile,
      setOpenMobile,
      toggleSidebar,
      width,
      setWidth,
      isDraggingRail,
      setIsDraggingRail,
    }),
    [
      state,
      open,
      setOpen,
      isMobile,
      openMobile,
      toggleSidebar,
      width,
      isDraggingRail,
    ],
  );

  return (
    <SidebarContext.Provider value={contextValue}>
      <div
        data-slot="sidebar-wrapper"
        style={
          {
            "--sidebar-width": width,
            "--sidebar-width-icon": SIDEBAR_WIDTH_ICON,
            ...style,
          } as CSSProperties
        }
        className={cn(
          "group/sidebar-wrapper flex min-h-svh w-full has-data-[variant=inset]:bg-sidebar",
          className,
        )}
        {...rest}
      >
        {children}
      </div>
    </SidebarContext.Provider>
  );
};

const Sidebar = ({
  side = "left",
  variant = "sidebar",
  collapsible = "offcanvas",
  className,
  children,
  ...rest
}: ComponentProps<"div"> & {
  side?: "left" | "right";
  variant?: "sidebar" | "floating" | "inset";
  collapsible?: "offcanvas" | "icon" | "none";
}) => {
  const { isMobile, state, openMobile, setOpenMobile, isDraggingRail } =
    useSidebar();

  // On mobile, don't render until hydration completes to keep drawer UX snappy.
  // On desktop, render a collapsed-size placeholder to prevent layout shift.
  if (isMobile === null) {
    return (
      <div
        data-slot="sidebar-placeholder"
        className="hidden w-[calc(var(--sidebar-width-icon)+(--spacing(4)))] shrink-0 md:block"
      />
    );
  }

  if (collapsible === "none") {
    return (
      <div
        data-slot="sidebar"
        className={cn(
          "flex h-full w-(--sidebar-width) flex-col bg-red-500 text-sidebar-foreground",
          className,
        )}
        {...rest}
      >
        {children}
      </div>
    );
  }

  if (isMobile) {
    return (
      <SheetRoot
        open={openMobile}
        onOpenChange={({ open }: { open: boolean }) => setOpenMobile(open)}
      >
        <SheetTrigger asChild className="absolute top-2 right-2 z-50">
          <Button variant="ghost" size="icon" className="h-10 w-10">
            <PanelLeftIcon className="size-5" />
          </Button>
        </SheetTrigger>
        <SheetContent
          data-sidebar="sidebar"
          data-slot="sidebar"
          data-mobile="true"
          className="w-1/2 bg-sidebar p-0 text-sidebar-foreground [&>button]:hidden"
          side={side}
        >
          <div className="sr-only">
            <SheetTitle>Sidebar</SheetTitle>
            <SheetDescription>Displays the mobile sidebar.</SheetDescription>
          </div>
          <div className="flex h-full w-full flex-col">{children}</div>
        </SheetContent>
      </SheetRoot>
    );
  }

  return (
    <div
      className="group peer block text-sidebar-foreground"
      data-state={state}
      data-collapsible={state === "collapsed" ? collapsible : ""}
      data-variant={variant}
      data-side={side}
      data-slot="sidebar"
      data-dragging={isDraggingRail}
    >
      {/* This is what handles the sidebar gap on desktop */}
      <div
        data-slot="sidebar-gap"
        className={cn(
          "relative w-(--sidebar-width) bg-transparent transition-[width] duration-200 ease-linear",
          "group-data-[collapsible=offcanvas]:w-0",
          "group-data-[side=right]:rotate-180",
          variant === "floating" || variant === "inset"
            ? "group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4)))]"
            : "group-data-[collapsible=icon]:w-(--sidebar-width-icon)",
          //* set duration to 0 for all elements when dragging
          "group-data-[dragging=true]:duration-0! group-data-[dragging=true]_*:duration-0!",
        )}
      />
      <div
        data-slot="sidebar-container"
        className={cn(
          "fixed inset-y-0 z-50 flex h-svh w-(--sidebar-width) transition-[left,right,width] duration-200 ease-linear",
          side === "left"
            ? "left-0 group-data-[collapsible=offcanvas]:left-[calc(var(--sidebar-width)*-1)]"
            : "right-0 group-data-[collapsible=offcanvas]:right-[calc(var(--sidebar-width)*-1)]",
          // Adjust the padding for floating and inset variants.
          variant === "floating" || variant === "inset"
            ? "p-2 group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4))+2px)]"
            : "group-data-[collapsible=icon]:w-(--sidebar-width-icon) group-data-[side=left]:border-r group-data-[side=right]:border-l",
          //* set duration to 0 for all elements when dragging
          "group-data-[dragging=true]:duration-0! group-data-[dragging=true]_*:duration-0!",
          className,
        )}
        {...rest}
      >
        <div
          data-sidebar="sidebar"
          data-slot="sidebar-inner"
          className="flex h-full w-full flex-col rounded-xl bg-sidebar group-data-[variant=floating]:rounded-lg group-data-[variant=floating]:border group-data-[variant=floating]:border-sidebar-border group-data-[variant=floating]:shadow-sm"
        >
          {children}
        </div>
      </div>
    </div>
  );
};

const SidebarTrigger = ({
  className,
  onClick,
  ...rest
}: ComponentProps<typeof Button>) => {
  const { toggleSidebar } = useSidebar();

  return (
    <Button
      data-sidebar="trigger"
      data-slot="sidebar-trigger"
      variant="ghost"
      size="icon"
      className={cn("sticky top-2 ml-2 size-8", className)}
      onClick={(event: MouseEvent<HTMLButtonElement>) => {
        onClick?.(event);
        toggleSidebar();
      }}
      {...rest}
    >
      <PanelLeftIcon />
      <span className="sr-only">Toggle Sidebar</span>
    </Button>
  );
};

const SidebarRail = ({
  enableDrag = true,
  className,
  ...rest
}: ComponentProps<typeof ark.button> & {
  enableDrag?: boolean;
}) => {
  const { toggleSidebar, setWidth, state, width, setIsDraggingRail } =
    useSidebar();

  const { dragRef, handleMouseDown } = useSidebarResize({
    onResize: setWidth,
    onToggle: toggleSidebar,
    currentWidth: width,
    isCollapsed: state === "collapsed",
    minResizeWidth: MIN_SIDEBAR_WIDTH,
    maxResizeWidth: MAX_SIDEBAR_WIDTH,
    setIsDraggingRail,
    widthCookieName: "sidebar:width",
    enableAutoCollapse: true,
    autoCollapseThreshold: 1.3,
    expandThreshold: 0.2,
  });

  const anchorRect = useRef<DOMRect | null>(null);
  const getAnchorRect = useCallback(() => anchorRect.current, []);

  const isCollapsed = state === "collapsed";

  return (
    <TooltipRoot
      positioning={{
        placement: "right",
        getAnchorRect,
      }}
      closeDelay={0}
      openDelay={300}
    >
      <TooltipContext>
        {(tootlip) => (
          <TooltipTrigger
            asChild
            onPointerMove={(e: PointerEvent<HTMLButtonElement>) => {
              anchorRect.current = new DOMRect(e.clientX, e.clientY, 1, 1);
              tootlip.reposition();
            }}
          >
            <button
              ref={dragRef}
              data-sidebar="rail"
              data-slot="sidebar-rail"
              aria-label="Toggle Sidebar"
              tabIndex={-1}
              onMouseDown={handleMouseDown}
              className={cn(
                "absolute inset-y-0 z-20 hidden w-4 -translate-x-1/2 transition-all ease-linear after:absolute after:inset-y-0 after:left-1/2 after:w-0.5 group-data-[side=left]:-right-4 group-data-[side=right]:left-0 sm:flex",
                "in-data-[side=left]:cursor-w-resize in-data-[side=right]:cursor-e-resize",
                "[[data-side=left][data-state=collapsed]_&]:cursor-e-resize [[data-side=right][data-state=collapsed]_&]:cursor-w-resize",
                "group-data-[collapsible=offcanvas]:translate-x-0 hover:group-data-[collapsible=offcanvas]:bg-sidebar group-data-[collapsible=offcanvas]:after:left-full",
                "[[data-side=left][data-collapsible=offcanvas]_&]:-right-2",
                "[[data-side=right][data-collapsible=offcanvas]_&]:-left-2",
                "[[data-side=left][data-state=expanded]_&]:cursor-col-resize",
                className,
              )}
              {...rest}
            />
          </TooltipTrigger>
        )}
      </TooltipContext>

      <TooltipPositioner>
        <TooltipContent className="flex h-fit flex-col items-start">
          <span>Drag to resize</span>
          <div className="flex items-center gap-2">
            Click to {isCollapsed ? "expand" : "collapse"}{" "}
            <span className="ml-auto flex items-center justify-center gap-0.5 rounded border bg-background px-1 font-medium text-foreground text-xs">
              B
            </span>
          </div>
        </TooltipContent>
      </TooltipPositioner>
    </TooltipRoot>
  );
};

const SidebarInset = ({ className, ...rest }: ComponentProps<"main">) => {
  return (
    <main
      data-slot="sidebar-inset"
      className={cn(
        "relative flex w-full flex-1 flex-col bg-background",
        "md:peer-data-[variant=inset]:m-2 md:peer-data-[variant=inset]:ml-0 md:peer-data-[variant=inset]:rounded-xl",
        className,
      )}
      {...rest}
    />
  );
};

const SidebarSeparator = ({ className, ...rest }: ComponentProps<"div">) => {
  return (
    <div
      data-slot="sidebar-separator"
      className={cn("-mx-2 h-px bg-border py-0", className)}
      {...rest}
    />
  );
};

const SidebarInput = ({ className, ...rest }: ComponentProps<typeof Input>) => {
  return (
    <Input
      data-slot="sidebar-input"
      data-sidebar="input"
      className={cn("h-8 w-full bg-background shadow-none", className)}
      {...rest}
    />
  );
};

const SidebarHeader = ({ className, ...rest }: ComponentProps<"div">) => {
  return (
    <div
      data-slot="sidebar-header"
      data-sidebar="header"
      className={cn("flex flex-col gap-2 p-2", className)}
      {...rest}
    />
  );
};

const SidebarFooter = ({ className, ...rest }: ComponentProps<"div">) => {
  return (
    <div
      data-slot="sidebar-footer"
      data-sidebar="footer"
      className={cn("flex flex-col gap-2 p-2", className)}
      {...rest}
    />
  );
};

const SidebarContent = ({ className, ...rest }: ComponentProps<"div">) => {
  return (
    <div
      data-slot="sidebar-content"
      data-sidebar="content"
      className={cn(
        "no-scrollbar mb-2 flex min-h-0 flex-1 flex-col gap-4 overflow-auto group-data-[collapsible=icon]:overflow-hidden",
        className,
      )}
      {...rest}
    />
  );
};

const SidebarGroup = ({ className, ...rest }: ComponentProps<"div">) => {
  return (
    <div
      data-slot="sidebar-group"
      data-sidebar="group"
      className={cn("flex w-full flex-col gap-1 px-2", className)}
      {...rest}
    />
  );
};

const SidebarGroupLabel = ({
  className,
  ...rest
}: ComponentProps<typeof ark.div>) => {
  return (
    <ark.div
      data-slot="sidebar-group-label"
      data-sidebar="group-label"
      className={cn(
        "flex shrink-0 items-center rounded-md py-1 font-medium text-sidebar-foreground/70 text-xs outline-hidden ring-sidebar-ring transition-[margin,opacity] duration-200 ease-linear focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0",
        "group-data-[collapsible=icon]:hidden group-data-[collapsible=icon]:opacity-0",
        className,
      )}
      {...rest}
    />
  );
};

const SidebarGroupAction = ({
  className,
  disabled = false,
  ...rest
}: ComponentProps<typeof ark.div> & {
  disabled?: boolean;
}) => {
  return (
    <ark.div
      data-slot="sidebar-group-action"
      data-sidebar="group-action"
      data-disabled={disabled ? "true" : undefined}
      className={cn(
        "flex size-5 cursor-pointer items-center justify-center rounded-md p-0 text-base-400 outline-hidden ring-sidebar-ring transition-transform hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 data-[disabled=true]:cursor-not-allowed data-[disabled=true]:opacity-50 data-[disabled=true]:hover:bg-transparent data-[disabled=true]:hover:text-base-400 [&>svg]:size-3 [&>svg]:shrink-0",
        "group-data-[collapsible=icon]:hidden",
        className,
      )}
      {...rest}
    />
  );
};

const SidebarGroupContent = ({ className, ...rest }: ComponentProps<"div">) => {
  return (
    <div
      data-slot="sidebar-group-content"
      data-sidebar="group-content"
      className={cn("w-full text-sm", className)}
      {...rest}
    />
  );
};

const SidebarMenu = ({ className, ...rest }: ComponentProps<"div">) => {
  return (
    <div
      data-slot="sidebar-menu"
      data-sidebar="menu"
      className={cn("flex w-full min-w-0 flex-col gap-1", className)}
      {...rest}
    />
  );
};

const SidebarMenuItem = ({ className, ...rest }: ComponentProps<"div">) => {
  return (
    <div
      data-slot="sidebar-menu-item"
      data-sidebar="menu-item"
      className={cn("group/menu-item relative cursor-pointer", className)}
      {...rest}
    />
  );
};

const SidebarMenuButton = ({
  isActive = false,
  tooltip,
  shortcut,
  className,
  ...rest
}: ComponentProps<typeof ark.button> & {
  isActive?: boolean;
  tooltip?: string;
  shortcut?: string;
}) => {
  const { isMobile, state } = useSidebar();

  const button = (
    <ark.button
      data-slot="sidebar-menu-button"
      data-sidebar="menu-button"
      data-active={isActive}
      className={cn(
        // Base layout and spacing
        "peer/menu-button flex h-8 w-full cursor-pointer items-center gap-2 overflow-hidden rounded-md px-2 text-left text-sm transition-[width,height,padding,color,box-shadow] duration-0",
        // Typography and base text color
        "font-medium text-sidebar-foreground/70",
        // Hover styles
        "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
        // Focus styles
        "outline-hidden focus-visible:text-sidebar-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring! focus-visible:ring-offset-2! focus-visible:ring-offset-background",
        // Active styles
        "active:text-sidebar-accent-foreground",
        // Disabled and aria-disabled styles
        "disabled:pointer-events-none disabled:opacity-50",
        "aria-disabled:pointer-events-none aria-disabled:opacity-50",
        // Data attribute states
        "data-[active=true]:bg-sidebar-accent/80 data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground",
        "data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground",
        // Collapsible size variant
        "group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-2!",
        // Sidebar action padding adjustment
        "group-has-data-[sidebar=menu-action]/menu-item:pr-8",
        // Children styling
        "[&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0",
        className,
      )}
      {...rest}
    />
  );

  if (!tooltip) {
    return button;
  }

  return (
    <TooltipRoot
      positioning={{ placement: "right" }}
      closeDelay={0}
      openDelay={200}
      disabled={isMobile || state === "expanded"}
    >
      <TooltipTrigger asChild>{button}</TooltipTrigger>
      <TooltipPositioner>
        <TooltipContent className="flex items-center gap-2">
          {tooltip}
          {shortcut && (
            <span className="ml-auto flex items-center justify-center gap-0.5 rounded border bg-background px-1 font-medium text-foreground text-xs">
              {shortcut}
            </span>
          )}
        </TooltipContent>
      </TooltipPositioner>
    </TooltipRoot>
  );
};

const SidebarMenuAction = ({
  isActive,
  className,
  showOnHover = false,
  ...rest
}: ComponentProps<typeof ark.button> & {
  isActive?: boolean;
  showOnHover?: boolean;
}) => {
  return (
    <ark.button
      data-slot="sidebar-menu-action"
      data-sidebar="menu-action"
      data-active={isActive}
      className={cn(
        "absolute top-1.5 right-1 flex aspect-square w-5 cursor-pointer items-center justify-center rounded-md p-0 text-sidebar-foreground outline-none outline-hidden ring-sidebar-ring transition-[color,box-shadow] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring! focus-visible:ring-offset-2 peer-hover/menu-button:text-sidebar-accent-foreground data-[active=true]:text-sidebar-accent-foreground data-[active=true]:hover:bg-accent data-[active=true]:dark:hover:bg-base-700 [&>svg]:size-4 [&>svg]:shrink-0",
        "after:absolute after:-inset-2 md:after:hidden",
        "peer-data-[size=sm]/menu-button:top-1",
        "peer-data-[size=default]/menu-button:top-1.5",
        "peer-data-[size=lg]/menu-button:top-2.5",
        "group-data-[collapsible=icon]:hidden",
        showOnHover &&
          "group-focus-within/menu-item:opacity-100 group-hover/menu-item:opacity-100 data-[state=open]:opacity-100 peer-data-[active=true]/menu-button:text-sidebar-accent-foreground md:opacity-0",
        className,
      )}
      {...rest}
    />
  );
};

const SidebarMenuBadge = ({ className, ...rest }: ComponentProps<"div">) => {
  return (
    <div
      data-slot="sidebar-menu-badge"
      data-sidebar="menu-badge"
      className={cn(
        "pointer-events-none absolute right-1 flex h-5 min-w-5 select-none items-center justify-center rounded-md px-1 font-medium text-sidebar-foreground text-xs tabular-nums",
        "peer-hover/menu-button:text-sidebar-accent-foreground peer-data-[active=true]/menu-button:text-sidebar-accent-foreground",
        "peer-data-[size=sm]/menu-button:top-1",
        "peer-data-[size=default]/menu-button:top-1.5",
        "peer-data-[size=lg]/menu-button:top-2.5",
        "group-data-[collapsible=icon]:hidden",
        className,
      )}
      {...rest}
    />
  );
};

const SidebarMenuSub = ({ className, ...rest }: ComponentProps<"ul">) => {
  return (
    <ul
      data-slot="sidebar-menu-sub"
      data-sidebar="menu-sub"
      className={cn(
        "mx-3.5 flex min-w-0 translate-x-px flex-col gap-1 border-sidebar-border border-l px-2.5 py-0.5",
        "group-data-[collapsible=icon]:hidden",
        className,
      )}
      {...rest}
    />
  );
};

const SidebarMenuSubItem = ({ className, ...rest }: ComponentProps<"li">) => {
  return (
    <li
      data-slot="sidebar-menu-sub-item"
      data-sidebar="menu-sub-item"
      className={cn("group/menu-sub-item relative", className)}
      {...rest}
    />
  );
};

const SidebarMenuSubButton = ({
  size = "md",
  isActive = false,
  className,
  ...rest
}: ComponentProps<typeof ark.a> & {
  size?: "sm" | "md";
  isActive?: boolean;
}) => {
  return (
    <ark.a
      data-slot="sidebar-menu-sub-button"
      data-sidebar="menu-sub-button"
      data-size={size}
      data-active={isActive}
      className={cn(
        "flex h-7 min-w-0 -translate-x-px items-center gap-2 overflow-hidden rounded-md px-2 text-sidebar-foreground outline-hidden ring-sidebar-ring hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0 [&>svg]:text-sidebar-accent-foreground",
        "data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground",
        size === "sm" && "text-xs",
        size === "md" && "text-sm",
        "group-data-[collapsible=icon]:hidden",
        className,
      )}
      {...rest}
    />
  );
};

/** @knipignore */
export {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
  useSidebar,
  SidebarSeparator,
};
