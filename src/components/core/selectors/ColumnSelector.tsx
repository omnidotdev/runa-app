import { useQuery } from "@tanstack/react-query";
import { useRef } from "react";

import PopoverWithTooltip from "@/components/core/PopoverWithTooltip";
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
import { SidebarMenuShortcut } from "@/components/ui/sidebar";
import { TooltipTrigger } from "@/components/ui/tooltip";
import { Hotkeys } from "@/lib/constants/hotkeys";
import projectOptions from "@/lib/options/project.options";

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

  const selectButtonRef = useRef<HTMLButtonElement | null>(null);

  const columnCollection = createListCollection({
    items:
      project?.columns?.nodes?.map((column) => ({
        label: column?.title ?? "",
        value: column?.rowId ?? "",
        emoji: column?.emoji ?? "",
      })) ?? [],
  });

  return (
    <PopoverWithTooltip
      triggerRef={selectButtonRef}
      tooltip="Adjust status"
      shortcut={Hotkeys.UpdateTaskStatus.toUpperCase()}
    >
      <Select
        collection={columnCollection}
        positioning={{
          getAnchorRect: () =>
            selectButtonRef.current?.getBoundingClientRect() ?? null,
        }}
        loopFocus
        aria-label="Select Column"
        {...rest}
      >
        <SelectControl>
          <SelectTrigger ref={selectButtonRef} asChild>
            <TooltipTrigger asChild>
              <Button variant="outline" className="w-fit">
                {triggerEmoji && <p className="text-lg">{triggerEmoji}</p>}

                <p className="hidden text-sm md:flex">{triggerLabel}</p>
              </Button>
            </TooltipTrigger>
          </SelectTrigger>
        </SelectControl>

        <SelectPositioner>
          <SelectContent className="w-48 p-0">
            <div className="flex w-full items-center justify-between border-b p-2 text-base-500 text-sm">
              Status{" "}
              <SidebarMenuShortcut>
                {Hotkeys.UpdateTaskStatus.toUpperCase()}
              </SidebarMenuShortcut>
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
    </PopoverWithTooltip>
  );
};

export default ColumnSelector;
