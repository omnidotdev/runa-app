import { Accordion as ArkAccordion } from "@ark-ui/react";
import { FiChevronDown } from "react-icons/fi";
import { tv } from "tailwind-variants";

import { cn } from "@/lib/utils";

import type {
  AccordionItemContentProps,
  AccordionItemProps,
  AccordionItemTriggerProps,
  AccordionRootProps,
} from "@ark-ui/react";
import type { ElementType } from "react";

const accordionVariants = tv({
  slots: {
    root: "flex flex-col border-t data-[orientation=horizontal]:flex-row data-[orientation=horizontal]:gap-4 data-[orientation=horizontal]:border-none",
    item: "group flex flex-col border-b px-2 data-[orientation=horizontal]:w-full data-[orientation=horizontal]:border-none data-disabled:opacity-50",
    itemTrigger:
      "flex flex-1 cursor-pointer items-center justify-between py-4 text-left font-medium text-sm transition-all disabled:cursor-not-allowed data-[orientation=horizontal]:items-start [&[data-state=open]>svg]:rotate-180",
    itemTriggerIcon: "size-4 transition-transform",
    itemContent:
      "overflow-hidden text-sm data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down",
  },
});

const { root, item, itemTrigger, itemTriggerIcon, itemContent } =
  accordionVariants();

const AccordionRoot = ({ className, ...rest }: AccordionRootProps) => (
  <ArkAccordion.Root className={cn(root(), className)} {...rest} />
);

const AccordionItem = ({ className, ...rest }: AccordionItemProps) => (
  <ArkAccordion.Item className={cn(item(), className)} {...rest} />
);

interface ItemTriggerProps extends AccordionItemTriggerProps {
  icon?: ElementType;
}

const AccordionItemTrigger = ({
  className,
  children,
  icon,
  ...rest
}: ItemTriggerProps) => {
  const Icon = icon ?? FiChevronDown;

  return (
    <ArkAccordion.ItemTrigger
      className={cn(itemTrigger(), className)}
      {...rest}
    >
      {children}
      <Icon className={itemTriggerIcon()} />
    </ArkAccordion.ItemTrigger>
  );
};

const AccordionItemContent = ({
  className,
  children,
  ...rest
}: AccordionItemContentProps) => (
  <ArkAccordion.ItemContent className={itemContent()} {...rest}>
    <div className={cn("pt-0 pb-4", className)}>{children}</div>
  </ArkAccordion.ItemContent>
);

export {
  AccordionRoot,
  AccordionItem,
  AccordionItemTrigger,
  AccordionItemContent,
};
