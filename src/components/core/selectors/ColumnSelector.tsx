import { useQuery } from "@tanstack/react-query";
import { useParams } from "@tanstack/react-router";

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
import { getColumnIcon } from "@/lib/util/getColumnIcon";
import { cn } from "@/lib/utils";
import { buttonVariants } from "../../ui/button";

import type { ComponentProps } from "react";

interface Props extends Omit<ComponentProps<typeof Select>, "collection"> {
  triggerValue?: string;
  size?: "xs" | "sm" | "default";
}

const ColumnSelector = ({ triggerValue, size = "default", ...rest }: Props) => {
  const { projectId } = useParams({ strict: false });

  const { data: project } = useQuery({
    ...projectOptions({ rowId: projectId! }),
    select: (data) => data?.project,
  });

  const columnCollection = createListCollection({
    items:
      project?.columns?.nodes?.map((column) => ({
        label: column?.title ?? "",
        value: column?.rowId ?? "",
      })) ?? [],
  });

  const ColumnIcon = getColumnIcon(triggerValue);

  return (
    <Select
      // @ts-ignore TODO: type issue
      collection={columnCollection}
      {...rest}
    >
      <SelectTrigger
        size={size}
        className={cn(
          buttonVariants({ variant: "outline" }),
          "w-full [&[data-state=open]>svg]:rotate-0 [&_svg:not([class*='text-'])]:text-foreground",
        )}
      >
        {ColumnIcon}
        <p className="font-semibold text-xs">{triggerValue}</p>
      </SelectTrigger>
      <SelectContent>
        <SelectItemGroup className="space-y-1">
          {columnCollection.items.map((column) => {
            const ColumnIcon = getColumnIcon(column.label);

            return (
              <SelectItem key={column.value} item={column}>
                <SelectItemText>
                  {ColumnIcon}

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

export default ColumnSelector;
