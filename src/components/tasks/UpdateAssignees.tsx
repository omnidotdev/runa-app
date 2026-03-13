import { useFilter, useListCollection } from "@ark-ui/react";
import { useQuery } from "@tanstack/react-query";
import { useLoaderData, useRouteContext } from "@tanstack/react-router";
import { LayoutGridIcon, ListIcon, SearchIcon } from "lucide-react";

import { taskFormDefaults } from "@/lib/constants/taskFormDefaults";
import useCookieState from "@/lib/hooks/useCookieState";
import { withForm } from "@/lib/hooks/useForm";
import organizationMembersOptions from "@/lib/options/organizationMembers.options";
import { cn } from "@/lib/utils";
import { Input } from "../ui/input";
import AssigneeList from "./AssigneeList";

export interface WorkspaceUser {
  label: string;
  value: string;
  user: {
    name: string;
    avatarUrl?: string | null;
  };
}

type ViewMode = "grid" | "list";

const UpdateAssignees = withForm({
  defaultValues: taskFormDefaults,
  props: {
    maxAssignees: 1 as number,
  },
  render: ({ form, maxAssignees }) => {
    const { organizationId } = useLoaderData({ from: "/_app" });
    const { session } = useRouteContext({ from: "/_app" });
    const { contains } = useFilter({ sensitivity: "base" });

    const [viewMode, setViewMode] = useCookieState<ViewMode>(
      "assignee-view-mode",
      "grid",
    );

    const { data: membersData } = useQuery({
      ...organizationMembersOptions({
        organizationId: organizationId!,
        accessToken: session?.accessToken!,
      }),
      enabled: !!organizationId && !!session?.accessToken,
    });

    const members = membersData?.data ?? [];

    const { collection: usersCollection, filter } =
      useListCollection<WorkspaceUser>({
        initialItems: members.map((member) => ({
          label: member.user.name,
          value: member.userId,
          user: {
            name: member.user.name,
            avatarUrl: member.user.image,
          },
        })),
        filter: contains,
      });

    return (
      <form.Field name="assignees">
        {(field) => {
          const selected: string[] = field.state.value ?? [];
          const selectedSet = new Set(selected);
          const atLimit = selected.length >= maxAssignees;

          // Sort items so that selected users appear first
          const sortedItems = [...usersCollection.items].sort((a, b) => {
            const aVal = selectedSet.has(a.value) ? 0 : 1;
            const bVal = selectedSet.has(b.value) ? 0 : 1;
            return aVal - bVal;
          });

          const handleToggle = (userId: string) => {
            const isSelected = selected.includes(userId);

            if (isSelected) {
              field.setValue(selected.filter((id) => id !== userId));
            } else if (maxAssignees === 1) {
              field.setValue([userId]);
            } else if (!atLimit) {
              field.pushValue(userId);
            }
          };

          // const handleToggle = (userId: string) => {
          //   const isSelected = selected.includes(userId);
          //   if (isSelected) {
          //     field.setValue(selected.filter((id) => id !== userId));
          //   } else {
          //     field.pushValue(userId);
          //   }
          // };

          return (
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <SearchIcon className="pointer-events-none absolute top-1/2 left-2 size-4 -translate-y-1/2 text-base-400" />
                  <Input
                    placeholder="Filter members…"
                    className="h-8 pl-8 text-sm shadow-none"
                    onChange={(e) => filter(e.currentTarget.value)}
                  />
                </div>

                <div className="flex items-center rounded-lg border border-base-200 p-0.5 dark:border-base-700">
                  <button
                    type="button"
                    onClick={() => setViewMode("grid")}
                    className={cn(
                      "rounded-md p-1.5",
                      viewMode === "grid"
                        ? "bg-base-100 text-base-900 dark:bg-base-800 dark:text-base-100"
                        : "text-base-400 hover:text-base-600 dark:text-base-500 dark:hover:text-base-300",
                    )}
                  >
                    <LayoutGridIcon className="size-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode("list")}
                    className={cn(
                      "rounded-md p-1.5",
                      viewMode === "list"
                        ? "bg-base-100 text-base-900 dark:bg-base-800 dark:text-base-100"
                        : "text-base-400 hover:text-base-600 dark:text-base-500 dark:hover:text-base-300",
                    )}
                  >
                    <ListIcon className="size-3.5" />
                  </button>
                </div>
              </div>

              {sortedItems.length === 0 ? (
                <p className="py-6 text-center text-base-400 text-xs">
                  No members found
                </p>
              ) : (
                <AssigneeList
                  viewMode={viewMode}
                  items={sortedItems}
                  selected={selected}
                  atLimit={atLimit}
                  maxAssignees={maxAssignees}
                  onToggle={handleToggle}
                />
              )}

              {/* Show a hint when at limit on multi-assignee tiers */}
              {atLimit && maxAssignees > 1 && maxAssignees < Infinity && (
                <p className="text-base-400 text-xs">
                  Max {maxAssignees} assignees reached — deselect someone to
                  swap.
                </p>
              )}
            </div>
          );
        }}
      </form.Field>
    );
  },
});

export default UpdateAssignees;
