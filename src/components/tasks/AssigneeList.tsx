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
      <div className="max-h-80 overflow-y-auto rounded-lg">
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
                  "group relative flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border p-3",
                  isSelected
                    ? "bg-primary/5 hover:bg-primary/10"
                    : "bg-transparent hover:bg-base-50 dark:hover:bg-base-900",
                  isDisabled &&
                    "pointer-events-none cursor-not-allowed opacity-40",
                )}
              >
                <AvatarRoot
                  className={cn(
                    "size-9 shrink-0 rounded-full border-2 font-medium text-sm",
                    isSelected
                      ? "border-primary/50"
                      : "border-base-200 opacity-70 grayscale group-hover:border-base-300 group-hover:opacity-100 group-hover:grayscale-0 dark:border-base-700 dark:group-hover:border-base-600",
                  )}
                >
                  <AvatarImage
                    src={item.user.avatarUrl ?? undefined}
                    alt={item.user.name}
                  />
                  <AvatarFallback className="bg-base-100 text-xs dark:bg-base-800">
                    {item.user.name?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </AvatarRoot>

                <span
                  className={cn(
                    "w-full truncate text-center font-medium text-xs",
                    isSelected
                      ? "text-base-900 dark:text-base-100"
                      : "text-base-500 group-hover:text-base-700 dark:text-base-400 dark:group-hover:text-base-200",
                  )}
                >
                  {item.user.name?.split(" ")[0]}
                </span>

                <span
                  className={cn(
                    "absolute top-1.5 right-1.5 flex size-4 items-center justify-center rounded-full",
                    isSelected
                      ? "bg-primary text-white"
                      : "bg-base-200 opacity-0 group-hover:opacity-40 dark:bg-base-700",
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
    <div className="max-h-80 overflow-y-auto rounded-xl border border-base-200 dark:border-base-700">
      <div className="flex flex-col">
        {items.map((item, index) => {
          const isSelected = selected.includes(item.value);
          const isDisabled = !isSelected && atLimit && maxAssignees > 1;

          return (
            <button
              type="button"
              key={item.value}
              onClick={() => onToggle(item.value)}
              className={cn(
                "group flex cursor-pointer items-center gap-3 px-3 py-2.5",
                index !== 0 && "border-base-100 border-t dark:border-base-800",
                isSelected
                  ? "bg-primary/5 hover:bg-primary/10"
                  : "bg-transparent hover:bg-base-50 dark:hover:bg-base-900",
                isDisabled &&
                  "pointer-events-none cursor-not-allowed opacity-40",
              )}
            >
              <AvatarRoot
                className={cn(
                  "size-9 shrink-0 rounded-full border-2 font-medium text-sm",
                  isSelected
                    ? "border-primary/50"
                    : "border-base-200 opacity-70 grayscale group-hover:border-base-300 group-hover:opacity-100 group-hover:grayscale-0 dark:border-base-700 dark:group-hover:border-base-600",
                )}
              >
                <AvatarImage
                  src={item.user.avatarUrl ?? undefined}
                  alt={item.user.name}
                />
                <AvatarFallback className="bg-base-100 text-xs dark:bg-base-800">
                  {item.user.name?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </AvatarRoot>

              <span
                className={cn(
                  "flex-1 truncate text-left font-medium text-sm",
                  isSelected
                    ? "text-base-900 dark:text-base-100"
                    : "text-base-500 group-hover:text-base-700 dark:text-base-400 dark:group-hover:text-base-200",
                )}
              >
                {item.user.name}
              </span>

              <div
                className={cn(
                  "flex size-5 shrink-0 items-center justify-center rounded-md",
                  isSelected
                    ? "bg-primary text-white"
                    : "border border-base-300 bg-transparent group-hover:border-base-400 dark:border-base-600 dark:group-hover:border-base-500",
                )}
              >
                {isSelected && <CheckIcon className="size-3" />}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
