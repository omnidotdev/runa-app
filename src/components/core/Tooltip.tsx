import { Shortcut } from "@/components/ui/shortcut";
import {
  TooltipContent,
  TooltipPositioner,
  TooltipRoot,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

import type { ComponentProps, ReactNode } from "react";

interface Props extends ComponentProps<typeof TooltipRoot> {
  tooltip: string;
  trigger: ReactNode;
  shortcut?: string;
  className?: string;
}

const Tooltip = ({ trigger, tooltip, shortcut, className, ...rest }: Props) => {
  return (
    <TooltipRoot closeDelay={0} openDelay={100} {...rest}>
      <TooltipTrigger asChild>{trigger}</TooltipTrigger>
      <TooltipPositioner>
        <TooltipContent
          className={cn("flex items-center gap-2 rounded-lg", className)}
        >
          {tooltip}
          {shortcut && <Shortcut>{shortcut}</Shortcut>}
        </TooltipContent>
      </TooltipPositioner>
    </TooltipRoot>
  );
};

export default Tooltip;
