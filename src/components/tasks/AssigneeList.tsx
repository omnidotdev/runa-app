import { CheckIcon } from "lucide-react";

import {
  AvatarFallback,
  AvatarImage,
  AvatarRoot,
} from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

import type { WorkspaceUser } from "./UpdateAssignees";

interface AssigneeListProps {
  viewMode: "grid" | "list";
  items: WorkspaceUser[];
  selected: string[];
  atLimit: boolean;
  maxAssignees: number;
  onToggle: (value: string) => void;
}

export default function AssigneeList({
  viewMode,
  items,
  selected,
  atLimit,
  maxAssignees,
  onToggle,
}: AssigneeListProps) {
  if (viewMode === "grid") {
    return (
      <div className="h-56 max-h-80 overflow-y-auto rounded-md">
        <div className="grid grid-cols-4 gap-1.5 outline-none">
          {items.map((item) => {
            const isSelected = selected.includes(item.value);
            const isDisabled = !isSelected && atLimit && maxAssignees > 1;

            return (
              <button
                type="button"
                key={item.value}
                onClick={() => onToggle(item.value)}
                className={cn(
                  "group relative flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border p-3 active:scale-[0.97]",
                  isSelected
                    ? "border border-primary bg-primary/10 hover:bg-primary/15"
                    : "hover:border-input hover:bg-muted",
                  isDisabled && "cursor-not-allowed opacity-40",
                )}
              >
                <AvatarRoot
                  className={cn(
                    "size-10 shrink-0 rounded-full border font-medium text-sm",
                    isSelected
                      ? "border-primary"
                      : "border opacity-70 grayscale group-hover:border-input group-hover:opacity-100 group-hover:grayscale-0",
                  )}
                >
                  <AvatarImage
                    src={item.user.avatarUrl ?? undefined}
                    alt={item.user.name}
                  />
                  <AvatarFallback className="bg-background text-xs">
                    {item.user.name?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </AvatarRoot>

                <span className="w-full truncate text-center text-muted-foreground text-xs group-hover:text-foreground">
                  {item.user.name?.split(" ")[0]}
                </span>

                <span
                  className={cn(
                    "absolute top-1.5 right-1.5 flex size-4 items-center justify-center rounded-full",
                    isSelected
                      ? "bg-primary text-white dark:text-black"
                      : "bg-input opacity-0 group-hover:opacity-40",
                  )}
                >
                  <CheckIcon className="size-2.5" />
                </span>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="h-56 max-h-80 overflow-y-auto rounded-md">
      <div className="flex flex-col divide-y rounded-md border border-input">
        {items.map((item, index) => {
          const isSelected = selected.includes(item.value);
          const isDisabled = !isSelected && atLimit && maxAssignees > 1;

          return (
            <button
              type="button"
              key={item.value}
              onClick={() => onToggle(item.value)}
              className={cn(
                "group flex cursor-pointer items-center gap-3 px-3 py-2",
                index === 0 && "rounded-t",
                index === items.length - 1 && "rounded-b",
                isSelected
                  ? "bg-primary/10 hover:bg-primary/15"
                  : "hover:bg-muted",
                isDisabled && "cursor-not-allowed opacity-40",
              )}
            >
              <AvatarRoot
                className={cn(
                  "size-6 shrink-0 rounded-full border font-medium text-sm",
                  isSelected
                    ? "border-primary"
                    : "border opacity-70 grayscale group-hover:border-input group-hover:opacity-100 group-hover:grayscale-0",
                )}
              >
                <AvatarImage
                  src={item.user.avatarUrl ?? undefined}
                  alt={item.user.name}
                />
                <AvatarFallback className="bg-background text-xs">
                  {item.user.name?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </AvatarRoot>

              <span className="w-full truncate text-left text-muted-foreground text-xs hover:text-foreground">
                {item.user.name}
              </span>

              <div
                className={cn(
                  "flex size-4 shrink-0 items-center justify-center rounded-md",
                  isSelected
                    ? "bg-primary text-white"
                    : "border bg-transparent opacity-0 group-hover:border-input group-hover:opacity-100",
                )}
              >
                {isSelected && <CheckIcon className="size-2.5" />}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
