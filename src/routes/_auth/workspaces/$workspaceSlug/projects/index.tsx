import { DragDropContext } from "@hello-pangea/dnd";
import { useSuspenseQuery } from "@tanstack/react-query";
import {
  createFileRoute,
  notFound,
  stripSearchParams,
} from "@tanstack/react-router";
import { zodValidator } from "@tanstack/zod-adapter";
import {
  ColumnsIcon,
  Grid2X2Icon,
  ListIcon,
  Plus,
  SearchIcon,
} from "lucide-react";
import { useCallback, useMemo } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { useDebounceCallback } from "usehooks-ts";
import { z } from "zod";

import { Tooltip } from "@/components/core";
import { NotFound } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { OverviewBoard, OverviewList } from "@/components/workspaces";
import {
  useProjectQuery,
  useProjectsQuery,
  useSettingByOrganizationIdQuery,
  useUpdateProjectMutation,
  useUpdateSettingMutation,
} from "@/generated/graphql";
import { BASE_URL } from "@/lib/config/env.config";
import { Hotkeys } from "@/lib/constants/hotkeys";
import useDialogStore, { DialogType } from "@/lib/hooks/store/useDialogStore";
import useDragStore from "@/lib/hooks/store/useDragStore";
import { useCurrentUserRole } from "@/lib/hooks/useCurrentUserRole";
import useMaxProjectsReached from "@/lib/hooks/useMaxProjectsReached";
import projectColumnsOptions from "@/lib/options/projectColumns.options";
import projectsOptions from "@/lib/options/projects.options";
import settingByOrganizationIdOptions from "@/lib/options/settingByOrganizationId.options";
import { Role } from "@/lib/permissions";
import createMetaTags from "@/lib/util/createMetaTags";
import getQueryKeyPrefix from "@/lib/util/getQueryKeyPrefix";
import { cn } from "@/lib/utils";

import type { DragStart, DropResult } from "@hello-pangea/dnd";
import type { ChangeEvent } from "react";
import type { ProjectsQuery } from "@/generated/graphql";

const projectsSearchSchema = z.object({
  search: z.string().default(""),
});

export const Route = createFileRoute(
  "/_auth/workspaces/$workspaceSlug/projects/",
)({
  validateSearch: zodValidator(projectsSearchSchema),
  search: {
    middlewares: [stripSearchParams({ search: "" })],
  },
  loaderDeps: ({ search: { search } }) => ({ search }),
  loader: async ({
    deps: { search },
    context: { queryClient, organizationId, session },
  }) => {
    if (!organizationId) {
      throw notFound();
    }

    await Promise.all([
      queryClient.ensureQueryData(
        projectsOptions({
          organizationId,
          search,
          userId: session?.user?.rowId,
        }),
      ),
      queryClient.ensureQueryData(
        projectColumnsOptions({
          organizationId,
          search,
        }),
      ),
    ]);

    return { organizationId };
  },
  head: ({ params }) => ({
    meta: [
      ...createMetaTags({
        title: "Projects",
        description: "Manage and track all projects for this workspace.",
        url: `${BASE_URL}/workspaces/${params.workspaceSlug}/projects`,
      }),
    ],
  }),
  notFoundComponent: () => <NotFound>Workspace Not Found</NotFound>,
  component: ProjectsOverviewPage,
});

function ProjectsOverviewPage() {
  const { session } = Route.useRouteContext();
  const { organizationId } = Route.useLoaderData();
  const { search } = Route.useSearch();
  const navigate = Route.useNavigate();
  const { queryClient } = Route.useRouteContext();

  const { data: settings } = useSuspenseQuery({
    ...settingByOrganizationIdOptions({ organizationId }),
    select: (data) => data?.settingByOrganizationId,
  });

  // Get role from IDP organization claims
  const role = useCurrentUserRole(organizationId);
  const isMember = role === Role.Member;

  const maxProjectsReached = useMaxProjectsReached();

  const projectsVariables = useMemo(
    () => ({ organizationId, search, userId: session?.user?.rowId }),
    [organizationId, search, session?.user?.rowId],
  );

  const { data: projects } = useSuspenseQuery({
    ...projectsOptions(projectsVariables),
    select: (data) => data?.projects?.nodes ?? [],
  });

  const { setDraggableId, setIsDragging } = useDragStore();

  const { mutate: updateViewMode } = useUpdateSettingMutation({
    meta: {
      invalidates: [getQueryKeyPrefix(useSettingByOrganizationIdQuery)],
    },
    onMutate: (variables) => {
      queryClient.setQueryData(
        settingByOrganizationIdOptions({ organizationId }).queryKey,
        (old) => ({
          settingByOrganizationId: {
            ...old?.settingByOrganizationId!,
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
        rowId: settings?.rowId!,
        patch: {
          viewMode: settings?.viewMode === "board" ? "list" : "board",
        },
      }),
    [updateViewMode, settings?.viewMode, settings?.rowId],
  );

  const { mutateAsync: updateProject } = useUpdateProjectMutation({
    meta: {
      invalidates: [
        getQueryKeyPrefix(useProjectsQuery),
        getQueryKeyPrefix(useProjectQuery),
      ],
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

  const onDragStart = useCallback(
    (start: DragStart) => {
      setIsDragging(true);
      setDraggableId(start.draggableId);
    },
    [setIsDragging, setDraggableId],
  );

  // biome-ignore lint/correctness/useExhaustiveDependencies: `setIsDragging` is stable
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

      // Get current projects from cache
      const queryKey = projectsOptions(projectsVariables).queryKey;
      const cachedData = queryClient.getQueryData<ProjectsQuery>(queryKey);
      const currentProjects = cachedData?.projects?.nodes ?? [];

      if (!currentProjects.length) return;

      const currentProject = currentProjects.find(
        (project) => project.rowId === draggableId,
      );
      if (!currentProject) return;

      const destinationColumnProjects = currentProjects.filter(
        (project) => project.projectColumnId === destination.droppableId,
      );

      // Helper to apply optimistic update to cache
      const applyOptimisticUpdate = (
        updater: (projects: typeof currentProjects) => typeof currentProjects,
      ) => {
        queryClient.setQueryData<ProjectsQuery>(queryKey, (old) => {
          if (!old?.projects?.nodes) return old;
          return {
            ...old,
            projects: {
              ...old.projects,
              nodes: updater([...old.projects.nodes]),
            },
          };
        });
      };

      if (source.droppableId === destination.droppableId) {
        // Same column reorder
        const reorderedColumnProjects = [...destinationColumnProjects];
        const [projectToMove] = reorderedColumnProjects.splice(
          currentProject.columnIndex,
          1,
        );
        reorderedColumnProjects.splice(destination.index, 0, projectToMove);

        // Optimistic update
        applyOptimisticUpdate((prev) => {
          const unTouchedProjects = prev.filter(
            (project) => project.projectColumnId !== destination.droppableId,
          );
          return [
            ...unTouchedProjects,
            ...reorderedColumnProjects.map((project, index) => ({
              ...project,
              columnIndex: index,
            })),
          ];
        });

        // Persist to server
        await Promise.all(
          reorderedColumnProjects.map((project, index) =>
            updateProject({
              rowId: project.rowId,
              patch: {
                columnIndex: index,
              },
            }),
          ),
        );
      } else {
        // Cross-column move
        const sourceColumnProjectsExcludingMovedProject =
          currentProjects.filter(
            (project) =>
              project.projectColumnId === source.droppableId &&
              project.rowId !== draggableId,
          );

        const projectsWithMovedInDestination = [...destinationColumnProjects];
        projectsWithMovedInDestination.splice(
          destination.index,
          0,
          currentProject,
        );

        const sourceProjectIds = sourceColumnProjectsExcludingMovedProject.map(
          (project) => project.rowId,
        );
        const destinationProjectIds = projectsWithMovedInDestination.map(
          (project) => project.rowId,
        );

        // Optimistic update
        applyOptimisticUpdate((prev) => {
          const unTouchedProjects = prev.filter(
            (project) =>
              !sourceProjectIds.includes(project.rowId) &&
              !destinationProjectIds.includes(project.rowId),
          );
          return [
            ...unTouchedProjects,
            ...sourceColumnProjectsExcludingMovedProject.map(
              (project, index) => ({
                ...project,
                columnIndex: index,
              }),
            ),
            ...projectsWithMovedInDestination.map((project, index) => ({
              ...project,
              columnIndex: index,
              projectColumnId:
                project.rowId === currentProject.rowId
                  ? destination.droppableId
                  : project.projectColumnId,
            })),
          ];
        });

        // Persist to server
        await Promise.all([
          ...sourceColumnProjectsExcludingMovedProject.map((project, index) =>
            updateProject({
              rowId: project.rowId,
              patch: {
                columnIndex: index,
              },
            }),
          ),
          ...projectsWithMovedInDestination.map((project, index) =>
            updateProject({
              rowId: project.rowId,
              patch: {
                columnIndex: index,
                projectColumnId:
                  project.rowId === currentProject.rowId
                    ? destination.droppableId
                    : project.projectColumnId,
              },
            }),
          ),
        ]);
      }

      setDraggableId(null);

      // Mark queries as stale (mutations will handle invalidation via meta.invalidates)
      await queryClient.invalidateQueries({
        queryKey: getQueryKeyPrefix(useProjectsQuery),
      });
    },
    [updateProject, setDraggableId, projectsVariables, queryClient],
  );

  return (
    <div className="flex size-full">
      <div className="flex size-full flex-col">
        <div className="border-b px-6 py-4">
          <div className="flex flex-col gap-4">
            <div>
              <h2 className="mb-1 font-bold text-2xl text-base-800 sm:mb-2 sm:text-3xl dark:text-base-100">
                Projects
              </h2>
              <p className="text-base-600 text-sm sm:text-base dark:text-base-300">
                Manage and track all your projects in one place
              </p>
            </div>

            <div className="mb-4 flex items-center gap-2 rounded-lg border border-primary-200 bg-primary-50 px-4 py-2.5 text-primary-700 dark:border-primary-800 dark:bg-primary-950/50 dark:text-primary-300">
              <ColumnsIcon className="size-4 shrink-0" />
              <span className="text-sm">
                Editing project columns is coming soon.
              </span>
            </div>

            <div className="flex flex-wrap gap-2 sm:flex-nowrap">
              <div className="relative flex-1 sm:flex-none">
                <SearchIcon className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-base-400" />
                <Input
                  defaultValue={search}
                  onChange={handleSearch}
                  placeholder="Search projects..."
                  className="border-border pl-10 shadow-xs"
                  id="project-search-input"
                  autoComplete="off"
                />
              </div>

              <Tooltip
                positioning={{ placement: "bottom" }}
                tooltip={
                  settings?.viewMode === "list" ? "Board View" : "List View"
                }
                shortcut="V"
                trigger={
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() =>
                      updateViewMode({
                        rowId: settings?.rowId!,
                        patch: {
                          viewMode:
                            settings?.viewMode === "board" ? "list" : "board",
                        },
                      })
                    }
                    aria-label={
                      settings?.viewMode === "list" ? "Board View" : "List View"
                    }
                  >
                    {settings?.viewMode === "list" ? (
                      <Grid2X2Icon />
                    ) : (
                      <ListIcon />
                    )}
                  </Button>
                }
              />

              <Tooltip
                positioning={{ placement: "bottom" }}
                tooltip="Create Project"
                shortcut="P"
                trigger={
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setIsCreateProjectOpen(true)}
                    // TODO: update tooltip to handle disabled state
                    disabled={maxProjectsReached}
                    aria-label="Create Project"
                    className={cn("hidden", !isMember && "inline-flex")}
                  >
                    <Plus className="size-4" />
                  </Button>
                }
              />
            </div>
          </div>
        </div>

        <DragDropContext onDragStart={onDragStart} onDragEnd={onDragEnd}>
          {settings?.viewMode === "board" ? (
            <OverviewBoard projects={projects} />
          ) : (
            <OverviewList projects={projects} />
          )}
        </DragDropContext>
      </div>
    </div>
  );
}
