import { useSuspenseQuery } from "@tanstack/react-query";
import { notFound } from "@tanstack/react-router";
import { format } from "date-fns";
import {
  ArrowLeftIcon,
  CalendarIcon,
  MoreHorizontalIcon,
  SendIcon,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useDebounceCallback, useMediaQuery } from "usehooks-ts";

import Link from "@/components/core/Link";
import RichTextEditor from "@/components/core/RichTextEditor";
import ColumnSelector from "@/components/core/selectors/ColumnSelector";
import PrioritySelector from "@/components/core/selectors/PrioritySelector";
import NotFound from "@/components/layout/NotFound";
import TaskSidebar from "@/components/TaskSidebar";
import UpdateAssigneesDialog from "@/components/UpdateAssigneesDialog";
import UpdateDueDateDialog from "@/components/UpdateDueDateDialog";
import UpdateTaskLabelsDialog from "@/components/UpdateTaskLabelsDialog";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { CardContent, CardHeader, CardRoot } from "@/components/ui/card";
import { SheetContent, SheetRoot, SheetTrigger } from "@/components/ui/sheet";
import { SidebarMenuShortcut } from "@/components/ui/sidebar";
import { Tooltip } from "@/components/ui/tooltip";
import {
  useCreatePostMutation,
  useUpdateTaskMutation,
} from "@/generated/graphql";
import useDialogStore, { DialogType } from "@/lib/hooks/store/useDialogStore";
import projectOptions from "@/lib/options/project.options";
import taskOptions from "@/lib/options/task.options";
import workspaceBySlugOptions from "@/lib/options/workspaceBySlug.options";
import workspaceUsersOptions from "@/lib/options/workspaceUsers.options";
import seo from "@/lib/util/seo";

import type { EditorApi } from "@/components/core/RichTextEditor";

export const Route = createFileRoute({
  loader: async ({
    params: { workspaceSlug, projectSlug, taskId },
    context: { queryClient },
  }) => {
    const { workspaceBySlug } = await queryClient.ensureQueryData(
      workspaceBySlugOptions({
        slug: workspaceSlug,
        projectSlug,
      }),
    );

    if (!workspaceBySlug) {
      throw notFound();
    }

    const [{ task }] = await Promise.all([
      queryClient.ensureQueryData(taskOptions({ rowId: taskId })),
      queryClient.ensureQueryData(
        workspaceUsersOptions({ workspaceId: workspaceBySlug.rowId }),
      ),
    ]);

    if (!task) {
      throw notFound();
    }

    return {
      workspaceId: workspaceBySlug.rowId,
      projectId: workspaceBySlug.projects?.nodes?.[0]?.rowId!,
    };
  },
  head: () => ({
    meta: [...seo({ title: "Task" })],
  }),
  notFoundComponent: () => <NotFound>Task Not Found</NotFound>,
  component: TaskPage,
});

function TaskPage() {
  const { session } = Route.useRouteContext();
  const { projectId } = Route.useLoaderData();
  const { workspaceSlug, projectSlug, taskId } = Route.useParams();
  const matches = useMediaQuery("(min-width: 1024px)");
  const [isTaskSidebarOpen, setIsTaskSidebarOpen] = useState(false);

  const commentEditorApiRef = useRef<EditorApi | null>(null);

  const { data: task } = useSuspenseQuery({
    ...taskOptions({ rowId: taskId }),
    select: (data) => data?.task,
  });

  const { data: project } = useSuspenseQuery({
    ...projectOptions({ rowId: projectId }),
    select: (data) => data?.project,
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
    if (newComment.trim()) {
      addComment({
        input: {
          post: {
            taskId,
            authorId: session?.user?.rowId!,
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

  const taskIndex = project?.columns?.nodes
    ?.flatMap((column) => column?.tasks?.nodes?.map((task) => task))
    .sort(
      (a, b) =>
        new Date(a.createdAt!).getTime() - new Date(b.createdAt!).getTime(),
    )
    .map((task) => task.rowId)
    .indexOf(taskId);

  const { setIsOpen: setIsUpdateDueDateDialogOpen } = useDialogStore({
    type: DialogType.UpdateDueDate,
  });

  useEffect(() => {
    if (matches && isTaskSidebarOpen) {
      setIsTaskSidebarOpen(false);
    }
  }, [matches, isTaskSidebarOpen]);

  return (
    <>
      {/* Main content */}
      <div className="grid flex-1 grid-cols-4 gap-8 overflow-hidden p-12">
        <div className="no-scrollbar col-span-4 flex flex-col gap-8 overflow-auto lg:col-span-3">
          {/* Header */}
          <div className="flex items-center gap-3">
            <Link
              to="/workspaces/$workspaceSlug/projects/$projectSlug"
              params={{
                workspaceSlug,
                projectSlug,
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
                skeletonClassName="h-8 min-w-40"
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
              </div>
            </div>
          </div>

          <div className="w-full">
            <div className="no-scrollbar flex items-center gap-2 overflow-x-scroll">
              <ColumnSelector
                projectId={projectId}
                defaultValue={[task?.columnId!]}
                triggerLabel={task?.column?.title}
                triggerEmoji={task?.column?.emoji ?? undefined}
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

              <Tooltip
                positioning={{ placement: "top" }}
                tooltip={{
                  className: "bg-background text-foreground border",
                  children: (
                    <div className="inline-flex">
                      Update Due Date
                      <div className="ml-2 flex items-center gap-0.5">
                        <SidebarMenuShortcut>D</SidebarMenuShortcut>
                      </div>
                    </div>
                  ),
                }}
              >
                <Button
                  onClick={() => setIsUpdateDueDateDialogOpen(true)}
                  variant="outline"
                  className="h-7"
                >
                  {task?.dueDate ? (
                    <div className="flex items-center gap-1 text-base-900 dark:text-base-100">
                      <CalendarIcon className="size-3" />
                      {format(new Date(task.dueDate), "MMM d, yyyy")}
                    </div>
                  ) : (
                    <p>Set due date</p>
                  )}
                </Button>
              </Tooltip>

              {/* TODO: Better position this for actual mobile */}
              <div className="lg:hidden">
                <SheetRoot
                  open={isTaskSidebarOpen}
                  onOpenChange={({ open }) => setIsTaskSidebarOpen(open)}
                >
                  <SheetTrigger asChild className="">
                    <Button variant="outline" size="icon" className="h-7 w-7">
                      <MoreHorizontalIcon className="size-4" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent className="w-2/3 p-3" side="right">
                    <TaskSidebar />
                  </SheetContent>
                </SheetRoot>
              </div>
            </div>
          </div>

          {/* Description */}
          <CardRoot className="overflow-hidden p-0 shadow-none">
            <CardHeader className="flex h-10 flex-row items-center justify-between bg-base-50 px-3 dark:bg-base-800">
              <h3 className="font-medium text-base-900 text-sm dark:text-base-100">
                Description
              </h3>
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

          <CardRoot className="overflow-hidden p-0 shadow-none">
            <CardHeader className="flex h-10 flex-row items-center justify-between bg-base-50 px-3 dark:bg-base-800">
              <h3 className="font-medium text-base-900 text-sm dark:text-base-100">
                Comments
              </h3>
            </CardHeader>

            <CardContent className="flex items-center p-0">
              {task?.posts?.nodes?.length ? (
                <div>
                  {task?.posts?.nodes?.map((comment) => (
                    <div key={comment?.rowId} className="flex gap-2 p-2">
                      <Avatar
                        fallback={comment?.author?.name.charAt(0)}
                        src={comment?.author?.avatarUrl ?? undefined}
                        alt={comment?.author?.name}
                        size="sm"
                        className="rounded-full border-2 border-base-100 dark:border-base-900"
                      />
                      <div className="flex-1">
                        <div className="flex items-baseline gap-3">
                          <span className="font-medium text-base text-base-900 dark:text-base-100">
                            {comment?.author?.name}
                          </span>
                          <span className="text-base-500 text-xs dark:text-base-400">
                            {format(
                              new Date(comment.createdAt!),
                              "MMM d, yyyy 'at' h:mm a",
                            )}
                          </span>
                        </div>

                        <RichTextEditor
                          defaultContent={comment.description!}
                          className="min-h-0 border-0 p-0 py-2 text-sm leading-relaxed"
                          skeletonClassName="h-[38.75px]"
                          editable={false}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="mx-auto flex place-self-center p-4 text-muted-foreground text-sm">
                  No Comment. Add a comment to start the discussion.
                </p>
              )}
            </CardContent>
          </CardRoot>

          {/* Add comment */}
          <div className="mb-8 flex gap-4">
            <div className="flex-1 space-y-3">
              <RichTextEditor
                editorApi={commentEditorApiRef}
                className="min-h-0 border-solid p-2 text-sm dark:bg-background"
                skeletonClassName="h-[38px]"
                onUpdate={({ editor }) => setNewComment(editor.getHTML())}
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
        </div>

        <div className="hidden lg:mt-38 lg:block">
          <TaskSidebar />
        </div>
      </div>

      <UpdateAssigneesDialog />
      <UpdateDueDateDialog />
      <UpdateTaskLabelsDialog />
    </>
  );
}
