import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { useLoaderData, useRouteContext } from "@tanstack/react-router";
import { EyeOffIcon, MoreHorizontalIcon, Trash2Icon } from "lucide-react";

import DestructiveActionDialog from "@/components/core/DestructiveActionDialog";
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
  useDeleteTaskMutation,
  useUpdateUserPreferenceMutation,
} from "@/generated/graphql";
import useDialogStore, { DialogType } from "@/lib/hooks/store/useDialogStore";
import useTaskStore from "@/lib/hooks/store/useTaskStore";
import columnOptions from "@/lib/options/column.options";
import projectOptions from "@/lib/options/project.options";
import userPreferencesOptions from "@/lib/options/userPreferences.options";
import workspaceOptions from "@/lib/options/workspace.options";
import { cn } from "@/lib/utils";

interface Props {
  columnId: string;
}

const ColumnMenu = ({ columnId }: Props) => {
  const { projectId, workspaceId } = useLoaderData({
    from: "/_auth/workspaces/$workspaceSlug/projects/$projectSlug/",
  });

  const { session } = useRouteContext({
    from: "/_auth/workspaces/$workspaceSlug/projects/$projectSlug/",
  });

  const { setIsOpen } = useDialogStore({
    type: DialogType.DeleteColumnTasks,
  });

  const { columnId: storedColumnId, setColumnId: setStoredColumnId } =
    useTaskStore();

  const { data: role } = useSuspenseQuery({
    ...workspaceOptions({ rowId: workspaceId, userId: session?.user?.rowId! }),
    select: (data) => data.workspace?.workspaceUsers.nodes?.[0]?.role,
  });

  const isMember = role === Role.Member;

  const { data: userPreferences } = useSuspenseQuery({
    ...userPreferencesOptions({
      userId: session?.user?.rowId!,
      projectId,
    }),
    select: (data) => data?.userPreferenceByUserIdAndProjectId,
  });

  const { data: column } = useSuspenseQuery({
    ...projectOptions({
      rowId: projectId,
    }),
    select: (data) =>
      data?.project?.columns?.nodes?.find((col) => col.rowId === columnId),
  });

  const { data: taskIds } = useQuery({
    ...columnOptions({ columnId }),
    select: (data) => data?.column?.tasks?.nodes?.map((task) => task.rowId),
  });

  const { mutate: updateUserPreferences } = useUpdateUserPreferenceMutation({
    meta: {
      invalidates: [
        userPreferencesOptions({
          userId: session?.user?.rowId!,
          projectId,
        }).queryKey,
      ],
    },
  });

  const { mutate: deleteTask } = useDeleteTaskMutation({
    meta: {
      invalidates: [["all"]],
    },
  });

  return (
    <>
      <MenuRoot
        positioning={{
          strategy: "fixed",
          placement: "bottom-end",
        }}
      >
        <MenuTrigger asChild onClick={(e) => e.stopPropagation()}>
          <Button
            variant="ghost"
            className="size-7"
            aria-label={`More Actions for ${column?.title}`}
          >
            <MoreHorizontalIcon className="size-4" />
          </Button>
        </MenuTrigger>

        <MenuPositioner>
          <MenuContent className="focus-within:outline-none">
            <MenuItem
              value="hide"
              className="flex cursor-pointer items-center gap-2"
              onClick={() => {
                updateUserPreferences({
                  rowId: userPreferences?.rowId!,
                  patch: {
                    hiddenColumnIds: [
                      ...(userPreferences?.hiddenColumnIds as string[]),
                      columnId,
                    ],
                  },
                });
              }}
            >
              <EyeOffIcon />
              <span>Hide Column</span>
            </MenuItem>

            <MenuItem
              value="delete"
              className={cn(
                "flex cursor-pointer items-center gap-2",
                isMember && "hidden",
              )}
              variant="destructive"
              disabled={!taskIds?.length}
              onClick={() => {
                setStoredColumnId(columnId);
                setIsOpen(true);
              }}
            >
              <Trash2Icon />
              <span>Delete All Tasks</span>
            </MenuItem>
          </MenuContent>
        </MenuPositioner>
      </MenuRoot>

      {storedColumnId === columnId && (
        <DestructiveActionDialog
          title="Danger Zone"
          description={`This will delete all tasks from ${column?.title}. This action cannot be undone`}
          confirmation={`permanently delete ${column?.title} tasks`}
          dialogType={DialogType.DeleteColumnTasks}
          onConfirm={() => {
            if (taskIds?.length) {
              for (const taskId of taskIds) {
                deleteTask({ rowId: taskId });
              }
            }
            setStoredColumnId(null);
            setIsOpen(false);
          }}
          onOpenChange={({ open }) => {
            if (!open) {
              setStoredColumnId(null);
            }
          }}
        />
      )}
    </>
  );
};

export default ColumnMenu;
