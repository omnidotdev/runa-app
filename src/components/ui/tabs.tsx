import { Tabs as ArkTabs } from "@ark-ui/react/tabs";
import { tv } from "tailwind-variants";

import { cn } from "@/lib/utils";

import type { ComponentProps } from "react";

const tabsVariants = tv({
  slots: {
    root: "w-full",
    list: "inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground",
    trigger:
      "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 font-medium text-sm ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 aria-selected:bg-background aria-selected:text-foreground aria-selected:shadow-sm",
    content:
      "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
    indicator:
      "absolute transition-all duration-200 data-[orientation=vertical]:right-0 data-[orientation=horizontal]:bottom-0",
  },
});

const { root, list, trigger, content, indicator } = tabsVariants();

const TabsProvider = ArkTabs.RootProvider;
const TabsContext = ArkTabs.Context;

const TabsRoot = ({
  className,
  ...rest
}: ComponentProps<typeof ArkTabs.Root>) => (
  <ArkTabs.Root className={cn(root(), className)} {...rest} />
);

const TabsList = ({
  className,
  ...rest
}: ComponentProps<typeof ArkTabs.List>) => (
  <ArkTabs.List className={cn(list(), className)} {...rest} />
);

const TabsTrigger = ({
  className,
  ...rest
}: ComponentProps<typeof ArkTabs.Trigger>) => (
  <ArkTabs.Trigger className={cn(trigger(), className)} {...rest} />
);

const TabsContent = ({
  className,
  ...rest
}: ComponentProps<typeof ArkTabs.Content>) => (
  <ArkTabs.Content className={cn(content(), className)} {...rest} />
);

const TabsIndicator = ({
  className,
  ...rest
}: ComponentProps<typeof ArkTabs.Indicator>) => (
  <ArkTabs.Indicator className={cn(indicator(), className)} {...rest} />
);

export {
  TabsRoot,
  TabsList,
  TabsTrigger,
  TabsContent,
  TabsIndicator,
  TabsProvider,
  TabsContext,
};
