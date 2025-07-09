import { ChevronDownIcon } from "lucide-react";

import {
  createListCollection,
  Select,
  SelectContent,
  SelectItem,
  SelectItemGroup,
  SelectItemText,
  SelectTrigger,
} from "@/components/ui/select";
import { labelColors } from "@/lib/constants/labelColors";
import { cn } from "@/lib/utils";

import type { Select as ArkSelect } from "@ark-ui/react/select";
import type { ComponentProps } from "react";

interface Props
  extends Omit<ComponentProps<typeof ArkSelect.Root>, "collection"> {
  triggerValue?: string;
}

const ColorSelector = ({ triggerValue, ...rest }: Props) => {
  const colorCollection = createListCollection({
    items: labelColors.map((color) => ({
      label: color.name,
      value: color.name.toLowerCase(),
      color: color,
    })),
  });

  return (
    <Select
      // @ts-ignore TODO: type issue
      collection={colorCollection}
      {...rest}
    >
      <SelectTrigger className="w-full justify-start bg-transparent shadow-none dark:bg-transparent">
        <div
          className={cn(
            "size-4 rounded-full",
            labelColors.find((l) => l.name.toLowerCase() === triggerValue)
              ?.classes,
          )}
        />
        <p className="first-letter:uppercase">{triggerValue}</p>
        <ChevronDownIcon className="ml-auto size-3" />
      </SelectTrigger>
      <SelectContent>
        <SelectItemGroup>
          {colorCollection.items.map((item) => (
            <SelectItem key={item.value} item={item}>
              <SelectItemText>{item.label}</SelectItemText>

              <div className={cn("size-4 rounded-full", item.color.classes)} />
            </SelectItem>
          ))}
        </SelectItemGroup>
      </SelectContent>
    </Select>
  );
};

export default ColorSelector;
