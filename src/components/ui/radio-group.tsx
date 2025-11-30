import { RadioGroup as ArkRadioGroup } from "@ark-ui/react/radio-group";
import { tv } from "tailwind-variants";

import { cn } from "@/lib/utils";

import type { ComponentProps, ReactNode } from "react";

const radioGroupVariants = tv({
  slots: {
    root: "space-y-3",
    label: "text-sm",
    indicator: "",
    item: "flex cursor-pointer items-center space-x-2",
    itemText:
      "text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
    itemControl:
      "flex size-3 cursor-pointer items-center justify-center rounded-full ring-1 ring-ring ring-offset-2 ring-offset-background transition-normal disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
    itemHiddenInput: "peer",
  },
});

const { root, label, indicator, item, itemText, itemControl, itemHiddenInput } =
  radioGroupVariants();

const RadioGroupProvider = ArkRadioGroup.RootProvider;
const RadioGroupContext = ArkRadioGroup.Context;

const RadioGroupRoot = ({
  className,
  ...rest
}: ComponentProps<typeof ArkRadioGroup.Root>) => (
  <ArkRadioGroup.Root className={cn(root(), className)} {...rest} />
);

// TODO: update in thornberry
const RadioGroupLabel = ({
  className,
  children,
}: ComponentProps<typeof ArkRadioGroup.Label>) => (
  <ArkRadioGroup.Label className={cn(label(), className)}>
    {children}
  </ArkRadioGroup.Label>
);

const RadioGroupIndicator = ({
  className,
  ...rest
}: ComponentProps<typeof ArkRadioGroup.Indicator>) => (
  <ArkRadioGroup.Indicator className={cn(indicator(), className)} {...rest} />
);

const RadioGroupItem = ({
  className,
  ...rest
}: ComponentProps<typeof ArkRadioGroup.Item>) => (
  <ArkRadioGroup.Item className={cn(item(), className)} {...rest} />
);

const RadioGroupItemText = ({ children }: { children: ReactNode }) => (
  <ArkRadioGroup.ItemText className={itemText()}>
    {children}
  </ArkRadioGroup.ItemText>
);

const RadioGroupItemControl = ({
  className,
  ...rest
}: ComponentProps<typeof ArkRadioGroup.ItemControl>) => (
  <ArkRadioGroup.ItemControl className={cn(itemControl(), className)} {...rest}>
    <div className="size-2 rounded-full bg-current opacity-0 transition-opacity data-[state=checked]:opacity-100" />
  </ArkRadioGroup.ItemControl>
);

const RadioGroupItemHiddenInput = ({
  className,
  ...rest
}: ComponentProps<typeof ArkRadioGroup.ItemHiddenInput>) => (
  <ArkRadioGroup.ItemHiddenInput
    className={cn(itemHiddenInput(), className)}
    {...rest}
  />
);

export {
  RadioGroupProvider,
  RadioGroupContext,
  RadioGroupRoot,
  RadioGroupLabel,
  RadioGroupIndicator,
  RadioGroupItem,
  RadioGroupItemText,
  RadioGroupItemControl,
  RadioGroupItemHiddenInput,
};
