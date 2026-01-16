import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "@tanstack/react-router";
import { all } from "better-all";
import { useHotkeys } from "react-hotkeys-hook";

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
  useTasksQuery,
} from "@/generated/graphql";
import { Hotkeys } from "@/lib/constants/hotkeys";
import { taskFormDefaults } from "@/lib/constants/taskFormDefaults";
import useDialogStore, { DialogType } from "@/lib/hooks/store/useDialogStore";
import useTaskStore from "@/lib/hooks/store/useTaskStore";
import useForm from "@/lib/hooks/useForm";
import labelsOptions from "@/lib/options/labels.options";
import taskOptions from "@/lib/options/task.options";
import getQueryKeyPrefix from "@/lib/util/getQueryKeyPrefix";
import TaskLabelsForm from "./TaskLabelsForm";

const UpdateTaskLabelsDialog = () => {
  const queryClient = useQueryClient();

  const { taskId: paramsTaskId } = useParams({
    strict: false,
  });

  const { taskId: storeTaskId, setTaskId } = useTaskStore();

  const taskId = paramsTaskId ?? storeTaskId;
  const taskQueryKey = taskOptions({ rowId: taskId! }).queryKey;

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

  const projectId = task?.projectId;

  const { data: labels = [] } = useQuery({
    ...labelsOptions({ projectId: projectId! }),
    enabled: !!projectId,
    select: (data) => data?.labels?.nodes ?? [],
  });

  const taskLabelIds =
    task?.taskLabels?.nodes?.map((label) => label.label?.rowId!) ?? [];

  const defaultLabels = labels.map((label) => ({
    ...label,
    checked: taskLabelIds.includes(label.rowId),
  }));

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
      const pendingLabels = value.labels.filter((l) => l.rowId === "pending");
      const existingTaskLabels = allTaskLabels.filter(
        (label) => label.rowId !== "pending",
      );

      const currentTaskLabels =
        task?.taskLabels?.nodes?.map((l) => ({
          taskId: l.taskId,
          labelId: l.labelId,
        })) ?? [];

      await all({
        async newLabels() {
          return Promise.all(
            pendingLabels.map((label) =>
              updateProjectLabel({
                input: {
                  label: {
                    name: label.name,
                    color: label.color,
                    projectId: projectId!,
                  },
                },
              }),
            ),
          );
        },
        async deleteCurrentLabels() {
          return Promise.all(
            currentTaskLabels.map(({ taskId, labelId }) =>
              deleteTaskLabel({ taskId, labelId }),
            ),
          );
        },
        async createTaskLabels() {
          const newLabels = await this.$.newLabels;
          const newlyAddedLabels = newLabels.map(
            (mutation) => mutation.createLabel?.label!,
          );
          const allLabels = [...existingTaskLabels, ...newlyAddedLabels];

          return Promise.all(
            allLabels.map((label) =>
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
        },
      });

      queryClient.invalidateQueries({ queryKey: taskQueryKey });
      queryClient.invalidateQueries({
        queryKey: getQueryKeyPrefix(useTasksQuery),
      });
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
                  state.isDefaultValue,
                ]}
              >
                {([canSubmit, isSubmitting, isDefaultValue]) => (
                  <Button
                    type="submit"
                    disabled={!canSubmit || isSubmitting || isDefaultValue}
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
