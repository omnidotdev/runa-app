import { DragDropContext } from "@hello-pangea/dnd";
import { useSuspenseQuery } from "@tanstack/react-query";
import {
  createFileRoute,
  notFound,
  stripSearchParams,
} from "@tanstack/react-router";
import { zodValidator } from "@tanstack/zod-adapter";
import { all } from "better-all";
import {
  GlobeIcon,
  Grid2X2Icon,
  ListIcon,
  Maximize2Icon,
  Minimize2Icon,
  SearchIcon,
  Settings2,
} from "lucide-react";
import { Suspense, useCallback, useMemo, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { useDebounceCallback } from "usehooks-ts";
import { z } from "zod";

import { Link, Tooltip } from "@/components/core";
import { NotFound } from "@/components/layout";
import {
  Board,
  List,
  ProjectLinks,
  ProjectPageSkeleton,
  PublicBoard,
} from "@/components/projects";
import {
  CreateTaskDialog,
  Filter,
  UpdateAssigneesDialog,
  UpdateDueDateDialog,
  UpdateTaskLabelsDialog,
} from "@/components/tasks";
import DeleteTaskDialog from "@/components/tasks/DeleteTaskDialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  useSettingByOrganizationIdQuery,
  useTaskQuery,
  useTasksQuery,
  useUpdateTaskMutation,
  useUpdateUserPreferenceMutation,
  useUserPreferencesQuery,
} from "@/generated/graphql";
import { BASE_URL } from "@/lib/config/env.config";
import { Hotkeys } from "@/lib/constants/hotkeys";
import useDragStore from "@/lib/hooks/store/useDragStore";
import useTaskStore from "@/lib/hooks/store/useTaskStore";
import useMaxTasksReached from "@/lib/hooks/useMaxTasksReached";
import projectOptions from "@/lib/options/project.options";
import projectBySlugOptions from "@/lib/options/projectBySlug.options";
import settingByOrganizationIdOptions from "@/lib/options/settingByOrganizationId.options";
import tasksOptions from "@/lib/options/tasks.options";
import userPreferencesOptions from "@/lib/options/userPreferences.options";
import createMetaTags from "@/lib/util/createMetaTags";
import { compareKeys, reorderKey } from "@/lib/util/fractionalKey";
import getQueryKeyPrefix from "@/lib/util/getQueryKeyPrefix";
import resolveActiveColumnId from "@/lib/util/resolveActiveColumnId";

import type { DragStart, DropResult } from "@hello-pangea/dnd";
import type { ChangeEvent } from "react";
import type { TasksQuery, TasksQueryVariables } from "@/generated/graphql";

const projectSearchParamsSchema = z.object({
  search: z.string().default(""),
  // See: https://zod.dev/v4/changelog?id=stricter-uuid
  assignees: z.array(z.guid()).default([]),
  labels: z.array(z.guid()).default([]),
  priorities: z.array(z.enum(["low", "medium", "high"])).default([]),
  mode: z.enum(["public"]).optional(),
});

export const Route = createFileRoute(
  "/_app/workspaces/$workspaceSlug/projects/$projectSlug/",
)({
  pendingComponent: ProjectPageSkeleton,
  pendingMinMs: 500,
  loaderDeps: ({ search: { search, assignees, labels, priorities } }) => ({
    search,
    assignees,
    labels,
    priorities,
  }),
  loader: async ({
    deps: { search, assignees, labels, priorities },
    params: { projectSlug },
    context: { session, queryClient, organizationId },
  }) => {
    if (!organizationId) throw notFound();

    // Unauthenticated public access
    if (!session?.user?.rowId) {
      const { project } = await all({
        async project() {
          const { projectBySlugAndOrganizationId } =
            await queryClient.ensureQueryData(
              projectBySlugOptions({ slug: projectSlug, organizationId }),
            );

          if (!projectBySlugAndOrganizationId) throw notFound();
          if (!projectBySlugAndOrganizationId.isPublic) throw notFound();

          return projectBySlugAndOrganizationId;
        },
        async projectData() {
          const project = await this.$.project;
          return queryClient.ensureQueryData(
            projectOptions({ rowId: project.rowId }),
          );
        },
        async tasks() {
          const project = await this.$.project;
          return queryClient.ensureQueryData(
            tasksOptions({ projectId: project.rowId }),
          );
        },
      });

      return {
        name: project.name,
        projectId: project.rowId,
        organizationId,
        isPublicAccess: true,
      };
    }

    const { project } = await all({
      async project() {
        const { projectBySlugAndOrganizationId } =
          await queryClient.ensureQueryData(
            projectBySlugOptions({ slug: projectSlug, organizationId }),
          );
        if (!projectBySlugAndOrganizationId) throw notFound();
        return projectBySlugAndOrganizationId;
      },
      async projectData() {
        const project = await this.$.project;
        return queryClient.ensureQueryData(
          projectOptions({ rowId: project.rowId }),
        );
      },
      async userPreferences() {
        const project = await this.$.project;
        return queryClient.ensureQueryData(
          userPreferencesOptions({
            userId: session?.user.rowId!,
            projectId: project.rowId,
          }),
        );
      },
      async tasks() {
        const project = await this.$.project;
        return queryClient.ensureQueryData(
          tasksOptions({
            projectId: project.rowId,
            search,
            assignees: assignees.length
              ? { some: { user: { rowId: { in: assignees } } } }
              : undefined,
            labels: labels.length
              ? { some: { label: { rowId: { in: labels } } } }
              : undefined,
            priorities: priorities.length ? priorities : undefined,
          }),
        );
      },
    });

    return {
      name: project.name,
      projectId: project.rowId,
      organizationId,
    };
  },
  validateSearch: zodValidator(projectSearchParamsSchema),
  search: {
    middlewares: [
      stripSearchParams({
        search: "",
        assignees: [],
        labels: [],
        priorities: [],
        mode: undefined,
      }),
    ],
  },
  head: ({ loaderData, params }) => ({
    meta: loaderData
      ? [
          ...createMetaTags({
            title: loaderData.name,
            description: `View and manage tasks for ${loaderData.name}.`,
            url: `${BASE_URL}/workspaces/${params.workspaceSlug}/projects/${params.projectSlug}`,
            image: `${BASE_URL}/api/og/project/${params.workspaceSlug}/${params.projectSlug}`,
          }),
        ]
      : undefined,
  }),
  notFoundComponent: () => <NotFound>Project Not Found</NotFound>,
  component: ProjectPage,
});

function ProjectPage() {
  const loaderData = Route.useLoaderData();
  const { session } = Route.useRouteContext();
  const { mode } = Route.useSearch();
  const isPublicAccess =
    "isPublicAccess" in loaderData && loaderData.isPublicAccess;

  // Show public view for unauth users or when previewing public board
  if (isPublicAccess || !session?.user?.rowId || mode === "public") {
    return <PublicProjectView projectId={loaderData.projectId} />;
  }

  return <AuthenticatedProjectPage />;
}

function AuthenticatedProjectPage() {
  const { session } = Route.useRouteContext();
  const { projectSlug, workspaceSlug } = Route.useParams();
  const loaderData = Route.useLoaderData();
  const { projectId, organizationId } = loaderData;
  const { search, assignees, labels, priorities } = Route.useSearch();
  const [isForceClosed, setIsForceClosed] = useState(false);

  const navigate = Route.useNavigate();

  const { queryClient } = Route.useRouteContext();

  const tasksVariables: TasksQueryVariables = useMemo(
    () => ({
      projectId,
      search,
      assignees: assignees.length
        ? { some: { user: { rowId: { in: assignees } } } }
        : undefined,
      labels: labels.length
        ? { some: { label: { rowId: { in: labels } } } }
        : undefined,
      priorities: priorities.length ? priorities : undefined,
    }),
    [projectId, search, assignees, labels, priorities],
  );

  const { data: tasks } = useSuspenseQuery({
    ...tasksOptions(tasksVariables),
    select: (data) => data?.tasks?.nodes ?? [],
  });

  const { setIsDragging, setDraggableId } = useDragStore();

  const handleSearch = useDebounceCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      navigate({
        search: (prev) => ({
          ...prev,
          search: e.target.value.length ? e.target.value : "",
        }),
      });
    },
    300,
  );

  const { data: userPreferences } = useSuspenseQuery({
    ...userPreferencesOptions({
      userId: session?.user.rowId!,
      projectId,
    }),
    select: (data) => data?.userPreferenceByUserIdAndProjectId,
  });

  const { data: project } = useSuspenseQuery({
    ...projectOptions({
      rowId: projectId,
    }),
    // TODO: determine best way to extract this logic. Using `userPreferences` in the loader to prefetch the project data was causing issue, this client side filtering seems to work well though.
    select: (data) => ({
      ...data?.project,
      columns: {
        ...data?.project?.columns,
        nodes: data?.project?.columns?.nodes?.filter(
          (column) => !userPreferences?.hiddenColumnIds.includes(column.rowId),
        ),
      },
    }),
  });

  const [projectColumnOpenStates, setProjectColumnOpenStates] = useState(
    project?.columns?.nodes?.map(() => true) ?? [],
  );

  const handleCloseAll = () => {
    setProjectColumnOpenStates((prev) => prev.map(() => false));
    setIsForceClosed(true);
  };

  const handleOpenAll = () => {
    setProjectColumnOpenStates((prev) => prev.map(() => true));
    setIsForceClosed(false);
  };

  const { mutate: updateViewMode } = useUpdateUserPreferenceMutation({
    meta: {
      invalidates: [
        getQueryKeyPrefix(useUserPreferencesQuery),
        getQueryKeyPrefix(useSettingByOrganizationIdQuery),
      ],
    },
    onMutate: (variables) => {
      // Update userPreferences cache for project page UI
      queryClient.setQueryData(
        userPreferencesOptions({
          projectId: projectId,
          userId: session?.user?.rowId!,
        }).queryKey,
        (old) => ({
          userPreferenceByUserIdAndProjectId: {
            ...old?.userPreferenceByUserIdAndProjectId!,
            viewMode: variables.patch?.viewMode!,
          },
        }),
      );

      // Update settings cache for sidebar icon
      queryClient.setQueryData(
        settingByOrganizationIdOptions({
          organizationId,
        }).queryKey,
        (old) => {
          if (!old?.settingByOrganizationId) return old;
          return {
            ...old,
            settingByOrganizationId: {
              ...old.settingByOrganizationId,
              // Settings don't contain project userPreferences, so this is a no-op
              // The sidebar will refetch via invalidation
            },
          };
        },
      );
    },
  });

  const { mutateAsync: updateTask } = useUpdateTaskMutation({
    meta: {
      invalidates: [
        getQueryKeyPrefix(useTaskQuery),
        getQueryKeyPrefix(useTasksQuery),
      ],
    },
  });

  const onDragEnd = useCallback(
    async (result: DropResult) => {
      setIsDragging(false);

      const { destination, source, draggableId } = result;

      // Exit early if dropped outside a droppable area or in the same position
      if (!destination) return;

      if (
        destination.droppableId === source.droppableId &&
        destination.index === source.index
      )
        return;

      setDraggableId(draggableId);

      // Get current tasks from cache
      const queryKey = tasksOptions(tasksVariables).queryKey;
      const cachedData = queryClient.getQueryData<TasksQuery>(queryKey);
      const currentTasks = cachedData?.tasks?.nodes ?? [];

      if (!currentTasks.length) return;

      const currentTask = currentTasks.find(
        (task) => task.rowId === draggableId,
      );
      if (!currentTask) return;

      const destinationColumnTasks = currentTasks.filter(
        (task) => task.columnId === destination.droppableId,
      );

      // Helper to apply optimistic update to cache
      const applyOptimisticUpdate = (
        updater: (tasks: typeof currentTasks) => typeof currentTasks,
      ) => {
        queryClient.setQueryData<TasksQuery>(queryKey, (old) => {
          if (!old?.tasks?.nodes) return old;
          return {
            ...old,
            tasks: {
              ...old.tasks,
              nodes: updater([...old.tasks.nodes]),
            },
          };
        });
      };

      if (source.droppableId === destination.droppableId) {
        // Same-column reorder: compute the new key from neighbors and update
        // only the moved task. Siblings keep their existing keys.
        const siblings = destinationColumnTasks.filter(
          (task) => task.rowId !== currentTask.rowId,
        );
        const newKey = reorderKey(
          siblings,
          destination.index,
          (task) => task.columnIndex,
        );

        applyOptimisticUpdate((prev) =>
          prev
            .map((task) =>
              task.rowId === currentTask.rowId
                ? { ...task, columnIndex: newKey }
                : task,
            )
            .sort((a, b) => compareKeys(a.columnIndex, b.columnIndex)),
        );

        await updateTask({
          rowId: currentTask.rowId,
          patch: { columnIndex: newKey },
        });
      } else {
        // Cross-column move: destinationColumnTasks already excludes the
        // moved task (it is in the source column).
        const newKey = reorderKey(
          destinationColumnTasks,
          destination.index,
          (task) => task.columnIndex,
        );

        applyOptimisticUpdate((prev) =>
          prev
            .map((task) =>
              task.rowId === currentTask.rowId
                ? {
                    ...task,
                    columnIndex: newKey,
                    columnId: destination.droppableId,
                  }
                : task,
            )
            .sort((a, b) => compareKeys(a.columnIndex, b.columnIndex)),
        );

        await updateTask({
          rowId: currentTask.rowId,
          patch: {
            columnIndex: newKey,
            columnId: destination.droppableId,
          },
        });
      }

      setDraggableId(null);

      // Mark queries as stale (mutations will handle invalidation via meta.invalidates)
      await queryClient.invalidateQueries({
        queryKey: getQueryKeyPrefix(useTasksQuery),
      });
    },
    [updateTask, setDraggableId, tasksVariables, queryClient, setIsDragging],
  );

  const onDragStart = useCallback(
    (start: DragStart) => {
      setIsDragging(true);
      setDraggableId(start.draggableId);
    },
    [setDraggableId, setIsDragging],
  );

  useHotkeys(
    Hotkeys.ToggleViewMode,
    () =>
      updateViewMode({
        rowId: userPreferences?.rowId!,
        patch: {
          viewMode: userPreferences?.viewMode !== "list" ? "list" : "board",
        },
      }),
    [updateViewMode, userPreferences?.viewMode, projectId],
  );

  const { focusedColumnId, hoveredColumnId, setQuickAddColumnId } =
    useTaskStore();

  const maxTasksReached = useMaxTasksReached();

  useHotkeys(
    Hotkeys.CreateTask,
    () => {
      const columns = project?.columns?.nodes;
      const target = resolveActiveColumnId(
        focusedColumnId,
        hoveredColumnId,
        columns,
      );
      if (!target) return;

      // Expand the target column in list view so its quick-add row is visible
      // and focusable instead of hidden inside a collapsed column (no-op in
      // board view, where the open states are unused)
      const index = columns?.findIndex((column) => column.rowId === target);
      if (index !== undefined && index >= 0) {
        setProjectColumnOpenStates((prev) => {
          if (prev[index]) return prev;

          const next = [...prev];
          next[index] = true;
          return next;
        });
      }

      setQuickAddColumnId(target);
    },
    { enabled: !maxTasksReached },
    [focusedColumnId, hoveredColumnId, project, maxTasksReached],
  );

  return (
    <div className="flex size-full">
      <div className="flex size-full flex-col">
        <div className="border-b px-6 py-4">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <h1 className="font-semibold text-2xl">{project?.name}</h1>
              {project?.isPublic && (
                <Link
                  to="/workspaces/$workspaceSlug/projects/$projectSlug"
                  params={{ workspaceSlug, projectSlug }}
                  search={{ mode: "public" }}
                  target="_blank"
                  variant="unstyled"
                  className="h-auto rounded-none p-0 font-normal"
                >
                  <Badge variant="secondary" className="gap-1">
                    <GlobeIcon className="size-3" />
                    Public
                  </Badge>
                </Link>
              )}
              <ProjectLinks links={project?.projectLinks?.nodes ?? []} />
            </div>

            {project?.description && (
              <p className="text-base-600 text-sm dark:text-base-400">
                {project.description}
              </p>
            )}

            <div className="mt-2 flex flex-wrap gap-2 sm:flex-nowrap">
              <div className="relative flex-1 sm:flex-none">
                <SearchIcon className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-base-400" />
                <Input
                  id="search-tasks"
                  autoComplete="off"
                  defaultValue={search}
                  onChange={handleSearch}
                  placeholder="Search tasks..."
                  className="border-border pl-10 shadow-xs"
                />
              </div>

              <Tooltip
                positioning={{ placement: "bottom" }}
                tooltip={
                  userPreferences?.viewMode === "list"
                    ? "Board View"
                    : "List View"
                }
                shortcut={Hotkeys.ToggleViewMode.toUpperCase()}
                trigger={
                  <Button
                    variant="outline"
                    size="icon"
                    aria-label="Switch View Mode"
                    onClick={() =>
                      updateViewMode({
                        rowId: userPreferences?.rowId!,
                        patch: {
                          viewMode:
                            userPreferences?.viewMode !== "list"
                              ? "list"
                              : "board",
                        },
                      })
                    }
                  >
                    {userPreferences?.viewMode === "list" ? (
                      <Grid2X2Icon />
                    ) : (
                      <ListIcon />
                    )}
                  </Button>
                }
              />

              <Filter />

              <Tooltip
                positioning={{ placement: "bottom" }}
                tooltip="Project Settings"
                trigger={
                  <Link
                    to="/workspaces/$workspaceSlug/projects/$projectSlug/settings"
                    params={{
                      workspaceSlug,
                      projectSlug,
                    }}
                    variant="outline"
                    size="icon"
                    aria-label="Project Settings"
                  >
                    <Settings2 />
                  </Link>
                }
              />

              {userPreferences?.viewMode === "list" && (
                <Tooltip
                  positioning={{ placement: "bottom" }}
                  tooltip={isForceClosed ? "Expand Lists" : "Collapse Lists"}
                  trigger={
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={isForceClosed ? handleOpenAll : handleCloseAll}
                      aria-label={
                        isForceClosed ? "Expand Lists" : "Collapse Lists"
                      }
                    >
                      {isForceClosed ? <Maximize2Icon /> : <Minimize2Icon />}
                    </Button>
                  }
                />
              )}
            </div>
          </div>
        </div>

        <DragDropContext onDragStart={onDragStart} onDragEnd={onDragEnd}>
          {userPreferences?.viewMode !== "list" ? (
            <Board tasks={tasks} />
          ) : (
            <List
              tasks={tasks}
              openStates={projectColumnOpenStates}
              setOpenStates={setProjectColumnOpenStates}
              setIsForceClosed={setIsForceClosed}
            />
          )}
        </DragDropContext>
      </div>

      <CreateTaskDialog />
      <UpdateAssigneesDialog />
      <UpdateDueDateDialog />
      <UpdateTaskLabelsDialog />
      <DeleteTaskDialog />
    </div>
  );
}

function PublicProjectView({ projectId }: { projectId: string }) {
  const { data: project } = useSuspenseQuery({
    ...projectOptions({ rowId: projectId }),
    select: (data) => data?.project,
  });

  const { data: tasks } = useSuspenseQuery({
    ...tasksOptions({ projectId }),
    select: (data) => data?.tasks?.nodes ?? [],
  });

  if (!project) return null;

  return (
    <div className="flex size-full flex-col">
      <div className="border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h1 className="font-semibold text-2xl">{project.name}</h1>
            <ProjectLinks links={project?.projectLinks?.nodes ?? []} />
          </div>
        </div>

        {project.description && (
          <p className="mt-1 text-base-600 text-sm dark:text-base-400">
            {project.description}
          </p>
        )}
      </div>

      <Suspense>
        <PublicBoard project={project} tasks={tasks} />
      </Suspense>
    </div>
  );
}
