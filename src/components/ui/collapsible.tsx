import { Collapsible as ArkCollapsible } from "@ark-ui/react/collapsible";

import { cn } from "@/lib/utils";

import type { ComponentProps } from "react";

const CollapsibleProvider = ArkCollapsible.RootProvider;
const CollapsibleContext = ArkCollapsible.Context;

const CollapsibleRoot = ({
  className,
  ...rest
}: ComponentProps<typeof ArkCollapsible.Root>) => (
  <ArkCollapsible.Root className={cn("w-full", className)} {...rest} />
);

const CollapsibleTrigger = ({
  className,
  children,
  ...rest
}: ComponentProps<typeof ArkCollapsible.Trigger>) => (
  <ArkCollapsible.Trigger
    className={cn(
      "transform] flex w-full cursor-pointer items-center justify-between rounded-md px-3 py-3 font-medium text-sm outline-none transition-[color,box-shadow,transition] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background [&[data-state=open]>svg]:rotate-90",
      className,
    )}
    {...rest}
  >
    {children}
  </ArkCollapsible.Trigger>
);

const CollapsibleContent = ({
  className,
  ...rest
}: ComponentProps<typeof ArkCollapsible.Content>) => (
  <ArkCollapsible.Content
    className={cn(
      "overflow-hidden rounded-b-md border border-muted/50 border-t-0 p-4",
      className,
    )}
    {...rest}
  />
);

export {
  CollapsibleRoot,
  CollapsibleTrigger,
  CollapsibleContent,
  CollapsibleProvider,
  CollapsibleContext,
};
