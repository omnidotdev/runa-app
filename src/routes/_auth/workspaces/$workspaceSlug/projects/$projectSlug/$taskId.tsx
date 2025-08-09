import { useSuspenseQuery } from "@tanstack/react-query";
import { notFound } from "@tanstack/react-router";
import { format } from "date-fns";
import {
  ArrowLeftIcon,
  CalendarIcon,
  MoreHorizontalIcon,
  Trash2Icon,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useDebounceCallback } from "usehooks-ts";

import DestructiveActionDialog from "@/components/core/DestructiveActionDialog";
import Link from "@/components/core/Link";
import RichTextEditor from "@/components/core/RichTextEditor";
import ColumnSelector from "@/components/core/selectors/ColumnSelector";
import PrioritySelector from "@/components/core/selectors/PrioritySelector";
import NotFound from "@/components/layout/NotFound";
import Comments from "@/components/tasks/Comments";
import CreateComment from "@/components/tasks/CreateComment";
import TaskDescription from "@/components/tasks/TaskDescription";
import TaskSidebar from "@/components/tasks/TaskSidebar";
import UpdateAssigneesDialog from "@/components/tasks/UpdateAssigneesDialog";
import UpdateDueDateDialog from "@/components/tasks/UpdateDueDateDialog";
import UpdateTaskLabelsDialog from "@/components/tasks/UpdateTaskLabelsDialog";
import { Button } from "@/components/ui/button";
import { SheetContent, SheetRoot, SheetTrigger } from "@/components/ui/sheet";
import { Tooltip } from "@/components/ui/tooltip";
import {
  useDeleteTaskMutation,
  useUpdateTaskMutation,
} from "@/generated/graphql";
import useDialogStore, { DialogType } from "@/lib/hooks/store/useDialogStore";
import useViewportSize, { Breakpoint } from "@/lib/hooks/useViewportSize";
import projectOptions from "@/lib/options/project.options";
import taskOptions from "@/lib/options/task.options";
import seo from "@/lib/util/seo";

export const Route = createFileRoute({
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
    };
  },
  head: () => ({
    meta: [...seo({ title: "Task" })],
  }),
  notFoundComponent: () => <NotFound>Task Not Found</NotFound>,
  component: TaskPage,
});

function TaskPage() {
  const navigate = Route.useNavigate();
  const { projectId } = Route.useLoaderData();
  const { workspaceSlug, projectSlug, taskId } = Route.useParams();
  const matches = useViewportSize({ breakpoint: Breakpoint.Large });
  const [isTaskSidebarOpen, setIsTaskSidebarOpen] = useState(false);

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

  const { mutate: deleteTask } = useDeleteTaskMutation({
    meta: {
      invalidates: [["all"]],
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

          <div className="flex items-center gap-2 font-mono text-base-400 text-sm dark:text-base-500">
            {`${project?.prefix ? project.prefix : "PROJ"}-${taskIndex}`}
          </div>
        </div>
      </div>

      {/* Task Controls */}
      <div className="mb-12 w-full">
        <div className="flex flex-wrap items-center gap-2 p-1">
          <Button
            variant="outline"
            className="justify-self-end text-red-500 hover:bg-destructive/10 hover:text-red-500/80 focus-visible:ring-red-500 dark:hover:bg-destructive/20"
            onClick={() => setIsDeleteTaskDialogOpen(true)}
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
          >
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
          </Tooltip>

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
              description: task?.description,
              rowId: taskId,
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
