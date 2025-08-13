import { useSuspenseQuery } from "@tanstack/react-query";
import { useLoaderData, useRouteContext } from "@tanstack/react-router";
import { MoreHorizontalIcon, PlusIcon, Trash2Icon } from "lucide-react";
import { useRef, useState } from "react";

import DestructiveActionDialog from "@/components/core/DestructiveActionDialog";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  MenuContent,
  MenuItem,
  MenuPositioner,
  MenuRoot,
  MenuTrigger,
} from "@/components/ui/menu";
import { Tooltip } from "@/components/ui/tooltip";
import InviteMemberDialog from "@/components/workspaces/InviteMemberDialog";
import { useDeleteWorkspaceUserMutation } from "@/generated/graphql";
import useDialogStore, { DialogType } from "@/lib/hooks/store/useDialogStore";
import workspaceOptions from "@/lib/options/workspace.options";
import workspaceUsersOptions from "@/lib/options/workspaceUsers.options";

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
    ...workspaceUsersOptions({ workspaceId: workspaceId }),
    select: (data) => data?.workspaceUsers,
  });

  const { mutate: deleteMember } = useDeleteWorkspaceUserMutation({
    meta: {
      invalidates: [
        workspaceUsersOptions({ workspaceId: workspaceId }).queryKey,
      ],
    },
  });

  const { setIsOpen: setIsDeleteTeamMemberOpen } = useDialogStore({
      type: DialogType.DeleteTeamMember,
    }),
    { setIsOpen: setIsInviteTeamMemberOpen } = useDialogStore({
      type: DialogType.InviteTeamMember,
    });

  return (
    <>
      <div className="flex flex-col">
        <div className="mb-1 flex h-10 items-center justify-between">
          <h2 className="ml-2 flex items-center gap-2 font-medium text-base-700 text-sm lg:ml-0 dark:text-base-300">
            Team Members
          </h2>

          <Tooltip
            tooltip="Invite Member"
            shortcut="I"
            positioning={{
              placement: "left",
            }}
          >
            <Button
              variant="ghost"
              size="icon"
              aria-label="Invite team member"
              className="mr-2 size-7"
              onClick={() => setIsInviteTeamMemberOpen(true)}
              ref={inviteRef}
            >
              <PlusIcon />
            </Button>
          </Tooltip>
        </div>

        {members?.nodes.length ? (
          <div className="flex flex-col divide-y border-y">
            {members?.nodes?.map((member) => {
              const completedTasks =
                member?.user?.completedTasks?.totalCount ?? 0;
              const totalTasks = member?.user?.assignedTasks?.totalCount ?? 0;

              return (
                <div
                  key={member?.user?.rowId}
                  className="group flex h-10 w-full items-center px-2 hover:bg-accent lg:px-0"
                >
                  <div className="flex w-full items-center">
                    <div className="flex size-10 items-center justify-center">
                      <Avatar
                        fallback={member.user?.name?.charAt(0)}
                        src={member.user?.avatarUrl ?? undefined}
                        alt={member.user?.name}
                        size="xs"
                        className="size-6 rounded-full border bg-background font-medium text-sm uppercase shadow"
                      />
                    </div>

                    <span className="px-3 text-xs md:text-sm">
                      {member?.user?.name}
                    </span>

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
                            className="size-7 text-base-400"
                            aria-label="More team member options"
                          >
                            <MoreHorizontalIcon />
                          </Button>
                        </MenuTrigger>

                        <MenuPositioner>
                          <MenuContent className="focus-within:outline-none">
                            <MenuItem
                              value="reset"
                              variant="destructive"
                              onClick={() => {
                                setIsDeleteTeamMemberOpen(true);
                                setSelectedMember(member.user!);
                              }}
                              disabled={
                                member.user?.rowId === session?.user?.rowId
                              }
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
