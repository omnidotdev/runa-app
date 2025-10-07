import { Portal } from "@ark-ui/react/portal";

import { SidebarMenuShortcut } from "@/components/ui/sidebar";
import {
  TooltipContent,
  TooltipPositioner,
  TooltipRoot,
} from "@/components/ui/tooltip";

import type { ComponentProps, ReactNode, RefObject } from "react";

interface Props extends ComponentProps<typeof TooltipRoot> {
  children?: ReactNode;
  tooltip?: string;
  shortcut?: string;
  triggerRef: RefObject<HTMLButtonElement | null>;
}

const PopoverWithTooltip = ({
  tooltip,
  children,
  shortcut,
  triggerRef,
  ...rest
}: Props) => {
  return (
    <TooltipRoot
      positioning={{
        strategy: "fixed",
        placement: "top",
        getAnchorRect: () =>
          triggerRef.current?.getBoundingClientRect() ?? null,
      }}
      closeDelay={0}
      openDelay={100}
      {...rest}
    >
      {children}

      <Portal>
        <TooltipPositioner>
          <TooltipContent className="border bg-background text-foreground">
            <div className="flex items-center gap-2">
              {tooltip}
              {shortcut && (
                <div className="ml-2 flex items-center gap-0.5">
                  <SidebarMenuShortcut className="w-fit px-1">
                    {shortcut}
                  </SidebarMenuShortcut>
                </div>
              )}
            </div>
          </TooltipContent>
        </TooltipPositioner>
      </Portal>
    </TooltipRoot>
  );
};

export default PopoverWithTooltip;
