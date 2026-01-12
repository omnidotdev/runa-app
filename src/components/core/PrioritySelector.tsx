import { useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";

import { PriorityIcon } from "@/components/tasks";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectControl,
  SelectItem,
  SelectItemGroup,
  SelectItemIndicator,
  SelectItemText,
  SelectPositioner,
  SelectTrigger,
  createListCollection,
} from "@/components/ui/select";
import { Hotkeys } from "@/lib/constants/hotkeys";
import capitalizeFirstLetter from "@/lib/util/capitalizeFirstLetter";
import Shortcut from "./Shortcut";
import Tooltip from "./Tooltip";

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

  const [isPrioritySelectorOpen, setIsPrioritySelectorOpen] = useState(false);

  useHotkeys(
    Hotkeys.UpdateTaskPriority,
    () => setIsPrioritySelectorOpen(!isPrioritySelectorOpen),
    [isPrioritySelectorOpen, setIsPrioritySelectorOpen],
  );

  return (
    <Select
      open={isPrioritySelectorOpen}
      onOpenChange={({ open }) => setIsPrioritySelectorOpen(open)}
      collection={priorityCollection}
      loopFocus
      {...rest}
    >
      <Tooltip
        positioning={{ placement: "top" }}
        tooltip="Adjust Priority"
        shortcut={Hotkeys.UpdateTaskPriority}
        trigger={
          <SelectControl>
            <SelectTrigger aria-label="Select Priority" asChild>
              <Button variant="outline" className="w-fit">
                <PriorityIcon priority={triggerValue} />

                <p className="hidden text-sm md:flex">
                  {capitalizeFirstLetter(triggerValue!)}
                </p>
              </Button>
            </SelectTrigger>
          </SelectControl>
        }
      />

      <SelectPositioner>
        <SelectContent className="w-48 p-0">
          <div className="flex w-full items-center justify-between border-b p-2 text-base-500 text-sm">
            Priority
            <Shortcut>{Hotkeys.UpdateTaskPriority}</Shortcut>
          </div>

          <SelectItemGroup className="space-y-1 p-1">
            {priorityCollection.items.map((column) => (
              <SelectItem key={column.value} item={column}>
                <SelectItemText>
                  <PriorityIcon priority={column.label} />
                  {column.label}
                </SelectItemText>
                <SelectItemIndicator />
              </SelectItem>
            ))}
          </SelectItemGroup>
        </SelectContent>
      </SelectPositioner>
    </Select>
  );
};

export default PrioritySelector;
