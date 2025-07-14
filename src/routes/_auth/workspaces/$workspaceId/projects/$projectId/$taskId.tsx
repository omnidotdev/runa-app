import { useSuspenseQuery } from "@tanstack/react-query";
import { notFound } from "@tanstack/react-router";
import { format } from "date-fns";
import {
  ArrowLeftIcon,
  CalendarIcon,
  EditIcon,
  InfoIcon,
  MessageSquareIcon,
  SendIcon,
  TagIcon,
  TypeIcon,
  UserIcon,
} from "lucide-react";
import { useRef, useState } from "react";
import { useDebounceCallback } from "usehooks-ts";

import Link from "@/components/core/Link";
import RichTextEditor from "@/components/core/RichTextEditor";
import ColumnSelector from "@/components/core/selectors/ColumnSelector";
import PrioritySelector from "@/components/core/selectors/PrioritySelector";
import Labels from "@/components/Labels";
import NotFound from "@/components/layout/NotFound";
import UpdateAssigneesDialog from "@/components/UpdateAssigneesDialog";
import UpdateDueDateDialog from "@/components/UpdateDueDateDialog";
import UpdateTaskLabelsDialog from "@/components/UpdateTaskLabelsDialog";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CardContent, CardHeader, CardRoot } from "@/components/ui/card";
import { createListCollection } from "@/components/ui/select";
import { SidebarMenuShotcut } from "@/components/ui/sidebar";
import {
  TooltipContent,
  TooltipPositioner,
  TooltipRoot,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  useCreatePostMutation,
  useUpdateTaskMutation,
} from "@/generated/graphql";
import useDialogStore, { DialogType } from "@/lib/hooks/store/useDialogStore";
import projectOptions from "@/lib/options/project.options";
import taskOptions from "@/lib/options/task.options";
import workspaceUsersOptions from "@/lib/options/workspaceUsers.options";
import seo from "@/lib/util/seo";

import type { EditorApi } from "@/components/core/RichTextEditor";

export const Route = createFileRoute({
  loader: async ({
    params: { workspaceId, taskId },
    context: { queryClient },
  }) => {
    const [{ task }] = await Promise.all([
      queryClient.ensureQueryData(taskOptions({ rowId: taskId })),
      queryClient.ensureQueryData(
        workspaceUsersOptions({ rowId: workspaceId }),
      ),
    ]);

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

function TaskPage() {
  const { workspaceId, projectId, taskId } = Route.useParams();

  const commentEditorApiRef = useRef<EditorApi | null>(null);

  const { data: task } = useSuspenseQuery({
    ...taskOptions({ rowId: taskId }),
    select: (data) => data?.task,
  });

  const { data: project } = useSuspenseQuery({
    ...projectOptions({ rowId: projectId }),
    select: (data) => data?.project,
  });

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
      invalidates: [["all"]],
    },
  });
  const { mutate: addComment } = useCreatePostMutation({
    meta: {
      invalidates: [taskOptions({ rowId: taskId }).queryKey],
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

  const { setIsOpen: setIsUpdateAssigneesDialogOpen } = useDialogStore({
    type: DialogType.UpdateAssignees,
  });

  const { setIsOpen: setIsUpdateTaskLabelsDialogOpen } = useDialogStore({
    type: DialogType.UpdateTaskLabels,
  });

  const { setIsOpen: setIsUpdateDueDateDialogOpen } = useDialogStore({
    type: DialogType.UpdateDueDate,
  });

  const taskIndex = project?.columns?.nodes
    ?.flatMap((column) => column?.tasks?.nodes?.map((task) => task))
    .sort(
      (a, b) =>
        new Date(a.createdAt!).getTime() - new Date(b.createdAt!).getTime(),
    )
    .map((task) => task.rowId)
    .indexOf(taskId);

  return (
    <div className="flex h-full">
      {/* Main content */}
      <div className="flex-1 overflow-auto">
        <div className="p-12">
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
                  skeletonClassName="h-8"
                  onUpdate={({ editor }) =>
                    !editor.isEmpty &&
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
                    {`${project?.prefix ? project.prefix : "PROJ"}-${taskIndex}`}
                  </span>

                  <ColumnSelector
                    defaultValue={[task?.columnId!]}
                    triggerValue={task?.column?.title}
                    size="xs"
                    onValueChange={({ value }) =>
                      updateTask({
                        rowId: taskId,
                        patch: {
                          columnId: value[0],
                        },
                      })
                    }
                  />

                  <PrioritySelector
                    defaultValue={[task?.priority!]}
                    triggerValue={task?.priority}
                    size="xs"
                    onValueChange={({ value }) =>
                      updateTask({
                        rowId: taskId,
                        patch: {
                          priority: value[0],
                        },
                      })
                    }
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
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
                    skeletonClassName="h-[120px] rounded-t-none"
                    onUpdate={({ editor }) => {
                      !editor.isEmpty &&
                        handleTaskUpdate({
                          rowId: taskId,
                          patch: {
                            // TODO: discuss if description should be nullable. Current schema structure doesn't allow it
                            description: editor.getHTML(),
                          },
                        });
                    }}
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
                              new Date(comment.createdAt!),
                              "MMM d, yyyy 'at' h:mm a",
                            )}
                          </span>
                        </div>
                        <RichTextEditor
                          defaultContent={comment.description!}
                          className="min-h-0 border-0 p-0 py-2 text-sm leading-relaxed dark:bg-background"
                          skeletonClassName="h-[38.75px]"
                          editable={false}
                        />
                      </div>
                    </div>
                  ))}

                  {!task?.posts?.nodes?.length && (
                    <p className="place-self-center pt-4 text-muted-foreground">
                      No comments found. Add a comment to start the
                      conversation.
                    </p>
                  )}

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
                  <TooltipRoot positioning={{ placement: "top" }}>
                    <TooltipTrigger asChild>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => setIsUpdateAssigneesDialogOpen(true)}
                      >
                        <EditIcon />
                      </Button>
                    </TooltipTrigger>

                    <TooltipPositioner>
                      <TooltipContent className="border bg-background text-foreground">
                        <div className="inline-flex">
                          Update Assignees
                          <div className="ml-2 flex items-center gap-0.5">
                            <SidebarMenuShotcut>A</SidebarMenuShotcut>
                          </div>
                        </div>
                      </TooltipContent>
                    </TooltipPositioner>
                  </TooltipRoot>
                </CardHeader>
                <CardContent className="space-y-4 p-4">
                  {task?.assignees?.nodes?.length ? (
                    task?.assignees?.nodes?.map((assignee) => (
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
                    ))
                  ) : (
                    <p className="place-self-center text-sm">No Assignees</p>
                  )}
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
                  <TooltipRoot positioning={{ placement: "top" }}>
                    <TooltipTrigger asChild>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => setIsUpdateTaskLabelsDialogOpen(true)}
                      >
                        <EditIcon />
                      </Button>
                    </TooltipTrigger>

                    <TooltipPositioner>
                      <TooltipContent className="border bg-background text-foreground">
                        <div className="inline-flex">
                          Update Labels
                          <div className="ml-2 flex items-center gap-0.5">
                            <SidebarMenuShotcut>L</SidebarMenuShotcut>
                          </div>
                        </div>
                      </TooltipContent>
                    </TooltipPositioner>
                  </TooltipRoot>
                </CardHeader>
                <CardContent className="p-4">
                  <Labels
                    labels={
                      task?.taskLabels?.nodes?.map((node) => node.label!) ?? []
                    }
                    className="flex flex-wrap gap-2"
                  />
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
                    <TooltipRoot positioning={{ placement: "top" }}>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          className="group h-fit py-0 font-normal text-base-500 hover:bg-transparent has-[>svg]:px-0 dark:text-base-400"
                          onClick={() => setIsUpdateDueDateDialogOpen(true)}
                        >
                          Due Date
                          <EditIcon className="size-3.5" />
                        </Button>
                      </TooltipTrigger>

                      <TooltipPositioner>
                        <TooltipContent className="border bg-background text-foreground">
                          <div className="inline-flex">
                            Update Due Date
                            <div className="ml-2 flex items-center gap-0.5">
                              <SidebarMenuShotcut>D</SidebarMenuShotcut>
                            </div>
                          </div>
                        </TooltipContent>
                      </TooltipPositioner>
                    </TooltipRoot>

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

      <UpdateAssigneesDialog />
      <UpdateDueDateDialog />
      <UpdateTaskLabelsDialog />
    </div>
  );
}
