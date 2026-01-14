import { useMenu } from "@ark-ui/react";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import {
  useLoaderData,
  useNavigate,
  useRouteContext,
  useSearch,
} from "@tanstack/react-router";
import {
  CircleAlertIcon,
  FunnelXIcon,
  ListFilter,
  TagIcon,
  UserPlusIcon,
} from "lucide-react";
import { useId, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";

import { Shortcut, Tooltip } from "@/components/core";
import {
  AvatarFallback,
  AvatarImage,
  AvatarRoot,
} from "@/components/ui/avatar";
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
  MenuTrigger,
  MenuTriggerItem,
} from "@/components/ui/menu";
import { Hotkeys } from "@/lib/constants/hotkeys";
import organizationMembersOptions from "@/lib/options/organizationMembers.options";
import projectOptions from "@/lib/options/project.options";
import { cn } from "@/lib/utils";

const Filter = () => {
  const { organizationId, projectId } = useLoaderData({
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

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const triggerId = useId();

  const { data: project } = useSuspenseQuery({
    ...projectOptions({ rowId: projectId }),
    select: (data) => data?.project,
  });

  // Fetch organization members from IDP
  const { data: membersData } = useQuery({
    ...organizationMembersOptions({
      organizationId: organizationId!,
      accessToken: session?.accessToken!,
    }),
    enabled: !!organizationId && !!session?.accessToken,
  });

  const users = membersData?.members ?? [];

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
      open={isFilterOpen}
      onOpenChange={({ open }) => setIsFilterOpen(open)}
      ids={{ trigger: triggerId }}
    >
      <Tooltip
        ids={{ trigger: triggerId }}
        tooltip="Filter"
        shortcut={Hotkeys.ToggleFilter}
        trigger={
          <MenuTrigger asChild>
            <Button variant="outline" size="icon">
              <ListFilter />
            </Button>
          </MenuTrigger>
        }
      />

      <MenuPositioner>
        <MenuContent className="w-48 p-0">
          <MenuItemGroup>
            <MenuItemGroupLabel className="border-b">
              Filter <Shortcut>{Hotkeys.ToggleFilter}</Shortcut>
            </MenuItemGroupLabel>

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
                    {users.map((member) => (
                      <MenuCheckboxItem
                        key={member.userId}
                        closeOnSelect={false}
                        value={member.userId}
                        checked={assignees.includes(member.userId)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            navigate({
                              search: (prev) => ({
                                ...prev,
                                assignees: [
                                  ...(prev.assignees ?? []),
                                  member.userId,
                                ],
                              }),
                            });
                          } else {
                            navigate({
                              search: (prev) => ({
                                ...prev,
                                assignees: prev.assignees?.filter(
                                  (id) => id !== member.userId,
                                ),
                              }),
                            });
                          }
                        }}
                      >
                        <MenuItemText className="ml-0 flex items-center gap-2">
                          <div className="flex h-6 items-center">
                            <AvatarRoot className="size-4 rounded-full">
                              <AvatarImage
                                src={member.user.image ?? undefined}
                                alt={member.user.name}
                              />
                              <AvatarFallback>
                                {member.user.name?.charAt(0)}
                              </AvatarFallback>
                            </AvatarRoot>
                          </div>
                          <p className="-ml-2 font-light text-sm">
                            {member.user.name}
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
