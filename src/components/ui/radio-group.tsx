import { RadioGroup as ArkRadioGroup } from "@ark-ui/react/radio-group";

import { cn } from "@/lib/utils";

import type { ComponentProps } from "react";

const RadioGroupRoot = ({
  className,
  ...rest
}: ComponentProps<typeof ArkRadioGroup.Root>) => (
  <ArkRadioGroup.Root
    className={cn("flex w-fit flex-col gap-4", className)}
    {...rest}
  />
);

const RadioGroupLabel = ({
  children,
  className,
}: ComponentProps<typeof ArkRadioGroup.Label>) => (
  <ArkRadioGroup.Label className={className}>{children}</ArkRadioGroup.Label>
);

const RadioGroupItem = ({
  className,
  ...rest
}: ComponentProps<typeof ArkRadioGroup.Item>) => (
  <ArkRadioGroup.Item
    className={cn("flex cursor-pointer items-center space-x-2", className)}
    {...rest}
  />
);

const RadioGroupItemHiddenInput = ({
  className,
  ...rest
}: ComponentProps<typeof ArkRadioGroup.ItemHiddenInput>) => (
  <ArkRadioGroup.ItemHiddenInput
    className={cn(
      "peer sr-only focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
      className,
    )}
    {...rest}
  />
);

const RadioGroupItemControl = ({
  className,
  ...rest
}: ComponentProps<typeof ArkRadioGroup.ItemControl>) => (
  <ArkRadioGroup.ItemControl
    className={cn(
      "flex size-3 items-center justify-center rounded-full shadow ring-1 ring-ring ring-offset-2 ring-offset-background transition-normal",
      "peer-focus:ring-2 peer-focus:ring-primary peer-focus:ring-offset-2 peer-focus:ring-offset-background",
      "data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
      className,
    )}
    {...rest}
  >
    <div
      className={cn(
        "size-2 rounded-full bg-current opacity-0 transition-opacity data-[state=checked]:opacity-100",
      )}
    />
  </ArkRadioGroup.ItemControl>
);

const RadioGroupItemText = ({
  children,
  className,
}: ComponentProps<typeof ArkRadioGroup.ItemText>) => (
  <ArkRadioGroup.ItemText
    className={cn(
      "font-medium text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
      className,
    )}
  >
    {children}
  </ArkRadioGroup.ItemText>
);

export {
  RadioGroupRoot,
  RadioGroupLabel,
  RadioGroupItem,
  RadioGroupItemHiddenInput,
  RadioGroupItemControl,
  RadioGroupItemText,
};
