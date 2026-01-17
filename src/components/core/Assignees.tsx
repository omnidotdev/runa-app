import { useQuery } from "@tanstack/react-query";
import { useLoaderData, useRouteContext } from "@tanstack/react-router";

import {
  AvatarFallback,
  AvatarImage,
  AvatarRoot,
} from "@/components/ui/avatar";
import organizationMembersOptions from "@/lib/options/organizationMembers.options";
import { cn } from "@/lib/utils";

import type { ComponentProps } from "react";

interface Props extends ComponentProps<"div"> {
  assignees?: string[];
  showUsername?: boolean;
  maxVisible?: number;
}

const Assignees = ({
  assignees,
  showUsername = false,
  maxVisible = 3,
  ...rest
}: Props) => {
  const { organizationId } = useLoaderData({ from: "/_auth" });
  const { session } = useRouteContext({ from: "/_auth" });

  // Fetch organization members from IDP
  const { data: membersData } = useQuery({
    ...organizationMembersOptions({
      organizationId: organizationId!,
      accessToken: session?.accessToken!,
    }),
    enabled: !!organizationId && !!session?.accessToken,
  });

  const members = membersData?.data ?? [];

  const assignedUsers = members.filter((member) =>
    assignees?.includes(member.userId),
  );

  if (!assignees?.length || !assignedUsers?.length) return null;

  const extraCount =
    assignedUsers.length > maxVisible
      ? assignedUsers.length - (maxVisible - 1)
      : 0;

  const visibleUsers = extraCount
    ? assignedUsers.slice(0, maxVisible - 1)
    : assignedUsers;

  return (
    <div {...rest}>
      <div
        className={cn(
          "flex items-center",
          showUsername ? "flex-col gap-1" : "-space-x-6",
        )}
      >
        {visibleUsers.map((member) => (
          <div key={member.userId} className="flex items-center gap-0">
            <AvatarRoot className="size-6 rounded-full border-2 bg-background font-medium text-xs">
              <AvatarImage
                src={member.user.image ?? undefined}
                alt={member.user.name}
              />
              <AvatarFallback>
                {member.user.name?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </AvatarRoot>

            {showUsername && (
              <p className="ml-2 hidden text-xs md:flex">{member.user.name}</p>
            )}
          </div>
        ))}
      </div>

      {extraCount > 0 && (
        <div className="z-50 flex size-6 items-center justify-center rounded-full border-2 bg-background font-medium text-[10px]">
          +{extraCount}
        </div>
      )}
    </div>
  );
};

export default Assignees;
