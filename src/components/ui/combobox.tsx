import { Combobox as ArkCombobox } from "@ark-ui/react/combobox";
import { Check, ChevronsUpDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import type {
  Combobox as ComboboxProps,
  ComboboxRootProps,
} from "@ark-ui/react/combobox";
import type { ComponentProps } from "react";

const ComboboxProvider = ArkCombobox.RootProvider;
const ComboboxContext = ArkCombobox.Context;

const ComboboxRoot = <T,>({ className, ...rest }: ComboboxRootProps<T>) => (
  <ArkCombobox.Root
    className={cn("flex w-full flex-col gap-1.5", className)}
    {...rest}
  />
);

const ComboboxLabel = ({
  className,
  ...rest
}: ComponentProps<typeof ArkCombobox.Label>) => (
  <ArkCombobox.Label
    className={cn("block font-medium text-sm", className)}
    {...rest}
  />
);

const ComboboxControl = ({
  className,
  ...rest
}: ComponentProps<typeof ArkCombobox.Control>) => (
  <ArkCombobox.Control
    className={cn("relative flex items-center justify-between", className)}
    {...rest}
  />
);

const ComboboxInput = ({
  className,
  ...rest
}: ComponentProps<typeof ArkCombobox.Input>) => (
  <ArkCombobox.Input
    className={cn(
      "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:font-medium file:text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
      className,
    )}
    {...rest}
  />
);

const ComboboxTrigger = ({
  className,
  ...rest
}: ComponentProps<typeof ArkCombobox.Trigger>) => (
  <ArkCombobox.Trigger asChild {...rest}>
    <Button
      variant="ghost"
      size="icon"
      className={cn(
        "absolute top-0.5 right-0.5 opacity-50 hover:bg-background",
        className,
      )}
    >
      <ChevronsUpDown className="size-4" />
    </Button>
  </ArkCombobox.Trigger>
);

const ComboboxClearTrigger = ({
  className,
  ...rest
}: ComponentProps<typeof ArkCombobox.ClearTrigger>) => (
  <ArkCombobox.ClearTrigger
    className={cn(
      "absolute top-0 right-10 flex h-full items-center justify-center pr-2 text-muted-foreground hover:text-foreground disabled:pointer-events-none",
      className,
    )}
    {...rest}
  />
);

const ComboboxPositioner = ({
  className,
  ...rest
}: ComponentProps<typeof ArkCombobox.Positioner>) => (
  <ArkCombobox.Positioner
    className={cn("z-50 w-full min-w-32", className)}
    {...rest}
  />
);

const ComboboxContent = ({
  className,
  ...rest
}: ComponentProps<typeof ArkCombobox.Content>) => (
  <ArkCombobox.Content
    className={cn(
      "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 z-50 max-h-[300px] overflow-y-auto rounded-md border bg-popover p-1 shadow-md data-[state=closed]:animate-out data-[state=open]:animate-in",
      className,
    )}
    {...rest}
  />
);

const ComboboxItem = ({
  className,
  children,
  ...rest
}: ComponentProps<typeof ArkCombobox.Item>) => (
  <ArkCombobox.Item
    className={cn(
      "flex w-full cursor-default select-none items-center justify-between rounded-sm px-2 py-1.5 pr-2 text-sm outline-none data-disabled:pointer-events-none data-[state=checked]:bg-accent data-highlighted:bg-accent data-[state=checked]:text-accent-foreground data-highlighted:text-accent-foreground data-disabled:opacity-50",
      className,
    )}
    {...rest}
  >
    {children}
  </ArkCombobox.Item>
);

const ComboboxItemGroup = ({
  className,
  ...rest
}: ComponentProps<typeof ArkCombobox.ItemGroup>) => (
  <ArkCombobox.ItemGroup className={cn("p-1", className)} {...rest} />
);

const ComboboxItemGroupLabel = ({
  className,
  ...rest
}: ComponentProps<typeof ArkCombobox.ItemGroupLabel>) => (
  <ArkCombobox.ItemGroupLabel
    className={cn(
      "px-2 py-1.5 font-medium text-muted-foreground text-xs",
      className,
    )}
    {...rest}
  />
);

const ComboboxItemIndicator = ({
  className,
  ...rest
}: ComponentProps<typeof ArkCombobox.ItemIndicator>) => (
  <ArkCombobox.ItemIndicator
    className={cn(
      "ml-auto flex h-3.5 w-3.5 items-center justify-center",
      className,
    )}
    {...rest}
  >
    <Check className="size-4" />
  </ArkCombobox.ItemIndicator>
);

const ComboboxItemText = ({
  className,
  ...rest
}: ComponentProps<typeof ArkCombobox.ItemText>) => (
  <ArkCombobox.ItemText className={className} {...rest} />
);

export {
  ComboboxRoot,
  ComboboxLabel,
  ComboboxControl,
  ComboboxInput,
  ComboboxTrigger,
  ComboboxClearTrigger,
  ComboboxPositioner,
  ComboboxContent,
  ComboboxItem,
  ComboboxItemGroup,
  ComboboxItemGroupLabel,
  ComboboxProvider,
  ComboboxContext,
  ComboboxItemIndicator,
  ComboboxItemText,
  type ComboboxProps,
};
