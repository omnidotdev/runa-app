import { useMenu } from "@ark-ui/react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useLoaderData, useNavigate, useSearch } from "@tanstack/react-router";
import {
  CircleAlertIcon,
  FunnelXIcon,
  ListFilter,
  TagIcon,
  UserPlusIcon,
} from "lucide-react";
import { useRef, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";

import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  MenuCheckboxItem,
  MenuContent,
  MenuItem,
  MenuItemGroup,
  MenuItemGroupLabel,
  MenuItemIndicator,
  MenuItemText,
  MenuPositioner,
  MenuProvider,
  MenuRoot,
  MenuSeparator,
  MenuTrigger,
  MenuTriggerItem,
} from "@/components/ui/menu";
import { SidebarMenuShortcut } from "@/components/ui/sidebar";
import { Tooltip } from "@/components/ui/tooltip";
import { Hotkeys } from "@/lib/constants/hotkeys";
import projectOptions from "@/lib/options/project.options";
import workspaceUsersOptions from "@/lib/options/workspaceUsers.options";
import { cn } from "@/lib/utils";

const Filter = () => {
  const { workspaceId, projectId } = useLoaderData({
    from: "/_auth/workspaces/$workspaceSlug/projects/$projectSlug/",
  });

  const { assignees, labels, priorities } = useSearch({
    from: "/_auth/workspaces/$workspaceSlug/projects/$projectSlug/",
  });

  const navigate = useNavigate({
    from: "/workspaces/$workspaceSlug/projects/$projectSlug",
  });

  const menuButtonRef = useRef<HTMLButtonElement | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const { data: project } = useSuspenseQuery({
    ...projectOptions({ rowId: projectId }),
    select: (data) => data?.project,
  });

  const { data: users } = useSuspenseQuery({
    ...workspaceUsersOptions({ workspaceId: workspaceId }),
    select: (data) => data?.workspaceUsers?.nodes.flatMap((user) => user?.user),
  });

  useHotkeys(Hotkeys.ToggleFilter, () => setIsFilterOpen(!isFilterOpen), [
    isFilterOpen,
  ]);

  const areFiltersActive =
    assignees.length > 0 || labels.length > 0 || priorities.length > 0;

  const labelsMenu = useMenu({
    positioning: { placement: "right-start" },
    closeOnSelect: false,
    onOpenChange: ({ open }) => {
      if (open) {
        assigneesMenu.api.setOpen(false);
        prioritiesMenu.api.setOpen(false);
      }
    },
  });
  const assigneesMenu = useMenu({
    positioning: { placement: "right-start" },
    closeOnSelect: false,
    onOpenChange: ({ open }) => {
      if (open) {
        labelsMenu.api.setOpen(false);
        prioritiesMenu.api.setOpen(false);
      }
    },
  });
  const prioritiesMenu = useMenu({
    positioning: { placement: "right-start" },
    closeOnSelect: false,
    onOpenChange: ({ open }) => {
      if (open) {
        labelsMenu.api.setOpen(false);
        assigneesMenu.api.setOpen(false);
      }
    },
  });

  const clearAllFilters = () => {
    navigate({
      search: (prev) => ({
        ...prev,
        assignees: [],
        labels: [],
        priorities: [],
      }),
    });
  };

  return (
    <MenuRoot
      positioning={{
        strategy: "fixed",
        placement: "bottom",
        getAnchorRect: () =>
          menuButtonRef.current?.getBoundingClientRect() ?? null,
      }}
      open={isFilterOpen}
      onOpenChange={({ open }) => {
        setIsFilterOpen(open);
      }}
    >
      <Tooltip
        positioning={{ placement: "bottom" }}
        tooltip="Filter"
        shortcut="F"
      >
        <MenuTrigger ref={menuButtonRef} asChild>
          <Button variant="outline" size="icon">
            <ListFilter />
          </Button>
        </MenuTrigger>
      </Tooltip>

      <MenuPositioner>
        <MenuContent className="w-48 p-0">
          <MenuItemGroup>
            <MenuItemGroupLabel>
              Filter <SidebarMenuShortcut>F</SidebarMenuShortcut>
            </MenuItemGroupLabel>

            <MenuSeparator />

            <div className="mt-1 flex flex-col gap-0.5">
              <MenuProvider value={labelsMenu}>
                <MenuTriggerItem>
                  <TagIcon />
                  Labels
                </MenuTriggerItem>

                <MenuPositioner>
                  <MenuContent className="w-48">
                    {project?.labels?.nodes?.map((label) => (
                      <MenuCheckboxItem
                        key={label.rowId}
                        closeOnSelect={false}
                        value={label.rowId}
                        checked={labels.includes(label.rowId)}
                        onCheckedChange={(checked) => {
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
                        <MenuItemText className="flex items-center gap-2">
                          <div
                            className="size-4 rounded-full"
                            style={{ backgroundColor: label.color }}
                          />
                          {label.name}
                        </MenuItemText>
                        <MenuItemIndicator />
                      </MenuCheckboxItem>
                    ))}
                  </MenuContent>
                </MenuPositioner>
              </MenuProvider>

              <MenuProvider value={assigneesMenu}>
                <MenuTriggerItem>
                  <UserPlusIcon />
                  Assignees
                </MenuTriggerItem>

                <MenuPositioner>
                  <MenuContent className="w-48">
                    {users?.map((user) => (
                      <MenuCheckboxItem
                        key={user?.rowId}
                        closeOnSelect={false}
                        value={user?.rowId!}
                        checked={assignees.includes(user?.rowId!)}
                        onCheckedChange={(checked) => {
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
                        <MenuItemText className="ml-0 flex items-center gap-2">
                          <div className="flex h-6 items-center">
                            <Avatar
                              src={user?.avatarUrl ?? undefined}
                              alt={user?.name}
                              fallback={user?.name?.charAt(0)}
                              className="size-4 rounded-full"
                            />
                          </div>
                          <p className="-ml-2 font-light text-sm">
                            {user?.name}
                          </p>
                        </MenuItemText>
                        <MenuItemIndicator />
                      </MenuCheckboxItem>
                    ))}
                  </MenuContent>
                </MenuPositioner>
              </MenuProvider>

              <MenuProvider value={prioritiesMenu}>
                <MenuTriggerItem>
                  <CircleAlertIcon />
                  Priorities
                </MenuTriggerItem>

                <MenuPositioner>
                  <MenuContent className="w-48">
                    {(["low", "medium", "high"] as const).map((priority) => (
                      <MenuCheckboxItem
                        key={priority}
                        closeOnSelect={false}
                        value={priority}
                        checked={priorities.includes(priority)}
                        onCheckedChange={(checked) => {
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
                        <MenuItemText className="ml-0 flex items-center gap-2">
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
                        </MenuItemText>
                        <MenuItemIndicator />
                      </MenuCheckboxItem>
                    ))}
                  </MenuContent>
                </MenuPositioner>
              </MenuProvider>

              <MenuItem
                value="clear"
                onClick={clearAllFilters}
                disabled={!areFiltersActive}
              >
                <FunnelXIcon />
                Clear
              </MenuItem>
            </div>
          </MenuItemGroup>
        </MenuContent>
      </MenuPositioner>
    </MenuRoot>
  );
};

export default Filter;
