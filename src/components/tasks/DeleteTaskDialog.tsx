import { useMatch, useNavigate } from "@tanstack/react-router";

import {
  DialogBackdrop,
  DialogCloseTrigger,
  DialogContent,
  DialogDescription,
  DialogPositioner,
  DialogRoot,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  useDeleteTaskMutation,
  useProjectQuery,
  useTasksQuery,
} from "@/generated/graphql";
import useDialogStore, { DialogType } from "@/lib/hooks/store/useDialogStore";
import useTaskStore from "@/lib/hooks/store/useTaskStore";
import getQueryKeyPrefix from "@/lib/util/getQueryKeyPrefix";
import { Button } from "../ui/button";

const DeleteTaskDialog = () => {
  const navigate = useNavigate();

  const { taskId } = useTaskStore();

  const taskDetailMatch = useMatch({
    from: "/_app/workspaces/$workspaceSlug/projects/$projectSlug/$taskId",
    shouldThrow: false,
  });

  const {
    isOpen: isDeleteTaskDialogOpen,
    setIsOpen: setIsDeleteTaskDialogOpen,
  } = useDialogStore({
    type: DialogType.DeleteTask,
  });

  const { mutate: deleteTask } = useDeleteTaskMutation({
    meta: {
      invalidates: [
        getQueryKeyPrefix(useTasksQuery),
        getQueryKeyPrefix(useProjectQuery),
      ],
    },

    onSuccess: () => {
      if (taskDetailMatch) {
        navigate({
          to: "/workspaces/$workspaceSlug/projects/$projectSlug",
          params: {
            workspaceSlug: taskDetailMatch.params.workspaceSlug,
            projectSlug: taskDetailMatch.params.projectSlug,
          },
          replace: true,
        });
      }
    },
  });

  return (
    <DialogRoot
      open={isDeleteTaskDialogOpen}
      onOpenChange={(details) => {
        setIsDeleteTaskDialogOpen(details.open);
      }}
    >
      <DialogBackdrop />
      <DialogPositioner>
        <DialogContent className="w-full max-w-md rounded-lg bg-background">
          <DialogCloseTrigger />

          <div className="mb-4 flex flex-col gap-4">
            <DialogTitle>Danger Zone</DialogTitle>
            <DialogDescription>
              This will delete your task. This action cannot be undone.
            </DialogDescription>
          </div>

          <Button
            type="submit"
            variant="destructive"
            onClick={() => {
              deleteTask({
                rowId: taskDetailMatch
                  ? taskDetailMatch.params.taskId
                  : taskId!,
              });
              setIsDeleteTaskDialogOpen(false);
            }}
          >
            Delete
          </Button>
        </DialogContent>
      </DialogPositioner>
    </DialogRoot>
  );
};

export default DeleteTaskDialog;
