import { Portal } from "@ark-ui/react/portal";
import { Tooltip as ArkTooltip } from "@ark-ui/react/tooltip";
import { tv } from "tailwind-variants";

import { cn } from "@/lib/utils";

import type { ComponentProps } from "react";

const tooltipVariants = tv({
  slots: {
    trigger: "",
    positioner: "absolute top-0",
    content:
      "fade-in-0 zoom-in-95 data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-fit origin-(--radix-tooltip-content-transform-origin) animate-in text-balance rounded-md bg-base-500 px-3 py-1.5 text-base-100 text-xs data-[state=closed]:animate-out",
    arrowTip: "border-t-[1px] border-l-[1px]",
  },
});

const { trigger, positioner, content, arrowTip } = tooltipVariants();

const TooltipProvider = ArkTooltip.RootProvider;
const TooltipRoot = ArkTooltip.Root;
const TooltipArrow = ArkTooltip.Arrow;

const TooltipTrigger = ({
  className,
  ...rest
}: ComponentProps<typeof ArkTooltip.Trigger>) => (
  <ArkTooltip.Trigger
    data-slot="tooltip-trigger"
    className={cn(trigger(), className)}
    {...rest}
  />
);

const TooltipPositioner = ({
  className,
  ...rest
}: ComponentProps<typeof ArkTooltip.Positioner>) => (
  <ArkTooltip.Positioner className={cn(positioner(), className)} {...rest} />
);

const TooltipContent = ({
  className,
  ...rest
}: ComponentProps<typeof ArkTooltip.Content>) => (
  <ArkTooltip.Content
    data-slot="tooltip-content"
    className={cn(content(), className)}
    {...rest}
  />
);

const TooltipArrowTip = ({
  className,
  ...rest
}: ComponentProps<typeof ArkTooltip.ArrowTip>) => (
  <ArkTooltip.ArrowTip className={cn(arrowTip(), className)} {...rest} />
);

interface Props extends ComponentProps<typeof TooltipRoot> {
  children?: React.ReactNode;
  tooltip?: string | ComponentProps<typeof TooltipContent>;
}

const Tooltip = ({ tooltip, children, ...rest }: Props) => {
  const tooltipProps =
    typeof tooltip === "string" ? { children: tooltip } : tooltip;

  return (
    <TooltipRoot
      positioning={{ placement: "top" }}
      closeDelay={0}
      openDelay={100}
      {...rest}
    >
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <Portal>
        <TooltipPositioner>
          <TooltipContent {...tooltipProps} />
        </TooltipPositioner>
      </Portal>
    </TooltipRoot>
  );
};

export {
  /** @knipignore */
  TooltipArrow,
  /** @knipignore */
  TooltipArrowTip,
  TooltipContent,
  TooltipPositioner,
  /** @knipignore */
  TooltipProvider,
  TooltipRoot,
  TooltipTrigger,
  Tooltip,
};
