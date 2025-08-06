import { useSuspenseQuery } from "@tanstack/react-query";
import {
  useLoaderData,
  useNavigate,
  useRouteContext,
  useSearch,
} from "@tanstack/react-router";
import {
  AlignJustifyIcon,
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
  MenuRoot,
  MenuSeparator,
  MenuTrigger,
  MenuTriggerItem,
} from "@/components/ui/menu";
import { SidebarMenuShortcut } from "@/components/ui/sidebar";
import { Tooltip } from "@/components/ui/tooltip";
import { useUpdateUserPreferenceMutation } from "@/generated/graphql";
import { Hotkeys } from "@/lib/constants/hotkeys";
import projectOptions from "@/lib/options/project.options";
import userPreferencesOptions from "@/lib/options/userPreferences.options";
import workspaceUsersOptions from "@/lib/options/workspaceUsers.options";
import { cn } from "@/lib/utils";

const Filter = () => {
  const { workspaceId, projectId } = useLoaderData({
    from: "/_auth/workspaces/$workspaceSlug/projects/$projectSlug/",
  });

  const { session } = useRouteContext({
    from: "/_auth/workspaces/$workspaceSlug/projects/$projectSlug/",
  });

  const { assignees, labels, priorities } = useSearch({
    from: "/_auth/workspaces/$workspaceSlug/projects/$projectSlug/",
  });

  const navigate = useNavigate({
    from: "/workspaces/$workspaceSlug/projects/$projectSlug",
  });

  const popoverButtonRef = useRef<HTMLButtonElement | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const { data: project } = useSuspenseQuery({
    ...projectOptions({ rowId: projectId }),
    select: (data) => data?.project,
  });

  const { data: users } = useSuspenseQuery({
    ...workspaceUsersOptions({ workspaceId: workspaceId }),
    select: (data) => data?.workspaceUsers?.nodes.flatMap((user) => user?.user),
  });

  const { data: userPreferences } = useSuspenseQuery({
    ...userPreferencesOptions({
      userId: session?.user?.rowId!,
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

  // Determine if any filters are active
  const areFiltersActive =
    assignees.length > 0 ||
    labels.length > 0 ||
    priorities.length > 0 ||
    userHiddenColumns.length > 0;

  // Function to clear all filters
  const clearAllFilters = () => {
    navigate({
      search: (prev) => ({
        ...prev,
        assignees: [],
        labels: [],
        priorities: [],
      }),
    });

    updateUserPreferences({
      rowId: userPreferences?.rowId!,
      patch: {
        hiddenColumnIds: [],
      },
    });
  };

  return (
    <MenuRoot
      positioning={{
        strategy: "fixed",
        placement: "bottom",
        getAnchorRect: () =>
          popoverButtonRef.current?.getBoundingClientRect() ?? null,
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
        <MenuTrigger ref={popoverButtonRef} asChild>
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
              <MenuRoot
                positioning={{ placement: "right-start" }}
                closeOnSelect={false}
              >
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
              </MenuRoot>

              <MenuRoot
                positioning={{ placement: "right-start" }}
                closeOnSelect={false}
              >
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
              </MenuRoot>

              <MenuRoot
                positioning={{ placement: "right-start" }}
                closeOnSelect={false}
              >
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
              </MenuRoot>

              <MenuRoot
                positioning={{ placement: "right-start" }}
                closeOnSelect={false}
              >
                <MenuTriggerItem>
                  <AlignJustifyIcon className="rotate-90" />
                  Columns
                </MenuTriggerItem>

                <MenuPositioner>
                  <MenuContent className="w-48">
                    {project?.columns.nodes.map((column) => {
                      const isHidden = userHiddenColumns.includes(column.rowId);

                      return (
                        <MenuCheckboxItem
                          key={column.rowId}
                          closeOnSelect={false}
                          value={column.rowId}
                          checked={!isHidden} // ✅ checked when visible
                          onCheckedChange={(checked) => {
                            if (checked === false) {
                              // ✅ Checkbox was unchecked → hide column
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
                              // ✅ Checkbox was checked → show column
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
                          <MenuItemText className="ml-0 flex items-center gap-2">
                            <div className="flex items-center gap-2">
                              <p>{column.emoji ?? "😀"}</p>
                              <p className="font-light text-sm first-letter:uppercase">
                                {column.title}
                              </p>
                            </div>
                          </MenuItemText>
                          <MenuItemIndicator />
                        </MenuCheckboxItem>
                      );
                    })}
                    {/* {project?.columns.nodes.map((column) => (
                      <MenuCheckboxItem
                        key={column.rowId}
                        closeOnSelect={false}
                        value={column.rowId}
                        defaultChecked={true}
                        checked={userHiddenColumns.includes(column.rowId)}
                        onCheckedChange={(checked) => {
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
                        <MenuItemText className="ml-0 flex items-center gap-2">
                          <div className="flex items-center gap-2">
                            <p>{column.emoji ?? "😀"}</p>
                            <p className="font-light text-sm first-letter:uppercase">
                              {column.title}
                            </p>
                          </div>
                        </MenuItemText>
                        <MenuItemIndicator />
                      </MenuCheckboxItem>
                    ))} */}
                  </MenuContent>
                </MenuPositioner>
              </MenuRoot>

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
