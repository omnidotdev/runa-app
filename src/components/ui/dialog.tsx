import { Dialog as ArkDialog } from "@ark-ui/react/dialog";
import { X } from "lucide-react";

import { cn } from "@/lib/utils";

import type { ComponentProps } from "react";

const DialogProvider = ArkDialog.RootProvider;
const DialogContext = ArkDialog.Context;
const DialogRoot = ArkDialog.Root;

const DialogTrigger = ({
  className,
  ...rest
}: ComponentProps<typeof ArkDialog.Trigger>) => (
  <ArkDialog.Trigger className={cn("", className)} {...rest} />
);

const DialogBackdrop = ({
  className,
  ...rest
}: ComponentProps<typeof ArkDialog.Backdrop>) => (
  <ArkDialog.Backdrop
    className={cn(
      "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-background/80 backdrop-blur-sm data-[state=closed]:animate-out data-[state=open]:animate-in",
      className,
    )}
    {...rest}
  />
);

const DialogPositioner = ({
  className,
  ...rest
}: ComponentProps<typeof ArkDialog.Positioner>) => (
  <ArkDialog.Positioner
    className={cn(
      "fixed inset-0 z-50 flex items-center justify-center",
      className,
    )}
    {...rest}
  />
);

const DialogContent = ({
  className,
  ...rest
}: ComponentProps<typeof ArkDialog.Content>) => (
  <ArkDialog.Content
    className={cn(
      "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-top-[2%] data-[state=open]:slide-in-from-top-[2%] relative grid w-full max-w-lg gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=closed]:animate-out data-[state=open]:animate-in sm:rounded-lg",
      className,
    )}
    {...rest}
  />
);

const DialogTitle = ({
  className,
  ...rest
}: ComponentProps<typeof ArkDialog.Title>) => (
  <ArkDialog.Title
    className={cn(
      "font-semibold text-lg leading-none tracking-tight",
      className,
    )}
    {...rest}
  />
);

const DialogDescription = ({
  className,
  ...rest
}: ComponentProps<typeof ArkDialog.Description>) => (
  <ArkDialog.Description
    className={cn("text-muted-foreground text-sm", className)}
    {...rest}
  />
);

const DialogCloseTrigger = ({
  className,
  children,
  asChild,
  ...rest
}: ComponentProps<typeof ArkDialog.CloseTrigger>) => {
  // If there are no children, render the default X icon
  if (!children) {
    return (
      <ArkDialog.CloseTrigger
        className={cn(
          "absolute top-4 right-4 cursor-pointer rounded opacity-70 outline-none ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:pointer-events-none",
          className,
        )}
        {...rest}
      >
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </ArkDialog.CloseTrigger>
    );
  }

  // If children are provided, use them inside the CloseTrigger
  // This is useful for creating buttons that close the dialog
  return (
    <ArkDialog.CloseTrigger className={className} asChild={asChild} {...rest}>
      {children}
    </ArkDialog.CloseTrigger>
  );
};

export {
  DialogRoot,
  DialogTrigger,
  DialogBackdrop,
  DialogPositioner,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogCloseTrigger,
  DialogProvider,
  DialogContext,
};
