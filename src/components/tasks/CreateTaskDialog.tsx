import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { useLoaderData, useRouteContext } from "@tanstack/react-router";
import { all } from "better-all";
import { useRef } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { toast } from "sonner";

import { RichTextEditor } from "@/components/core";
import { Button } from "@/components/ui/button";
import {
  DialogBackdrop,
  DialogCloseTrigger,
  DialogContent,
  DialogPositioner,
  DialogRoot,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  useCreateAssigneeMutation,
  useCreateLabelMutation,
  useCreateTaskLabelMutation,
  useCreateTaskMutation,
  useProjectQuery,
  useTasksQuery,
} from "@/generated/graphql";
import { Hotkeys } from "@/lib/constants/hotkeys";
import { taskFormDefaults } from "@/lib/constants/taskFormDefaults";
import useDialogStore, { DialogType } from "@/lib/hooks/store/useDialogStore";
import useTaskStore from "@/lib/hooks/store/useTaskStore";
import useForm from "@/lib/hooks/useForm";
import useMaxTasksReached from "@/lib/hooks/useMaxTasksReached";
import labelsOptions from "@/lib/options/labels.options";
import projectOptions from "@/lib/options/project.options";
import getQueryKeyPrefix from "@/lib/util/getQueryKeyPrefix";
import CreateTaskAssignees from "./CreateTaskAssignees";
import CreateTaskDatePicker from "./CreateTaskDatePicker";
import CreateTaskLabels from "./CreateTaskLabels";
import CreateTaskPriority from "./CreateTaskPriority";
import TaskColumnForm from "./TaskColumnForm";

const CreateTaskDialog = () => {
  const { projectId } = useLoaderData({
    from: "/_auth/workspaces/$workspaceSlug/projects/$projectSlug/",
  });

  const { session, queryClient } = useRouteContext({
    from: "/_auth/workspaces/$workspaceSlug/projects/$projectSlug/",
  });

  const titleRef = useRef<HTMLInputElement>(null);

  const { data: project } = useSuspenseQuery({
    ...projectOptions({ rowId: projectId }),
    select: (data) => data?.project,
  });

  const { data: labels } = useQuery({
    ...labelsOptions({ projectId }),
    select: (data) => data?.labels?.nodes ?? [],
    enabled: !!projectId,
  });

  const defaultColumnId = project?.columns?.nodes?.[0]?.rowId! ?? null;

  const { columnId, setColumnId } = useTaskStore();

  const maxTasksReached = useMaxTasksReached();

  const { isOpen: isCreateTaskOpen, setIsOpen: setIsCreateTaskOpen } =
    useDialogStore({
      type: DialogType.CreateTask,
    });

  useHotkeys(
    Hotkeys.CreateTask,
    () => setIsCreateTaskOpen(true),
    {
      enabled: !maxTasksReached,
      description: "Create New Task",
    },
    [maxTasksReached],
  );

  const totalTasks = project?.tasks?.totalCount ?? 0;

  const projectLabels: {
    name: string;
    color: string;
    rowId: string;
    checked: boolean;
  }[] =
    labels?.map((label) => ({
      ...label,
      checked: false,
    })) ?? [];

  const { mutateAsync: addNewTask } = useCreateTaskMutation();
  const { mutate: addNewAssignee } = useCreateAssigneeMutation();
  const { mutateAsync: updateProjectLabel } = useCreateLabelMutation();
  const { mutateAsync: createTaskLabel } = useCreateTaskLabelMutation();

  const form = useForm({
    defaultValues: {
      ...taskFormDefaults,
      labels: projectLabels,
      columnId: columnId ?? defaultColumnId,
    },
    onSubmit: async ({ value, formApi }) => {
      const createTaskOperation = async () => {
        const allTaskLabels = value.labels.filter((l) => l.checked);
        const pendingLabels = value.labels.filter((l) => l.rowId === "pending");
        const existingTaskLabels = allTaskLabels.filter(
          (label) => label.rowId !== "pending",
        );

        await all({
          async newLabels() {
            return Promise.all(
              pendingLabels.map((label) =>
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
          },
          async task() {
            return addNewTask({
              input: {
                task: {
                  content: value.title,
                  description: value.description,
                  projectId,
                  columnId: value.columnId,
                  authorId: session?.user?.rowId!,
                  dueDate: value.dueDate.length
                    ? new Date(value.dueDate)
                    : undefined,
                  priority: value.priority,
                  columnIndex: totalTasks ?? 0,
                },
              },
            });
          },
          async taskLabels() {
            const [newLabels, task] = await Promise.all([
              this.$.newLabels,
              this.$.task,
            ]);
            const newlyAddedLabels = newLabels.map(
              (mutation) => mutation.createLabel?.label!,
            );
            const allLabels = [...existingTaskLabels, ...newlyAddedLabels];
            const taskId = task.createTask?.task?.rowId!;

            return Promise.all(
              allLabels.map((label) =>
                createTaskLabel({
                  input: {
                    taskLabel: {
                      labelId: label.rowId,
                      taskId,
                    },
                  },
                }),
              ),
            );
          },
          async assignees() {
            const task = await this.$.task;
            if (!task.createTask || !value.assignees.length) return;

            return Promise.all(
              value.assignees.map((assignee) =>
                addNewAssignee({
                  input: {
                    assignee: {
                      userId: assignee,
                      taskId: task.createTask?.task?.rowId!,
                    },
                  },
                }),
              ),
            );
          },
        });

        queryClient.invalidateQueries({
          queryKey: getQueryKeyPrefix(useTasksQuery),
        });
        queryClient.invalidateQueries({
          queryKey: getQueryKeyPrefix(useProjectQuery),
        });
      };

      toast.promise(createTaskOperation(), {
        loading: "Creating task...",
        success: "Task created successfully!",
        error: "Failed to create task. Please try again.",
      });

      formApi.reset();
      setTimeout(() => setColumnId(null), 350);

      setIsCreateTaskOpen(false);
    },
  });

  if (maxTasksReached) return null;

  return (
    <DialogRoot
      open={isCreateTaskOpen}
      onOpenChange={({ open }) => {
        setIsCreateTaskOpen(open);
        form.reset();

        if (!open) {
          // Allow for dialog close animation to finish
          setTimeout(() => setColumnId(null), 350);
        }
      }}
      initialFocusEl={() => titleRef.current}
      unmountOnExit
    >
      <DialogBackdrop />
      <DialogPositioner>
        <DialogContent className="mx-8 flex max-w-3xl flex-col items-start rounded-lg">
          <DialogCloseTrigger />

          <span className="text-nowrap font-medium font-mono text-base-400 dark:text-base-500">
            {project?.prefix
              ? `${project?.prefix}-${totalTasks}`
              : `PROJ-${totalTasks}`}
          </span>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
            className="flex w-full flex-1 flex-col gap-2"
          >
            {/* Tasks properties */}
            <div className="flex gap-3 py-2">
              <CreateTaskAssignees form={form} />

              <CreateTaskLabels form={form} />

              <CreateTaskDatePicker form={form} />

              <TaskColumnForm form={form} />

              <CreateTaskPriority form={form} />
            </div>

            <form.Field name="title">
              {(field) => (
                <div className="flex items-center gap-2 py-1">
                  <Input
                    ref={titleRef}
                    id="task-title"
                    className="border-base-300 border-dashed shadow-none transition-none placeholder:text-base-400 hover:border-base-400 focus-visible:ring-0 dark:border-base-600 dark:bg-transparent dark:hover:border-base-500"
                    placeholder="Task title..."
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                </div>
              )}
            </form.Field>

            <RichTextEditor
              className="min-h-40 text-xs placeholder:text-xs md:text-sm"
              placeholder="Task description..."
              onUpdate={({ editor }) =>
                form.setFieldValue("description", editor.getHTML())
              }
            />

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
                    Create Task
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

export default CreateTaskDialog;
