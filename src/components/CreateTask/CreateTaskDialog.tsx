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
  CheckIcon,
  PlusIcon,
  TagIcon,
  TypeIcon,
  UserPlusIcon,
  XIcon,
} from "lucide-react";
import { useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  DialogBackdrop,
  DialogCloseTrigger,
  DialogContent,
  DialogPositioner,
  DialogRoot,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { labelColors } from "@/lib/constants/labelColors";
import useDialogStore, { DialogType } from "@/lib/hooks/store/useDialogStore";
import projectOptions from "@/lib/options/project.options";
import { cn } from "@/lib/utils";
import {
  CheckboxControl,
  CheckboxHiddenInput,
  CheckboxIndicator,
  CheckboxLabel,
  CheckboxRoot,
} from "../ui/checkbox";
import {
  PopoverContent,
  PopoverPositioner,
  PopoverRoot,
  PopoverTrigger,
} from "../ui/popover";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectItemText,
  SelectTrigger,
} from "../ui/select";

interface Props {
  columnId: string;
}

const CreateTaskDialog = ({ columnId }: Props) => {
  const { projectId } = useParams({
    from: "/_auth/workspaces/$workspaceId/projects/$projectId/",
  });

  const [newLabel, setNewLabel] = useState({
    name: "",
    color: "blue",
  });

  const editorContainerRef = useRef<HTMLDivElement>(null);

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

  const { Field, Subscribe, handleSubmit, reset } = useForm({
    defaultValues: {
      title: "",
      description: "",
      labels: projectLabels,
    },
    onSubmit({ value, formApi }) {
      const addedLabels = value.labels
        .filter((l) => l.checked)
        .map((label) => ({
          name: label.name,
          color: label.color,
        }));

      alert(JSON.stringify(addedLabels));
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
      // TODO: remove when state management with select and popover is resolved
      closeOnInteractOutside={false}
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

              <PopoverRoot>
                <PopoverTrigger asChild>
                  <Button variant="outline">
                    <TagIcon className="size-4" />
                    Add labels
                  </Button>
                </PopoverTrigger>

                <PopoverPositioner>
                  <PopoverContent className="flex min-w-80 flex-col gap-2">
                    <Field name="labels" mode="array">
                      {(field) => {
                        return (
                          <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-2 pb-2">
                              {/* TODO: make sure that selection doesn't close popover. Happens if value is outside the bounds of the popover */}
                              <Select
                                value={newLabel.color}
                                onValueChange={(value) => {
                                  setNewLabel((prev) => ({
                                    ...prev,
                                    color: value,
                                  }));
                                }}
                              >
                                <SelectTrigger>
                                  <div
                                    className={cn(
                                      "size-4 rounded-full",
                                      labelColors.find(
                                        (l) =>
                                          l.name.toLowerCase() ===
                                          newLabel.color,
                                      )?.classes,
                                    )}
                                  />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectGroup>
                                    {labelColors.map((color) => (
                                      <SelectItem
                                        key={color.name}
                                        value={color.name.toLowerCase()}
                                      >
                                        <SelectItemText>
                                          {color.name}
                                        </SelectItemText>

                                        <div
                                          className={cn(
                                            "size-4 rounded-full",
                                            color.classes,
                                          )}
                                        />
                                      </SelectItem>
                                    ))}
                                  </SelectGroup>
                                </SelectContent>
                              </Select>
                              <Input
                                placeholder="Add new label..."
                                value={newLabel.name}
                                onChange={(e) =>
                                  setNewLabel((prev) => ({
                                    ...prev,
                                    name: e.target.value,
                                  }))
                                }
                              />
                              <Button
                                variant="ghost"
                                size="icon"
                                disabled={!newLabel.name || !newLabel.color}
                                onClick={() =>
                                  field.pushValue({
                                    name: newLabel.name,
                                    color: newLabel.color,
                                    checked: true,
                                  })
                                }
                              >
                                <PlusIcon className="size-4" />
                              </Button>
                            </div>

                            {field.state.value.map((label, i) => {
                              return (
                                <Field key={label.name} name={`labels[${i}]`}>
                                  {(subField) => {
                                    return (
                                      <CheckboxRoot
                                        className="flex items-center justify-between"
                                        defaultChecked={
                                          subField.state.value.checked
                                        }
                                        onCheckedChange={({ checked }) =>
                                          subField.handleChange({
                                            ...subField.state.value,
                                            checked: !!checked,
                                          })
                                        }
                                      >
                                        <CheckboxLabel className="ml-0">
                                          <div className="flex items-center gap-2">
                                            <div
                                              className={cn(
                                                "size-4 rounded-full",
                                                labelColors.find(
                                                  (l) =>
                                                    l.name.toLowerCase() ===
                                                    subField.state.value.color,
                                                )?.classes,
                                              )}
                                            />
                                            <p className="text-sm">
                                              {subField.state.value.name}
                                            </p>
                                          </div>
                                        </CheckboxLabel>
                                        <CheckboxHiddenInput />
                                        <CheckboxControl>
                                          <CheckboxIndicator>
                                            <CheckIcon className="size-4" />
                                          </CheckboxIndicator>
                                        </CheckboxControl>
                                      </CheckboxRoot>
                                    );
                                  }}
                                </Field>
                              );
                            })}
                          </div>
                        );
                      }}
                    </Field>
                  </PopoverContent>
                </PopoverPositioner>
              </PopoverRoot>

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
