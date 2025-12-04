import { Tooltip as ArkTooltip } from "@ark-ui/react/tooltip";

import { cn } from "@/lib/utils";

import type { ComponentProps } from "react";

const TooltipProvider = ArkTooltip.RootProvider;
const TooltipRoot = ArkTooltip.Root;
const TooltipArrow = ArkTooltip.Arrow;

const TooltipTrigger = ({
  className,
  ...rest
}: ComponentProps<typeof ArkTooltip.Trigger>) => (
  <ArkTooltip.Trigger
    data-slot="tooltip-trigger"
    className={className}
    {...rest}
  />
);

const TooltipPositioner = ({
  className,
  ...rest
}: ComponentProps<typeof ArkTooltip.Positioner>) => (
  <ArkTooltip.Positioner className={className} {...rest} />
);

const TooltipContent = ({
  className,
  ...rest
}: ComponentProps<typeof ArkTooltip.Content>) => (
  <ArkTooltip.Content
    data-slot="tooltip-content"
    className={cn(
      "fade-in-0 zoom-in-95 data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 flex h-10 animate-in items-center overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-popover-foreground text-sm shadow-md data-[state=closed]:animate-out",
      className,
    )}
    {...rest}
  />
);

const TooltipArrowTip = ({
  className,
  ...rest
}: ComponentProps<typeof ArkTooltip.ArrowTip>) => (
  <ArkTooltip.ArrowTip
    className={cn("border-t border-l", className)}
    {...rest}
  />
);

export {
  TooltipArrow,
  TooltipArrowTip,
  TooltipContent,
  TooltipPositioner,
  TooltipProvider,
  TooltipRoot,
  TooltipTrigger,
};
