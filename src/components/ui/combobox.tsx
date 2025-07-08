import { Combobox as ArkCombobox } from "@ark-ui/react/combobox";
import { ChevronsUpDownIcon } from "lucide-react";
import { FiCheck } from "react-icons/fi";
import { tv } from "tailwind-variants";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import type { ComponentProps } from "react";

const comboboxVariants = tv({
  slots: {
    root: "flex w-full flex-col gap-1.5",
    label: "block font-medium text-sm",
    control: "relative flex items-center",
    input:
      "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:font-medium file:text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
    trigger: "absolute top-1.5 right-1.5 bottom-1 size-7",
    clearTrigger:
      "absolute top-0 right-10 flex h-full items-center justify-center pr-2 text-muted-foreground hover:text-foreground disabled:pointer-events-none",
    positioner: "z-50 w-full min-w-[8rem]",
    content:
      "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 z-50 max-h-[300px] overflow-y-auto rounded-md border bg-popover p-1 shadow-md data-[state=closed]:animate-out data-[state=open]:animate-in",
    item: "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pr-2 pl-8 text-sm outline-none data-[disabled]:pointer-events-none data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground data-[disabled]:opacity-50",
    itemIndicator:
      "absolute left-2 flex h-3.5 w-3.5 items-center justify-center",
    itemGroup: "p-1",
    itemGroupLabel: "px-2 py-1.5 font-medium text-muted-foreground text-xs",
  },
});

const {
  root,
  label,
  control,
  input,
  trigger,
  clearTrigger,
  positioner,
  content,
  item,
  itemIndicator,
  itemGroup,
  itemGroupLabel,
} = comboboxVariants();

const ComboboxProvider = ArkCombobox.RootProvider;
const ComboboxContext = ArkCombobox.Context;

const ComboboxRoot = ({
  className,
  ...rest
}: ComponentProps<typeof ArkCombobox.Root>) => (
  <ArkCombobox.Root className={cn(root(), className)} {...rest} />
);

const ComboboxLabel = ({
  className,
  ...rest
}: ComponentProps<typeof ArkCombobox.Label>) => (
  <ArkCombobox.Label className={cn(label(), className)} {...rest} />
);

const ComboboxControl = ({
  className,
  ...rest
}: ComponentProps<typeof ArkCombobox.Control>) => (
  <ArkCombobox.Control className={cn(control(), className)} {...rest} />
);

const ComboboxInput = ({
  className,
  ...rest
}: ComponentProps<typeof ArkCombobox.Input>) => (
  <ArkCombobox.Input className={cn(input(), className)} {...rest} />
);

const ComboboxTrigger = ({
  className,
  ...rest
}: ComponentProps<typeof ArkCombobox.Trigger>) => (
  <ArkCombobox.Trigger asChild {...rest}>
    <Button variant="ghost" size="icon" className={cn(trigger(), className)}>
      <ChevronsUpDownIcon />
    </Button>
  </ArkCombobox.Trigger>
);

const ComboboxClearTrigger = ({
  className,
  ...rest
}: ComponentProps<typeof ArkCombobox.ClearTrigger>) => (
  <ArkCombobox.ClearTrigger
    className={cn(clearTrigger(), className)}
    {...rest}
  />
);

const ComboboxPositioner = ({
  className,
  ...rest
}: ComponentProps<typeof ArkCombobox.Positioner>) => (
  <ArkCombobox.Positioner className={cn(positioner(), className)} {...rest} />
);

const ComboboxContent = ({
  className,
  ...rest
}: ComponentProps<typeof ArkCombobox.Content>) => (
  <ArkCombobox.Content className={cn(content(), className)} {...rest} />
);

const ComboboxItem = ({
  className,
  children,
  ...rest
}: ComponentProps<typeof ArkCombobox.Item>) => (
  <ArkCombobox.Item className={cn(item(), className)} {...rest}>
    <span className={itemIndicator()}>
      <ArkCombobox.ItemIndicator>
        <FiCheck className="h-4 w-4" />
      </ArkCombobox.ItemIndicator>
    </span>
    <ArkCombobox.ItemText>{children}</ArkCombobox.ItemText>
  </ArkCombobox.Item>
);

const ComboboxItemGroup = ({
  className,
  ...rest
}: ComponentProps<typeof ArkCombobox.ItemGroup>) => (
  <ArkCombobox.ItemGroup className={cn(itemGroup(), className)} {...rest} />
);

const ComboboxItemGroupLabel = ({
  className,
  ...rest
}: ComponentProps<typeof ArkCombobox.ItemGroupLabel>) => (
  <ArkCombobox.ItemGroupLabel
    className={cn(itemGroupLabel(), className)}
    {...rest}
  />
);

export {
  ComboboxRoot,
  /** @knipignore */
  ComboboxLabel,
  ComboboxControl,
  ComboboxInput,
  ComboboxTrigger,
  /** @knipignore */
  ComboboxClearTrigger,
  ComboboxPositioner,
  ComboboxContent,
  ComboboxItem,
  /** @knipignore */
  ComboboxItemGroup,
  /** @knipignore */
  ComboboxItemGroupLabel,
  /** @knipignore */
  ComboboxProvider,
  /** @knipignore */
  ComboboxContext,
};
