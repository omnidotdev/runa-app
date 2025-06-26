import { useForm } from "@tanstack/react-form";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useParams } from "@tanstack/react-router";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import TaskItem from "@tiptap/extension-task-item";
import TaskList from "@tiptap/extension-task-list";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
  CalendarIcon,
  TagIcon,
  TypeIcon,
  UserPlusIcon,
  XIcon,
} from "lucide-react";
import { useRef } from "react";

import { Button } from "@/components/ui/button";
import {
  DialogBackdrop,
  DialogCloseTrigger,
  DialogContent,
  DialogPositioner,
  DialogRoot,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import useDialogStore, { DialogType } from "@/lib/hooks/store/useDialogStore";
import projectOptions from "@/lib/options/project.options";
import { cn } from "@/lib/utils";

interface Props {
  columnId: string;
}

const CreateTaskDialog = ({ columnId }: Props) => {
  const editorContainerRef = useRef<HTMLDivElement>(null);

  const { projectId } = useParams({
    from: "/_auth/workspaces/$workspaceId/projects/$projectId/",
  });

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

  const { Field, Subscribe, handleSubmit, reset } = useForm({
    defaultValues: {
      title: "",
      description: "",
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
        showOnlyWhenEditable: true,
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
  });

  const handleContainerClick = () => {
    if (editor) {
      editor.commands.focus();
    }
  };

  return (
    <DialogRoot
      open={isOpen}
      onOpenChange={({ open }) => {
        setIsOpen(open);
        reset();
      }}
    >
      <DialogBackdrop />
      <DialogPositioner>
        <DialogContent>
          <DialogCloseTrigger className="absolute top-4 right-4 rounded-full p-1">
            <XIcon className="size-4" />
          </DialogCloseTrigger>

          <form
            className="flex flex-col gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleSubmit();
            }}
          >
            <Field name="title">
              {(field) => (
                <div className="-mt-3 flex items-center gap-2 border-b py-1 pr-8">
                  <span className="mt-0.5 text-nowrap font-medium font-mono text-base-400 text-xs dark:text-base-500">
                    {project?.prefix
                      ? `${project?.prefix}-${totalTasks}`
                      : `PROJ-${totalTasks}`}
                  </span>
                  <Input
                    className="border-none shadow-none focus-visible:ring-0"
                    placeholder="Task Title"
                    autoFocus
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                </div>
              )}
            </Field>

            <div className="flex gap-3">
              <Button variant="outline">
                <UserPlusIcon className="size-4" />
                Assign
              </Button>

              <Button variant="outline">
                <TagIcon className="size-4" />
                Add labels
              </Button>

              <Button variant="outline">
                <CalendarIcon className="size-4" />
                Set due date
              </Button>
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
                onClick={handleContainerClick}
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

              <Subscribe
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
              </Subscribe>
            </div>
          </form>
        </DialogContent>
      </DialogPositioner>
    </DialogRoot>
  );
};

export default CreateTaskDialog;
