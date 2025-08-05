import { Collapsible as ArkCollapsible } from "@ark-ui/react/collapsible";
import { tv } from "tailwind-variants";

import { cn } from "@/lib/utils";

import type { ComponentProps } from "react";

const collapsibleVariants = tv({
  slots: {
    root: "",
    trigger:
      "flex w-full outline-none outline-hidden focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 items-center cursor-pointer justify-between rounded-md px-3 py-3 font-medium text-sm transition-transform [&[data-state=open]>svg]:rotate-90",
    content:
      "overflow-hidden data-[state=open]:animate-collapsible-down data-[state=closed]:animate-collapsible-up duration-300 ease-in-out",
  },
});

const { root, trigger, content } = collapsibleVariants();

const CollapsibleProvider = ArkCollapsible.RootProvider;
const CollapsibleContext = ArkCollapsible.Context;

const CollapsibleRoot = ({
  className,
  ...rest
}: ComponentProps<typeof ArkCollapsible.Root>) => (
  <ArkCollapsible.Root className={cn(root(), className)} {...rest} />
);

const CollapsibleTrigger = ({
  className,
  children,
  ...rest
}: ComponentProps<typeof ArkCollapsible.Trigger>) => (
  <ArkCollapsible.Trigger className={cn(trigger(), className)} {...rest}>
    {children}
  </ArkCollapsible.Trigger>
);

const CollapsibleContent = ({
  className,
  ...rest
}: ComponentProps<typeof ArkCollapsible.Content>) => (
  <ArkCollapsible.Content className={cn(content(), className)} {...rest} />
);

export {
  CollapsibleRoot,
  CollapsibleTrigger,
  CollapsibleContent,
  /** @knipignore */
  CollapsibleProvider,
  /** @knipignore */
  CollapsibleContext,
};
