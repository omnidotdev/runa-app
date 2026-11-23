import { Button } from "@omnidotdev/thornberry/button";
import {
  DialogBackdrop,
  DialogCloseTrigger,
  DialogContent,
  DialogDescription,
  DialogPortal,
  DialogPositioner,
  DialogRoot,
  DialogTitle,
} from "@omnidotdev/thornberry/dialog";
import { useMatch, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";

import {
  useDeleteTaskMutation,
  useProjectQuery,
  useTasksQuery,
} from "@/generated/graphql";
import useDialogStore, { DialogType } from "@/lib/hooks/store/useDialogStore";
import useTaskStore from "@/lib/hooks/store/useTaskStore";
import getQueryKeyPrefix from "@/lib/util/getQueryKeyPrefix";
import { isTaskRowId } from "@/lib/util/taskUrl";

const DeleteTaskDialog = () => {
  const navigate = useNavigate();

  const { taskId } = useTaskStore();

  const taskDetailMatch = useMatch({
    from: "/_app/@{$workspaceSlug}/$projectSlug/$taskId",
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
          to: "/@{$workspaceSlug}/$projectSlug",
          params: {
            workspaceSlug: taskDetailMatch.params.workspaceSlug,
            projectSlug: taskDetailMatch.params.projectSlug,
          },
          replace: true,
        });
      }
    },

    onError: () => {
      toast.error("Failed to delete task. Please try again.");
    },
  });

  return (
    <DialogRoot
      open={isDeleteTaskDialogOpen}
      onOpenChange={(details) => {
        setIsDeleteTaskDialogOpen(details.open);
      }}
    >
      <DialogPortal>
        <DialogBackdrop />
        <DialogPositioner>
          <DialogContent className="max-w-md">
            <DialogCloseTrigger />

            <div className="flex flex-col gap-1.5">
              <DialogTitle>Danger Zone</DialogTitle>
              <DialogDescription>
                This will delete your task. This action cannot be undone.
              </DialogDescription>
            </div>

            <Button
              type="submit"
              variant="destructive"
              onClick={() => {
                // the detail route param is a vanity key, so always use the
                // resolved rowId the page keeps in the task store, and guard
                // against ever sending a non-rowId to the UUID-typed mutation
                if (!isTaskRowId(taskId)) {
                  toast.error("Failed to delete task. Please try again.");
                  return;
                }

                deleteTask({ rowId: taskId });
                setIsDeleteTaskDialogOpen(false);
              }}
            >
              Delete
            </Button>
          </DialogContent>
        </DialogPositioner>
      </DialogPortal>
    </DialogRoot>
  );
};

export default DeleteTaskDialog;
