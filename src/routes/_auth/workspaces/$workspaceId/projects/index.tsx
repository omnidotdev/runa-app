import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import { useSuspenseQuery } from "@tanstack/react-query";
import { notFound, stripSearchParams } from "@tanstack/react-router";
import { zodValidator } from "@tanstack/zod-adapter";
import {
  AlertCircleIcon,
  ArchiveIcon,
  ChevronDownIcon,
  Grid2X2Icon,
  ListIcon,
  Plus,
  PlusIcon,
  RocketIcon,
  SearchIcon,
} from "lucide-react";
import { useCallback } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { match } from "ts-pattern";
import { useDebounceCallback } from "usehooks-ts";
import * as z from "zod/v4";

import NotFound from "@/components/layout/NotFound";
import { Button } from "@/components/ui/button";
import {
  CollapsibleContent,
  CollapsibleRoot,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import { SidebarMenuShortcut } from "@/components/ui/sidebar";
import { Tooltip } from "@/components/ui/tooltip";
import {
  ProjectStatus,
  useUpdateProjectMutation,
  useUpdateWorkspaceMutation,
} from "@/generated/graphql";
import { Hotkeys } from "@/lib/constants/hotkeys";
import useDialogStore, { DialogType } from "@/lib/hooks/store/useDialogStore";
import useDragStore from "@/lib/hooks/store/useDragStore";
import useProjectStore from "@/lib/hooks/store/useProjectStore";
import projectsOptions from "@/lib/options/projects.options";
import workspaceOptions from "@/lib/options/workspace.options";
import seo from "@/lib/util/seo";
import { cn } from "@/lib/utils";

import type { DropResult } from "@hello-pangea/dnd";
import type { ChangeEvent } from "react";
import type { ProjectFragment } from "@/generated/graphql";

const projectsSearchSchema = z.object({
  search: z.string().default(""),
});

export const Route = createFileRoute({
  validateSearch: zodValidator(projectsSearchSchema),
  search: {
    middlewares: [stripSearchParams({ search: "" })],
  },
  loaderDeps: ({ search: { search } }) => ({ search }),
  loader: async ({
    deps: { search },
    params: { workspaceId },
    context: { queryClient },
  }) => {
    const [{ workspace }] = await Promise.all([
      queryClient.ensureQueryData(workspaceOptions({ rowId: workspaceId })),
      queryClient.ensureQueryData(projectsOptions({ workspaceId, search })),
    ]);

    if (!workspace) {
      throw notFound();
    }

    return { name: workspace.name };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [...seo({ title: `${loaderData.name} Projects` })]
      : undefined,
  }),
  notFoundComponent: () => <NotFound>Workspace Not Found</NotFound>,
  component: ProjectsOverviewPage,
});

function ProjectsOverviewPage() {
  const { workspaceId } = Route.useParams();
  const { search } = Route.useSearch();
  const navigate = Route.useNavigate();
  const { queryClient } = Route.useRouteContext();

  const { data: workspace } = useSuspenseQuery({
    ...workspaceOptions({ rowId: workspaceId }),
    select: (data) => data?.workspace,
  });

  const { data: projects } = useSuspenseQuery({
    ...projectsOptions({ workspaceId, search }),
    select: (data) => data?.projects?.nodes,
  });

  const { setDraggableId } = useDragStore();

  const { mutate: updateViewMode } = useUpdateWorkspaceMutation({
    meta: {
      invalidates: [workspaceOptions({ rowId: workspaceId }).queryKey],
    },
    onMutate: (variables) => {
      queryClient.setQueryData(
        workspaceOptions({ rowId: workspaceId }).queryKey,
        (old) => ({
          workspace: {
            ...old?.workspace!,
            viewMode: variables?.patch?.viewMode!,
          },
        }),
      );
    },
  });

  useHotkeys(
    Hotkeys.ToggleViewMode,
    () =>
      updateViewMode({
        rowId: workspaceId,
        patch: {
          viewMode: workspace?.viewMode === "board" ? "list" : "board",
        },
      }),
    [updateViewMode, workspace?.viewMode, workspaceId],
  );

  const { mutate: updateProject } = useUpdateProjectMutation({
    meta: {
      invalidates: [projectsOptions({ workspaceId, search }).queryKey],
    },
    onMutate: async (variables) => {
      await queryClient.cancelQueries(projectsOptions({ workspaceId, search }));

      queryClient.setQueryData(
        projectsOptions({ workspaceId, search }).queryKey,
        // @ts-ignore TODO: type properly
        (old) => ({
          projects: {
            ...old?.projects!,
            nodes: old?.projects?.nodes?.map((project) => {
              if (project?.rowId === variables.rowId) {
                return {
                  ...project!,
                  status: variables.patch.status,
                };
              }

              return project;
            }),
          },
        }),
      );

      setDraggableId(null);
    },
  });

  const { setIsOpen: setIsCreateProjectOpen } = useDialogStore({
    type: DialogType.CreateProject,
  });

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

  const projectsByStatus = {
    [ProjectStatus.Planned]: projects?.filter(
      (p) => p?.status === ProjectStatus.Planned,
    ) as ProjectFragment[],
    [ProjectStatus.InProgress]: projects?.filter(
      (p) => p?.status === ProjectStatus.InProgress,
    ) as ProjectFragment[],
    [ProjectStatus.Completed]: projects?.filter(
      (p) => p?.status === ProjectStatus.Completed,
    ) as ProjectFragment[],
  };

  const onDragEnd = useCallback(
    (result: DropResult) => {
      const { destination, source, draggableId } = result;

      // Exit early if dropped outside a droppable area or in the same position
      if (!destination) return;

      if (
        destination.droppableId === source.droppableId &&
        destination.index === source.index
      )
        return;

      setDraggableId(draggableId);

      updateProject({
        rowId: draggableId,
        patch: {
          status: destination.droppableId as ProjectStatus,
        },
      });
    },
    [updateProject, setDraggableId],
  );

  return (
    <div className="flex size-full">
      <div className="flex size-full flex-col">
        <div className="border-b px-6 py-4">
          <div className="flex flex-col gap-4">
            <div>
              <h1 className="mb-1 font-bold text-2xl text-base-800 sm:mb-2 sm:text-3xl dark:text-base-100">
                Projects
              </h1>
              <p className="text-base-600 text-sm sm:text-base dark:text-base-300">
                Manage and track all your projects in one place
              </p>
            </div>
            <div className="flex flex-wrap gap-2 sm:flex-nowrap">
              <div className="relative flex-1 sm:flex-none">
                <SearchIcon className="-translate-y-1/2 absolute top-1/2 left-3 size-4 text-base-400" />
                <Input
                  defaultValue={search}
                  onChange={handleSearch}
                  placeholder="Search projects..."
                  className="pl-10"
                />
              </div>

              <Tooltip
                positioning={{ placement: "bottom" }}
                tooltip={{
                  className: "bg-background text-foreground border",
                  children: (
                    <div className="inline-flex">
                      {workspace?.viewMode === "list"
                        ? "Board View"
                        : "List View"}
                      <div className="ml-2 flex items-center gap-0.5">
                        <SidebarMenuShortcut>V</SidebarMenuShortcut>
                      </div>
                    </div>
                  ),
                }}
              >
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() =>
                    updateViewMode({
                      rowId: workspaceId,
                      patch: {
                        viewMode:
                          workspace?.viewMode === "board" ? "list" : "board",
                      },
                    })
                  }
                >
                  {workspace?.viewMode === "list" ? (
                    <Grid2X2Icon />
                  ) : (
                    <ListIcon />
                  )}
                </Button>
              </Tooltip>

              <Tooltip
                positioning={{ placement: "bottom" }}
                tooltip={{
                  className: "bg-background text-foreground border",
                  children: (
                    <div className="inline-flex">
                      Create Project
                      <div className="ml-2 flex items-center gap-0.5">
                        <SidebarMenuShortcut>P</SidebarMenuShortcut>
                      </div>
                    </div>
                  ),
                }}
              >
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setIsCreateProjectOpen(true)}
                >
                  <Plus className="size-4" />
                </Button>
              </Tooltip>
            </div>
          </div>
        </div>

        <DragDropContext onDragEnd={onDragEnd}>
          {workspace?.viewMode === "board" ? (
            <ProjectsBoard projectsByStatus={projectsByStatus} />
          ) : (
            <ProjectsList projects={projects as ProjectFragment[]} />
          )}
        </DragDropContext>
      </div>
    </div>
  );
}

const getStatusIcon = (status: ProjectStatus) =>
  match(status)
    .with(ProjectStatus.Planned, () => (
      <RocketIcon className="size-4 text-purple-500" />
    ))
    .with(ProjectStatus.InProgress, () => (
      <AlertCircleIcon className="size-4 text-primary-500" />
    ))
    .with(ProjectStatus.Completed, () => (
      <ArchiveIcon className="size-4 text-green-500" />
    ))
    .exhaustive();

function ProjectsBoard({
  projectsByStatus,
}: {
  projectsByStatus: {
    [ProjectStatus.Planned]: ProjectFragment[];
    [ProjectStatus.InProgress]: ProjectFragment[];
    [ProjectStatus.Completed]: ProjectFragment[];
  };
}) {
  const { draggableId } = useDragStore();

  const { setStatus } = useProjectStore();
  const { setIsOpen: setIsCreateProjectDialogOpen } = useDialogStore({
    type: DialogType.CreateProject,
  });

  return (
    <div className="no-scrollbar h-full select-none overflow-x-auto bg-primary-100/30 dark:bg-primary-950/20">
      <div className="h-full min-w-fit p-4">
        <div className="flex h-full gap-3">
          {Object.entries(projectsByStatus).map(([status, projects]) => (
            <div
              key={status}
              className="relative flex h-full w-80 flex-col gap-2 bg-inherit"
            >
              <div className="z-10 mb-1 flex items-center justify-between rounded-lg border bg-background px-3 py-2 shadow-sm">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-base-800 text-sm dark:text-base-100">
                    {status
                      .split("_")
                      .map(
                        (word) => word.charAt(0).toUpperCase() + word.slice(1),
                      )
                      .join(" ")}
                  </h3>
                  <span className="flex size-7 items-center justify-center rounded-full bg-muted text-foreground text-xs tabular-nums">
                    {projects.length}
                  </span>
                </div>
                <Tooltip
                  positioning={{ placement: "top", gutter: 11 }}
                  tooltip={{
                    className: "bg-background text-foreground border",
                    children: (
                      <div className="inline-flex">
                        Create Project
                        <div className="ml-2 flex items-center gap-0.5">
                          <SidebarMenuShortcut>P</SidebarMenuShortcut>
                        </div>
                      </div>
                    ),
                  }}
                >
                  <Button
                    variant="ghost"
                    size="xs"
                    className="size-5"
                    onClick={() => {
                      setStatus(status as ProjectStatus);
                      setIsCreateProjectDialogOpen(true);
                    }}
                  >
                    <Plus className="size-4" />
                  </Button>
                </Tooltip>
              </div>
              <div className="no-scrollbar flex h-full overflow-y-auto">
                <Droppable droppableId={status}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={cn(
                        "flex flex-1 flex-col rounded-xl bg-background/60 p-2 dark:bg-background/20",
                        snapshot.isDraggingOver &&
                          "bg-primary-100/40 dark:bg-primary-950/40",
                      )}
                    >
                      {projects
                        .filter((project) => project.rowId !== draggableId)
                        .map((project, index) => (
                          <Draggable
                            key={project.rowId}
                            draggableId={project.rowId}
                            index={index}
                          >
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className="my-1"
                              >
                                <ProjectCard
                                  project={project}
                                  status={status as ProjectStatus}
                                />
                              </div>
                            )}
                          </Draggable>
                        ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ProjectsList({ projects }: { projects: ProjectFragment[] }) {
  const { setStatus } = useProjectStore();

  const { setIsOpen: setIsCreateProjectDialogOpen } = useDialogStore({
    type: DialogType.CreateProject,
  });

  const projectsByStatus = {
    [ProjectStatus.Planned]: projects.filter(
      (p) => p.status === ProjectStatus.Planned,
    ),
    [ProjectStatus.InProgress]: projects.filter(
      (p) => p.status === ProjectStatus.InProgress,
    ),
    [ProjectStatus.Completed]: projects.filter(
      (p) => p.status === ProjectStatus.Completed,
    ),
  };

  const { draggableId } = useDragStore();

  return (
    <div className="custom-scrollbar h-full overflow-y-auto bg-primary-100/30 p-4 dark:bg-primary-950/20">
      {Object.entries(projectsByStatus).map(([status, statusProjects]) => (
        <CollapsibleRoot
          key={status}
          className="mb-4 rounded-lg border bg-background last:mb-0"
          defaultOpen
        >
          <CollapsibleTrigger asChild>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="flex-shrink-0">
                  {status
                    .split("_")
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(" ")}
                </span>
                <span className="flex size-7 items-center justify-center rounded-full bg-muted text-foreground text-xs tabular-nums">
                  {statusProjects.length}
                </span>
              </div>

              <div className="ml-auto flex gap-2">
                <Tooltip
                  positioning={{ placement: "top", gutter: 11 }}
                  tooltip={{
                    className: "bg-background text-foreground border",
                    children: (
                      <div className="inline-flex">
                        Add Project
                        <div className="ml-2 flex items-center gap-0.5">
                          <SidebarMenuShortcut>P</SidebarMenuShortcut>
                        </div>
                      </div>
                    ),
                  }}
                >
                  <Button
                    variant="ghost"
                    size="xs"
                    className="size-5"
                    onClick={(e) => {
                      e.preventDefault();
                      setStatus(status as ProjectStatus);
                      setIsCreateProjectDialogOpen(true);
                    }}
                  >
                    <PlusIcon className="size-4" />
                  </Button>
                </Tooltip>
              </div>

              <ChevronDownIcon className="ml-2 size-4 transition-transform" />
            </div>
          </CollapsibleTrigger>

          <CollapsibleContent className="border-t">
            <Droppable droppableId={status}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={cn(
                    "flex min-h-px flex-1 flex-col divide-y divide-base-200 overflow-hidden rounded-b-lg bg-background/40 dark:divide-base-700",
                    snapshot.isDraggingOver &&
                      "bg-primary-100/40 dark:bg-primary-950/40",
                  )}
                >
                  {statusProjects.length === 0 ? (
                    <p
                      className={cn(
                        "ml-2 p-2 text-muted-foreground text-xs",
                        snapshot.isDraggingOver && "hidden",
                      )}
                    >
                      No projects
                    </p>
                  ) : (
                    statusProjects
                      .filter((project) => project.rowId !== draggableId)
                      .map((project, index) => (
                        <Draggable
                          key={project.rowId}
                          draggableId={project.rowId}
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={cn(
                                "group cursor-pointer bg-background",
                                snapshot.isDragging
                                  ? "z-10 shadow-lg"
                                  : "hover:bg-base-50/50 dark:hover:bg-background/90",
                              )}
                            >
                              <ProjectListItem
                                project={project}
                                status={status as ProjectStatus}
                              />
                            </div>
                          )}
                        </Draggable>
                      ))
                  )}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </CollapsibleContent>
        </CollapsibleRoot>
      ))}
    </div>
  );
}

function ProjectCard({
  project,
  status,
}: {
  project: ProjectFragment;
  status: ProjectStatus;
}) {
  const { workspaceId } = Route.useParams();
  const navigate = Route.useNavigate();

  const completedTasks = project.columns?.nodes?.reduce(
    (acc, col) => acc + (col?.completedTasks.totalCount || 0),
    0,
  );
  const totalTasks = project.columns?.nodes?.reduce(
    (acc, col) => acc + (col?.allTasks.totalCount || 0),
    0,
  );
  const progressPercentage =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div
      onClick={() =>
        navigate({
          to: "/workspaces/$workspaceId/projects/$projectId",
          params: {
            workspaceId,
            projectId: project.rowId,
          },
        })
      }
      className="cursor-pointer rounded-lg border bg-card p-4 shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="mb-3 flex items-center gap-2">
        {getStatusIcon(status)}
        <p className="text-base-600 text-sm dark:text-base-400">
          #{project.prefix ?? "PROJ"}
        </p>
      </div>

      <p className="mb-1 font-medium text-sm">{project.name}</p>

      <p className="mb-2 text-muted-foreground text-sm">
        {project.description}
      </p>

      <div>
        <div className="mb-1 flex justify-end text-sm">
          <span className="text-base-900 dark:text-base-100">
            {completedTasks}/{totalTasks} tasks
          </span>
        </div>
        <div className="h-2 w-full rounded-full bg-base-200 dark:bg-base-700">
          <div
            className="h-2 rounded-full bg-primary transition-all"
            style={{
              width: `${progressPercentage}%`,
              backgroundColor: project?.color ?? undefined,
            }}
          />
        </div>
      </div>
    </div>
  );
}

function ProjectListItem({
  project,
  status,
}: {
  project: ProjectFragment;
  status: ProjectStatus;
}) {
  const navigate = Route.useNavigate();
  const { workspaceId } = Route.useParams();

  const completedTasks = project.columns?.nodes?.reduce(
    (acc, col) => acc + (col?.completedTasks.totalCount || 0),
    0,
  );
  const totalTasks = project.columns?.nodes?.reduce(
    (acc, col) => acc + (col?.allTasks.totalCount || 0),
    0,
  );
  const progressPercentage =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div
      className="cursor-pointer border-base-200 border-b bg-card p-4 last:border-b-0 dark:border-base-700"
      onClick={() =>
        navigate({
          to: "/workspaces/$workspaceId/projects/$projectId",
          params: {
            workspaceId,
            projectId: project.rowId,
          },
        })
      }
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="mb-3 flex items-center gap-2">
            {getStatusIcon(status)}
            <p className="text-base-600 text-sm dark:text-base-400">
              #{project.prefix ?? "PROJ"}
            </p>
          </div>

          <p className="mb-1 font-medium text-sm">{project.name}</p>

          <p className="mb-2 text-muted-foreground text-sm">
            {project.description}
          </p>

          <div className="flex items-center justify-end">
            <div className="w-32">
              <div className="mb-1 flex justify-between text-sm">
                <span className="text-base-600 dark:text-base-400">
                  {completedTasks}/{totalTasks} tasks
                </span>
                <span className="text-base-900 dark:text-base-100">
                  {progressPercentage}%
                </span>
              </div>
              <div className="h-2 w-full rounded-full bg-base-200 dark:bg-base-700">
                <div
                  className="h-2 rounded-full bg-primary transition-all"
                  style={{
                    width: `${progressPercentage}%`,
                    backgroundColor: project?.color ?? undefined,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
