import { useForm } from "@tanstack/react-form";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
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
} from "lucide-react";
import { useRef, useState } from "react";

import { Avatar } from "@/components/ui/avatar";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  CheckboxControl,
  CheckboxHiddenInput,
  CheckboxIndicator,
  CheckboxLabel,
  CheckboxRoot,
} from "@/components/ui/checkbox";
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
  createListCollection,
  Select,
  SelectContent,
  SelectItem,
  SelectItemGroup,
  SelectItemText,
  SelectTrigger,
} from "@/components/ui/select";
import {
  useCreateAssigneeMutation,
  useCreateTaskMutation,
} from "@/generated/graphql";
import { labelColors } from "@/lib/constants/labelColors";
import useDialogStore, { DialogType } from "@/lib/hooks/store/useDialogStore";
import projectOptions from "@/lib/options/project.options";
import usersOptions from "@/lib/options/users.options";
import { cn } from "@/lib/utils";
import getQueryClient from "@/utils/getQueryClient";

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

  const titleRef = useRef<HTMLInputElement>(null);
  const editorContainerRef = useRef<HTMLDivElement>(null);

  const queryClient = getQueryClient();

  const { data: project } = useSuspenseQuery({
    ...projectOptions(projectId),
    select: (data) => data?.project,
  });

  const { data: users } = useQuery({
    ...usersOptions,
    select: (data) => data?.users?.nodes,
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

  const usersCollection = createListCollection({
    items:
      users?.map((user) => ({
        label: user?.name || "",
        value: user?.rowId || "",
        user: user,
      })) || [],
  });

  const colorCollection = createListCollection({
    items: labelColors.map((color) => ({
      label: color.name,
      value: color.name.toLowerCase(),
      color: color,
    })),
  });

  const { mutateAsync: addNewTask } = useCreateTaskMutation();
  const { mutate: addNewAssignee } = useCreateAssigneeMutation();

  const { Field, Subscribe, handleSubmit, reset, setFieldValue } = useForm({
    defaultValues: {
      title: "",
      description: "",
      labels: projectLabels,
      assignees: [] as string[],
    },
    onSubmit: async ({ value, formApi }) => {
      // TODO: dynamic with auth
      const authorId = "024bec7c-5822-4b34-f993-39cbc613e1c9";

      // TODO: add any new labels to the project labels as well?
      const addedLabels = value.labels
        .filter((l) => l.checked)
        .map((label) => ({
          name: label.name,
          color: label.color,
        }));

      const { createTask } = await addNewTask({
        input: {
          task: {
            content: value.title,
            description: value.description,
            columnId,
            authorId,
            labels: JSON.stringify(addedLabels),
          },
        },
      });

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
    // TODO: discuss. This saves the HTML in db, i.e. `<p>Testing <strong>bold</strong> text</p>` which we could later render. `getText` removes any rich text
    onUpdate: ({ editor }) => setFieldValue("description", editor.getHTML()),
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
      initialFocusEl={() => titleRef.current}
      // TODO: remove when state management with select and popover is resolved
      closeOnInteractOutside={false}
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
                    ref={titleRef}
                    className="border-none shadow-none focus-visible:ring-0 dark:bg-transparent"
                    placeholder="Task Title"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                </div>
              )}
            </Field>

            <div className="flex gap-3">
              <Field name="assignees">
                {(field) => {
                  return (
                    <Select
                      // @ts-ignore TODO: fix type issue
                      collection={usersCollection}
                      multiple
                      onValueChange={({ value }) =>
                        value.length
                          ? field.setValue(value)
                          : field.clearValues()
                      }
                    >
                      <SelectTrigger
                        showIcon={false}
                        className={cn(
                          buttonVariants({ variant: "outline" }),
                          "[&[data-state=open]>svg]:rotate-0 [&_svg:not([class*='text-'])]:text-foreground",
                        )}
                      >
                        <UserPlusIcon className="size-4" />
                        Assign
                      </SelectTrigger>

                      <SelectContent className="max-h-80 overflow-auto">
                        <SelectItemGroup className="flex flex-col gap-1">
                          {usersCollection.items.map((item) => {
                            return (
                              <SelectItem
                                key={item.value}
                                item={item}
                                className="flex items-center justify-start gap-1 px-1 py-0.5"
                              >
                                <Avatar
                                  src={item.user?.avatarUrl!}
                                  alt={item.user?.name}
                                  fallback={item.user?.name?.charAt(0)}
                                  className="size-6 rounded-full"
                                />
                                <SelectItemText>{item.label}</SelectItemText>
                              </SelectItem>
                            );
                          })}
                        </SelectItemGroup>
                      </SelectContent>
                    </Select>
                  );
                }}
              </Field>

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
                                // @ts-ignore TODO: type issue
                                collection={colorCollection}
                                value={[newLabel.color]}
                                onValueChange={(details) => {
                                  setNewLabel((prev) => ({
                                    ...prev,
                                    color: details.value[0] || "blue",
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
                                  <SelectItemGroup>
                                    {colorCollection.items.map((item) => (
                                      <SelectItem key={item.value} item={item}>
                                        <SelectItemText>
                                          {item.label}
                                        </SelectItemText>

                                        <div
                                          className={cn(
                                            "size-4 rounded-full",
                                            item.color.classes,
                                          )}
                                        />
                                      </SelectItem>
                                    ))}
                                  </SelectItemGroup>
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

              {/* TODO: implement. */}
              <Button disabled variant="outline">
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
