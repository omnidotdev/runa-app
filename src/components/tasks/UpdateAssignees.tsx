import { useFilter, useListCollection } from "@ark-ui/react";
import { useQuery } from "@tanstack/react-query";
import { useLoaderData, useRouteContext } from "@tanstack/react-router";
import { LayoutGridIcon, ListIcon, SearchIcon } from "lucide-react";

import { taskFormDefaults } from "@/lib/constants/taskFormDefaults";
import useCookieState from "@/lib/hooks/useCookieState";
import { withForm } from "@/lib/hooks/useForm";
import organizationMembersOptions from "@/lib/options/organizationMembers.options";
import { cn } from "@/lib/utils";
import Tooltip from "../core/Tooltip";
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
    initialAssignees: [] as string[] | undefined,
  },
  render: ({ form, maxAssignees, initialAssignees }) => {
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
          const atLimit = selected.length >= maxAssignees;

          const initialSet = new Set(initialAssignees);

          const sortedItems = [...usersCollection.items].sort((a, b) => {
            const aAssigned = initialSet.has(a.value) ? 0 : 1;
            const bAssigned = initialSet.has(b.value) ? 0 : 1;
            if (aAssigned !== bAssigned) return aAssigned - bAssigned;
            return a.label.localeCompare(b.label);
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

          return (
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <SearchIcon className="pointer-events-none absolute top-1/2 left-2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Filter members…"
                    className="h-8 pl-8 text-sm shadow-none"
                    onChange={(e) => filter(e.currentTarget.value)}
                  />
                </div>

                <div className="flex items-center gap-1 rounded-md border border-input p-0.5">
                  <Tooltip
                    tooltip="Grid view"
                    trigger={
                      <button
                        type="button"
                        onClick={() => setViewMode("grid")}
                        className={cn(
                          "rounded-md p-1.5",
                          viewMode === "grid"
                            ? "bg-accent"
                            : "text-muted-foreground hover:text-foreground",
                        )}
                      >
                        <LayoutGridIcon className="size-3.5" />
                      </button>
                    }
                  />

                  <Tooltip
                    tooltip="List view"
                    trigger={
                      <button
                        type="button"
                        onClick={() => setViewMode("list")}
                        className={cn(
                          "rounded-md p-1.5",
                          viewMode === "list"
                            ? "bg-accent"
                            : "text-muted-foreground hover:text-foreground",
                        )}
                      >
                        <ListIcon className="size-3.5" />
                      </button>
                    }
                  />
                </div>
              </div>

              {sortedItems.length === 0 ? (
                <p className="py-6 text-center text-xs">No members found</p>
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
                <p className="text-muted-foreground text-xs">
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
