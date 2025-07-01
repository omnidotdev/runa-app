import { useSuspenseQuery } from "@tanstack/react-query";
import { notFound } from "@tanstack/react-router";
import { format } from "date-fns";
import {
  AlertCircleIcon,
  AlertTriangleIcon,
  ArrowLeftIcon,
  CalendarIcon,
  CheckCircle2Icon,
  CircleDotIcon,
  CircleIcon,
  ClockIcon,
  EyeIcon,
  InfoIcon,
  MessageSquareIcon,
  MinusCircleIcon,
  MoreHorizontalIcon,
  SendIcon,
  TagIcon,
  TypeIcon,
  UserIcon,
} from "lucide-react";
import { useRef, useState } from "react";
import { useDebounceCallback } from "usehooks-ts";

import Link from "@/components/core/Link";
import RichTextEditor from "@/components/core/RichTextEditor";
import NotFound from "@/components/layout/NotFound";
import TaskLabelsForm from "@/components/tasks/TaskLabelsForm";
import UpdateAssignees from "@/components/tasks/UpdateAssignees";
import UpdateDueDate from "@/components/tasks/UpdateDueDate";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CardContent, CardHeader, CardRoot } from "@/components/ui/card";
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
  useCreatePostMutation,
  useDeleteAssigneeMutation,
  useUpdateTaskMutation,
} from "@/generated/graphql";
import useForm from "@/lib/hooks/useForm";
import projectOptions from "@/lib/options/project.options";
import taskOptions from "@/lib/options/task.options";
import { getLabelClasses } from "@/lib/util/getLabelClasses";
import { cn } from "@/lib/utils";
import seo from "@/utils/seo";

import type { EditorApi } from "@/components/core/RichTextEditor";

export const Route = createFileRoute({
  loader: async ({ params: { taskId }, context: { queryClient } }) => {
    const { task } = await queryClient.ensureQueryData(taskOptions(taskId));

    if (!task) {
      throw notFound();
    }
  },
  head: () => ({
    meta: [...seo({ title: "Task" })],
  }),
  notFoundComponent: () => <NotFound>Task Not Found</NotFound>,
  component: TaskPage,
});

const StatusBadge = ({ status }: { status: string }) => {
  const statusConfig = {
    "To Do": {
      icon: ClockIcon,
      label: "To Do",
      className:
        "bg-base-100 text-base-600 dark:bg-base-800 dark:text-base-300",
    },
    "In Progress": {
      icon: AlertCircleIcon,
      label: "In Progress",
      className:
        "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300",
    },
    "Awaiting Review": {
      icon: EyeIcon,
      label: "Awaiting Review",
      className:
        "bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300",
    },
    Done: {
      icon: CheckCircle2Icon,
      label: "Done",
      className:
        "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300",
    },
    Backlog: {
      icon: CircleIcon,
      label: "Backlog",
      className:
        "bg-base-100 text-base-600 dark:bg-base-800 dark:text-base-300",
    },
  };

  const config = statusConfig[status as keyof typeof statusConfig];
  if (!config) return null;

  const Icon = config.icon;

  return (
    <Badge className={cn("gap-1.5", config.className)} variant="outline">
      <Icon className="!size-2.5" />
      {config.label}
    </Badge>
  );
};

const PriorityBadge = ({ priority }: { priority: string }) => {
  const priorityConfig = {
    high: {
      icon: AlertTriangleIcon,
      label: "High",
      className: "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-300",
    },
    medium: {
      icon: CircleDotIcon,
      label: "Medium",
      className:
        "bg-yellow-50 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-300",
    },
    low: {
      icon: MinusCircleIcon,
      label: "Low",
      className:
        "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300",
    },
  };

  const config = priorityConfig[priority as keyof typeof priorityConfig];
  if (!config) return null;

  const Icon = config.icon;

  return (
    <Badge className={cn("gap-1.5", config.className)} variant="outline">
      <Icon className="!size-2.5" />
      {config.label}
    </Badge>
  );
};

function TaskPage() {
  const { workspaceId, projectId, taskId } = Route.useParams();

  const commentEditorApiRef = useRef<EditorApi | null>(null);

  const { data: task } = useSuspenseQuery({
    ...taskOptions(taskId),
    select: (data) => data?.task,
  });

  const { data: project } = useSuspenseQuery({
    ...projectOptions(projectId),
    select: (data) => data?.project,
  });

  const defaultAssignees = task?.assignees?.nodes?.map(
    (assignee) => assignee?.user?.rowId!,
  );

  const defaultLabels: { name: string; color: string; checked: boolean }[] =
    project?.labels?.map((label: { name: string; color: string }) => ({
      ...label,
      // TODO: This assumes that label names are unique per project, validate this
      checked: task?.labels?.includes(label.name) || false,
    }));

  const columnCollection = createListCollection({
    items:
      project?.columns?.nodes?.map((column) => ({
        label: column?.title ?? "",
        value: column?.rowId ?? "",
      })) ?? [],
  });

  const priorityCollection = createListCollection({
    items: [
      { label: "Low", value: "low" },
      { label: "Medium", value: "medium" },
      { label: "High", value: "high" },
    ],
  });

  const { mutate: updateTask } = useUpdateTaskMutation({
    meta: {
      invalidates: [
        taskOptions(taskId).queryKey,
        projectOptions(projectId).queryKey,
      ],
    },
  });
  const { mutate: addComment } = useCreatePostMutation({
    meta: {
      invalidates: [taskOptions(taskId).queryKey],
    },
  });
  const { mutate: addNewAssignee } = useCreateAssigneeMutation({
    meta: {
      invalidates: [
        taskOptions(taskId).queryKey,
        projectOptions(projectId).queryKey,
      ],
    },
  });
  const { mutate: removeAssignee } = useDeleteAssigneeMutation({
    meta: {
      invalidates: [
        taskOptions(taskId).queryKey,
        projectOptions(projectId).queryKey,
      ],
    },
  });

  const handleTaskUpdate = useDebounceCallback(updateTask, 300);

  const [newComment, setNewComment] = useState("");

  const handleAddComment = () => {
    // TODO: dynamic with auth
    const authorId = "024bec7c-5822-4b34-f993-39cbc613e1c9";

    if (newComment.trim()) {
      addComment({
        input: {
          post: {
            taskId,
            authorId,
            description: newComment,
          },
        },
      });
      setNewComment("");

      if (commentEditorApiRef.current) {
        commentEditorApiRef.current.clearContent();
      }
    }
  };

  const updateLabelsForm = useForm({
    defaultValues: {
      title: "",
      description: "",
      labels: defaultLabels,
      assignees: [] as string[],
      dueDate: "",
    },
    onSubmit: ({ value }) => {
      // TODO: update project labels if new label is created
      const taskLabels = value.labels
        .filter((l) => l.checked)
        .map((label) => ({
          name: label.name,
          color: label.color,
        }));

      updateTask({
        rowId: taskId,
        patch: {
          labels: JSON.stringify(taskLabels),
        },
      });
    },
  });

  const updateAssigneesForm = useForm({
    defaultValues: {
      title: "",
      description: "",
      labels: [] as {
        name: string;
        color: string;
        checked: boolean;
      }[],
      assignees: defaultAssignees ?? [],
      dueDate: "",
    },
    onSubmit: ({ value: { assignees } }) => {
      for (const assignee of assignees) {
        // Add any new assignees
        if (!defaultAssignees?.includes(assignee)) {
          addNewAssignee({
            input: {
              assignee: {
                taskId,
                userId: assignee,
              },
            },
          });
        }
      }

      if (defaultAssignees?.length) {
        for (const assignee of defaultAssignees) {
          // remove any assignees that are no longer assigned
          if (!assignees.includes(assignee)) {
            removeAssignee({
              rowId: task?.assignees?.nodes?.find(
                (a) => a?.user?.rowId === assignee,
              )?.rowId!,
            });
          }
        }
      }
    },
  });

  return (
    <div className="flex h-full">
      {/* Main content */}
      <div className="flex-1 overflow-auto">
        <div className="h-full p-12">
          {/* Header */}
          <div className="mb-10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link
                to="/workspaces/$workspaceId/projects/$projectId"
                params={{
                  workspaceId,
                  projectId,
                }}
                variant="ghost"
                size="icon"
              >
                <ArrowLeftIcon className="size-4" />
              </Link>
              <div className="flex flex-col gap-2">
                <RichTextEditor
                  defaultContent={task?.content}
                  className="min-h-0 border-0 bg-transparent p-0 text-2xl dark:bg-transparent"
                  skeletonClassName="h-[33px]"
                  onUpdate={({ editor }) =>
                    handleTaskUpdate({
                      rowId: taskId,
                      patch: {
                        content: editor.getHTML(),
                      },
                    })
                  }
                />
                <div className="flex items-center gap-2">
                  <span className="font-mono text-base-400 text-sm dark:text-base-500">
                    PROJ-123
                  </span>
                  <Select
                    // @ts-ignore TODO: type issue
                    collection={columnCollection}
                    defaultValue={[task?.columnId!]}
                    onValueChange={({ value }) =>
                      updateTask({
                        rowId: taskId,
                        patch: {
                          columnId: value[0],
                        },
                      })
                    }
                  >
                    <SelectTrigger className="size-fit bg-transparent p-0 data-[size=default]:h-fit dark:bg-transparent">
                      <StatusBadge status={task?.column?.title!} />
                    </SelectTrigger>

                    <SelectContent>
                      <SelectItemGroup className="space-y-1">
                        {columnCollection.items.map((column) => (
                          <SelectItem key={column.value} item={column}>
                            <SelectItemText>{column.label}</SelectItemText>
                          </SelectItem>
                        ))}
                      </SelectItemGroup>
                    </SelectContent>
                  </Select>

                  <Select
                    // @ts-ignore TODO: type issue
                    collection={priorityCollection}
                    defaultValue={[task?.priority!]}
                    onValueChange={({ value }) =>
                      updateTask({
                        rowId: taskId,
                        patch: {
                          priority: value[0],
                        },
                      })
                    }
                  >
                    <SelectTrigger className="size-fit bg-transparent p-0 data-[size=default]:h-fit dark:bg-transparent">
                      <PriorityBadge priority={task?.priority!} />
                    </SelectTrigger>

                    <SelectContent>
                      <SelectItemGroup className="space-y-1">
                        {priorityCollection.items.map((column) => (
                          <SelectItem key={column.value} item={column}>
                            <SelectItemText>{column.label}</SelectItemText>
                          </SelectItem>
                        ))}
                      </SelectItemGroup>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>

          <div className="grid h-full grid-cols-1 gap-12 lg:grid-cols-3">
            {/* Main content column */}
            <div className="space-y-10 lg:col-span-2">
              {/* Description */}
              <CardRoot className="border-0 p-0 dark:shadow-base-500/10">
                <CardHeader className="flex flex-row items-center gap-2 rounded-t-xl bg-base-50 p-3 dark:bg-base-800">
                  <TypeIcon className="size-4 text-base-500 dark:text-base-400" />
                  <h2 className="font-semibold text-base-900 text-lg dark:text-base-100">
                    Description
                  </h2>
                </CardHeader>
                <CardContent className="p-0">
                  <RichTextEditor
                    defaultContent={task?.description}
                    className="border-0"
                    skeletonClassName="h-[120px]"
                    onUpdate={({ editor }) =>
                      handleTaskUpdate({
                        rowId: taskId,
                        patch: {
                          description: editor.getHTML(),
                        },
                      })
                    }
                  />
                </CardContent>
              </CardRoot>

              {/* Comments */}
              <CardRoot className="mb-8 border-0 p-0 dark:shadow-base-500/10">
                <CardHeader className="flex flex-row items-center gap-2 rounded-t-xl bg-base-50 p-3 dark:bg-base-800">
                  <MessageSquareIcon className="size-4 text-base-500 dark:text-base-400" />
                  <h2 className="font-semibold text-base-900 text-lg dark:text-base-100">
                    Comments
                  </h2>
                  <Badge variant="subtle" size="sm">
                    {task?.posts?.totalCount ?? 0}
                  </Badge>
                </CardHeader>
                {/* TODO: discuss different mutations for existing comments. Use Linear as ref possibly? */}
                <CardContent className="mt-4 space-y-8">
                  {task?.posts?.nodes?.map((comment) => (
                    <div key={comment?.rowId} className="flex gap-4">
                      <Avatar
                        fallback={comment?.author?.name.charAt(0)}
                        src={comment?.author?.avatarUrl ?? undefined}
                        alt={comment?.author?.name}
                        size="md"
                        className="rounded-full border-2 border-base-100 dark:border-base-900"
                      />
                      <div className="flex-1 space-y-3">
                        <div className="flex items-center gap-3">
                          <span className="font-medium text-base text-base-900 dark:text-base-100">
                            {comment?.author?.name}
                          </span>
                          <span className="text-base-500 text-sm dark:text-base-400">
                            {format(
                              new Date(comment?.createdAt!),
                              "MMM d, yyyy 'at' h:mm a",
                            )}
                          </span>
                        </div>
                        <RichTextEditor
                          defaultContent={comment?.description!}
                          className="min-h-0 border-0 p-0 py-2 text-sm leading-relaxed dark:bg-background"
                          skeletonClassName="h-[38.75px]"
                          editable={false}
                        />
                      </div>
                    </div>
                  ))}

                  {/* Add comment */}
                  <div className="flex gap-4 border-t pt-8">
                    <Avatar
                      fallback="You"
                      src={undefined}
                      alt="Your avatar"
                      size="sm"
                      className="rounded-full border-2 border-base-100 dark:border-base-900"
                    />
                    <div className="flex-1 space-y-3">
                      <RichTextEditor
                        editorApi={commentEditorApiRef}
                        className="min-h-0 border-solid p-2 text-sm dark:bg-background"
                        onUpdate={({ editor }) =>
                          setNewComment(editor.getHTML())
                        }
                        placeholder="Add a comment..."
                      />
                      <div className="flex justify-end">
                        <Button
                          size="sm"
                          onClick={handleAddComment}
                          disabled={!newComment.trim()}
                        >
                          <SendIcon className="size-3" />
                          Comment
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </CardRoot>
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Assignees */}
              <CardRoot className="border-0 p-0 dark:shadow-base-500/10">
                <CardHeader className="flex flex-row items-center justify-between rounded-t-xl bg-base-50 p-3 dark:bg-base-800">
                  <div className="flex items-center gap-2">
                    <UserIcon className="size-4 text-base-500 dark:text-base-400" />
                    <h3 className="font-medium text-base text-base-900 dark:text-base-100">
                      Assignees
                    </h3>
                  </div>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      updateAssigneesForm.handleSubmit();
                    }}
                  >
                    <PopoverRoot
                      positioning={{ placement: "bottom-end", gutter: -2 }}
                    >
                      <PopoverTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontalIcon className="size-3" />
                        </Button>
                      </PopoverTrigger>

                      <PopoverPositioner>
                        <PopoverContent className="flex min-w-80 flex-col gap-2">
                          <UpdateAssignees form={updateAssigneesForm} />

                          <updateAssigneesForm.Subscribe
                            selector={(state) => [
                              state.canSubmit,
                              state.isSubmitting,
                              state.isDirty,
                            ]}
                          >
                            {([canSubmit, isSubmitting, isDirty]) => (
                              <Button
                                type="submit"
                                disabled={
                                  !canSubmit || isSubmitting || !isDirty
                                }
                                size="sm"
                                className="mt-4"
                              >
                                Update Assignees
                              </Button>
                            )}
                          </updateAssigneesForm.Subscribe>
                        </PopoverContent>
                      </PopoverPositioner>
                    </PopoverRoot>
                  </form>
                </CardHeader>
                <CardContent className="space-y-4 p-4">
                  {task?.assignees?.nodes?.map((assignee) => (
                    <div
                      key={assignee?.rowId}
                      className="flex items-center gap-2"
                    >
                      <Avatar
                        fallback={assignee?.user?.name.charAt(0)}
                        src={assignee?.user?.avatarUrl ?? undefined}
                        alt={assignee?.user?.name}
                        size="xs"
                        className="rounded-full border-2 border-base-100 dark:border-base-900"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-medium text-base-900 text-sm dark:text-base-100">
                          {assignee?.user?.name}
                        </p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </CardRoot>

              {/* Labels */}
              <CardRoot className="border-0 p-0 dark:shadow-base-500/10">
                <CardHeader className="flex flex-row items-center justify-between rounded-t-xl bg-base-50 p-3 dark:bg-base-800">
                  <div className="flex items-center gap-2">
                    <TagIcon className="size-4 text-base-500 dark:text-base-400" />
                    <h3 className="font-medium text-base text-base-900 dark:text-base-100">
                      Labels
                    </h3>
                  </div>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      updateLabelsForm.handleSubmit();
                    }}
                  >
                    <PopoverRoot
                      positioning={{ placement: "bottom-end", gutter: -2 }}
                    >
                      <PopoverTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontalIcon className="size-3" />
                        </Button>
                      </PopoverTrigger>

                      <PopoverPositioner>
                        <PopoverContent className="flex min-w-80 flex-col gap-2">
                          <TaskLabelsForm form={updateLabelsForm} />

                          <updateLabelsForm.Subscribe
                            selector={(state) => [
                              state.canSubmit,
                              state.isSubmitting,
                              state.isDirty,
                            ]}
                          >
                            {([canSubmit, isSubmitting, isDirty]) => (
                              <Button
                                type="submit"
                                disabled={
                                  !canSubmit || isSubmitting || !isDirty
                                }
                                size="sm"
                                className="mt-4"
                              >
                                Update Labels
                              </Button>
                            )}
                          </updateLabelsForm.Subscribe>
                        </PopoverContent>
                      </PopoverPositioner>
                    </PopoverRoot>
                  </form>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="flex flex-wrap gap-2">
                    {/* TODO: remove need for `JSON.parse` used just from seed script stringifying JSON to get dynamic labels */}
                    {JSON.parse(task?.labels).map(
                      (label: { name: string; color: string }) => {
                        const colors = getLabelClasses(label.color);

                        return (
                          <Badge
                            key={label.name}
                            className={cn(colors.bg, colors.text)}
                          >
                            <TagIcon className={cn("!size-3", colors.icon)} />
                            <span className="font-medium">{label.name}</span>
                          </Badge>
                        );
                      },
                    )}
                  </div>
                </CardContent>
              </CardRoot>

              {/* Metadata */}
              <CardRoot className="border-0 p-0 dark:shadow-base-500/10">
                <CardHeader className="rounded-t-xl bg-base-50 p-3 dark:bg-base-800">
                  <div className="flex items-center gap-2">
                    <InfoIcon className="size-4 text-base-500 dark:text-base-400" />
                    <h3 className="font-medium text-base text-base-900 dark:text-base-100">
                      Details
                    </h3>
                  </div>
                </CardHeader>
                <CardContent className="space-y-5 p-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-base-500 dark:text-base-400">
                      Created
                    </span>
                    <span className="text-base-900 dark:text-base-100">
                      {format(new Date(task?.createdAt!), "MMM d, yyyy")}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-base-500 dark:text-base-400">
                      Updated
                    </span>
                    <span className="text-base-900 dark:text-base-100">
                      {format(new Date(task?.updatedAt!), "MMM d, yyyy")}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <UpdateDueDate />
                    {task?.dueDate ? (
                      <div className="flex items-center gap-1 text-base-900 dark:text-base-100">
                        <CalendarIcon className="size-3" />
                        {format(new Date(task.dueDate), "MMM d, yyyy")}
                      </div>
                    ) : (
                      <div>--</div>
                    )}
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-base-500 dark:text-base-400">
                      Author
                    </span>
                    <div className="flex items-center gap-2">
                      <Avatar
                        fallback={task?.author?.name.charAt(0)}
                        src={task?.author?.avatarUrl ?? undefined}
                        alt={task?.author?.name}
                        size="xs"
                        className="rounded-full border-2 border-base-100 dark:border-base-900"
                      />
                      <span className="text-base-900 dark:text-base-100">
                        {task?.author?.name}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </CardRoot>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
