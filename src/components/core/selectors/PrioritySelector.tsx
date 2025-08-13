import PriorityIcon from "@/components/tasks/PriorityIcon";
import { buttonVariants } from "@/components/ui/button";
import {
  createListCollection,
  Select,
  SelectContent,
  SelectItem,
  SelectItemGroup,
  SelectItemText,
  SelectTrigger,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

import type { ComponentProps } from "react";

interface Props extends Omit<ComponentProps<typeof Select>, "collection"> {
  triggerValue?: string;
}

const PrioritySelector = ({ triggerValue, ...rest }: Props) => {
  const priorityCollection = createListCollection({
    items: [
      { label: "Low", value: "low" },
      { label: "Medium", value: "medium" },
      { label: "High", value: "high" },
    ],
  });

  return (
    <Select collection={priorityCollection} {...rest}>
      <SelectTrigger
        className={cn(
          buttonVariants({ variant: "outline" }),
          "w-full [&[data-state=open]>svg]:rotate-0 [&_svg:not([class*='text-'])]:text-foreground",
        )}
        aria-label="Select Priority"
      >
        <PriorityIcon priority={triggerValue} />

        <p className="text-sm first-letter:uppercase">{triggerValue}</p>
      </SelectTrigger>
      <SelectContent>
        <SelectItemGroup className="space-y-1">
          {priorityCollection.items.map((column) => (
            <SelectItem key={column.value} item={column}>
              <SelectItemText>
                <PriorityIcon priority={column.label} />
                {column.label}
              </SelectItemText>
            </SelectItem>
          ))}
        </SelectItemGroup>
      </SelectContent>
    </Select>
  );
};

export default PrioritySelector;
