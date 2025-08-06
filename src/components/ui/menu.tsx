import { Menu as ArkMenu } from "@ark-ui/react/menu";
import { CheckIcon } from "lucide-react";
import { FiChevronRight } from "react-icons/fi";
import { tv } from "tailwind-variants";

import { cn } from "@/lib/utils";

import type { ComponentProps } from "react";

const menuVariants = tv({
  slots: {
    trigger: "",
    positioner: "",
    content:
      "bg-background outline-none data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[state=closed]:animate-out data-[state=open]:animate-in flex flex-col gap-0.5",
    arrow: "fill-popover",
    arrowTip: "fill-border",
    item: "focus:bg-accent hover:bg-accent focus:text-accent-foreground data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground data-[variant=destructive]:text-destructive data-[variant=destructive]:hover:bg-destructive/10 dark:data-[variant=destructive]:hover:bg-destructive/20 data-[variant=destructive]:focus:text-destructive data-[variant=destructive]:focus:bg-destructive/10 data-[variant=destructive]:*:[svg]:!text-destructive [&_svg:not([class*='text-'])]:text-muted-foreground relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[inset]:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
    checkboxItem:
      "relative w-full flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent hover:bg-accent focus:text-accent-foreground data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
    itemGroup: "overflow-hidden p-1",
    itemGroupLabel:
      "flex w-full items-center justify-between p-2 text-base-500 text-sm",
    itemText: "",
    itemIndicator:
      "text-green-500 ml-auto flex h-3.5 w-3.5 items-center justify-center",
    radioItem:
      "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground data-[disabled]:opacity-50",
    radioItemGroup: "",
    separator: "-mx-1 py-0 h-px",
    triggerItem:
      "relative [&>svg]:size-4 outline-none focus-visible:border-ring data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground focus-visible:ring-ring/50 focus-visible:ring-[3px] flex cursor-default select-none items-center rounded-sm gap-2 px-2 py-1.5 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
  },
});

const {
  trigger,
  positioner,
  content,
  arrow,
  arrowTip,
  item,
  checkboxItem,
  itemGroup,
  itemGroupLabel,
  itemText,
  itemIndicator,
  radioItem,
  radioItemGroup,
  separator,
  triggerItem,
} = menuVariants();

const MenuProvider = ArkMenu.RootProvider;
const MenuRoot = ArkMenu.Root;

const MenuTrigger = ({
  className,
  ...rest
}: ComponentProps<typeof ArkMenu.Trigger>) => (
  <ArkMenu.Trigger className={cn(trigger(), className)} {...rest} />
);

const MenuPositioner = ({
  className,
  ...rest
}: ComponentProps<typeof ArkMenu.Positioner>) => (
  <ArkMenu.Positioner className={cn(positioner(), className)} {...rest} />
);

const MenuContent = ({
  className,
  ...rest
}: ComponentProps<typeof ArkMenu.Content>) => (
  <ArkMenu.Content className={cn(content(), className)} {...rest} />
);

const MenuArrow = ({
  className,
  ...rest
}: ComponentProps<typeof ArkMenu.Arrow>) => (
  <ArkMenu.Arrow className={cn(arrow(), className)} {...rest} />
);

const MenuArrowTip = ({
  className,
  ...rest
}: ComponentProps<typeof ArkMenu.ArrowTip>) => (
  <ArkMenu.ArrowTip className={cn(arrowTip(), className)} {...rest} />
);

const MenuItem = ({
  className,
  children,
  variant = "default",
  ...rest
}: ComponentProps<typeof ArkMenu.Item> & {
  variant?: "default" | "destructive";
}) => (
  <ArkMenu.Item
    data-variant={variant}
    className={cn(
      item(),
      variant === "destructive" &&
        "data-[highlighted]:bg-destructive/10 data-[highlighted]:text-destructive",
      className,
    )}
    {...rest}
  >
    {children}
  </ArkMenu.Item>
);

const MenuCheckboxItem = ({
  className,
  children,
  ...rest
}: ComponentProps<typeof ArkMenu.CheckboxItem>) => (
  <ArkMenu.CheckboxItem className={cn(checkboxItem(), className)} {...rest}>
    {children}
  </ArkMenu.CheckboxItem>
);

const MenuItemGroup = ({
  className,
  ...rest
}: ComponentProps<typeof ArkMenu.ItemGroup>) => (
  <ArkMenu.ItemGroup className={cn(itemGroup(), className)} {...rest} />
);

const MenuItemGroupLabel = ({
  className,
  ...rest
}: ComponentProps<typeof ArkMenu.ItemGroupLabel>) => (
  <ArkMenu.ItemGroupLabel
    className={cn(itemGroupLabel(), className)}
    {...rest}
  />
);

const MenuItemText = ({
  className,
  ...rest
}: ComponentProps<typeof ArkMenu.ItemText>) => (
  <ArkMenu.ItemText className={cn(itemText(), className)} {...rest} />
);

const MenuItemIndicator = ({
  className,
  ...rest
}: ComponentProps<typeof ArkMenu.ItemIndicator>) => (
  <ArkMenu.ItemIndicator className={cn(itemIndicator(), className)} {...rest}>
    <CheckIcon className="size-4" />
  </ArkMenu.ItemIndicator>
);

const MenuRadioItem = ({
  className,
  children,
  ...rest
}: ComponentProps<typeof ArkMenu.RadioItem>) => (
  <ArkMenu.RadioItem className={cn(radioItem(), className)} {...rest}>
    {children}
  </ArkMenu.RadioItem>
);

const MenuRadioItemGroup = ({
  className,
  ...rest
}: ComponentProps<typeof ArkMenu.RadioItemGroup>) => (
  <ArkMenu.RadioItemGroup
    className={cn(radioItemGroup(), className)}
    {...rest}
  />
);

const MenuSeparator = ({
  className,
  ...rest
}: ComponentProps<typeof ArkMenu.Separator>) => (
  <ArkMenu.Separator className={cn(separator(), className)} {...rest} />
);

const MenuTriggerItem = ({
  className,
  children,
  ...rest
}: ComponentProps<typeof ArkMenu.TriggerItem>) => (
  <ArkMenu.TriggerItem className={cn(triggerItem(), className)} {...rest}>
    {children}
    <FiChevronRight className="ml-auto size-3! text-base-400" />
  </ArkMenu.TriggerItem>
);

export {
  /** @knipignore */
  MenuArrow,
  /** @knipignore */
  MenuArrowTip,
  MenuContent,
  MenuItem,
  MenuItemGroup,
  MenuItemGroupLabel,
  MenuCheckboxItem,
  /** @knipignore */
  MenuRadioItem,
  /** @knipignore */
  MenuRadioItemGroup,
  MenuItemText,
  MenuItemIndicator,
  MenuPositioner,
  /** @knipignore */
  MenuProvider,
  MenuRoot,
  MenuSeparator,
  MenuTrigger,
  MenuTriggerItem,
};
