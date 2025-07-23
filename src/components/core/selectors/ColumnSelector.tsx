import { useQuery } from "@tanstack/react-query";

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
import projectOptions from "@/lib/options/project.options";
import { cn } from "@/lib/utils";

import type { ComponentProps } from "react";

interface Props extends Omit<ComponentProps<typeof Select>, "collection"> {
  // TODO: remove in favor of route loader or similar
  projectId: string;
  triggerLabel?: string;
  triggerEmoji?: string;
  size?: "xs" | "sm" | "default";
}

const ColumnSelector = ({
  projectId,
  triggerLabel,
  triggerEmoji,
  size = "default",
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
    <Select collection={columnCollection} {...rest}>
      <SelectTrigger
        size={size}
        className={cn(
          buttonVariants({ variant: "outline" }),
          "w-full [&[data-state=open]>svg]:rotate-0 [&_svg:not([class*='text-'])]:text-foreground",
        )}
      >
        {triggerEmoji && (
          <p className="font-semibold text-xs">{triggerEmoji}</p>
        )}
        <p className="font-semibold text-xs">{triggerLabel}</p>
      </SelectTrigger>
      <SelectContent>
        <SelectItemGroup className="space-y-1">
          {columnCollection.items.map((column) => (
            <SelectItem key={column.value} item={column}>
              <SelectItemText>
                {column.emoji}

                <p className="ml-1">{column.label}</p>
              </SelectItemText>
            </SelectItem>
          ))}
        </SelectItemGroup>
      </SelectContent>
    </Select>
  );
};

export default ColumnSelector;
