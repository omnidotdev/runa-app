import { Dialog as ArkSheet } from "@ark-ui/react/dialog";
import { X } from "lucide-react";

import { cn } from "@/lib/utils";

import type { ComponentProps } from "react";

const SheetProvider = ArkSheet.RootProvider;
const SheetContext = ArkSheet.Context;
const SheetRoot = ArkSheet.Root;

const SheetTrigger = ({
  className,
  ...rest
}: ComponentProps<typeof ArkSheet.Trigger>) => (
  <ArkSheet.Trigger className={className} {...rest} />
);

const SheetBackdrop = ({
  className,
  ...rest
}: ComponentProps<typeof ArkSheet.Backdrop>) => (
  <ArkSheet.Backdrop className={className} {...rest} />
);

const SheetPositioner = ({
  className,
  ...rest
}: ComponentProps<typeof ArkSheet.Positioner>) => (
  <ArkSheet.Positioner className={className} {...rest} />
);

interface ArkSheetContentProps extends ComponentProps<typeof ArkSheet.Content> {
  side?: "top" | "right" | "bottom" | "left";
}

const SheetContent = ({
  className,
  side = "left",
  ...rest
}: ArkSheetContentProps) => (
  <ArkSheet.Content
    className={cn(
      "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed z-50 bg-background data-[state=closed]:animate-out data-[state=open]:animate-in",
      side === "right" &&
        "data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right inset-y-0 right-0 h-full w-3/4 border-l sm:max-w-sm",
      side === "left" &&
        "data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left inset-y-0 left-0 h-full w-3/4 border-r sm:max-w-sm",
      side === "top" &&
        "data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top inset-x-0 top-0 h-auto border-b",
      side === "bottom" &&
        "data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom inset-x-0 bottom-0 h-auto border-t",
      className,
    )}
    {...rest}
  />
);

const SheetTitle = ({
  className,
  ...rest
}: ComponentProps<typeof ArkSheet.Title>) => (
  <ArkSheet.Title
    className={cn(
      "font-semibold text-lg leading-none tracking-tight",
      className,
    )}
    {...rest}
  />
);

const SheetDescription = ({
  className,
  ...rest
}: ComponentProps<typeof ArkSheet.Description>) => (
  <ArkSheet.Description
    className={cn("text-muted-foreground text-sm", className)}
    {...rest}
  />
);

const SheetCloseTrigger = ({
  className,
  children,
  asChild,
  ...rest
}: ComponentProps<typeof ArkSheet.CloseTrigger>) => {
  // If there are no children, render the default X icon
  if (!children) {
    return (
      <ArkSheet.CloseTrigger
        className={cn(
          "absolute top-4 right-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none",
          className,
        )}
        {...rest}
      >
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </ArkSheet.CloseTrigger>
    );
  }

  // If children are provided, use them inside the CloseTrigger
  // This is useful for creating buttons that close the ArkSheet
  return (
    <ArkSheet.CloseTrigger className={className} asChild={asChild} {...rest}>
      {children}
    </ArkSheet.CloseTrigger>
  );
};

export {
  SheetRoot,
  SheetTrigger,
  SheetBackdrop,
  SheetPositioner,
  SheetContent,
  SheetTitle,
  SheetDescription,
  SheetCloseTrigger,
  SheetProvider,
  SheetContext,
};
