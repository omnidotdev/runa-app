import { useSuspenseQuery } from "@tanstack/react-query";
import { useParams } from "@tanstack/react-router";
import {
  CheckIcon,
  ChevronRight,
  ListFilter,
  TagIcon,
  UserPlusIcon,
} from "lucide-react";
import { useRef, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";

import { Button } from "@/components/ui/button";
import {
  CheckboxControl,
  CheckboxHiddenInput,
  CheckboxIndicator,
  CheckboxLabel,
  CheckboxRoot,
} from "@/components/ui/checkbox";
import {
  PopoverContent,
  PopoverPositioner,
  PopoverRoot,
  PopoverTrigger,
} from "@/components/ui/popover";
import { SidebarMenuShotcut } from "@/components/ui/sidebar";
import { Tooltip } from "@/components/ui/tooltip";
import { Hotkeys } from "@/lib/constants/hotkeys";
import { labelColors } from "@/lib/constants/labelColors";
import projectOptions from "@/lib/options/project.options";
import workspaceUsersOptions from "@/lib/options/workspaceUsers.options";
import { cn } from "@/lib/utils";
import { Avatar } from "./ui/avatar";

const Filter = () => {
  const { projectId } = useParams({
    from: "/_auth/workspaces/$workspaceId/projects/$projectId/",
  });
  const { workspaceId } = useParams({
    from: "/_auth/workspaces/$workspaceId/projects/$projectId/",
  });

  const popoverButtonRef = useRef<HTMLButtonElement | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  // TODO: Hook up filters with board and list view
  const [selectedLabels, setSelectedLabels] = useState<string[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  const { data: project } = useSuspenseQuery({
    ...projectOptions({ rowId: projectId }),
    select: (data) => data?.project,
  });

  const { data: users } = useSuspenseQuery({
    ...workspaceUsersOptions({ rowId: workspaceId }),
    select: (data) => data?.workspaceUsers?.nodes.flatMap((user) => user?.user),
  });

  const projectLabels: { name: string; color: string; checked: boolean }[] =
    project?.labels?.map((label: { name: string; color: string }) => ({
      ...label,
      checked: false,
    })) ?? [];

  useHotkeys(Hotkeys.ToggleFilter, () => setIsFilterOpen(!isFilterOpen), [
    isFilterOpen,
  ]);

  return (
    <PopoverRoot
      positioning={{
        strategy: "fixed",
        placement: "bottom",
        getAnchorRect: () =>
          popoverButtonRef.current?.getBoundingClientRect() ?? null,
      }}
      open={isFilterOpen}
      onOpenChange={({ open }) => setIsFilterOpen(open)}
    >
      <Tooltip
        positioning={{ placement: "bottom" }}
        tooltip={{
          className: "bg-background text-foreground border",
          children: (
            <div className="inline-flex">
              Filter
              <div className="ml-2 flex items-center gap-0.5">
                <SidebarMenuShotcut>F</SidebarMenuShotcut>
              </div>
            </div>
          ),
        }}
      >
        <PopoverTrigger ref={popoverButtonRef} asChild>
          <Button variant="outline" size="icon">
            <ListFilter />
          </Button>
        </PopoverTrigger>
      </Tooltip>
      <PopoverPositioner>
        <PopoverContent className="p-0">
          <div className="inline-flex w-full items-center justify-between border-b p-2">
            <p className="text-base-500 text-sm">Filter</p>
            <SidebarMenuShotcut>F</SidebarMenuShotcut>
          </div>

          <div>
            <PopoverRoot positioning={{ placement: "right-start" }}>
              <PopoverTrigger className="flex w-full cursor-pointer justify-between border-b px-3 py-2">
                <div className="flex items-center gap-2">
                  <TagIcon className="size-4" />
                  <p>Labels</p>
                </div>
                <ChevronRight className="h-4 w-4" />
              </PopoverTrigger>
              <PopoverPositioner>
                <PopoverContent className="flex w-48 flex-col gap-2 p-2">
                  {projectLabels.map((label) => (
                    <CheckboxRoot
                      key={label.name}
                      className="group flex cursor-pointer items-center justify-between p-0.5"
                      checked={selectedLabels.includes(label.name)}
                      onCheckedChange={({ checked }) =>
                        setSelectedLabels((prev) => {
                          if (checked) {
                            return [...prev, label.name];
                          } else {
                            return prev.filter((l) => l !== label.name);
                          }
                        })
                      }
                    >
                      <CheckboxLabel className="ml-0 flex items-center gap-2">
                        <div
                          className={cn(
                            "size-4 rounded-full",
                            labelColors.find(
                              (l) => l.name.toLowerCase() === label.color,
                            )?.classes,
                          )}
                        />
                        <p className="font-light text-sm">{label.name}</p>
                      </CheckboxLabel>
                      <CheckboxHiddenInput />
                      <CheckboxControl
                        className={cn(
                          "hidden group-hover:flex",
                          selectedLabels.includes(label.name) ? "flex" : "",
                        )}
                      >
                        <CheckboxIndicator>
                          <CheckIcon className="size-4" />
                        </CheckboxIndicator>
                      </CheckboxControl>
                    </CheckboxRoot>
                  ))}
                </PopoverContent>
              </PopoverPositioner>
            </PopoverRoot>

            <PopoverRoot positioning={{ placement: "right-start" }}>
              <PopoverTrigger className="flex w-full cursor-pointer justify-between px-3 py-2">
                <div className="flex items-center gap-2">
                  <UserPlusIcon className="size-4" />
                  <p>Assignees</p>
                </div>
                <ChevronRight className="h-4 w-4" />
              </PopoverTrigger>
              <PopoverPositioner>
                <PopoverContent className="flex w-48 flex-col p-2">
                  {users?.map((user) => (
                    <CheckboxRoot
                      key={user?.name}
                      className="group flex cursor-pointer items-center justify-between p-0.5"
                      checked={selectedUsers.includes(user?.name ?? "")}
                      onCheckedChange={({ checked }) =>
                        setSelectedUsers((prev) => {
                          if (!user?.name) return prev;

                          if (checked) {
                            return [...prev, user?.name];
                          } else {
                            return prev.filter((l) => l !== user.name);
                          }
                        })
                      }
                    >
                      <CheckboxLabel className="-ml-2 flex h-8 items-center gap-2">
                        <Avatar
                          src={user?.avatarUrl!}
                          alt={user?.name}
                          fallback={user?.name?.charAt(0)}
                          className="size-6 rounded-full"
                        />
                        <p className="-ml-2 font-light text-sm">{user?.name}</p>
                      </CheckboxLabel>
                      <CheckboxHiddenInput />
                      <CheckboxControl
                        className={cn(
                          "hidden group-hover:flex",
                          selectedUsers.includes(user?.name ?? "")
                            ? "flex"
                            : "",
                        )}
                      >
                        <CheckboxIndicator>
                          <CheckIcon className="size-4" />
                        </CheckboxIndicator>
                      </CheckboxControl>
                    </CheckboxRoot>
                  ))}
                </PopoverContent>
              </PopoverPositioner>
            </PopoverRoot>
          </div>
        </PopoverContent>
      </PopoverPositioner>
    </PopoverRoot>
  );
};

export default Filter;
