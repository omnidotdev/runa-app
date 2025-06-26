import { Collapsible as ArkCollapsible } from "@ark-ui/react/collapsible";
import { FiChevronDown } from "react-icons/fi";
import { tv } from "tailwind-variants";

import { cn } from "@/lib/utils";

import type { ComponentProps } from "react";

const collapsibleVariants = tv({
  slots: {
    root: "w-full",
    trigger:
      "flex w-full items-center cursor-pointer justify-between rounded-md bg-background px-4 py-2 font-medium text-sm transition-all hover:bg-muted/50 data-[state=open]:rounded-b-none data-[state=open]:bg-muted/50 [&[data-state=open]>svg]:rotate-180",
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
    <FiChevronDown className="h-4 w-4 transition-transform" />
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
