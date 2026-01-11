import { useSuspenseQuery } from "@tanstack/react-query";
import { useLoaderData, useRouteContext } from "@tanstack/react-router";
import {
  CheckIcon,
  ChevronDownIcon,
  MoreHorizontalIcon,
  PlusIcon,
  Trash2Icon,
} from "lucide-react";
import { useRef, useState } from "react";
import { match } from "ts-pattern";

import { DestructiveActionDialog, Tooltip } from "@/components/core";
import {
  AvatarFallback,
  AvatarImage,
  AvatarRoot,
} from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  MenuContent,
  MenuItem,
  MenuPositioner,
  MenuRoot,
  MenuTrigger,
} from "@/components/ui/menu";
import {
  Role,
  Tier,
  useDeleteMemberMutation,
  useUpdateMemberMutation,
} from "@/generated/graphql";
import useDialogStore, { DialogType } from "@/lib/hooks/store/useDialogStore";
import {
  canModifyMember,
  useCanManageTeam,
} from "@/lib/hooks/useCanManageTeam";
import membersOptions from "@/lib/options/members.options";
import workspaceOptions from "@/lib/options/workspace.options";
import { cn } from "@/lib/utils";
import InviteMemberDialog from "./InviteMemberDialog";

const Team = () => {
  const inviteRef = useRef<HTMLButtonElement>(null);

  const { workspaceId } = useLoaderData({
    from: "/_auth/workspaces/$workspaceSlug/settings",
  });

  const { session } = useRouteContext({
    from: "/_auth/workspaces/$workspaceSlug/settings",
  });

  const [selectedMember, setSelectedMember] = useState<{
    name: string;
    avatarUrl?: string | null;
    rowId: string;
  }>();

  const { data: workspace } = useSuspenseQuery({
    ...workspaceOptions({
      rowId: workspaceId,
      userId: session?.user?.rowId!,
    }),
    select: (data) => data?.workspace,
  });

  const { data: members } = useSuspenseQuery({
    ...membersOptions({ workspaceId: workspaceId }),
    select: (data) => data?.members,
  });

  const currentUserRole = workspace?.members?.nodes?.[0]?.role;
  const { canInvite, canChangeRoles, canRemoveMembers } =
    useCanManageTeam(currentUserRole);

  const { mutate: deleteMember } = useDeleteMemberMutation({
    meta: {
      invalidates: [membersOptions({ workspaceId: workspaceId }).queryKey],
    },
  });

  const { mutate: editMember } = useUpdateMemberMutation();

  const { setIsOpen: setIsDeleteTeamMemberOpen } = useDialogStore({
      type: DialogType.DeleteTeamMember,
    }),
    { setIsOpen: _setIsInviteTeamMemberOpen } = useDialogStore({
      type: DialogType.InviteTeamMember,
    });

  const _maxNumberOfMembersReached = match(workspace?.tier)
    .with(Tier.Team, () => false)
    .with(Tier.Basic, () => members!.nodes.length >= 10)
    .otherwise(() => members!.nodes.length >= 3);

  const maxNumberofAdminsReached = match(workspace?.tier)
    .with(Tier.Team, () => false)
    .with(
      Tier.Basic,
      () =>
        members!.nodes.filter((member) => member.role !== Role.Member).length >=
        3,
    )
    .otherwise(
      () =>
        members!.nodes.filter((member) => member.role !== Role.Member).length >=
        1,
    );

  return (
    <>
      <div className="flex flex-col">
        <div className="mb-1 flex h-10 items-center justify-between">
          <h2 className="ml-2 flex items-center gap-2 font-medium text-base-700 text-sm lg:ml-0 dark:text-base-300">
            Team Members
          </h2>

          {/* TODO: re-enable when per-seat pricing is implemented */}
          <Tooltip
            positioning={{ placement: "left" }}
            tooltip="Coming Soon"
            // tooltip={
            //   maxNumberOfMembersReached
            //     ? "Upgrade workspace to invite members"
            //     : "Invite Member"
            // }
            // shortcut={!maxNumberOfMembersReached ? "I" : undefined}
            trigger={
              <Button
                variant="ghost"
                size="icon"
                aria-label="Invite team member"
                className={cn(
                  "mr-2 hidden size-7 disabled:pointer-events-auto disabled:cursor-not-allowed disabled:hover:bg-transparent dark:disabled:hover:bg-transparent",
                  canInvite && "inline-flex",
                )}
                // onClick={() => setIsInviteTeamMemberOpen(true)}
                disabled
                ref={inviteRef}
              >
                <PlusIcon />
              </Button>
            }
          />
        </div>

        {members?.nodes.length ? (
          <div className="flex flex-col divide-y border-y">
            {members?.nodes?.map((member) => {
              const completedTasks =
                member?.user?.completedTasks?.totalCount ?? 0;
              const totalTasks = member?.user?.assignedTasks?.totalCount ?? 0;

              // check if current user can modify this member
              const canModifyThisMember =
                currentUserRole &&
                member.role &&
                canModifyMember(currentUserRole, member.role);

              // cannot modify self
              const isSelf = member.user?.rowId === session?.user.rowId;

              return (
                <div
                  key={member?.user?.rowId}
                  className="group flex h-10 w-full items-center px-2 hover:bg-accent lg:px-0"
                >
                  <div className="flex w-full items-center">
                    <div className="flex size-10 items-center justify-center">
                      <AvatarRoot
                        size="xs"
                        className="size-6 rounded-full border bg-background font-medium text-sm uppercase shadow"
                      >
                        <AvatarImage
                          src={member.user?.avatarUrl ?? undefined}
                          alt={member.user?.name}
                        />
                        <AvatarFallback>
                          {member.user?.name?.charAt(0)}
                        </AvatarFallback>
                      </AvatarRoot>
                    </div>

                    <span className="px-3 text-xs md:text-sm">
                      {member?.user?.name}
                    </span>

                    <MenuRoot
                      positioning={{
                        strategy: "fixed",
                        placement: "bottom-start",
                      }}
                      onSelect={({ value }) =>
                        editMember({
                          input: {
                            userId: member?.user?.rowId!,
                            workspaceId: workspace?.rowId!,
                            patch: { role: value as Role },
                          },
                        })
                      }
                    >
                      <MenuTrigger
                        disabled={isSelf || !canModifyThisMember}
                        asChild
                      >
                        <Badge variant="outline">
                          <p className="first-letter:uppercase">
                            {member.role}
                          </p>
                          <ChevronDownIcon
                            className={cn(
                              "hidden",
                              canChangeRoles &&
                                !isSelf &&
                                canModifyThisMember &&
                                "inline-flex",
                            )}
                          />
                        </Badge>
                      </MenuTrigger>

                      <MenuPositioner>
                        <MenuContent>
                          <MenuItem
                            value={Role.Admin}
                            disabled={
                              member?.role === Role.Admin ||
                              maxNumberofAdminsReached
                            }
                          >
                            Admin
                            {member?.role === Role.Admin && (
                              <CheckIcon className="text-green-500" />
                            )}
                          </MenuItem>
                          <MenuItem
                            value={Role.Member}
                            disabled={member?.role === Role.Member}
                            className="justify-between"
                          >
                            Member
                            {member?.role === Role.Member && (
                              <CheckIcon className="text-green-500" />
                            )}
                          </MenuItem>
                        </MenuContent>
                      </MenuPositioner>
                    </MenuRoot>

                    <div className="mr-2 ml-auto flex gap-1">
                      <span className="flex items-center px-3 text-base-600 text-xs dark:text-base-400">
                        {completedTasks}/{totalTasks} tasks
                      </span>

                      <MenuRoot
                        positioning={{
                          strategy: "fixed",
                          placement: "left",
                        }}
                      >
                        <MenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className={cn(
                              "hidden size-7 text-base-400",
                              canRemoveMembers &&
                                canModifyThisMember &&
                                "inline-flex",
                            )}
                            aria-label="More team member options"
                          >
                            <MoreHorizontalIcon />
                          </Button>
                        </MenuTrigger>

                        <MenuPositioner>
                          <MenuContent className="focus-within:outline-none">
                            <MenuItem
                              value="delete"
                              variant="destructive"
                              onClick={() => {
                                setIsDeleteTeamMemberOpen(true);
                                setSelectedMember(member.user!);
                              }}
                              disabled={isSelf}
                            >
                              <Trash2Icon />
                              <span> Delete </span>
                            </MenuItem>
                          </MenuContent>
                        </MenuPositioner>
                      </MenuRoot>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="ml-2 flex items-center text-base-500 text-sm lg:ml-0">
            No team members
          </div>
        )}
      </div>

      <DestructiveActionDialog
        title="Danger Zone"
        description={`This will delete ${selectedMember?.name} from ${workspace?.name} workspace. This action cannot be undone.`}
        onConfirm={() =>
          deleteMember({ userId: selectedMember?.rowId!, workspaceId })
        }
        dialogType={DialogType.DeleteTeamMember}
        confirmation={selectedMember?.name}
      />

      <InviteMemberDialog triggerRef={inviteRef} />
    </>
  );
};

export default Team;
