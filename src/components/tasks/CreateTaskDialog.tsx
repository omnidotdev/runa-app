import { useSuspenseQuery } from "@tanstack/react-query";
import {
  useLoaderData,
  useNavigate,
  useRouteContext,
  useSearch,
} from "@tanstack/react-router";
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
} from "@/generated/graphql";
import { Hotkeys } from "@/lib/constants/hotkeys";
import { taskFormDefaults } from "@/lib/constants/taskFormDefaults";
import useTaskStore from "@/lib/hooks/store/useTaskStore";
import useForm from "@/lib/hooks/useForm";
import useMaxTasksReached from "@/lib/hooks/useMaxTasksReached";
import projectOptions from "@/lib/options/project.options";
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

  const { createTask } = useSearch({
    from: "/_auth/workspaces/$workspaceSlug/projects/$projectSlug/",
  });

  const navigate = useNavigate({
    from: "/workspaces/$workspaceSlug/projects/$projectSlug",
  });

  const titleRef = useRef<HTMLInputElement>(null);

  const { data: project } = useSuspenseQuery({
    ...projectOptions({ rowId: projectId }),
    select: (data) => data?.project,
  });

  const defaultColumnId = project?.columns?.nodes?.[0]?.rowId! ?? null;

  const { columnId, setColumnId } = useTaskStore();

  const maxTasksReached = useMaxTasksReached();

  useHotkeys(
    Hotkeys.CreateTask,
    () =>
      navigate({
        search: (prev) => ({
          ...prev,
          createTask: !createTask,
        }),
      }),
    {
      enabled: !maxTasksReached,
      description: "Create New Task",
    },
    [navigate, createTask, maxTasksReached],
  );

  const totalTasks = project?.columns?.nodes?.flatMap((column) =>
    column?.tasks?.nodes?.map((task) => task?.rowId),
  )?.length;

  const projectLabels: {
    name: string;
    color: string;
    rowId: string;
    checked: boolean;
  }[] =
    project?.labels?.nodes.map(
      (label: { name: string; color: string; rowId: string }) => ({
        ...label,
        checked: false,
      }),
    ) ?? [];

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

        const newLabels = value.labels.filter((l) => l.rowId === "pending");

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

        const [{ createTask }] = await Promise.all([
          addNewTask({
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
          }),
        ]);

        const taskId = createTask?.task?.rowId!;

        await Promise.all(
          newTaskLabels.map((label) =>
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

        if (createTask && value.assignees.length) {
          await Promise.all(
            value.assignees.map((assignee) =>
              addNewAssignee({
                input: {
                  assignee: {
                    userId: assignee,
                    taskId: createTask.task?.rowId!,
                  },
                },
              }),
            ),
          );
        }

        queryClient.invalidateQueries();
      };

      toast.promise(createTaskOperation(), {
        loading: "Creating task...",
        success: "Task created successfully!",
        error: "Failed to create task. Please try again.",
      });

      formApi.reset();
      setTimeout(() => setColumnId(null), 350);

      navigate({
        search: (prev) => ({
          ...prev,
          createTask: false,
        }),
      });
    },
  });

  if (maxTasksReached) return null;

  return (
    <DialogRoot
      open={createTask}
      onOpenChange={({ open }) => {
        navigate({
          search: (prev) => ({
            ...prev,
            createTask: open,
          }),
        });

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
