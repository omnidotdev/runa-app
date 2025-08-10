import { Switch as ArkSwitch } from "@ark-ui/react/switch";
import { tv } from "tailwind-variants";

import { cn } from "@/lib/utils";

import type { ComponentProps } from "react";
import type { VariantProps } from "tailwind-variants";

const switchVariants = tv({
  slots: {
    root: "flex items-center gap-2",
    control:
      "peer inline-flex shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input",
    thumb:
      "pointer-events-none block rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-full data-[state=unchecked]:translate-x-0",
    label:
      "font-medium text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
    hiddenInput: "",
  },
  variants: {
    size: {
      xs: {
        control: "h-[16px] w-[28px]",
        thumb: "h-3 w-3 data-[state=checked]:translate-x-[12px]",
      },
      sm: {
        control: "h-[18px] w-[34px]",
        thumb: "h-[14px] w-[14px] data-[state=checked]:translate-x-[16px]",
      },
      md: {
        control: "h-[24px] w-[44px]",
        thumb: "h-5 w-5 data-[state=checked]:translate-x-[20px]",
      },
      lg: {
        control: "h-[32px] w-[56px]",
        thumb: "h-6 w-6 data-[state=checked]:translate-x-[24px]",
      },
    },
  },
  defaultVariants: {
    size: "md",
  },
});

const { root, control, thumb, label, hiddenInput } = switchVariants();

const SwitchProvider = ArkSwitch.RootProvider;
const SwitchContext = ArkSwitch.Context;

const SwitchRoot = ({
  className,
  ...rest
}: ComponentProps<typeof ArkSwitch.Root>) => {
  return <ArkSwitch.Root className={cn(root(), className)} {...rest} />;
};

const SwitchControl = ({
  className,
  size,
  ...rest
}: ComponentProps<typeof ArkSwitch.Control> &
  VariantProps<typeof switchVariants>) => {
  return (
    <ArkSwitch.Control className={cn(control({ size }), className)} {...rest} />
  );
};

const SwitchThumb = ({
  className,
  size,
  ...rest
}: ComponentProps<typeof ArkSwitch.Thumb> &
  VariantProps<typeof switchVariants>) => {
  return (
    <ArkSwitch.Thumb className={cn(thumb({ size }), className)} {...rest} />
  );
};

const SwitchLabel = ({
  className,
  ...rest
}: ComponentProps<typeof ArkSwitch.Label>) => (
  <ArkSwitch.Label className={cn(label(), className)} {...rest} />
);

const SwitchHiddenInput = ({
  className,
  ...rest
}: ComponentProps<typeof ArkSwitch.HiddenInput>) => (
  <ArkSwitch.HiddenInput className={cn(hiddenInput(), className)} {...rest} />
);

export {
  SwitchRoot,
  SwitchControl,
  SwitchThumb,
  SwitchLabel,
  SwitchHiddenInput,
  SwitchProvider,
  SwitchContext,
};
