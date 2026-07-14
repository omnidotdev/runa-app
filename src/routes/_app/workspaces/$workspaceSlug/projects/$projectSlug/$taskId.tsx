import {
  SheetContent,
  SheetRoot,
  SheetTrigger,
} from "@omnidotdev/thornberry/sheet";
import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, notFound, redirect } from "@tanstack/react-router";
import {
  ArrowLeftIcon,
  LinkIcon,
  MoreHorizontalIcon,
  SlidersHorizontalIcon,
  Trash2Icon,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useDebounceCallback } from "usehooks-ts";

import { Link, RichTextEditor } from "@/components/core";
import { NotFound } from "@/components/layout";
import { AttachmentsSection, Comments } from "@/components/tasks";
import DeleteTaskDialog from "@/components/tasks/DeleteTaskDialog";
import TaskKey from "@/components/tasks/TaskKey";
import TaskProperties from "@/components/tasks/TaskProperties";
import { Button } from "@/components/ui/button";
import {
  MenuContent,
  MenuItem,
  MenuPositioner,
  MenuRoot,
  MenuTrigger,
} from "@/components/ui/menu";
import { useTasksQuery, useUpdateTaskMutation } from "@/generated/graphql";
import { BASE_URL } from "@/lib/config/env.config";
import useDialogStore, { DialogType } from "@/lib/hooks/store/useDialogStore";
import useTaskStore from "@/lib/hooks/store/useTaskStore";
import { useCurrentUserRole } from "@/lib/hooks/useCurrentUserRole";
import useViewportSize, { Breakpoint } from "@/lib/hooks/useViewportSize";
import projectOptions from "@/lib/options/project.options";
import projectBySlugOptions from "@/lib/options/projectBySlug.options";
import taskOptions from "@/lib/options/task.options";
import taskByNumberOptions from "@/lib/options/taskByNumber.options";
import { Role } from "@/lib/permissions";
import createMetaTags from "@/lib/util/createMetaTags";
import getQueryKeyPrefix from "@/lib/util/getQueryKeyPrefix";
import { buildTaskKey, parseTaskParam, stripMarkup } from "@/lib/util/taskUrl";

import type { TaskQuery } from "@/generated/graphql";

export const Route = createFileRoute(
  "/_app/workspaces/$workspaceSlug/projects/$projectSlug/$taskId",
)({
  loader: async ({
    params: { taskId: taskParam, workspaceSlug, projectSlug },
    context: { queryClient, organizationId, session },
    preload,
  }) => {
    if (!organizationId) throw notFound();

    const { projectBySlugAndOrganizationId: project } =
      await queryClient.ensureQueryData(
        projectBySlugOptions({ slug: projectSlug, organizationId }),
      );
    if (!project) throw notFound();

    // Unauth users can only access public projects
    if (!session?.user?.rowId && !project.isPublic) throw notFound();

    const parsed = parseTaskParam(taskParam);
    if (parsed.type === "invalid") throw notFound();

    // resolve the task rowId from either the legacy UUID permalink or the
    // vanity {number}-{slug} key
    let resolved: { rowId: string; number: number; content?: string | null };
    if (parsed.type === "uuid") {
      const { task } = await queryClient.ensureQueryData(
        taskOptions({ rowId: parsed.rowId }),
      );
      if (!task) throw notFound();
      resolved = {
        rowId: task.rowId,
        number: task.number!,
        content: task.content,
      };
    } else {
      const { taskByProjectIdAndNumber: task } =
        await queryClient.ensureQueryData(
          taskByNumberOptions({
            projectId: project.rowId,
            number: parsed.number,
          }),
        );
      if (!task) throw notFound();
      resolved = {
        rowId: task.rowId,
        number: task.number!,
        content: task.content,
      };
    }

    // redirect legacy UUID permalinks and stale title slugs to the canonical key
    const canonicalKey = buildTaskKey({
      number: resolved.number,
      content: resolved.content,
    });
    // Guard against preload so hovering a legacy/stale task link does not navigate
    if (!preload && taskParam !== canonicalKey) {
      throw redirect({
        to: "/workspaces/$workspaceSlug/projects/$projectSlug/$taskId",
        params: { workspaceSlug, projectSlug, taskId: canonicalKey },
        replace: true,
      });
    }

    // ensure the full task (keyed by rowId) is cached for the page components
    await queryClient.ensureQueryData(taskOptions({ rowId: resolved.rowId }));

    const title = resolved.content ? stripMarkup(resolved.content) : "";

    return {
      organizationId,
      projectId: project.rowId,
      projectName: project.name,
      taskId: resolved.rowId,
      taskTitle: title || undefined,
      ogImageUrl: `${BASE_URL}/api/og/task/${workspaceSlug}/${projectSlug}/${resolved.number}`,
      isPublicAccess: !session?.user?.rowId || undefined,
    };
  },
  head: ({ loaderData }) => ({
    meta: createMetaTags({
      title: loaderData?.taskTitle ?? "Task",
      description: loaderData?.projectName
        ? `View and manage a task for ${loaderData.projectName}.`
        : undefined,
      image: loaderData?.ogImageUrl,
    }),
  }),
  notFoundComponent: () => <NotFound>Task Not Found</NotFound>,
  component: TaskPage,
});

function TaskPage() {
  const loaderData = Route.useLoaderData();
  const isPublicAccess =
    "isPublicAccess" in loaderData && loaderData.isPublicAccess;
  const { session } = Route.useRouteContext();

  if (isPublicAccess || !session?.user?.rowId) {
    return <PublicTaskView />;
  }

  return <AuthenticatedTaskPage />;
}

function PublicTaskView() {
  const { projectId, taskId } = Route.useLoaderData();
  const { workspaceSlug, projectSlug } = Route.useParams();

  const { data: task } = useSuspenseQuery({
    ...taskOptions({ rowId: taskId }),
    select: (data) => data?.task,
  });

  const { data: project } = useSuspenseQuery({
    ...projectOptions({ rowId: projectId }),
    select: (data) => data?.project,
  });

  return (
    <div className="custom-scrollbar flex w-full flex-col overflow-y-auto px-6 py-10">
      <div className="mb-6 flex items-center gap-1">
        <Link
          to="/workspaces/$workspaceSlug/projects/$projectSlug"
          params={{ workspaceSlug, projectSlug }}
          variant="ghost"
          size="icon"
          aria-label="Go back"
        >
          <ArrowLeftIcon className="size-4" />
        </Link>

        <TaskKey
          prefix={project?.prefix}
          number={task?.number}
          className="text-muted-foreground text-sm"
        />
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_280px]">
        <div className="flex min-w-0 flex-col gap-6">
          <RichTextEditor
            defaultContent={task?.content}
            className="min-h-0 border-0 bg-transparent p-0 font-semibold text-2xl dark:bg-transparent"
            editorClassName="min-h-0"
            skeletonClassName="h-8 min-w-40"
            editable={false}
          />

          {task?.description && (
            <div className="prose dark:prose-invert max-w-none">
              <RichTextEditor
                defaultContent={task.description}
                className="min-h-0 border-0 bg-transparent p-0 dark:bg-transparent"
                editorClassName="min-h-0"
                editable={false}
              />
            </div>
          )}
        </div>

        <aside className="hidden lg:block">
          <div className="sticky top-0">
            {task && (
              <TaskProperties
                task={task}
                projectId={projectId}
                editable={false}
                onPatch={() => {}}
              />
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}

function AuthenticatedTaskPage() {
  const { projectId, organizationId, taskId } = Route.useLoaderData();
  const { session } = Route.useRouteContext();
  const { workspaceSlug, projectSlug } = Route.useParams();

  // keep the shared task store pointed at the resolved rowId so dialogs opened
  // from the detail route (where the URL param is a vanity key) target it
  const { setTaskId } = useTaskStore();
  useEffect(() => {
    setTaskId(taskId);
  }, [taskId, setTaskId]);

  const matches = useViewportSize({ breakpoint: Breakpoint.Large });
  const [isTaskSidebarOpen, setIsTaskSidebarOpen] = useState(false);

  // Get role from IDP organization claims
  const role = useCurrentUserRole(organizationId);
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

  const queryClient = useQueryClient();
  const taskQueryKey = taskOptions({ rowId: taskId }).queryKey;

  const { mutate: updateTask } = useUpdateTaskMutation({
    onMutate: async (variables) => {
      // cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: taskQueryKey });

      // snapshot the previous value
      const previousTask = queryClient.getQueryData(taskQueryKey);

      // optimistically update the cache
      queryClient.setQueryData<TaskQuery>(taskQueryKey, (old) => {
        if (!old?.task) return old;
        return {
          ...old,
          task: { ...old.task, ...variables.patch },
        } as TaskQuery;
      });

      // return context with the previous value
      return { previousTask };
    },
    onError: (_err, _variables, context) => {
      // rollback on error
      if (context?.previousTask) {
        queryClient.setQueryData(taskQueryKey, context.previousTask);
      }
    },
    meta: {
      invalidates: [
        // invalidate this specific task
        taskQueryKey,
        getQueryKeyPrefix(useTasksQuery),
      ],
    },
  });

  const handleContentUpdate = useDebounceCallback(updateTask, 300);
  const handleDescriptionUpdate = useDebounceCallback(updateTask, 300);

  const { setIsOpen: setIsDeleteTaskDialogOpen } = useDialogStore({
    type: DialogType.DeleteTask,
  });

  useEffect(() => {
    if (matches && isTaskSidebarOpen) {
      setIsTaskSidebarOpen(false);
    }
  }, [matches, isTaskSidebarOpen]);

  const canEdit = isAuthor || !isMember;

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard");
    } catch {
      // clipboard unavailable (e.g. insecure context); ignore silently
    }
  };

  return (
    <div className="custom-scrollbar flex w-full flex-col overflow-y-auto px-6 py-10">
      {/* Top bar */}
      <div className="mb-6 flex items-center justify-between gap-3">
        <div className="flex items-center gap-1">
          <Link
            to="/workspaces/$workspaceSlug/projects/$projectSlug"
            params={{ workspaceSlug, projectSlug }}
            variant="ghost"
            size="icon"
            aria-label="Go back"
          >
            <ArrowLeftIcon className="size-4" />
          </Link>

          <TaskKey
            prefix={project?.prefix}
            number={task?.number}
            className="text-muted-foreground text-sm"
          />
        </div>

        <div className="flex items-center gap-1">
          {/* Properties live in a slide-over on smaller screens */}
          <div className="lg:hidden">
            <SheetRoot
              open={isTaskSidebarOpen}
              onOpenChange={({ open }) => setIsTaskSidebarOpen(open)}
            >
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Properties">
                  <SlidersHorizontalIcon className="size-4" />
                </Button>
              </SheetTrigger>
              <SheetContent className="w-3/4 overflow-y-auto p-4" side="right">
                {task && (
                  <TaskProperties
                    task={task}
                    projectId={projectId}
                    editable={canEdit}
                    onPatch={(patch) => updateTask({ rowId: taskId, patch })}
                  />
                )}
              </SheetContent>
            </SheetRoot>
          </div>

          <MenuRoot positioning={{ placement: "bottom-end" }}>
            <MenuTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Task actions">
                <MoreHorizontalIcon className="size-4" />
              </Button>
            </MenuTrigger>

            <MenuPositioner>
              <MenuContent>
                <MenuItem value="copy" onClick={copyLink}>
                  <LinkIcon />
                  <span>Copy link</span>
                </MenuItem>

                {canEdit && (
                  <MenuItem
                    value="delete"
                    variant="destructive"
                    onClick={() => setIsDeleteTaskDialogOpen(true)}
                  >
                    <Trash2Icon />
                    <span>Delete task</span>
                  </MenuItem>
                )}
              </MenuContent>
            </MenuPositioner>
          </MenuRoot>
        </div>
      </div>

      {/* Body */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_280px]">
        <div className="flex min-w-0 flex-col gap-6">
          <RichTextEditor
            defaultContent={task?.content}
            className="min-h-0 border-0 bg-transparent p-0 font-semibold text-2xl outline-none hover:outline-none dark:bg-transparent"
            editorClassName="min-h-0"
            skeletonClassName="h-8 min-w-40"
            editable={canEdit}
            hideToolbar
            onUpdate={({ getHTML, isEmpty }) =>
              !isEmpty &&
              handleContentUpdate({
                rowId: taskId,
                patch: { content: getHTML() },
              })
            }
          />

          <RichTextEditor
            defaultContent={task?.description}
            editable={canEdit}
            imageUpload={{ taskId }}
            placeholder={canEdit ? "Add a description…" : undefined}
            className="min-h-[160px] overflow-hidden rounded-xl border"
            skeletonClassName="h-[160px]"
            onUpdate={({ getHTML, isEmpty }) =>
              handleDescriptionUpdate({
                rowId: taskId,
                patch: { description: isEmpty ? "" : getHTML() },
              })
            }
          />

          <AttachmentsSection
            taskId={taskId}
            organizationId={organizationId}
            editable={canEdit}
          />
          <Comments />
        </div>

        <aside className="hidden lg:block">
          <div className="sticky top-0">
            {task && (
              <TaskProperties
                task={task}
                projectId={projectId}
                editable={canEdit}
                onPatch={(patch) => updateTask({ rowId: taskId, patch })}
              />
            )}
          </div>
        </aside>
      </div>

      <DeleteTaskDialog />
    </div>
  );
}
