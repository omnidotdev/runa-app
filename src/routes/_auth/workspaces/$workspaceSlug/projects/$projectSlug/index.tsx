import { DragDropContext } from "@hello-pangea/dnd";
import { useSuspenseQuery } from "@tanstack/react-query";
import {
  createFileRoute,
  notFound,
  stripSearchParams,
} from "@tanstack/react-router";
import { zodValidator } from "@tanstack/zod-adapter";
import {
  Grid2X2Icon,
  ListIcon,
  Maximize2Icon,
  Minimize2Icon,
  SearchIcon,
  Settings2,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { useDebounceCallback } from "usehooks-ts";
import * as z from "zod/v4";

import Link from "@/components/core/Link";
import RichTextEditor from "@/components/core/RichTextEditor";
import NotFound from "@/components/layout/NotFound";
import Board from "@/components/projects/Board";
import List from "@/components/projects/List";
import CreateTaskDialog from "@/components/tasks/CreateTaskDialog";
import Filter from "@/components/tasks/Filter";
import UpdateAssigneesDialog from "@/components/tasks/UpdateAssigneesDialog";
import UpdateDueDateDialog from "@/components/tasks/UpdateDueDateDialog";
import UpdateTaskLabelsDialog from "@/components/tasks/UpdateTaskLabelsDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tooltip } from "@/components/ui/tooltip";
import {
  useUpdateProjectMutation,
  useUpdateTaskMutation,
  useUpdateUserPreferenceMutation,
} from "@/generated/graphql";
import { Hotkeys } from "@/lib/constants/hotkeys";
import getSdk from "@/lib/graphql/getSdk";
import useDragStore from "@/lib/hooks/store/useDragStore";
import projectOptions from "@/lib/options/project.options";
import tasksOptions from "@/lib/options/tasks.options";
import userPreferencesOptions from "@/lib/options/userPreferences.options";
import generateSlug from "@/lib/util/generateSlug";
import seo from "@/lib/util/seo";

import type { DragStart, DropResult } from "@hello-pangea/dnd";
import type { ChangeEvent } from "react";
import type { TasksQueryVariables } from "@/generated/graphql";

const projectSearchParamsSchema = z.object({
  search: z.string().default(""),
  // See: https://zod.dev/v4/changelog?id=stricter-uuid
  assignees: z.array(z.guid()).default([]),
  labels: z.array(z.guid()).default([]),
  priorities: z.array(z.enum(["low", "medium", "high"])).default([]),
  createTask: z.boolean().default(false),
});

export const Route = createFileRoute(
  "/_auth/workspaces/$workspaceSlug/projects/$projectSlug/",
)({
  // TODO: scaffold out. `loader` work takes longer than the preload of `intent` so without the `pendingComponent` we get flash of content
  // pendingComponent: () => (
  //   <div className="flex size-full items-center justify-center">Loading...</div>
  // ),
  loaderDeps: ({ search: { search, assignees, labels, priorities } }) => ({
    search,
    assignees,
    labels,
    priorities,
  }),
  loader: async ({
    deps: { search, assignees, labels, priorities },
    context: { session, queryClient, workspaceBySlug },
  }) => {
    if (!workspaceBySlug || !workspaceBySlug.projects.nodes.length) {
      throw notFound();
    }

    const project = workspaceBySlug.projects.nodes[0];

    const projectId = project.rowId;
    const projectName = project.name;

    await Promise.all([
      queryClient.ensureQueryData(
        projectOptions({
          rowId: projectId,
        }),
      ),
      queryClient.ensureQueryData(
        userPreferencesOptions({
          userId: session?.user.rowId!,
          projectId,
        }),
      ),
      queryClient.ensureQueryData(
        tasksOptions({
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
      ),
    ]);

    return {
      name: projectName,
      projectId,
      workspaceId: workspaceBySlug.rowId,
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
        createTask: false,
      }),
    ],
  },
  head: ({ loaderData }) => ({
    meta: loaderData ? [...seo({ title: loaderData.name })] : undefined,
  }),
  notFoundComponent: () => <NotFound>Project Not Found</NotFound>,
  component: ProjectPage,
});

function ProjectPage() {
  const { session } = Route.useRouteContext();
  const { projectSlug, workspaceSlug } = Route.useParams();
  const { projectId } = Route.useLoaderData();
  const { search, assignees, labels, priorities } = Route.useSearch();
  const [isForceClosed, setIsForceClosed] = useState(false);
  const [nameError, setNameError] = useState<string | null>(null);

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

  const [localTasks, setLocalTasks] = useState(tasks);

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

  const editNameSchema = z
    .object({
      name: z
        .string()
        .min(3, { error: "Name must be at least 3 characters." })
        .default(project?.name!),
      currentSlug: z.string().default(project?.slug!),
    })
    .check(async (ctx) => {
      const sdk = await getSdk();

      const updatedSlug = generateSlug(ctx.value.name);

      if (!updatedSlug?.length || updatedSlug === ctx.value.currentSlug)
        return z.NEVER;

      const { workspaceBySlug } = await sdk.WorkspaceBySlug({
        slug: workspaceSlug,
        projectSlug: updatedSlug,
      });

      if (workspaceBySlug?.projects.nodes.length) {
        ctx.issues.push({
          code: "custom",
          message: "Project slug already exists for this workspace.",
          input: ctx.value.name,
        });
      }
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
      invalidates: [["all"]],
    },
    onMutate: (variables) => {
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
    },
  });

  const { mutate: updateProject } = useUpdateProjectMutation({
    meta: {
      invalidates: [["all"]],
    },
    onSuccess: (_data, variables) => {
      if (variables.patch.slug) {
        navigate({
          to: "/workspaces/$workspaceSlug/projects/$projectSlug",
          params: { workspaceSlug, projectSlug: variables.patch.slug },
          replace: true,
        });
      }
    },
  });

  const handleProjectUpdate = useDebounceCallback(updateProject, 300);

  const { mutateAsync: updateTask } = useUpdateTaskMutation({
    meta: {
      invalidates: [["all"]],
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

      if (localTasks?.length) {
        const currentTask = localTasks.find(
          (task) => task.rowId === draggableId,
        )!;

        const destinationColumnTasks = localTasks.filter(
          (task) => task.columnId === destination.droppableId,
        );

        if (source.droppableId === destination.droppableId) {
          const reorderedColumnTasks = [...destinationColumnTasks];
          const [taskToMove] = reorderedColumnTasks.splice(
            currentTask.columnIndex,
            1,
          );
          reorderedColumnTasks.splice(destination.index, 0, taskToMove);

          setLocalTasks((prev) => {
            const unTouchedTasks = prev.filter(
              (task) => task.columnId !== destination.droppableId,
            );

            return [
              ...unTouchedTasks,
              ...reorderedColumnTasks.filter(Boolean).map((task, index) => ({
                ...task,
                columnIndex: index,
              })),
            ];
          });

          await Promise.all(
            reorderedColumnTasks.filter(Boolean).map((task, index) =>
              updateTask({
                rowId: task.rowId,
                patch: {
                  columnIndex: index,
                },
              }),
            ),
          );
        } else {
          const sourceColumnTasksExcludingMovedTask = localTasks.filter(
            (task) =>
              task.columnId === source.droppableId &&
              task.rowId !== draggableId,
          );

          const sourceTaskIds = sourceColumnTasksExcludingMovedTask.map(
            (task) => task.rowId,
          );

          const tasksWithMovedInDestination = [...destinationColumnTasks];
          tasksWithMovedInDestination.splice(destination.index, 0, currentTask);

          const destinationTaskIds = tasksWithMovedInDestination.map(
            (task) => task.rowId,
          );

          setLocalTasks((prev) => {
            const unTouchedTasks = prev.filter(
              (task) =>
                !sourceTaskIds.includes(task.rowId) &&
                !destinationTaskIds.includes(task.rowId),
            );

            return [
              ...unTouchedTasks,
              ...sourceColumnTasksExcludingMovedTask.map((task, index) => ({
                ...task,
                columnIndex: index,
              })),
              ...tasksWithMovedInDestination.map((task, index) => ({
                ...task,
                columnIndex: index,
                columnId:
                  task.rowId === currentTask.rowId
                    ? destination.droppableId
                    : task.columnId,
              })),
            ];
          });

          await Promise.all([
            ...sourceColumnTasksExcludingMovedTask.map((task, index) =>
              updateTask({
                rowId: task.rowId,
                patch: {
                  columnIndex: index,
                },
              }),
            ),
            ...tasksWithMovedInDestination.map((task, index) =>
              updateTask({
                rowId: task.rowId,
                patch: {
                  columnIndex: index,
                  columnId:
                    task.rowId === currentTask.rowId
                      ? destination.droppableId
                      : task.columnId,
                },
              }),
            ),
          ]);
        }

        setDraggableId(null);

        await queryClient.invalidateQueries({
          queryKey: ["Tasks"],
          // NB: important to refetch all `Tasks` queries *even* if they are inactive to prevent flashing when search params are updated
          refetchType: "all",
        });
      }
    },
    [updateTask, setDraggableId, localTasks, queryClient, setIsDragging],
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
          viewMode: userPreferences?.viewMode === "board" ? "list" : "board",
        },
      }),
    [updateViewMode, userPreferences?.viewMode, projectId],
  );

  useEffect(() => setLocalTasks(tasks), [tasks]);

  return (
    <div className="flex size-full">
      <div className="flex size-full flex-col">
        <div className="border-b px-6 py-4">
          <div className="flex flex-col gap-2">
            <RichTextEditor
              key={project?.name}
              defaultContent={project?.name}
              className="min-h-0 border-0 bg-transparent p-0 text-2xl dark:bg-transparent"
              skeletonClassName="h-8 max-w-80"
              onUpdate={async ({ editor }) => {
                const text = editor.getText().trim();

                const result = await editNameSchema.safeParseAsync({
                  name: text,
                });

                if (!result.success) {
                  setNameError(result.error.issues[0].message);
                  return;
                }

                setNameError(null);
                handleProjectUpdate({
                  rowId: projectId,
                  patch: { name: text, slug: generateSlug(text) },
                });
              }}
            />

            {nameError && (
              <p className="mt-1 text-red-500 text-sm">{nameError}</p>
            )}

            <RichTextEditor
              key={project?.description}
              defaultContent={project?.description || ""}
              className="min-h-0 border-0 bg-transparent p-0 text-base-600 text-sm dark:bg-transparent dark:text-base-400"
              placeholder="Add a short description..."
              skeletonClassName="h-5 max-w-40"
              onUpdate={({ editor }) =>
                handleProjectUpdate({
                  rowId: projectId,
                  patch: {
                    description: editor.getText(),
                  },
                })
              }
            />

            <div className="mt-2 flex flex-wrap gap-2 sm:flex-nowrap">
              <div className="relative flex-1 sm:flex-none">
                <SearchIcon className="-translate-y-1/2 absolute top-1/2 left-3 size-4 text-base-400" />
                <Input
                  id="search-tasks"
                  autoComplete="off"
                  defaultValue={search}
                  onChange={handleSearch}
                  placeholder="Search tasks..."
                  className="pl-10"
                />
              </div>

              <Tooltip
                positioning={{ placement: "bottom" }}
                shortcut="V"
                tooltip={
                  userPreferences?.viewMode === "list"
                    ? "Board View"
                    : "List View"
                }
              >
                <Button
                  variant="outline"
                  size="icon"
                  aria-label="Switch View Mode"
                  onClick={() =>
                    updateViewMode({
                      rowId: userPreferences?.rowId!,
                      patch: {
                        viewMode:
                          userPreferences?.viewMode === "board"
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
              </Tooltip>

              <Tooltip
                positioning={{ placement: "bottom" }}
                tooltip="Project Settings"
              >
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
              </Tooltip>

              <Filter />

              {userPreferences?.viewMode === "list" && (
                <Tooltip
                  positioning={{ placement: "bottom" }}
                  tooltip={isForceClosed ? "Expand Lists" : "Collapse Lists"}
                >
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
                </Tooltip>
              )}
            </div>
          </div>
        </div>

        <DragDropContext onDragStart={onDragStart} onDragEnd={onDragEnd}>
          {userPreferences?.viewMode === "board" ? (
            <Board tasks={localTasks} />
          ) : (
            <List
              tasks={localTasks}
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
    </div>
  );
}
