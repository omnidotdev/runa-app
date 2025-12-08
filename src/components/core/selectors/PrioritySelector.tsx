import { useRef } from "react";

import Shortcut from "@/components/core/Shortcut";
import Tooltip from "@/components/core/Tooltip";
import PriorityIcon from "@/components/tasks/PriorityIcon";
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
import firstLetterToUppercase from "@/lib/util/firstLetterToUppercase";

import type { ComponentProps } from "react";

interface Props extends Omit<ComponentProps<typeof Select>, "collection"> {
  triggerValue?: string;
}

const PrioritySelector = ({ triggerValue, ...rest }: Props) => {
  const selectButtonRef = useRef<HTMLButtonElement | null>(null);

  const priorityCollection = createListCollection({
    items: [
      { label: "Low", value: "low" },
      { label: "Medium", value: "medium" },
      { label: "High", value: "high" },
    ],
  });

  return (
    <Select collection={priorityCollection} loopFocus {...rest}>
      <Tooltip
        positioning={{ placement: "top" }}
        tooltip="Adjust Priority"
        shortcut={Hotkeys.UpdateTaskPriority}
        trigger={
          <SelectControl>
            <SelectTrigger
              aria-label="Select Priority"
              ref={selectButtonRef}
              asChild
            >
              <Button variant="outline" className="w-fit">
                <PriorityIcon priority={triggerValue} />

                <p className="hidden text-sm md:flex">
                  {firstLetterToUppercase(triggerValue!)}
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
