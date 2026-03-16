import { Portal } from "@ark-ui/react/portal";
import { useNavigate, useParams } from "@tanstack/react-router";
import { Trash2Icon } from "lucide-react";

import { Shortcut } from "@/components/core";
import {
  MenuContent,
  MenuContextTrigger,
  MenuItem,
  MenuPositioner,
  MenuRoot,
} from "@/components/ui/menu";
import {
  useDeleteTaskMutation,
  useProjectQuery,
  useTasksQuery,
} from "@/generated/graphql";
import useDialogStore, { DialogType } from "@/lib/hooks/store/useDialogStore";
import useTaskStore from "@/lib/hooks/store/useTaskStore";
import getQueryKeyPrefix from "@/lib/util/getQueryKeyPrefix";

import type { PropsWithChildren } from "react";

interface Props {
  taskRowId: string;
}

const TaskContextMenu = ({ taskRowId, children }: PropsWithChildren<Props>) => {
  const navigate = useNavigate();
  const { workspaceSlug, projectSlug } = useParams({
    from: "/_app/workspaces/$workspaceSlug/projects/$projectSlug/",
  });

  const { setTaskId } = useTaskStore();
  const { setIsOpen: setIsUpdateAssigneesDialogOpen } = useDialogStore({
    type: DialogType.UpdateAssignees,
  });
  const { setIsOpen: setIsUpdateDueDateDialogOpen } = useDialogStore({
    type: DialogType.UpdateDueDate,
  });
  const { setIsOpen: setIsUpdateTaskLabelsDialogOpen } = useDialogStore({
    type: DialogType.UpdateTaskLabels,
  });

  const navigateToTask = () => {
    navigate({
      to: "/workspaces/$workspaceSlug/projects/$projectSlug/$taskId",
      params: { workspaceSlug, projectSlug, taskId: taskRowId },
    });
  };

  const handleOpenAssigneesDialog = () => {
    setTaskId(taskRowId);
    setIsUpdateAssigneesDialogOpen(true);
  };

  const handleOpenDueDateDialog = () => {
    setTaskId(taskRowId);
    setIsUpdateDueDateDialogOpen(true);
  };

  const handleOpenTaskLabelsDialog = () => {
    setTaskId(taskRowId);
    setIsUpdateTaskLabelsDialogOpen(true);
  };

  const { mutate: deleteTask } = useDeleteTaskMutation({
    meta: {
      invalidates: [
        getQueryKeyPrefix(useTasksQuery),
        getQueryKeyPrefix(useProjectQuery),
      ],
    },
    onSuccess: () => {
      navigate({
        to: "/workspaces/$workspaceSlug/projects/$projectSlug",
        params: { workspaceSlug, projectSlug },
        replace: true,
      });
    },
  });

  return (
    <MenuRoot>
      <MenuContextTrigger className="w-full">{children}</MenuContextTrigger>

      <Portal>
        <MenuPositioner>
          <MenuContent>
            <MenuItem value="view" onSelect={navigateToTask}>
              View Task Details
            </MenuItem>

            <MenuItem value="assignees" onSelect={handleOpenAssigneesDialog}>
              Update Assignees
              <Shortcut>A</Shortcut>
            </MenuItem>

            <MenuItem value="date" onSelect={handleOpenDueDateDialog}>
              Update Date
              <Shortcut>D</Shortcut>
            </MenuItem>

            <MenuItem value="labels" onSelect={handleOpenTaskLabelsDialog}>
              Update Labels
              <Shortcut>L</Shortcut>
            </MenuItem>

            <MenuItem
              value="delete"
              variant="destructive"
              onSelect={() => deleteTask({ rowId: taskRowId })}
            >
              <Trash2Icon /> <span>Delete</span>
            </MenuItem>
          </MenuContent>
        </MenuPositioner>
      </Portal>
    </MenuRoot>
  );
};

export default TaskContextMenu;
