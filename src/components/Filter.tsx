import { useSuspenseQuery } from "@tanstack/react-query";
import { useNavigate, useParams, useSearch } from "@tanstack/react-router";
import {
  AlignJustifyIcon,
  CheckIcon,
  ChevronRight,
  CircleAlertIcon,
  ListFilter,
  TagIcon,
  UserPlusIcon,
} from "lucide-react";
import { useRef, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";

import { Avatar } from "@/components/ui/avatar";
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
import { SidebarMenuShortcut } from "@/components/ui/sidebar";
import { Tooltip } from "@/components/ui/tooltip";
import { useUpdateUserPreferenceMutation } from "@/generated/graphql";
import { Hotkeys } from "@/lib/constants/hotkeys";
import { labelColors } from "@/lib/constants/labelColors";
import projectOptions from "@/lib/options/project.options";
import userPreferencesOptions from "@/lib/options/userPreferences.options";
import workspaceUsersOptions from "@/lib/options/workspaceUsers.options";
import { cn } from "@/lib/utils";

const Filter = () => {
  const { workspaceId, projectId } = useParams({
    from: "/_auth/workspaces/$workspaceId/projects/$projectId/",
  });

  const { assignees, labels, priorities } = useSearch({
    from: "/_auth/workspaces/$workspaceId/projects/$projectId/",
  });

  const navigate = useNavigate({
    from: "/workspaces/$workspaceId/projects/$projectId",
  });

  const popoverButtonRef = useRef<HTMLButtonElement | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const { data: project } = useSuspenseQuery({
    ...projectOptions({ rowId: projectId }),
    select: (data) => data?.project,
  });

  const { data: users } = useSuspenseQuery({
    ...workspaceUsersOptions({ rowId: workspaceId }),
    select: (data) => data?.workspaceUsers?.nodes.flatMap((user) => user?.user),
  });

  const { data: userPreferences } = useSuspenseQuery({
    ...userPreferencesOptions({
      userId: "024bec7c-5822-4b34-f993-39cbc613e1c9",
      projectId,
    }),
    select: (data) => data?.userPreferenceByUserIdAndProjectId,
  });

  const userHiddenColumns = userPreferences?.hiddenColumnIds ?? [];

  const { mutate: updateUserPreferences } = useUpdateUserPreferenceMutation({
    meta: {
      invalidates: [["all"]],
    },
  });

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
                <SidebarMenuShortcut>F</SidebarMenuShortcut>
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
            <SidebarMenuShortcut>F</SidebarMenuShortcut>
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
                  {project?.labels?.nodes?.map((label) => (
                    <CheckboxRoot
                      key={label.rowId}
                      className="group flex cursor-pointer items-center justify-between p-0.5"
                      checked={labels.includes(label.rowId)}
                      onCheckedChange={({ checked }) => {
                        if (checked) {
                          navigate({
                            search: (prev) => ({
                              ...prev,
                              labels: [...(prev.labels ?? []), label.rowId],
                            }),
                          });
                        } else {
                          navigate({
                            search: (prev) => ({
                              ...prev,
                              labels: prev.labels?.filter(
                                (id) => id !== label.rowId,
                              ),
                            }),
                          });
                        }
                      }}
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
                      <CheckboxControl>
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
              <PopoverTrigger className="flex w-full cursor-pointer justify-between border-b px-3 py-2">
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
                      key={user?.rowId}
                      className="group flex cursor-pointer items-center justify-between p-0.5"
                      checked={assignees.includes(user?.rowId!)}
                      onCheckedChange={({ checked }) => {
                        if (checked) {
                          navigate({
                            search: (prev) => ({
                              ...prev,
                              assignees: [
                                ...(prev.assignees ?? []),
                                user?.rowId!,
                              ],
                            }),
                          });
                        } else {
                          navigate({
                            search: (prev) => ({
                              ...prev,
                              assignees: prev.assignees?.filter(
                                (id) => id !== user?.rowId!,
                              ),
                            }),
                          });
                        }
                      }}
                    >
                      <CheckboxLabel className="-ml-2 flex h-8 items-center gap-2">
                        <Avatar
                          src={user?.avatarUrl ?? undefined}
                          alt={user?.name}
                          fallback={user?.name?.charAt(0)}
                          className="size-6 rounded-full"
                        />
                        <p className="-ml-2 font-light text-sm">{user?.name}</p>
                      </CheckboxLabel>
                      <CheckboxHiddenInput />
                      <CheckboxControl>
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
              <PopoverTrigger className="flex w-full cursor-pointer justify-between border-b px-3 py-2">
                <div className="flex items-center gap-2">
                  <CircleAlertIcon className="size-4" />
                  <p>Priorities</p>
                </div>
                <ChevronRight className="h-4 w-4" />
              </PopoverTrigger>
              <PopoverPositioner>
                <PopoverContent className="flex w-48 flex-col gap-2 p-2">
                  {(["low", "medium", "high"] as const).map((priority) => (
                    <CheckboxRoot
                      key={priority}
                      className="group flex cursor-pointer items-center justify-between p-0.5"
                      checked={priorities.includes(priority)}
                      onCheckedChange={({ checked }) => {
                        if (checked) {
                          navigate({
                            search: (prev) => ({
                              ...prev,
                              priorities: [
                                ...(prev.priorities ?? []),
                                priority,
                              ],
                            }),
                          });
                        } else {
                          navigate({
                            search: (prev) => ({
                              ...prev,
                              priorities: prev.priorities?.filter(
                                (p) => p !== priority,
                              ),
                            }),
                          });
                        }
                      }}
                    >
                      <CheckboxLabel className="ml-0 flex items-center gap-2">
                        <div
                          className={cn(
                            "size-4 rounded-full",
                            priority === "high" && "bg-red-500",
                            priority === "medium" && "bg-yellow-500",
                            priority === "low" && "bg-green-500",
                          )}
                        />
                        <p className="font-light text-sm first-letter:uppercase">
                          {priority}
                        </p>
                      </CheckboxLabel>
                      <CheckboxHiddenInput />
                      <CheckboxControl>
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
              <PopoverTrigger className="flex w-full cursor-pointer justify-between border-b px-3 py-2">
                <div className="flex items-center gap-2">
                  <AlignJustifyIcon className="size-4 rotate-90" />
                  <p>Hidden Columns</p>
                </div>
                <ChevronRight className="h-4 w-4" />
              </PopoverTrigger>
              <PopoverPositioner>
                <PopoverContent className="flex w-48 flex-col gap-2 p-2">
                  {project?.columns.nodes.map((column) => (
                    <CheckboxRoot
                      key={column.rowId}
                      className="group flex cursor-pointer items-center justify-between p-0.5"
                      checked={userHiddenColumns.includes(column.rowId)}
                      onCheckedChange={({ checked }) => {
                        if (checked) {
                          updateUserPreferences({
                            rowId: userPreferences?.rowId!,
                            patch: {
                              hiddenColumnIds: [
                                ...userHiddenColumns,
                                column.rowId,
                              ],
                            },
                          });
                        } else {
                          updateUserPreferences({
                            rowId: userPreferences?.rowId!,
                            patch: {
                              hiddenColumnIds: userHiddenColumns.filter(
                                (id) => id !== column.rowId,
                              ),
                            },
                          });
                        }
                      }}
                    >
                      <CheckboxLabel className="ml-0 flex items-center gap-2">
                        <div className="flex items-center gap-2">
                          <p>{column.emoji ?? "😀"}</p>
                          <p className="font-light text-sm first-letter:uppercase">
                            {column.title}
                          </p>
                        </div>
                      </CheckboxLabel>
                      <CheckboxHiddenInput />
                      <CheckboxControl>
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
