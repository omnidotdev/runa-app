import { useQuery } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import {
  createListCollection,
  Select,
  SelectContent,
  SelectControl,
  SelectItem,
  SelectItemGroup,
  SelectItemIndicator,
  SelectItemText,
  SelectPositioner,
  SelectTrigger,
} from "@/components/ui/select";
import { Shortcut } from "@/components/ui/shortcut";
import { Hotkeys } from "@/lib/constants/hotkeys";
import projectOptions from "@/lib/options/project.options";
import Tooltip from "../Tooltip";

import type { ComponentProps } from "react";

interface Props extends Omit<ComponentProps<typeof Select>, "collection"> {
  // TODO: remove in favor of route loader or similar
  projectId: string;
  triggerLabel?: string;
  triggerEmoji?: string;
}

const ColumnSelector = ({
  projectId,
  triggerLabel,
  triggerEmoji,
  ...rest
}: Props) => {
  const { data: project } = useQuery({
    ...projectOptions({ rowId: projectId }),
    select: (data) => data?.project,
  });

  const columnCollection = createListCollection({
    items:
      project?.columns?.nodes?.map((column) => ({
        label: column?.title ?? "",
        value: column?.rowId ?? "",
        emoji: column?.emoji ?? "",
      })) ?? [],
  });

  return (
    <Select
      collection={columnCollection}
      loopFocus
      aria-label="Select Column"
      {...rest}
    >
      <Tooltip
        positioning={{ placement: "top" }}
        tooltip="Adjust status"
        shortcut={Hotkeys.UpdateTaskStatus.toUpperCase()}
        trigger={
          <SelectControl>
            <SelectTrigger asChild>
              <Button variant="outline" className="w-fit">
                {triggerEmoji && <p className="text-lg">{triggerEmoji}</p>}

                <p className="hidden text-sm md:flex">{triggerLabel}</p>
              </Button>
            </SelectTrigger>
          </SelectControl>
        }
      />

      <SelectPositioner>
        <SelectContent className="w-48 p-0">
          <div className="flex w-full items-center justify-between border-b p-2 text-base-500 text-sm">
            Status <Shortcut>{Hotkeys.UpdateTaskStatus.toUpperCase()}</Shortcut>
          </div>

          <SelectItemGroup className="space-y-1 p-1">
            {columnCollection.items.map((column) => (
              <SelectItem key={column.value} item={column}>
                <SelectItemText>
                  {column.emoji}

                  <p className="ml-1">{column.label}</p>
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

export default ColumnSelector;
