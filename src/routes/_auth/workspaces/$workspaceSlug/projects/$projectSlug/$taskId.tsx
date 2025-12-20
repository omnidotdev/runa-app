import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, notFound } from "@tanstack/react-router";
import { format } from "date-fns";
import {
  ArrowLeftIcon,
  CalendarIcon,
  MoreHorizontalIcon,
  Trash2Icon,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useDebounceCallback } from "usehooks-ts";

import {
  ColumnSelector,
  DestructiveActionDialog,
  Link,
  PrioritySelector,
  RichTextEditor,
  Tooltip,
} from "@/components/core";
import { NotFound } from "@/components/layout";
import {
  Comments,
  CreateComment,
  TaskDescription,
  TaskSidebar,
  UpdateAssigneesDialog,
  UpdateDueDateDialog,
  UpdateTaskLabelsDialog,
} from "@/components/tasks";
import { Button } from "@/components/ui/button";
import { SheetContent, SheetRoot, SheetTrigger } from "@/components/ui/sheet";
import {
  Role,
  useDeleteTaskMutation,
  useProjectQuery,
  useTaskQuery,
  useTasksQuery,
  useUpdateTaskMutation,
} from "@/generated/graphql";
import { BASE_URL } from "@/lib/config/env.config";
import useDialogStore, { DialogType } from "@/lib/hooks/store/useDialogStore";
import useViewportSize, { Breakpoint } from "@/lib/hooks/useViewportSize";
import projectOptions from "@/lib/options/project.options";
import taskOptions from "@/lib/options/task.options";
import workspaceOptions from "@/lib/options/workspace.options";
import createMetaTags from "@/lib/util/createMetaTags";
import getQueryKeyPrefix from "@/lib/util/getQueryKeyPrefix";
import { cn } from "@/lib/utils";

export const Route = createFileRoute(
  "/_auth/workspaces/$workspaceSlug/projects/$projectSlug/$taskId",
)({
  loader: async ({
    params: { taskId },
    context: { queryClient, workspaceBySlug },
  }) => {
    if (!workspaceBySlug) {
      throw notFound();
    }

    const { task } = await queryClient.ensureQueryData(
      taskOptions({ rowId: taskId }),
    );

    if (!task) {
      throw notFound();
    }

    return {
      workspaceId: workspaceBySlug.rowId,
      projectId: workspaceBySlug.projects?.nodes?.[0]?.rowId!,
      projectName: workspaceBySlug.projects.nodes?.[0]?.name!,
    };
  },
  head: ({ loaderData, params }) => ({
    meta: [
      ...createMetaTags({
        title: "Task",
        description: `View and manage a task for ${loaderData?.projectName}.`,
        url: `${BASE_URL}/workspaces/${params.workspaceSlug}/projects/${params.projectSlug}/${params.taskId}`,
      }),
    ],
  }),
  notFoundComponent: () => <NotFound>Task Not Found</NotFound>,
  component: TaskPage,
});

function TaskPage() {
  const navigate = Route.useNavigate();
  const { projectId, workspaceId } = Route.useLoaderData();
  const { session } = Route.useRouteContext();
  const { workspaceSlug, projectSlug, taskId } = Route.useParams();

  const matches = useViewportSize({ breakpoint: Breakpoint.Large });
  const [isTaskSidebarOpen, setIsTaskSidebarOpen] = useState(false);

  const { data: role } = useSuspenseQuery({
    ...workspaceOptions({ rowId: workspaceId, userId: session?.user?.rowId! }),
    select: (data) => data?.workspace?.workspaceUsers?.nodes?.[0]?.role,
  });

  const isMember = role === Role.Member;

  const { data: task } = useSuspenseQuery({
    ...taskOptions({ rowId: taskId }),
    select: (data) => data?.task,
  });

  const isAuthor = task?.author?.rowId === session?.user?.rowId;

  const { data: project } = useSuspenseQuery({
    ...projectOptions({ rowId: projectId }),
    select: (data) => data?.project,
  });

  const { mutate: updateTask } = useUpdateTaskMutation({
    meta: {
      invalidates: [
        getQueryKeyPrefix(useTaskQuery),
        getQueryKeyPrefix(useTasksQuery),
      ],
    },
  });

  const { mutate: deleteTask } = useDeleteTaskMutation({
    meta: {
      invalidates: [
        getQueryKeyPrefix(useTasksQuery),
        getQueryKeyPrefix(useProjectQuery),
      ],
    },
    onSuccess: () => {
      navigate({
        to: "/workspaces/$workspaceSlug/projects/$projectSlug",
        params: { workspaceSlug, projectSlug },
        replace: true,
      });
    },
  });

  const handleTaskUpdate = useDebounceCallback(updateTask, 300);

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

  const { setIsOpen: setIsDeleteTaskDialogOpen } = useDialogStore({
    type: DialogType.DeleteTask,
  });

  useEffect(() => {
    if (matches && isTaskSidebarOpen) {
      setIsTaskSidebarOpen(false);
    }
  }, [matches, isTaskSidebarOpen]);

  return (
    <div className="custom-scrollbar flex flex-col overflow-y-auto px-6 py-12">
      {/* Header */}
      <div className="mb-4 flex items-center gap-3">
        <Link
          to="/workspaces/$workspaceSlug/projects/$projectSlug"
          params={{
            workspaceSlug,
            projectSlug,
          }}
          variant="ghost"
          size="icon"
          className="ml-1"
          aria-label="Go back"
        >
          <ArrowLeftIcon className="size-4" />
        </Link>

        <div className="flex flex-col gap-2">
          <RichTextEditor
            defaultContent={task?.content}
            className="min-h-0 border-0 bg-transparent p-0 text-2xl dark:bg-transparent"
            skeletonClassName="h-8 min-w-40"
            editable={isAuthor || !isMember}
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

          <div className="flex items-center gap-2 font-mono text-base-500 text-sm dark:text-base-400">
            {`${project?.prefix ? project.prefix : "PROJ"}-${taskIndex}`}
          </div>
        </div>
      </div>

      {/* Task Controls */}
      <div className="mb-12 w-full">
        <div className="flex flex-wrap items-center gap-2 p-1">
          <Button
            variant="outline"
            className={cn(
              "justify-self-end text-red-500 hover:bg-destructive/10 hover:text-red-500/80 focus-visible:ring-red-500 dark:hover:bg-destructive/20",
              !isAuthor && isMember && "hidden",
            )}
            onClick={() => setIsDeleteTaskDialogOpen(true)}
            aria-label="Delete Task"
          >
            <Trash2Icon className="size-4" />
          </Button>

          <ColumnSelector
            projectId={projectId}
            defaultValue={[task?.columnId!]}
            triggerLabel={task?.column?.title}
            triggerEmoji={task?.column?.emoji ?? undefined}
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
            tooltip="Update Due Date"
            shortcut="D"
            trigger={
              <Button
                onClick={() => setIsUpdateDueDateDialogOpen(true)}
                variant="outline"
              >
                {task?.dueDate ? (
                  <div className="flex items-center gap-1 text-base-900 dark:text-base-100">
                    <CalendarIcon className="size-3" />
                    {format(new Date(task.dueDate), "MMM d, yyyy")}
                  </div>
                ) : (
                  <p className="text-sm">Set due date</p>
                )}
              </Button>
            }
          />

          {/* TODO: Better position this for actual mobile */}
          <div className="lg:hidden">
            <SheetRoot
              open={isTaskSidebarOpen}
              onOpenChange={({ open }) => setIsTaskSidebarOpen(open)}
            >
              <SheetTrigger asChild className="">
                <Button variant="outline" size="icon">
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

      {/* Main content */}
      <div className="grid h-full grid-cols-1 gap-4 lg:grid-cols-[5fr_3fr]">
        <div className="flex h-full flex-1 flex-col gap-8">
          {/* Task Details */}
          <TaskDescription
            task={{
              rowId: taskId,
              isAuthor,
              description: task?.description,
            }}
          />
          <Comments />
          <CreateComment />
        </div>

        {/* Sidebar (Sticky, hidden on mobile) */}
        <div className="hidden lg:flex">
          <TaskSidebar />
        </div>
      </div>

      <UpdateAssigneesDialog />
      <UpdateDueDateDialog />
      <UpdateTaskLabelsDialog />
      <DestructiveActionDialog
        title="Delete Task"
        description="This will permanently delete this task.
        This action cannot be undone."
        onConfirm={() => deleteTask({ rowId: taskId })}
        dialogType={DialogType.DeleteTask}
        confirmation="permanently delete this task"
      />
    </div>
  );
}
