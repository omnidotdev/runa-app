import { Popover as ArkPopover } from "@ark-ui/react/popover";
import { X } from "lucide-react";

import { cn } from "@/lib/utils";

import type { ComponentProps } from "react";

const PopoverProvider = ArkPopover.RootProvider;
const PopoverContext = ArkPopover.Context;
const PopoverRoot = ArkPopover.Root;
const PopoverArrow = ArkPopover.Arrow;

const PopoverTrigger = ({
  className,
  ...rest
}: ComponentProps<typeof ArkPopover.Trigger>) => (
  <ArkPopover.Trigger className={cn(className)} {...rest} />
);

const PopoverContent = ({
  className,
  ...rest
}: ComponentProps<typeof ArkPopover.Content>) => (
  <ArkPopover.Content
    className={cn(
      "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none data-[state=closed]:animate-out data-[state=open]:animate-in",
      className,
    )}
    {...rest}
  />
);

const PopoverPositioner = ({
  className,
  ...rest
}: ComponentProps<typeof ArkPopover.Positioner>) => (
  <ArkPopover.Positioner className={className} {...rest} />
);

const PopoverArrowTip = ({
  className,
  ...rest
}: ComponentProps<typeof ArkPopover.ArrowTip>) => (
  <ArkPopover.ArrowTip
    className={cn("border-t border-l", className)}
    {...rest}
  />
);

const PopoverCloseTrigger = ({
  className,
  children,
  asChild,
  ...rest
}: ComponentProps<typeof ArkPopover.CloseTrigger>) => {
  // If there are no children, render the default X icon
  if (!children) {
    return (
      <ArkPopover.CloseTrigger
        className={cn(
          "opacity] absolute top-4 right-4 rounded-sm opacity-70 ring-offset-background transition-[color,box-shadow, hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none",
          className,
        )}
        {...rest}
      >
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </ArkPopover.CloseTrigger>
    );
  }

  // If children are provided, use them inside the CloseTrigger
  // This is useful for creating buttons that close the dialog
  return (
    <ArkPopover.CloseTrigger className={className} asChild={asChild} {...rest}>
      {children}
    </ArkPopover.CloseTrigger>
  );
};

const PopoverTitle = ({
  className,
  ...rest
}: ComponentProps<typeof ArkPopover.Title>) => (
  <ArkPopover.Title
    className={cn("font-semibold text-lg", className)}
    {...rest}
  />
);

const PopoverDescription = ({
  className,
  ...rest
}: ComponentProps<typeof ArkPopover.Description>) => (
  <ArkPopover.Description
    className={cn("text-muted-foreground text-sm", className)}
    {...rest}
  />
);

export {
  PopoverRoot,
  PopoverTrigger,
  PopoverContent,
  PopoverPositioner,
  PopoverArrow,
  PopoverArrowTip,
  PopoverCloseTrigger,
  PopoverProvider,
  PopoverContext,
  PopoverTitle,
  PopoverDescription,
};
