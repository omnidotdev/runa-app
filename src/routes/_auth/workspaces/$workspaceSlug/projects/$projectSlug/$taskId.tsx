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
import { useDebounceCallback, useMediaQuery } from "usehooks-ts";

import DestructiveActionDialog from "@/components/core/DestructiveActionDialog";
import Link from "@/components/core/Link";
import RichTextEditor from "@/components/core/RichTextEditor";
import ColumnSelector from "@/components/core/selectors/ColumnSelector";
import PrioritySelector from "@/components/core/selectors/PrioritySelector";
import NotFound from "@/components/layout/NotFound";
import Comments from "@/components/tasks/Comments";
import CreateComment from "@/components/tasks/CreateComment";
import TaskSidebar from "@/components/tasks/TaskSidebar";
import UpdateAssigneesDialog from "@/components/tasks/UpdateAssigneesDialog";
import UpdateDueDateDialog from "@/components/tasks/UpdateDueDateDialog";
import UpdateTaskLabelsDialog from "@/components/tasks/UpdateTaskLabelsDialog";
import { Button } from "@/components/ui/button";
import { CardContent, CardHeader, CardRoot } from "@/components/ui/card";
import { SheetContent, SheetRoot, SheetTrigger } from "@/components/ui/sheet";
import { Tooltip } from "@/components/ui/tooltip";
import {
  useDeleteTaskMutation,
  useUpdateTaskMutation,
} from "@/generated/graphql";
import useDialogStore, { DialogType } from "@/lib/hooks/store/useDialogStore";
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
  const matches = useMediaQuery("(min-width: 1024px)");
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

              <div className="flex items-center gap-2">
                <span className="font-mono text-base-400 text-sm dark:text-base-500">
                  {`${project?.prefix ? project.prefix : "PROJ"}-${taskIndex}`}
                </span>
              </div>
            </div>
          </div>

          <div className="w-full">
            <div className="no-scrollbar flex items-center gap-2 overflow-x-scroll p-1">
              <Button
                variant="ghost"
                className="size-7 justify-self-end text-red-500 hover:text-red-500/80"
                onClick={() => setIsDeleteTaskDialogOpen(true)}
              >
                <Trash2Icon className="size-4" />
              </Button>

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
                tooltip="Update Due Date"
                shortcut="D"
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
                    <p className="text-xs">Set due date</p>
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

          <Comments />

          <CreateComment />
        </div>

        <div className="hidden lg:mt-38 lg:block">
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
    </>
  );
}
