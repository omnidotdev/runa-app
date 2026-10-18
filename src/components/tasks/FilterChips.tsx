import { useQuery } from "@tanstack/react-query";
import {
  useLoaderData,
  useNavigate,
  useRouteContext,
  useSearch,
} from "@tanstack/react-router";
import { XIcon } from "lucide-react";

import labelsOptions from "@/lib/options/labels.options";
import organizationMembersOptions from "@/lib/options/organizationMembers.options";
import workspaceLabelsOptions from "@/lib/options/workspaceLabels.options";

import type { ReactNode } from "react";

const PRIORITY_LABELS: Record<string, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
};

const Chip = ({
  onRemove,
  children,
}: {
  onRemove: () => void;
  children: ReactNode;
}) => (
  <button
    type="button"
    onClick={onRemove}
    className="inline-flex items-center gap-1 rounded-full border py-0.5 pr-1.5 pl-2 text-base-700 text-xs hover:bg-base-50 dark:text-base-300 dark:hover:bg-base-800"
  >
    {children}
    <XIcon className="size-3 text-base-400" />
  </button>
);

/**
 * Removable pills for the project's active filters (priority, assignee,
 * label), resolved to readable names. The filters live in the URL and feed the
 * shared task query, so these chips apply across the board, list, and calendar
 * views. Renders nothing when no filters are active.
 */
const FilterChips = () => {
  const { organizationId, projectId } = useLoaderData({
    from: "/_app/@{$workspaceSlug}/$projectSlug/",
  });
  const { session } = useRouteContext({
    from: "/_app/@{$workspaceSlug}/$projectSlug/",
  });
  const { assignees, labels, priorities } = useSearch({
    from: "/_app/@{$workspaceSlug}/$projectSlug/",
  });
  const navigate = useNavigate({ from: "/@{$workspaceSlug}/$projectSlug/" });

  const { data: projectLabels = [] } = useQuery({
    ...labelsOptions({ projectId }),
    select: (data) => data?.labels?.nodes ?? [],
    enabled: !!projectId,
  });
  const { data: workspaceLabels = [] } = useQuery({
    ...workspaceLabelsOptions({ organizationId: organizationId! }),
    select: (data) => data?.labels?.nodes ?? [],
    enabled: !!organizationId,
  });
  const availableLabels = [...workspaceLabels, ...projectLabels];

  const { data: membersData } = useQuery({
    ...organizationMembersOptions({ organizationId: organizationId! }),
    enabled: !!organizationId && !!session?.accessToken,
  });
  const members = membersData?.data ?? [];

  if (!(assignees.length || labels.length || priorities.length)) return null;

  const removePriority = (value: string) =>
    navigate({
      search: (prev) => ({
        ...prev,
        priorities: prev.priorities.filter((item) => item !== value),
      }),
    });
  const removeAssignee = (value: string) =>
    navigate({
      search: (prev) => ({
        ...prev,
        assignees: prev.assignees.filter((item) => item !== value),
      }),
    });
  const removeLabel = (value: string) =>
    navigate({
      search: (prev) => ({
        ...prev,
        labels: prev.labels.filter((item) => item !== value),
      }),
    });
  const clearAll = () =>
    navigate({
      search: (prev) => ({
        ...prev,
        assignees: [],
        labels: [],
        priorities: [],
      }),
    });

  return (
    <div className="flex flex-wrap items-center gap-1.5 px-2 py-2 lg:px-0">
      {priorities.map((priority) => (
        <Chip key={priority} onRemove={() => removePriority(priority)}>
          {PRIORITY_LABELS[priority] ?? priority}
        </Chip>
      ))}
      {assignees.map((id) => {
        const member = members.find((candidate) => candidate.userId === id);
        return (
          <Chip key={id} onRemove={() => removeAssignee(id)}>
            {member?.user?.name ?? "Assignee"}
          </Chip>
        );
      })}
      {labels.map((id) => {
        const label = availableLabels.find(
          (candidate) => candidate.rowId === id,
        );
        return (
          <Chip key={id} onRemove={() => removeLabel(id)}>
            {label?.color && (
              <span
                className="size-2 shrink-0 rounded-full"
                style={{ backgroundColor: label.color }}
              />
            )}
            {label?.name ?? "Label"}
          </Chip>
        );
      })}
      <button
        type="button"
        onClick={clearAll}
        className="ml-0.5 text-base-500 text-xs underline hover:text-base-800 dark:hover:text-base-200"
      >
        Clear all
      </button>
    </div>
  );
};

export default FilterChips;
