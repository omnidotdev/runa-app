import { useQuery } from "@tanstack/react-query";
import { useParams } from "@tanstack/react-router";

import { Avatar } from "@/components/ui/avatar";
import workspaceUsersOptions from "@/lib/options/workspaceUsers.options";

import type { ComponentProps } from "react";

interface Props extends ComponentProps<"div"> {
  assignees?: string[];
  showUsername?: boolean;
}

const Assignees = ({ assignees, showUsername = false, ...rest }: Props) => {
  const { workspaceId } = useParams({ strict: false });

  const { data: workspaceUsers } = useQuery({
    ...workspaceUsersOptions({ rowId: workspaceId! }),
    enabled: !!workspaceId,
    select: (data) => data?.workspaceUsers?.nodes.map((user) => user.user),
  });

  const assignedUsers = workspaceUsers?.filter((user) =>
    assignees?.includes(user?.rowId!),
  );

  if (!assignees?.length) return null;

  return (
    <div {...rest}>
      {assignedUsers?.map((user) => (
        <div key={user?.rowId} className="flex items-center gap-0">
          <Avatar
            fallback={user?.name?.charAt(0)}
            src={user?.avatarUrl!}
            alt={user?.name}
            className="size-6 rounded-full border-2 bg-base-200 font-medium text-base-900 text-xs dark:bg-base-600 dark:text-base-100"
          />

          {showUsername && <p className="text-xs">{user?.name}</p>}
        </div>
      ))}
    </div>
  );
};

export default Assignees;
