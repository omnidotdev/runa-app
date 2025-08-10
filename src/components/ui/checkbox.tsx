import { Checkbox as ArkCheckbox } from "@ark-ui/react/checkbox";
import { tv } from "tailwind-variants";

import { cn } from "@/lib/utils";

import type { ComponentProps } from "react";

const checkboxVariants = tv({
  slots: {
    root: "flex items-center",
    label:
      "ml-2 font-medium text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
    control:
      "flex size-5 cursor-pointer items-center justify-center rounded-sm border border-primary shadow transition-normal focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed peer-disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
    indicator: "peer",
    hiddenInput: "peer shrink-0",
  },
});

const { root, label, control, indicator, hiddenInput } = checkboxVariants();

const CheckboxProvider = ArkCheckbox.RootProvider;
const CheckboxGroup = ArkCheckbox.Group;
const CheckboxContext = ArkCheckbox.Context;

const CheckboxRoot = ({
  className,
  ...rest
}: ComponentProps<typeof ArkCheckbox.Root>) => (
  <ArkCheckbox.Root className={cn(root(), className)} {...rest} />
);

// TODO: fix types and className merging upstream in thornberry
const CheckboxLabel = ({
  className,
  children,
}: ComponentProps<typeof ArkCheckbox.Label>) => (
  <ArkCheckbox.Label className={cn(label(), className)}>
    {children}
  </ArkCheckbox.Label>
);

const CheckboxControl = ({
  className,
  ...rest
}: ComponentProps<typeof ArkCheckbox.Control>) => (
  <ArkCheckbox.Control className={cn(control(), className)} {...rest} />
);

const CheckboxIndicator = ({
  className,
  ...rest
}: ComponentProps<typeof ArkCheckbox.Indicator>) => (
  <ArkCheckbox.Indicator className={cn(indicator(), className)} {...rest} />
);

const CheckboxHiddenInput = ({
  className,
  ...rest
}: ComponentProps<typeof ArkCheckbox.HiddenInput>) => (
  <ArkCheckbox.HiddenInput className={cn(hiddenInput(), className)} {...rest} />
);

export {
  /** @knipignore */
  CheckboxProvider,
  /** @knipignore */
  CheckboxGroup,
  /** @knipignore */
  CheckboxContext,
  CheckboxRoot,
  CheckboxLabel,
  CheckboxControl,
  CheckboxIndicator,
  CheckboxHiddenInput,
};
