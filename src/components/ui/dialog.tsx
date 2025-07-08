import { Dialog as ArkDialog } from "@ark-ui/react/dialog";
import { FiX } from "react-icons/fi";
import { tv } from "tailwind-variants";

import { cn } from "@/lib/utils";

import type { ComponentProps } from "react";

const dialogVariants = tv({
  slots: {
    trigger: "",
    backdrop:
      "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-background/80 backdrop-blur-sm data-[state=closed]:animate-out data-[state=open]:animate-in",
    positioner: "fixed inset-0 z-50 flex items-center justify-center",
    content:
      "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-top-[2%] data-[state=open]:slide-in-from-top-[2%] relative grid w-full gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=closed]:animate-out data-[state=open]:animate-in sm:rounded-lg",
    title: "font-semibold text-lg leading-none tracking-tight",
    description: "text-muted-foreground text-sm",
    closeTrigger:
      "cursor-pointer absolute top-4 right-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none",
  },
});

const {
  trigger,
  backdrop,
  positioner,
  content,
  title,
  description,
  closeTrigger,
} = dialogVariants();

const DialogProvider = ArkDialog.RootProvider;
const DialogContext = ArkDialog.Context;
const DialogRoot = ArkDialog.Root;

const DialogTrigger = ({
  className,
  ...rest
}: ComponentProps<typeof ArkDialog.Trigger>) => (
  <ArkDialog.Trigger className={cn(trigger(), className)} {...rest} />
);

const DialogBackdrop = ({
  className,
  ...rest
}: ComponentProps<typeof ArkDialog.Backdrop>) => (
  <ArkDialog.Backdrop className={cn(backdrop(), className)} {...rest} />
);

const DialogPositioner = ({
  className,
  ...rest
}: ComponentProps<typeof ArkDialog.Positioner>) => (
  <ArkDialog.Positioner className={cn(positioner(), className)} {...rest} />
);

const DialogContent = ({
  className,
  ...rest
}: ComponentProps<typeof ArkDialog.Content>) => (
  <ArkDialog.Content className={cn(content(), className)} {...rest} />
);

const DialogTitle = ({
  className,
  ...rest
}: ComponentProps<typeof ArkDialog.Title>) => (
  <ArkDialog.Title className={cn(title(), className)} {...rest} />
);

const DialogDescription = ({
  className,
  ...rest
}: ComponentProps<typeof ArkDialog.Description>) => (
  <ArkDialog.Description className={cn(description(), className)} {...rest} />
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
        className={cn(closeTrigger(), className)}
        {...rest}
      >
        <FiX className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </ArkDialog.CloseTrigger>
    );
  }

  // If children are provided, use them inside the CloseTrigger
  // This is useful for creating buttons that close the dialog
  return (
    <ArkDialog.CloseTrigger
      className={cn(className)}
      asChild={asChild}
      {...rest}
    >
      {children}
    </ArkDialog.CloseTrigger>
  );
};

export {
  DialogRoot,
  /** @knipignore */
  DialogTrigger,
  DialogBackdrop,
  DialogPositioner,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogCloseTrigger,
  /** @knipignore */
  DialogProvider,
  /** @knipignore */
  DialogContext,
};
