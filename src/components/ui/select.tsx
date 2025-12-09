import { Select as ArkSelect } from "@ark-ui/react/select";
import { Check } from "lucide-react";

import { cn } from "@/lib/utils";

import type { SelectRootProps } from "@ark-ui/react/select";
import type { ComponentProps, HTMLAttributes } from "react";

const SelectRoot = ArkSelect.Root;
const SelectRootProvider = ArkSelect.RootProvider;
const SelectContext = ArkSelect.Context;
const SelectHiddenSelect = ArkSelect.HiddenSelect;

const Select = <T,>({ className, ...rest }: SelectRootProps<T>) => (
  <ArkSelect.Root className={className} {...rest} />
);

const SelectLabel = ({
  className,
  ...rest
}: ComponentProps<typeof ArkSelect.Label>) => (
  <ArkSelect.Label
    className={cn(
      "font-medium text-muted-foreground text-xs leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
      className,
    )}
    {...rest}
  />
);

const SelectControl = ({
  className,
  ...rest
}: ComponentProps<typeof ArkSelect.Control>) => (
  <ArkSelect.Control className={className} {...rest} />
);

// TODO: edit in thornberry to get rid of React.Children.only error when using `asChild` prop
const SelectTrigger = ({
  className,
  ...rest
}: ComponentProps<typeof ArkSelect.Trigger>) => (
  <ArkSelect.Trigger
    className={cn(
      "flex w-fit cursor-pointer items-center justify-between gap-2 whitespace-nowrap rounded-md px-3 py-2 text-foreground text-sm shadow-xs outline-none transition-transform disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 data-[size=default]:h-9 data-[size=sm]:h-8 data-[size=xs]:h-7 dark:aria-invalid:ring-destructive/40 dark:hover:bg-base-800 [&[data-state=open]>svg]:rotate-180 [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0",
      className,
    )}
    {...rest}
  />
);

const SelectValueText = ({
  className,
  ...rest
}: ComponentProps<typeof ArkSelect.ValueText>) => (
  <ArkSelect.ValueText
    className={cn("line-clamp-1 flex items-center gap-2", className)}
    {...rest}
  />
);

const SelectIndicator = ({
  className,
  children,
  ...rest
}: ComponentProps<typeof ArkSelect.Indicator>) => (
  <ArkSelect.Indicator
    className={cn("size-4 transition-transform", className)}
    {...rest}
  >
    {children}
  </ArkSelect.Indicator>
);

const SelectClearTrigger = ({
  className,
  ...rest
}: ComponentProps<typeof ArkSelect.ClearTrigger>) => (
  <ArkSelect.ClearTrigger
    className={cn(
      "w-full outline-none focus-visible:bg-accent focus-visible:outline-none",
      className,
    )}
    {...rest}
  />
);

const SelectPositioner = ({
  className,
  ...rest
}: ComponentProps<typeof ArkSelect.Positioner>) => (
  <ArkSelect.Positioner className={className} {...rest} />
);

const SelectContent = ({
  className,
  children,
  ...rest
}: ComponentProps<typeof ArkSelect.Content>) => (
  <ArkSelect.Content
    className={cn(
      "no-scrollbar data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 relative z-50 max-h-(--available-height) w-fit min-w-32 origin-(--transform-origin) overflow-auto overflow-y-auto overflow-x-hidden rounded-md border bg-popover p-2 text-popover-foreground shadow-md outline-none duration-300 data-[state=closed]:animate-out data-[state=open]:animate-in",
      className,
    )}
    {...rest}
  >
    {children}
  </ArkSelect.Content>
);

const SelectItemGroup = ({
  className,
  ...rest
}: ComponentProps<typeof ArkSelect.ItemGroup>) => (
  <ArkSelect.ItemGroup className={className} {...rest} />
);

const SelectItemGroupLabel = ({
  className,
  ...rest
}: ComponentProps<typeof ArkSelect.ItemGroupLabel>) => (
  <ArkSelect.ItemGroupLabel
    className={cn(
      "px-2 py-1.5 font-semibold text-muted-foreground text-xs",
      className,
    )}
    {...rest}
  />
);

const SelectItem = ({
  className,
  children,
  ...rest
}: ComponentProps<typeof ArkSelect.Item>) => (
  <ArkSelect.Item
    className={cn(
      "relative flex cursor-default select-none items-center gap-2 rounded px-2 py-1.5 text-sm outline-hidden hover:bg-accent focus:bg-accent focus:text-accent-foreground data-disabled:pointer-events-none data-[state=checked]:bg-accent data-highlighted:bg-accent data-inset:pl-8 data-[state=checked]:text-accent-foreground data-highlighted:text-accent-foreground data-disabled:opacity-50 data-[state=checked]:hover:bg-sidebar-accent/80 [&[data-state=checked][data-highlighted]]:bg-sidebar-accent/80 [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0",
      className,
    )}
    {...rest}
  >
    {children}
  </ArkSelect.Item>
);

const SelectItemText = ({
  className,
  ...rest
}: ComponentProps<typeof ArkSelect.ItemText>) => (
  <ArkSelect.ItemText
    className={cn("flex items-center gap-2", className)}
    {...rest}
  />
);

const SelectItemIndicator = ({
  className,
  children,
  ...rest
}: ComponentProps<typeof ArkSelect.ItemIndicator>) => (
  <ArkSelect.ItemIndicator
    className={cn(
      "ml-auto flex h-3.5 w-3.5 items-center justify-center text-green-500",
      className,
    )}
    {...rest}
  >
    <Check className="size-4" />
  </ArkSelect.ItemIndicator>
);

const SelectSeparator = ({
  className,
  ...rest
}: HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("-mx-1 pointer-events-none my-1 h-px bg-border", className)}
    {...rest}
  />
);

export {
  Select,
  SelectRoot,
  SelectRootProvider,
  SelectContext,
  SelectLabel,
  SelectControl,
  SelectTrigger,
  SelectValueText,
  SelectIndicator,
  SelectClearTrigger,
  SelectPositioner,
  SelectContent,
  SelectItemGroup,
  SelectItemGroupLabel,
  SelectItem,
  SelectItemText,
  SelectItemIndicator,
  SelectSeparator,
  SelectHiddenSelect,
};

// Re-export createListCollection for convenience
export { createListCollection } from "@ark-ui/react";
