import {
  createListCollection,
  Select,
  SelectContent,
  SelectItem,
  SelectItemGroup,
  SelectItemText,
  SelectTrigger,
} from "@/components/ui/select";
import { getPriorityIcon } from "@/lib/util/getPriorityIcon";
import { cn } from "@/lib/utils";
import { buttonVariants } from "../../ui/button";

import type { ComponentProps } from "react";

interface Props extends Omit<ComponentProps<typeof Select>, "collection"> {
  triggerValue?: string;
  size?: "xs" | "sm" | "default";
}

const PrioritySelector = ({
  triggerValue,
  size = "default",
  ...rest
}: Props) => {
  const priorityCollection = createListCollection({
    items: [
      { label: "Low", value: "low" },
      { label: "Medium", value: "medium" },
      { label: "High", value: "high" },
    ],
  });

  const PriorityIcon = getPriorityIcon(triggerValue);

  return (
    <Select
      // @ts-ignore TODO: type issue
      collection={priorityCollection}
      {...rest}
    >
      <SelectTrigger
        size={size}
        className={cn(
          buttonVariants({ variant: "outline" }),
          "[&[data-state=open]>svg]:rotate-0 [&_svg:not([class*='text-'])]:text-foreground",
        )}
      >
        {PriorityIcon}

        <p className="font-semibold text-xs first-letter:uppercase">
          {triggerValue}
        </p>
      </SelectTrigger>
      <SelectContent>
        <SelectItemGroup className="space-y-1">
          {priorityCollection.items.map((column) => {
            const PriorityIcon = getPriorityIcon(column.label);

            return (
              <SelectItem key={column.value} item={column}>
                <SelectItemText>
                  {PriorityIcon}
                  {column.label}
                </SelectItemText>
              </SelectItem>
            );
          })}
        </SelectItemGroup>
      </SelectContent>
    </Select>
  );
};

export default PrioritySelector;
