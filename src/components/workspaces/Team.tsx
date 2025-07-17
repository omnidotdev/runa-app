import { useSuspenseQuery } from "@tanstack/react-query";
import { useLoaderData } from "@tanstack/react-router";
import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";

import ConfirmDialog from "@/components/ConfirmDialog";
import InviteMemberDialog from "@/components/InviteMemberDialog";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Tooltip } from "@/components/ui/tooltip";
import { useDeleteWorkspaceUserMutation } from "@/generated/graphql";
import useDialogStore, { DialogType } from "@/lib/hooks/store/useDialogStore";
import workspaceOptions from "@/lib/options/workspace.options";
import workspaceUsersOptions from "@/lib/options/workspaceUsers.options";

const Team = () => {
  const { workspaceId } = useLoaderData({
    from: "/_auth/workspaces/$workspaceSlug/settings",
  });

  const [selectedMember, setSelectedMember] = useState<{
    name: string;
    avatarUrl?: string | null;
    rowId: string;
  }>();

  const { data: workspace } = useSuspenseQuery({
    ...workspaceOptions({ rowId: workspaceId }),
    select: (data) => data?.workspace,
  });

  const { data: members } = useSuspenseQuery({
    ...workspaceUsersOptions({ rowId: workspaceId }),
    select: (data) => data?.workspaceUsers,
  });

  const { mutate: deleteMember } = useDeleteWorkspaceUserMutation({
    meta: {
      invalidates: [workspaceUsersOptions({ rowId: workspaceId }).queryKey],
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
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between gap-4">
          <h2 className="flex items-center gap-2 font-medium text-base-700 text-sm dark:text-base-300">
            Team Members
          </h2>

          <Tooltip tooltip="Invite team member">
            <Button
              variant="ghost"
              size="icon"
              aria-label="Invite team member"
              onClick={() => setIsInviteTeamMemberOpen(true)}
            >
              <Plus />
            </Button>
          </Tooltip>
        </div>

        {members?.nodes.length ? (
          <div className="flex-1 rounded-md border">
            <Table>
              <TableBody>
                {members?.nodes?.map((member) => {
                  const completedTasks =
                    member?.user?.completedTasks?.totalCount ?? 0;
                  const totalTasks =
                    member?.user?.assignedTasks?.totalCount ?? 0;

                  return (
                    <TableRow key={member?.user?.rowId}>
                      <TableCell className="flex items-center gap-3">
                        <Avatar
                          fallback={member.user?.name?.charAt(0)}
                          src={member.user?.avatarUrl ?? undefined}
                          alt={member.user?.name}
                          className="size-8 rounded-full border-2 bg-base-200 font-medium text-base-900 text-xs dark:bg-base-600 dark:text-base-100"
                        />

                        <span className="text-foreground text-sm">
                          {member?.user?.name}
                        </span>

                        <div className="mr-1 ml-auto flex gap-1">
                          <div className="flex h-7 items-center px-4">
                            <span className="text-base-600 text-xs dark:text-base-400">
                              {completedTasks}/{totalTasks} tasks
                            </span>
                          </div>

                          <Button
                            variant="ghost"
                            size="icon"
                            aria-label="Remove team member"
                            onClick={() => {
                              setIsDeleteTeamMemberOpen(true);
                              setSelectedMember(member.user!);
                            }}
                            className="mr-2 ml-auto h-7 w-7 p-1 text-base-400 hover:text-red-500 dark:hover:text-red-400"
                          >
                            <Trash2 />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="flex items-center text-base-500 text-sm">
            No team members
          </div>
        )}
      </div>

      <ConfirmDialog
        title="Danger Zone"
        description={`This will delete ${selectedMember?.name} from ${workspace?.name} workspace. This action cannot be undone.`}
        onConfirm={() =>
          deleteMember({ userId: selectedMember?.rowId!, workspaceId })
        }
        dialogType={DialogType.DeleteTeamMember}
        confirmation={selectedMember?.name}
        inputProps={{
          className: "focus-visible:ring-red-500",
        }}
      />

      <InviteMemberDialog />
    </>
  );
};

export default Team;
