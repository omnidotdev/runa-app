import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "@tanstack/react-router";
import { all } from "better-all";
import { useEffect } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { toast } from "sonner";

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
  useLabelsQuery,
  useTasksQuery,
  useWorkspaceLabelsQuery,
} from "@/generated/graphql";
import { Hotkeys } from "@/lib/constants/hotkeys";
import { taskFormDefaults } from "@/lib/constants/taskFormDefaults";
import useDialogStore, { DialogType } from "@/lib/hooks/store/useDialogStore";
import useTaskStore from "@/lib/hooks/store/useTaskStore";
import useForm from "@/lib/hooks/useForm";
import labelsOptions from "@/lib/options/labels.options";
import taskOptions from "@/lib/options/task.options";
import getQueryKeyPrefix from "@/lib/util/getQueryKeyPrefix";
import { parseTaskParam } from "@/lib/util/taskUrl";
import TaskLabelsForm from "./TaskLabelsForm";

import type { TaskQuery, TasksQuery } from "@/generated/graphql";

const UpdateTaskLabelsDialog = () => {
  const queryClient = useQueryClient();

  const { taskId: paramsTaskId } = useParams({
    strict: false,
  });

  const { taskId: storeTaskId, setTaskId } = useTaskStore();

  // on the detail route the URL param is a vanity key, so fall back to the
  // store (set to the resolved rowId); only a legacy UUID param is a rowId
  const taskId =
    paramsTaskId && parseTaskParam(paramsTaskId).type === "uuid"
      ? paramsTaskId
      : storeTaskId;
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
    onSubmit: ({ value }) => {
      const checkedLabels = value.labels.filter((l) => l.checked);
      const pendingLabels = value.labels.filter((l) => l.rowId === "pending");
      const existingTaskLabels = checkedLabels.filter(
        (label) => label.rowId !== "pending",
      );

      const currentTaskLabels =
        task?.taskLabels?.nodes?.map((l) => ({
          taskId: l.taskId,
          labelId: l.labelId,
        })) ?? [];

      // Optimistic label objects. Brand-new "pending" labels get a temporary id
      // so they render instantly; the post-write refetch swaps in the real ids.
      const optimisticLabels = checkedLabels.map((label) => ({
        __typename: "Label" as const,
        rowId:
          label.rowId === "pending"
            ? `optimistic-${crypto.randomUUID()}`
            : label.rowId,
        name: label.name,
        color: label.color,
        icon: label.icon ?? null,
        projectId: label.projectId ?? projectId ?? null,
        organizationId: label.organizationId ?? null,
      }));

      // Snapshot for rollback if the write fails
      const previousTask = queryClient.getQueryData<TaskQuery>(taskQueryKey);
      const previousTasks = queryClient.getQueriesData<TasksQuery>({
        queryKey: getQueryKeyPrefix(useTasksQuery),
      });

      // Optimistically reflect the new label set on the task detail...
      queryClient.setQueryData<TaskQuery>(taskQueryKey, (old) =>
        old?.task
          ? {
              ...old,
              task: {
                ...old.task,
                taskLabels: {
                  __typename: "TaskLabelConnection",
                  nodes: optimisticLabels.map((label) => ({
                    __typename: "TaskLabel" as const,
                    taskId: taskId!,
                    labelId: label.rowId,
                    label,
                  })),
                },
              },
            }
          : old,
      );

      // ...and on every board/list card for this task
      queryClient.setQueriesData<TasksQuery>(
        { queryKey: getQueryKeyPrefix(useTasksQuery) },
        (old) =>
          old?.tasks?.nodes
            ? {
                ...old,
                tasks: {
                  ...old.tasks,
                  nodes: old.tasks.nodes.map((node) =>
                    node.rowId === taskId
                      ? {
                          ...node,
                          taskLabels: {
                            __typename: "TaskLabelConnection" as const,
                            nodes: optimisticLabels.map((label) => ({
                              __typename: "TaskLabel" as const,
                              label,
                            })),
                          },
                        }
                      : node,
                  ),
                },
              }
            : old,
      );

      // Close immediately; the writes reconcile in the background
      setIsOpen(false);
      setTaskId(null);

      void (async () => {
        try {
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
                currentTaskLabels.map(({ taskId: t, labelId }) =>
                  deleteTaskLabel({ taskId: t, labelId }),
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
                      taskLabel: { labelId: label.rowId, taskId: taskId! },
                    },
                  }),
                ),
              );
            },
          });
        } catch {
          // Roll back the optimistic caches on failure
          if (previousTask)
            queryClient.setQueryData(taskQueryKey, previousTask);
          for (const [key, data] of previousTasks) {
            queryClient.setQueryData(key, data);
          }
          toast.error("Couldn't update labels. Please try again.");
        } finally {
          // Reconcile the task, the board, and the shared label pickers. The
          // last two keys are why a newly-created label now reaches other tasks.
          queryClient.invalidateQueries({ queryKey: taskQueryKey });
          queryClient.invalidateQueries({
            queryKey: getQueryKeyPrefix(useTasksQuery),
          });
          queryClient.invalidateQueries({
            queryKey: getQueryKeyPrefix(useLabelsQuery),
          });
          queryClient.invalidateQueries({
            queryKey: getQueryKeyPrefix(useWorkspaceLabelsQuery),
          });
        }
      })();
    },
  });

  // Re-sync the form to the current task whenever the dialog opens or the target
  // task changes. The hotkey toggles `isOpen` directly, so `onOpenChange` never
  // fires on open; without this, a previously-hovered card's selection leaks in.
  // biome-ignore lint/correctness/useExhaustiveDependencies: reset is keyed on the resolved task/labels, not the derived defaultLabels
  useEffect(() => {
    if (isOpen) {
      form.reset({ ...taskFormDefaults, labels: defaultLabels });
    }
  }, [isOpen, taskId, task, labels]);

  if (!taskId) return null;

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
