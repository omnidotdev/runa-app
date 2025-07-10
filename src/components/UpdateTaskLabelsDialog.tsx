import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { useParams } from "@tanstack/react-router";
import { useHotkeys } from "react-hotkeys-hook";

import TaskLabelsForm from "@/components/tasks/TaskLabelsForm";
import { Button } from "@/components/ui/button";
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
  useCreateLabelMutation,
  useCreateTaskLabelMutation,
  useDeleteTaskLabelMutation,
} from "@/generated/graphql";
import { Hotkeys } from "@/lib/constants/hotkeys";
import useDialogStore, { DialogType } from "@/lib/hooks/store/useDialogStore";
import useTaskStore from "@/lib/hooks/store/useTaskStore";
import useForm from "@/lib/hooks/useForm";
import projectOptions from "@/lib/options/project.options";
import taskOptions from "@/lib/options/task.options";
import getQueryClient from "@/lib/util/getQueryClient";

const UpdateTaskLabelsDialog = () => {
  const queryClient = getQueryClient();

  const { projectId } = useParams({
    from: "/_auth/workspaces/$workspaceId/projects/$projectId/",
  });

  const { taskId, setTaskId } = useTaskStore();

  const { isOpen, setIsOpen } = useDialogStore({
    type: DialogType.UpdateTaskLabels,
  });

  useHotkeys(Hotkeys.UpdateTaskLabels, () => setIsOpen(true), [setIsOpen]);

  const { data: task } = useQuery({
    ...taskOptions({ rowId: taskId! }),
    enabled: !!taskId,
    select: (data) => data?.task,
  });

  const { data: project } = useSuspenseQuery({
    ...projectOptions({ rowId: projectId }),
    select: (data) => data?.project,
  });

  const taskLabelIds =
    task?.taskLabels?.nodes?.map((label) => label.label?.rowId!) ?? [];

  const defaultLabels =
    project?.labels?.nodes?.map((label) => ({
      ...label,
      checked: taskLabelIds.includes(label.rowId),
    })) ?? [];

  const { mutateAsync: updateProjectLabel } = useCreateLabelMutation();
  const { mutateAsync: deleteTaskLabel } = useDeleteTaskLabelMutation();
  const { mutateAsync: createTaskLabel } = useCreateTaskLabelMutation();

  const form = useForm({
    defaultValues: {
      title: "",
      description: "",
      labels: defaultLabels,
      assignees: [] as string[],
      dueDate: "",
      columnId: "",
    },
    onSubmit: async ({ value, formApi }) => {
      const allTaskLabels = value.labels.filter((l) => l.checked);

      const newLabels = value.labels.filter((l) => l.rowId === "pending");

      // Add all new labels to project labels
      const data = await Promise.all(
        newLabels.map((label) =>
          updateProjectLabel({
            input: {
              label: {
                name: label.name,
                color: label.color,
                projectId,
              },
            },
          }),
        ),
      );

      const newlyAddedLabels = data.map(
        (mutation) => mutation.createLabel?.label!,
      );
      const restOfTaskLabels = allTaskLabels.filter(
        (label) => label.rowId !== "pending",
      );

      const newTaskLabels = [...restOfTaskLabels, ...newlyAddedLabels];

      const currentTaskLabelIds =
        task?.taskLabels?.nodes?.map((l) => l.rowId) ?? [];

      // delete all current task labels
      await Promise.all(
        currentTaskLabelIds.map((rowId) => deleteTaskLabel({ rowId })),
      );

      // add all task labels (re-add existing and update with newly added)
      await Promise.all(
        newTaskLabels.map((label) =>
          createTaskLabel({
            input: {
              taskLabel: {
                labelId: label.rowId,
                taskId: taskId!,
              },
            },
          }),
        ),
      );

      queryClient.invalidateQueries();
      formApi.reset();
      setIsOpen(false);
      setTaskId(null);
    },
  });

  return (
    <DialogRoot
      open={isOpen}
      onOpenChange={({ open }) => {
        setIsOpen(open);

        if (!open) {
          setTaskId(null);
        }
      }}
    >
      <DialogBackdrop />
      <DialogPositioner>
        <DialogContent>
          <DialogCloseTrigger />
          <DialogTitle>Update Labels</DialogTitle>
          <DialogDescription>
            Update the labels for this task.
          </DialogDescription>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
          >
            <TaskLabelsForm form={form} />

            <form.Subscribe
              selector={(state) => [
                state.canSubmit,
                state.isSubmitting,
                state.isDirty,
              ]}
            >
              {([canSubmit, isSubmitting, isDirty]) => (
                <Button
                  type="submit"
                  disabled={!canSubmit || isSubmitting || !isDirty}
                  size="sm"
                  className="mt-4 w-full"
                >
                  Update Labels
                </Button>
              )}
            </form.Subscribe>
          </form>
        </DialogContent>
      </DialogPositioner>
    </DialogRoot>
  );
};

export default UpdateTaskLabelsDialog;
