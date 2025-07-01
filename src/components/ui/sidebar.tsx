import { ark } from "@ark-ui/react/factory";
import { Portal } from "@ark-ui/react/portal";
import { cva } from "class-variance-authority";
import { PanelLeftIcon } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  SheetContent,
  SheetDescription,
  SheetRoot,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  TooltipContent,
  TooltipPositioner,
  TooltipRoot,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import useIsMobile from "@/lib/hooks/use-mobile";
import { useSidebarResize } from "@/lib/hooks/use-sidebar-resize";
import { cn } from "@/lib/utils";

import type { VariantProps } from "class-variance-authority";

const SIDEBAR_COOKIE_NAME = "sidebar:state";
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;
const SIDEBAR_WIDTH = "16rem";
const SIDEBAR_WIDTH_MOBILE = "18rem";
const SIDEBAR_WIDTH_ICON = "3rem";
const SIDEBAR_KEYBOARD_SHORTCUT = "b";

//* new constants for sidebar resizing
const MIN_SIDEBAR_WIDTH = "14rem";
const MAX_SIDEBAR_WIDTH = "22rem";

type SidebarContextProps = {
  state: "expanded" | "collapsed";
  open: boolean;
  setOpen: (open: boolean) => void;
  openMobile: boolean;
  setOpenMobile: (open: boolean) => void;
  isMobile: boolean;
  toggleSidebar: () => void;
  //* new properties for sidebar resizing
  width: string;
  setWidth: (width: string) => void;
  //* new properties for tracking is dragging rail
  isDraggingRail: boolean;
  setIsDraggingRail: (isDraggingRail: boolean) => void;
};

const SidebarContext = React.createContext<SidebarContextProps | null>(null);

function useSidebar() {
  const context = React.useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider.");
  }

  return context;
}

function SidebarProvider({
  defaultOpen = true,
  open: openProp,
  onOpenChange: setOpenProp,
  className,
  style,
  children,
  defaultWidth = SIDEBAR_WIDTH, //* new prop for default width
  ...rest
}: React.ComponentProps<"div"> & {
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  //* new prop for default width
  defaultWidth?: string;
}) {
  const isMobile = useIsMobile();
  //* new state for sidebar width
  const [width, setWidth] = React.useState(defaultWidth);
  const [openMobile, setOpenMobile] = React.useState(false);
  //* new state for tracking is dragging rail
  const [isDraggingRail, setIsDraggingRail] = React.useState(false);

  // This is the internal state of the sidebar.
  // We use openProp and setOpenProp for control from outside the component.
  const [_open, _setOpen] = React.useState(defaultOpen);
  const open = openProp ?? _open;
  const setOpen = React.useCallback(
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
  const toggleSidebar = React.useCallback(() => {
    return isMobile ? setOpenMobile((open) => !open) : setOpen((open) => !open);
  }, [
    isMobile,
    setOpen,
    // setOpenMobile
  ]);

  // Adds a keyboard shortcut to toggle the sidebar.
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.key === SIDEBAR_KEYBOARD_SHORTCUT &&
        (event.metaKey || event.ctrlKey)
      ) {
        event.preventDefault();
        toggleSidebar();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toggleSidebar]);

  // We add a state so that we can do data-state="expanded" or "collapsed".
  // This makes it easier to style the sidebar with Tailwind classes.
  const state = open ? "expanded" : "collapsed";

  const contextValue = React.useMemo<SidebarContextProps>(
    () => ({
      state,
      open,
      setOpen,
      isMobile,
      openMobile,
      setOpenMobile,
      toggleSidebar,
      //* new context for sidebar resizing
      width,
      setWidth,
      //* new context for tracking is dragging rail
      isDraggingRail,
      setIsDraggingRail,
    }),
    [
      state,
      open,
      setOpen,
      isMobile,
      openMobile,
      //* remove setOpenMobile from dependencies because setOpenMobile are state setters created by useState
      // setOpenMobile,
      toggleSidebar,
      //* add width to dependencies
      width,
      //* add isDraggingRail to dependencies
      isDraggingRail,
    ],
  );

  return (
    <SidebarContext.Provider value={contextValue}>
      <div
        data-slot="sidebar-wrapper"
        style={
          {
            // * update '--sidebar-width' to use the new width state
            "--sidebar-width": width,
            "--sidebar-width-icon": SIDEBAR_WIDTH_ICON,
            ...style,
          } as React.CSSProperties
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
}

function Sidebar({
  side = "left",
  variant = "sidebar",
  collapsible = "offcanvas",
  className,
  children,
  ...rest
}: React.ComponentProps<"div"> & {
  side?: "left" | "right";
  variant?: "sidebar" | "floating" | "inset";
  collapsible?: "offcanvas" | "icon" | "none";
}) {
  const {
    isMobile,
    state,
    openMobile,
    setOpenMobile,
    //* new property for tracking is dragging rail
    isDraggingRail,
  } = useSidebar();

  if (collapsible === "none") {
    return (
      <div
        data-slot="sidebar"
        className={cn(
          "flex h-full w-(--sidebar-width) flex-col bg-sidebar text-sidebar-foreground",
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
        onOpenChange={({ open }) => setOpenMobile(open)}
      >
        <SheetContent
          data-sidebar="sidebar"
          data-slot="sidebar"
          data-mobile="true"
          className="w-(--sidebar-width) bg-sidebar p-0 text-sidebar-foreground [&>button]:hidden"
          style={
            {
              "--sidebar-width": SIDEBAR_WIDTH_MOBILE,
            } as React.CSSProperties
          }
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
      className="group peer hidden text-sidebar-foreground md:block"
      data-state={state}
      data-collapsible={state === "collapsed" ? collapsible : ""}
      data-variant={variant}
      data-side={side}
      data-slot="sidebar"
      //* add data-dragging attribute
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
          "group-data-[dragging=true]_*:!duration-0 group-data-[dragging=true]:duration-0!",
        )}
      />
      <div
        data-slot="sidebar-container"
        className={cn(
          "fixed inset-y-0 z-50 hidden h-svh w-(--sidebar-width) transition-[left,right,width] duration-200 ease-linear md:flex",
          side === "left"
            ? "left-0 group-data-[collapsible=offcanvas]:left-[calc(var(--sidebar-width)*-1)]"
            : "right-0 group-data-[collapsible=offcanvas]:right-[calc(var(--sidebar-width)*-1)]",
          // Adjust the padding for floating and inset variants.
          variant === "floating" || variant === "inset"
            ? "p-2 group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4))+2px)]"
            : "group-data-[collapsible=icon]:w-(--sidebar-width-icon) group-data-[side=left]:border-r group-data-[side=right]:border-l",
          //* set duration to 0 for all elements when dragging
          "group-data-[dragging=true]_*:!duration-0 group-data-[dragging=true]:duration-0!",
          className,
        )}
        {...rest}
      >
        <div
          data-sidebar="sidebar"
          data-slot="sidebar-inner"
          className="flex h-full w-full flex-col bg-sidebar group-data-[variant=floating]:rounded-lg group-data-[variant=floating]:border group-data-[variant=floating]:border-sidebar-border group-data-[variant=floating]:shadow-sm"
        >
          {children}
        </div>
      </div>
    </div>
  );
}

function SidebarTrigger({
  className,
  onClick,
  ...rest
}: React.ComponentProps<typeof Button>) {
  const { toggleSidebar } = useSidebar();

  return (
    <Button
      data-sidebar="trigger"
      data-slot="sidebar-trigger"
      variant="ghost"
      size="icon"
      className={cn("sticky top-2 ml-2 size-8", className)}
      onClick={(event) => {
        onClick?.(event);
        toggleSidebar();
      }}
      {...rest}
    >
      <PanelLeftIcon />
      <span className="sr-only">Toggle Sidebar</span>
    </Button>
  );
}

interface SidebarRailProps extends React.ComponentProps<"button"> {
  enableDrag?: boolean;
}

function SidebarRail({
  enableDrag = true,
  className,
  ...rest
}: SidebarRailProps) {
  const {
    toggleSidebar,
    setWidth,
    state,
    width,
    setIsDraggingRail,
    isDraggingRail,
  } = useSidebar();

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

  return (
    <button
      ref={dragRef}
      data-sidebar="rail"
      data-slot="sidebar-rail"
      aria-label="Toggle Sidebar"
      tabIndex={-1}
      onMouseDown={handleMouseDown}
      className={cn(
        "-translate-x-1/2 group-data-[side=left]:-right-4 absolute inset-y-0 z-20 hidden w-4 transition-all ease-linear after:absolute after:inset-y-0 after:left-1/2 after:w-[2px] group-data-[side=right]:left-0 sm:flex",
        "in-data-[side=left]:cursor-w-resize in-data-[side=right]:cursor-e-resize",
        "[[data-side=left][data-state=collapsed]_&]:cursor-e-resize [[data-side=right][data-state=collapsed]_&]:cursor-w-resize",
        "group-data-[collapsible=offcanvas]:translate-x-0 hover:group-data-[collapsible=offcanvas]:bg-sidebar group-data-[collapsible=offcanvas]:after:left-full",
        "[[data-side=left][data-collapsible=offcanvas]_&]:-right-2",
        "[[data-side=right][data-collapsible=offcanvas]_&]:-left-2",
        isDraggingRail ? "cursor-ew-resize" : "",

        className,
      )}
      {...rest}
    />
  );
}

function SidebarInset({ className, ...rest }: React.ComponentProps<"main">) {
  return (
    <main
      data-slot="sidebar-inset"
      className={cn(
        "relative flex w-full flex-1 flex-col bg-background",
        "md:peer-data-[variant=inset]:m-2 md:peer-data-[variant=inset]:ml-0 md:peer-data-[variant=inset]:rounded-xl md:peer-data-[variant=inset]:shadow-sm",
        className,
      )}
      {...rest}
    />
  );
}

function SidebarInput({
  className,
  ...rest
}: React.ComponentProps<typeof Input>) {
  return (
    <Input
      data-slot="sidebar-input"
      data-sidebar="input"
      className={cn("h-8 w-full bg-background shadow-none", className)}
      {...rest}
    />
  );
}

function SidebarHeader({ className, ...rest }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-header"
      data-sidebar="header"
      className={cn("flex flex-col gap-2 p-2", className)}
      {...rest}
    />
  );
}

function SidebarFooter({ className, ...rest }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-footer"
      data-sidebar="footer"
      className={cn("flex flex-col gap-2 p-2", className)}
      {...rest}
    />
  );
}

function SidebarContent({ className, ...rest }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-content"
      data-sidebar="content"
      className={cn(
        "flex min-h-0 flex-1 flex-col gap-0 overflow-auto group-data-[collapsible=icon]:overflow-hidden",
        className,
      )}
      {...rest}
    />
  );
}

function SidebarGroup({ className, ...rest }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-group"
      data-sidebar="group"
      className={cn(
        "relative flex w-full min-w-0 flex-col px-2 pt-2",
        className,
      )}
      {...rest}
    />
  );
}

function SidebarGroupLabel({
  className,
  ...rest
}: React.ComponentProps<typeof ark.div>) {
  return (
    <ark.div
      data-slot="sidebar-group-label"
      data-sidebar="group-label"
      className={cn(
        "flex h-8 shrink-0 items-center rounded-md font-medium text-sidebar-foreground/70 text-xs outline-hidden ring-sidebar-ring transition-[margin,opacity] duration-200 ease-linear focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0",
        "group-data-[collapsible=icon]:hidden group-data-[collapsible=icon]:opacity-0",
        className,
      )}
      {...rest}
    />
  );
}

function SidebarGroupAction({
  className,
  ...rest
}: React.ComponentProps<typeof ark.button>) {
  return (
    <ark.button
      data-slot="sidebar-group-action"
      data-sidebar="group-action"
      className={cn(
        "flex aspect-square w-5 cursor-pointer items-center justify-center rounded-md p-0 text-sidebar-foreground outline-hidden ring-sidebar-ring transition-transform hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0",
        // Increases the hit area of the button on mobile.
        "after:-inset-2 after:absolute md:after:hidden",
        "group-data-[collapsible=icon]:hidden group-data-[collapsible=icon]:opacity-0",
        className,
      )}
      {...rest}
    />
  );
}

function SidebarGroupContent({
  className,
  ...rest
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-group-content"
      data-sidebar="group-content"
      className={cn("w-full text-sm", className)}
      {...rest}
    />
  );
}

function SidebarMenu({ className, ...rest }: React.ComponentProps<"ul">) {
  return (
    <ul
      data-slot="sidebar-menu"
      data-sidebar="menu"
      className={cn("flex w-full min-w-0 flex-col gap-1", className)}
      {...rest}
    />
  );
}

function SidebarMenuItem({ className, ...rest }: React.ComponentProps<"li">) {
  return (
    <li
      data-slot="sidebar-menu-item"
      data-sidebar="menu-item"
      className={cn(
        "group/menu-item relative cursor-pointer list-none",
        className,
      )}
      {...rest}
    />
  );
}

const sidebarMenuButtonVariants = cva(
  "peer/menu-button flex w-full items-center gap-2 cursor-pointer overflow-hidden rounded-md p-2 text-left text-sm outline-hidden ring-sidebar-ring transition-[width,height,padding] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 group-has-data-[sidebar=menu-action]/menu-item:pr-8 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-2! [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
        outline:
          "bg-background shadow-[0_0_0_1px_hsl(var(--sidebar-border))] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:shadow-[0_0_0_1px_hsl(var(--sidebar-accent))]",
      },
      size: {
        default: "h-8 text-sm",
        sm: "h-7 text-xs",
        lg: "h-12 text-sm group-data-[collapsible=icon]:p-0!",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function SidebarMenuButton({
  isActive = false,
  variant = "default",
  size = "default",
  tooltip,
  className,
  ...rest
}: React.ComponentProps<typeof ark.button> & {
  isActive?: boolean;
  tooltip?: string | React.ComponentProps<typeof TooltipContent>;
} & VariantProps<typeof sidebarMenuButtonVariants>) {
  const { isMobile, state } = useSidebar();

  const button = (
    <ark.button
      data-slot="sidebar-menu-button"
      data-sidebar="menu-button"
      data-size={size}
      data-active={isActive}
      className={cn(sidebarMenuButtonVariants({ variant, size }), className)}
      {...rest}
    />
  );

  if (!tooltip) {
    return button;
  }

  if (typeof tooltip === "string") {
    tooltip = {
      children: tooltip,
    };
  }

  return (
    <TooltipRoot
      positioning={{ placement: "right" }}
      closeDelay={0}
      openDelay={0}
      disabled={isMobile || state === "expanded"}
    >
      <TooltipTrigger asChild>{button}</TooltipTrigger>
      <Portal>
        <TooltipPositioner>
          <TooltipContent {...tooltip} />
        </TooltipPositioner>
      </Portal>
    </TooltipRoot>
  );
}

function SidebarMenuAction({
  className,
  showOnHover = false,
  ...rest
}: React.ComponentProps<typeof ark.button> & {
  showOnHover?: boolean;
}) {
  return (
    <ark.button
      data-slot="sidebar-menu-action"
      data-sidebar="menu-action"
      className={cn(
        "absolute top-1.5 right-1 flex aspect-square w-5 cursor-pointer items-center justify-center rounded-md p-0 text-sidebar-foreground outline-hidden ring-sidebar-ring transition-transform hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 peer-hover/menu-button:text-sidebar-accent-foreground [&>svg]:size-4 [&>svg]:shrink-0",
        // Increases the hit area of the button on mobile.
        "after:-inset-2 after:absolute md:after:hidden",
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
}

function SidebarMenuBadge({ className, ...rest }: React.ComponentProps<"div">) {
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
}

// NB: Could extend on this with the hotkey hook for further advanced functionality
function SidebarMenuShotcut({
  className,
  ...rest
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="sidebar-menu-shortcut"
      data-sidebar="menu-shortcut"
      className={cn(
        "ml-auto flex items-center gap-0.5 text-muted-foreground text-xs tracking-widest",
        // "group-data-[collapsible=icon]:hidden",
        className,
      )}
      {...rest}
    />
  );
}

function SidebarMenuSub({ className, ...rest }: React.ComponentProps<"ul">) {
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
}

function SidebarMenuSubItem({
  className,
  ...rest
}: React.ComponentProps<"li">) {
  return (
    <li
      data-slot="sidebar-menu-sub-item"
      data-sidebar="menu-sub-item"
      className={cn("group/menu-sub-item relative", className)}
      {...rest}
    />
  );
}

function SidebarMenuSubButton({
  size = "md",
  isActive = false,
  className,
  ...rest
}: React.ComponentProps<typeof ark.a> & {
  size?: "sm" | "md";
  isActive?: boolean;
}) {
  return (
    <ark.a
      data-slot="sidebar-menu-sub-button"
      data-sidebar="menu-sub-button"
      data-size={size}
      data-active={isActive}
      className={cn(
        "-translate-x-px flex h-7 min-w-0 items-center gap-2 overflow-hidden rounded-md px-2 text-sidebar-foreground outline-hidden ring-sidebar-ring hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0 [&>svg]:text-sidebar-accent-foreground",
        "data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground",
        size === "sm" && "text-xs",
        size === "md" && "text-sm",
        "group-data-[collapsible=icon]:hidden",
        className,
      )}
      {...rest}
    />
  );
}

export {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  /** @knipignore */
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  /** @knipignore */
  SidebarInput,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  /** @knipignore */
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  /** @knipignore */
  type SidebarMenuSub,
  /** @knipignore */
  type SidebarMenuSubButton,
  /** @knipignore */
  type SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  /** @knipignore */
  SidebarTrigger,
  useSidebar,
  SidebarMenuShotcut,
};
