import { useSuspenseQuery } from "@tanstack/react-query";
import { useParams } from "@tanstack/react-router";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import TaskItem from "@tiptap/extension-task-item";
import TaskList from "@tiptap/extension-task-list";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { TagIcon, TypeIcon } from "lucide-react";
import { useRef } from "react";

import CreateTaskAssignees from "@/components/CreateTask/CreateTaskAssignees";
import CreateTaskDatePicker from "@/components/CreateTask/CreateTaskDatePicker";
import CreateTaskLabels from "@/components/CreateTask/CreateTaskLabels";
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
  PopoverContent,
  PopoverPositioner,
  PopoverRoot,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  useCreateAssigneeMutation,
  useCreateTaskMutation,
  useUpdateProjectMutation,
} from "@/generated/graphql";
import useDialogStore, { DialogType } from "@/lib/hooks/store/useDialogStore";
import useForm from "@/lib/hooks/useForm";
import projectOptions from "@/lib/options/project.options";
import { cn } from "@/lib/utils";
import getQueryClient from "@/utils/getQueryClient";

interface Props {
  columnId: string;
}

const CreateTaskDialog = ({ columnId }: Props) => {
  const { projectId } = useParams({
    from: "/_auth/workspaces/$workspaceId/projects/$projectId/",
  });

  const titleRef = useRef<HTMLInputElement>(null);
  const editorContainerRef = useRef<HTMLDivElement>(null);

  const queryClient = getQueryClient();

  const { data: project } = useSuspenseQuery({
    ...projectOptions(projectId),
    select: (data) => data?.project,
  });

  const { isOpen, setIsOpen } = useDialogStore({
    type: DialogType.CreateTask,
  });

  const totalTasks = project?.columns?.nodes?.flatMap((column) =>
    column?.tasks?.nodes?.map((task) => task?.rowId),
  )?.length;

  const projectLabels: { name: string; color: string; checked: boolean }[] =
    project?.labels?.map((label: { name: string; color: string }) => ({
      ...label,
      checked: false,
    }));

  const { mutateAsync: addNewTask } = useCreateTaskMutation();
  const { mutate: addNewAssignee } = useCreateAssigneeMutation();
  const { mutate: updateProject } = useUpdateProjectMutation();

  const form = useForm({
    defaultValues: {
      title: "",
      description: "",
      labels: projectLabels,
      assignees: [] as string[],
      dueDate: "",
    },
    onSubmit: async ({ value, formApi }) => {
      // TODO: dynamic with auth
      const authorId = "024bec7c-5822-4b34-f993-39cbc613e1c9";

      const allLabels = value.labels.map((label) => ({
        name: label.name,
        color: label.color,
      }));

      const taskLabels = value.labels
        .filter((l) => l.checked)
        .map((label) => ({
          name: label.name,
          color: label.color,
        }));

      const [{ createTask }] = await Promise.all([
        addNewTask({
          input: {
            task: {
              content: value.title,
              description: value.description,
              columnId,
              authorId,
              labels: JSON.stringify(taskLabels),
              dueDate: value.dueDate.length
                ? new Date(value.dueDate)
                : undefined,
            },
          },
        }),
        updateProject({
          rowId: projectId,
          patch: {
            labels: allLabels,
          },
        }),
      ]);

      if (createTask && value.assignees.length) {
        for (const assignee of value.assignees) {
          addNewAssignee({
            input: {
              assignee: {
                userId: assignee,
                taskId: createTask.task?.rowId!,
              },
            },
          });
        }
      }

      queryClient.invalidateQueries();
      formApi.reset();
      setIsOpen(false);
    },
  });

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2],
        },
      }),
      Placeholder.configure({
        placeholder: "Add a detailed description...",
      }),
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
      Link.configure({
        openOnClick: false,
      }),
    ],
    editorProps: {
      attributes: {
        class: "focus:outline-none prose-sm",
        spellcheck: "false",
      },
    },
    // TODO: discuss. This saves the HTML in db, i.e. `<p>Testing <strong>bold</strong> text</p>` which we could later render. `getText` removes any rich text
    onUpdate: ({ editor }) =>
      form.setFieldValue("description", editor.getHTML()),
  });

  return (
    <DialogRoot
      open={isOpen}
      onOpenChange={({ open }) => {
        setIsOpen(open);
        form.reset();
      }}
      initialFocusEl={() => titleRef.current}
      unmountOnExit
    >
      <DialogBackdrop />
      <DialogPositioner>
        <DialogContent>
          <DialogCloseTrigger />

          <form
            className="flex flex-col gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
          >
            <form.Field name="title">
              {(field) => (
                <div className="-mt-3 flex items-center gap-2 border-b py-1 pr-8">
                  <span className="mt-0.5 text-nowrap font-medium font-mono text-base-400 text-xs dark:text-base-500">
                    {project?.prefix
                      ? `${project?.prefix}-${totalTasks}`
                      : `PROJ-${totalTasks}`}
                  </span>
                  <Input
                    ref={titleRef}
                    className="border-none shadow-none focus-visible:ring-0 dark:bg-transparent"
                    placeholder="Task Title"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                </div>
              )}
            </form.Field>

            <div className="flex gap-3">
              <CreateTaskAssignees form={form} />

              <PopoverRoot>
                <PopoverTrigger asChild>
                  <Button variant="outline">
                    <TagIcon className="size-4" />
                    Add labels
                  </Button>
                </PopoverTrigger>

                <PopoverPositioner>
                  <PopoverContent className="flex min-w-80 flex-col gap-2">
                    <CreateTaskLabels form={form} />
                  </PopoverContent>
                </PopoverPositioner>
              </PopoverRoot>

              <CreateTaskDatePicker form={form} />
            </div>

            <div className="prose prose-sm dark:prose-invert w-full max-w-none">
              <div className="mb-2 flex items-center gap-2">
                <TypeIcon className="h-4 w-4 text-base-500 dark:text-base-400" />
                <h3 className="m-0 font-medium text-base-700 text-sm dark:text-base-300">
                  Description
                </h3>
              </div>
              <div
                ref={editorContainerRef}
                onClick={() => {
                  if (editor) {
                    editor.commands.focus();
                  }
                }}
                className="prose prose-sm dark:prose-invert relative max-w-none"
              >
                <EditorContent
                  editor={editor}
                  className={cn(
                    "pointer-events-auto min-h-[120px] rounded-md border border-base-300 border-dashed bg-transparent p-3 text-base-600 dark:border-base-600 dark:text-base-300 dark:hover:border-base-500",
                    editor?.isFocused
                      ? "border-2 border-primary-500/20 bg-primary-50/50 dark:border-primary-500/10 dark:bg-primary-900/5"
                      : "hover:border-base-400 dark:hover:border-base-500",
                  )}
                />
              </div>
            </div>

            <div className="flex justify-end gap-2">
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
