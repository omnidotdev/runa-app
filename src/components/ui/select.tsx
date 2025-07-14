import { Portal } from "@ark-ui/react/portal";
import { Select as ArkSelect } from "@ark-ui/react/select";
import { ChevronDownIcon } from "lucide-react";
import { tv } from "tailwind-variants";

import { cn } from "@/lib/utils";

import type { ComponentProps, HTMLAttributes } from "react";

// TODO: Add component to Thornberry registry.

const selectVariants = tv({
  slots: {
    root: "",
    label:
      "text-muted-foreground text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
    control: "",
    trigger:
      "flex w-fit cursor-pointer items-center justify-between gap-2 whitespace-nowrap rounded-md bg-base-100 text-foreground text-xs shadow-xs outline-none transition-transform hover:bg-base-200 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 data-[size=default]:h-9 data-[size=sm]:h-8 data-[size=xs]:h-7 dark:bg-base-700 dark:aria-invalid:ring-destructive/40 dark:hover:bg-base-800 [&[data-state=open]>svg]:rotate-180 [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0",
    valueText: "line-clamp-1 flex items-center gap-2",
    indicator: "size-4 transition-transform",
    clearTrigger:
      "cursor-pointer opacity-70 hover:opacity-100 transition-opacity",
    positioner: "",
    content:
      "no-scrollbar w-fit p-2 !max-h-80 overflow-auto data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 relative z-50 max-h-[var(--available-height)] min-w-[8rem] origin-[var(--transform-origin)] overflow-y-auto overflow-x-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=closed]:animate-out data-[state=open]:animate-in",
    itemGroup: "",
    itemGroupLabel: "px-2 py-1.5 text-muted-foreground text-xs font-semibold",
    item: "group relative flex w-full cursor-pointer select-none items-center justify-between gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg:not([class*='size-'])]:size-4 [&_svg:not([class*='text-'])]:text-muted-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 data-[state=checked]:bg-base-100 data-[state=checked]:text-foreground data-[state=checked]:hover:bg-base-200 data-[state=checked]:dark:bg-base-700 data-[state=checked]:dark:hover:bg-base-800 data-[state=unchecked]:hover:bg-accent data-[state=unchecked]:hover:text-accent-foreground data-[state=unchecked]:dark:hover:bg-accent/50",
    itemText: "flex items-center gap-2",
    itemIndicator:
      "absolute right-2 inline-flex items-center justify-center p-1",
    separator: "-mx-1 pointer-events-none my-1 h-px bg-border",
  },
  variants: {
    size: {
      xs: { trigger: "h-7" },
      sm: { trigger: "h-8" },
      default: { trigger: "h-9" },
    },
  },
  defaultVariants: {
    size: "default",
  },
});

const {
  root,
  label,
  control,
  trigger,
  valueText,
  indicator,
  clearTrigger,
  positioner,
  content,
  itemGroup,
  itemGroupLabel,
  item,
  itemText,
  itemIndicator,
  separator,
} = selectVariants();

const SelectRoot = ArkSelect.Root;
const SelectRootProvider = ArkSelect.RootProvider;
const SelectContext = ArkSelect.Context;
const SelectHiddenSelect = ArkSelect.HiddenSelect;

const Select = ({
  className,
  ...rest
}: ComponentProps<typeof ArkSelect.Root>) => (
  <ArkSelect.Root className={cn(root(), className)} {...rest} />
);

const SelectLabel = ({
  className,
  ...rest
}: ComponentProps<typeof ArkSelect.Label>) => (
  <ArkSelect.Label className={cn(label(), className)} {...rest} />
);

const SelectControl = ({
  className,
  ...rest
}: ComponentProps<typeof ArkSelect.Control>) => (
  <ArkSelect.Control className={cn(control(), className)} {...rest} />
);

// TODO: edit in thornberry to get rid of React.Children.only error when using `asChild` prop
const SelectTrigger = ({
  className,
  size = "default",
  ...rest
}: ComponentProps<typeof ArkSelect.Trigger> & {
  size?: "xs" | "sm" | "default";
}) => (
  <ArkSelect.Trigger
    data-size={size}
    className={cn(trigger({ size }), className)}
    {...rest}
  />
);

const SelectValueText = ({
  className,
  ...rest
}: ComponentProps<typeof ArkSelect.ValueText>) => (
  <ArkSelect.ValueText className={cn(valueText(), className)} {...rest} />
);

const SelectIndicator = ({
  className,
  children,
  ...rest
}: ComponentProps<typeof ArkSelect.Indicator>) => (
  <ArkSelect.Indicator className={cn(indicator(), className)} {...rest}>
    {children || <ChevronDownIcon />}
  </ArkSelect.Indicator>
);

const SelectClearTrigger = ({
  className,
  ...rest
}: ComponentProps<typeof ArkSelect.ClearTrigger>) => (
  <ArkSelect.ClearTrigger className={cn(clearTrigger(), className)} {...rest} />
);

const SelectPositioner = ({
  className,
  ...rest
}: ComponentProps<typeof ArkSelect.Positioner>) => (
  <ArkSelect.Positioner className={cn(positioner(), className)} {...rest} />
);

const SelectContent = ({
  className,
  children,
  ...rest
}: ComponentProps<typeof ArkSelect.Content>) => (
  <Portal>
    <SelectPositioner>
      <ArkSelect.Content className={cn(content(), className)} {...rest}>
        {children}
      </ArkSelect.Content>
    </SelectPositioner>
  </Portal>
);

const SelectItemGroup = ({
  className,
  ...rest
}: ComponentProps<typeof ArkSelect.ItemGroup>) => (
  <ArkSelect.ItemGroup className={cn(itemGroup(), className)} {...rest} />
);

const SelectItemGroupLabel = ({
  className,
  ...rest
}: ComponentProps<typeof ArkSelect.ItemGroupLabel>) => (
  <ArkSelect.ItemGroupLabel
    className={cn(itemGroupLabel(), className)}
    {...rest}
  />
);

const SelectItem = ({
  className,
  children,
  ...rest
}: ComponentProps<typeof ArkSelect.Item>) => (
  <ArkSelect.Item className={cn(item(), className)} {...rest}>
    {children}
  </ArkSelect.Item>
);

const SelectItemText = ({
  className,
  ...rest
}: ComponentProps<typeof ArkSelect.ItemText>) => (
  <ArkSelect.ItemText className={cn(itemText(), className)} {...rest} />
);

const SelectItemIndicator = ({
  className,
  children,
  ...rest
}: ComponentProps<typeof ArkSelect.ItemIndicator>) => (
  <ArkSelect.ItemIndicator className={cn(itemIndicator(), className)} {...rest}>
    {children}
  </ArkSelect.ItemIndicator>
);

const SelectSeparator = ({
  className,
  ...rest
}: HTMLAttributes<HTMLDivElement>) => (
  <div className={cn(separator(), className)} {...rest} />
);

export {
  Select,
  /** @knipignore */
  SelectRoot,
  /** @knipignore */
  SelectRootProvider,
  /** @knipignore */
  SelectContext,
  /** @knipignore */
  SelectLabel,
  /** @knipignore */
  SelectControl,
  SelectTrigger,
  SelectValueText,
  /** @knipignore */
  SelectIndicator,
  /** @knipignore */
  SelectClearTrigger,
  /** @knipignore */
  SelectPositioner,
  SelectContent,
  SelectItemGroup,
  /** @knipignore */
  SelectItemGroupLabel,
  SelectItem,
  SelectItemText,
  /** @knipignore */
  SelectItemIndicator,
  /** @knipignore */
  SelectSeparator,
  /** @knipignore */
  SelectHiddenSelect,
  selectVariants,
};

// Re-export createListCollection for convenience
export { createListCollection } from "@ark-ui/react";
