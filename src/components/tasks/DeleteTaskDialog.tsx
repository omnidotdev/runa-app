import { useMatch, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";

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
import { isTaskRowId } from "@/lib/util/taskUrl";
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
    </DialogRoot>
  );
};

export default DeleteTaskDialog;
