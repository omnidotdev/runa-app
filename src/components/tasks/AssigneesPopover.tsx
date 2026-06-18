import { useFilter, useListCollection } from "@ark-ui/react";
import { useQuery } from "@tanstack/react-query";
import { useLoaderData, useRouteContext } from "@tanstack/react-router";
import { SearchIcon } from "lucide-react";
import { match } from "ts-pattern";

import {
  AvatarFallback,
  AvatarImage,
  AvatarRoot,
} from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
  PopoverContent,
  PopoverPositioner,
  PopoverRoot,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  useCreateAssigneeMutation,
  useDeleteAssigneeMutation,
  useTasksQuery,
} from "@/generated/graphql";
import organizationMembersOptions from "@/lib/options/organizationMembers.options";
import pricesOptions from "@/lib/options/prices.options";
import subscriptionOptions from "@/lib/options/subscription.options";
import taskOptions from "@/lib/options/task.options";
import { Tier, getTierFromSubscription } from "@/lib/types/tier";
import getQueryKeyPrefix from "@/lib/util/getQueryKeyPrefix";
import AssigneeList from "./AssigneeList";
import { PropertyTrigger, PropertyValue } from "./propertyRow";

import type { WorkspaceUser } from "./UpdateAssignees";

interface Assignee {
  userId: string;
  user?: {
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
    from: "/_app/workspaces/$workspaceSlug",
  });
  const { session } = useRouteContext({ from: "/_app" });
  const { contains } = useFilter({ sensitivity: "base" });

  const { data: membersData } = useQuery({
    ...organizationMembersOptions({
      organizationId: organizationId!,
      accessToken: session?.accessToken!,
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

  const maxAssignees = match(tier)
    .with(Tier.Team, Tier.Enterprise, () => Number.POSITIVE_INFINITY)
    .with(Tier.Pro, () => 5)
    .otherwise(() => 1);

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

  const mutationOptions = {
    meta: {
      invalidates: [
        taskOptions({ rowId: taskId }).queryKey,
        getQueryKeyPrefix(useTasksQuery),
      ],
    },
  };

  const { mutateAsync: removeAssignee } =
    useDeleteAssigneeMutation(mutationOptions);
  const { mutateAsync: addAssignee } =
    useCreateAssigneeMutation(mutationOptions);

  const selected = assignees.map((assignee) => assignee.userId);
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
