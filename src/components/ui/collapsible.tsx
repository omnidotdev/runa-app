import { Collapsible as ArkCollapsible } from "@ark-ui/react/collapsible";
import { tv } from "tailwind-variants";

import { cn } from "@/lib/utils";

import type { ComponentProps } from "react";

const collapsibleVariants = tv({
  slots: {
    root: "w-full",
    trigger:
      "flex w-full items-center cursor-pointer justify-between rounded-md px-3 py-3 font-medium text-sm transition-transform [&[data-state=open]>svg]:rotate-180",
    content: "overflow-hidden",
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
