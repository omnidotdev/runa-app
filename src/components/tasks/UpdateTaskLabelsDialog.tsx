import { useQuery } from "@tanstack/react-query";
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
import { taskFormDefaults } from "@/lib/constants/taskFormDefaults";
import useDialogStore, { DialogType } from "@/lib/hooks/store/useDialogStore";
import useTaskStore from "@/lib/hooks/store/useTaskStore";
import useForm from "@/lib/hooks/useForm";
import projectOptions from "@/lib/options/project.options";
import taskOptions from "@/lib/options/task.options";
import getQueryClient from "@/lib/util/getQueryClient";

const UpdateTaskLabelsDialog = () => {
  const queryClient = getQueryClient();

  const { taskId: paramsTaskId } = useParams({
    strict: false,
  });

  const { taskId: storeTaskId, setTaskId } = useTaskStore();

  const taskId = paramsTaskId ?? storeTaskId;

  const { isOpen, setIsOpen } = useDialogStore({
    type: DialogType.UpdateTaskLabels,
  });

  useHotkeys(Hotkeys.UpdateTaskLabels, () => setIsOpen(!isOpen), [
    isOpen,
    setIsOpen,
  ]);

  const { data: task } = useQuery({
    ...taskOptions({ rowId: taskId! }),
    enabled: !!taskId,
    select: (data) => data?.task,
  });

  const { data: project } = useQuery({
    ...projectOptions({ rowId: task?.projectId! }),
    enabled: !!task?.projectId,
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
      ...taskFormDefaults,
      labels: defaultLabels,
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
                projectId: project?.rowId!,
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

      // delete all current labels and add all checked task labels. This is to provide ease of functionality rather than needing to compare on each current label to see if it is still valid.
      await Promise.all([
        ...currentTaskLabelIds.map((rowId) => deleteTaskLabel({ rowId })),
        ...newTaskLabels.map((label) =>
          createTaskLabel({
            input: {
              taskLabel: {
                labelId: label.rowId,
                taskId: taskId!,
              },
            },
          }),
        ),
      ]);

      queryClient.invalidateQueries();
      formApi.reset();
      setIsOpen(false);
      setTaskId(null);
    },
  });

  if (!taskId) return null;

  return (
    <DialogRoot
      open={isOpen}
      onOpenChange={({ open }) => {
        setIsOpen(open);
        form.reset();

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
            className="flex flex-col gap-2"
          >
            <div className="rounded border">
              <TaskLabelsForm form={form} />
            </div>

            <div className="mt-4 flex justify-end gap-2">
              <DialogCloseTrigger asChild>
                <Button variant="outline">Cancel</Button>
              </DialogCloseTrigger>

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
                  >
                    Update Labels
                  </Button>
                )}
              </form.Subscribe>
            </div>
          </form>
        </DialogContent>
      </DialogPositioner>
    </DialogRoot>
  );
};

export default UpdateTaskLabelsDialog;
