import { useFilter, useListCollection } from "@ark-ui/react";
import {
  AvatarFallback,
  AvatarImage,
  AvatarRoot,
} from "@omnidotdev/thornberry/avatar";
import {
  PopoverContent,
  PopoverPositioner,
  PopoverRoot,
  PopoverTrigger,
} from "@omnidotdev/thornberry/popover";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useLoaderData, useRouteContext } from "@tanstack/react-router";
import { SearchIcon } from "lucide-react";

import { Input } from "@/components/ui/input";
import {
  useCreateAssigneeMutation,
  useDeleteAssigneeMutation,
  useTasksQuery,
} from "@/generated/graphql";
import organizationMembersOptions from "@/lib/options/organizationMembers.options";
import pricesOptions from "@/lib/options/prices.options";
import subscriptionOptions from "@/lib/options/subscription.options";
import taskOptions from "@/lib/options/task.options";
import { getMaxAssignees, getTierFromSubscription } from "@/lib/types/tier";
import getQueryKeyPrefix from "@/lib/util/getQueryKeyPrefix";
import AssigneeLimitNotice from "./AssigneeLimitNotice";
import AssigneeList from "./AssigneeList";
import { PropertyTrigger, PropertyValue } from "./propertyRow";

import type { TaskQuery, TasksQuery } from "@/generated/graphql";
import type { WorkspaceUser } from "./UpdateAssignees";

interface Assignee {
  userId: string;
  user?: {
    identityProviderId?: string | null;
    name?: string | null;
    avatarUrl?: string | null;
  } | null;
}

interface Props {
  taskId: string;
  assignees: Assignee[];
  editable: boolean;
}

const AssigneeAvatars = ({ assignees }: { assignees: Assignee[] }) => (
  <div className="flex -space-x-1.5">
    {assignees.slice(0, 4).map((assignee) => (
      <AvatarRoot
        key={assignee.userId}
        className="size-5 rounded-full border-2 border-background bg-background font-medium text-[10px]"
      >
        <AvatarImage
          src={assignee.user?.avatarUrl ?? undefined}
          alt={assignee.user?.name ?? undefined}
        />
        <AvatarFallback>
          {assignee.user?.name?.charAt(0).toUpperCase()}
        </AvatarFallback>
      </AvatarRoot>
    ))}
  </div>
);

const TriggerContent = ({ assignees }: { assignees: Assignee[] }) => {
  if (!assignees.length) {
    return <span className="text-muted-foreground">Unassigned</span>;
  }

  return (
    <>
      <AssigneeAvatars assignees={assignees} />
      <span className="truncate">
        {assignees.length === 1
          ? assignees[0].user?.name
          : `${assignees.length} assignees`}
      </span>
    </>
  );
};

/** Editing surface, isolated so its hooks never mount in the read-only view. */
const AssigneesEditor = ({
  taskId,
  assignees,
}: {
  taskId: string;
  assignees: Assignee[];
}) => {
  const { organizationId } = useLoaderData({
    from: "/_app/@{$workspaceSlug}",
  });
  const { session } = useRouteContext({ from: "/_app" });
  const { contains } = useFilter({ sensitivity: "base" });

  const { data: membersData } = useQuery({
    ...organizationMembersOptions({
      organizationId: organizationId!,
    }),
    enabled: !!organizationId && !!session?.accessToken,
  });

  const { data: subscription } = useQuery({
    ...subscriptionOptions(organizationId!),
    enabled: !!organizationId,
  });

  const { data: prices } = useQuery({ ...pricesOptions() });

  const tier = getTierFromSubscription(
    subscription,
    prices,
    subscription?.priceId,
  );

  const maxAssignees = getMaxAssignees(tier);

  const members = membersData?.data ?? [];

  const { collection, filter } = useListCollection<WorkspaceUser>({
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

  const queryClient = useQueryClient();
  const taskQueryKey = taskOptions({ rowId: taskId }).queryKey;

  const invalidates = [taskQueryKey, getQueryKeyPrefix(useTasksQuery)];

  // Assignees are keyed on the member's IDP id (user.identityProviderId); the
  // stored node's userId is a local id we don't have client-side, so optimistic
  // nodes use a temp id and the refetch reconciles.
  const buildOptimisticAssignee = (userId: string) => {
    const member = members.find((m) => m.userId === userId);
    return {
      __typename: "Assignee" as const,
      taskId,
      userId,
      user: {
        __typename: "User" as const,
        rowId: `optimistic-${crypto.randomUUID()}`,
        identityProviderId: userId,
        name: member?.user.name ?? "",
        avatarUrl: member?.user.image ?? null,
      },
    };
  };

  const optimisticallyRemoveAssignee = (userId: string) => {
    queryClient.setQueryData<TaskQuery>(taskQueryKey, (old) =>
      old?.task
        ? {
            ...old,
            task: {
              ...old.task,
              assignees: {
                ...old.task.assignees,
                nodes: old.task.assignees.nodes.filter(
                  (node) => node.user?.identityProviderId !== userId,
                ),
              },
            },
          }
        : old,
    );
    queryClient.setQueriesData<TasksQuery>(
      { queryKey: getQueryKeyPrefix(useTasksQuery) },
      (old) =>
        old?.tasks?.nodes
          ? {
              ...old,
              tasks: {
                ...old.tasks,
                nodes: old.tasks.nodes.map((node) =>
                  node.rowId === taskId
                    ? {
                        ...node,
                        assignees: {
                          ...node.assignees,
                          nodes: node.assignees.nodes.filter(
                            (a) => a.user?.identityProviderId !== userId,
                          ),
                        },
                      }
                    : node,
                ),
              },
            }
          : old,
    );
  };

  const optimisticallyAddAssignee = (userId: string) => {
    const node = buildOptimisticAssignee(userId);
    queryClient.setQueryData<TaskQuery>(taskQueryKey, (old) =>
      old?.task
        ? {
            ...old,
            task: {
              ...old.task,
              assignees: {
                ...old.task.assignees,
                nodes: [...old.task.assignees.nodes, node],
              },
            },
          }
        : old,
    );
    queryClient.setQueriesData<TasksQuery>(
      { queryKey: getQueryKeyPrefix(useTasksQuery) },
      (old) =>
        old?.tasks?.nodes
          ? {
              ...old,
              tasks: {
                ...old.tasks,
                nodes: old.tasks.nodes.map((task) =>
                  task.rowId === taskId
                    ? {
                        ...task,
                        assignees: {
                          ...task.assignees,
                          nodes: [...task.assignees.nodes, node],
                        },
                      }
                    : task,
                ),
              },
            }
          : old,
    );
  };

  const { mutateAsync: removeAssignee } = useDeleteAssigneeMutation({
    meta: { invalidates },
    onMutate: (variables) => optimisticallyRemoveAssignee(variables.userId),
  });
  const { mutateAsync: addAssignee } = useCreateAssigneeMutation({
    meta: { invalidates },
    onMutate: (variables) =>
      optimisticallyAddAssignee(variables.input.assignee.userId),
  });

  // Member list values are IDP ids (Gatekeeper keys members by identityProviderId),
  // so selection must be compared in the same namespace or the remove branch in
  // handleToggle is never reached and every click re-runs the add mutation
  const selected = assignees
    .map((assignee) => assignee.user?.identityProviderId)
    .filter((id): id is string => Boolean(id));
  const atLimit = selected.length >= maxAssignees;

  const handleToggle = async (userId: string) => {
    if (selected.includes(userId)) {
      await removeAssignee({ taskId, userId });
      return;
    }

    if (maxAssignees === 1) {
      // single-assignee tiers replace the current assignee
      await Promise.all(
        selected.map((id) => removeAssignee({ taskId, userId: id })),
      );
      await addAssignee({ input: { assignee: { taskId, userId } } });
      return;
    }

    if (!atLimit) {
      await addAssignee({ input: { assignee: { taskId, userId } } });
    }
  };

  const sortedItems = [...collection.items].sort((a, b) => {
    const aAssigned = selected.includes(a.value) ? 0 : 1;
    const bAssigned = selected.includes(b.value) ? 0 : 1;
    if (aAssigned !== bAssigned) return aAssigned - bAssigned;
    return a.label.localeCompare(b.label);
  });

  return (
    <PopoverRoot positioning={{ placement: "bottom-start" }}>
      <PopoverTrigger asChild>
        <PropertyTrigger>
          <TriggerContent assignees={assignees} />
        </PropertyTrigger>
      </PopoverTrigger>

      <PopoverPositioner>
        <PopoverContent className="w-72 p-2">
          <div className="flex flex-col gap-2">
            <div className="relative">
              <SearchIcon className="pointer-events-none absolute top-1/2 left-2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Filter members…"
                className="h-8 pl-8 text-sm shadow-none"
                onChange={(event) => filter(event.currentTarget.value)}
              />
            </div>

            {sortedItems.length === 0 ? (
              <p className="py-6 text-center text-xs">No members found</p>
            ) : (
              <AssigneeList
                viewMode="list"
                items={sortedItems}
                selected={selected}
                atLimit={atLimit}
                maxAssignees={maxAssignees}
                onToggle={handleToggle}
              />
            )}

            <AssigneeLimitNotice tier={tier} maxAssignees={maxAssignees} />
          </div>
        </PopoverContent>
      </PopoverPositioner>
    </PopoverRoot>
  );
};

const AssigneesPopover = ({ taskId, assignees, editable }: Props) => {
  if (!editable) {
    return (
      <PropertyValue>
        <TriggerContent assignees={assignees} />
      </PropertyValue>
    );
  }

  return <AssigneesEditor taskId={taskId} assignees={assignees} />;
};

export default AssigneesPopover;
