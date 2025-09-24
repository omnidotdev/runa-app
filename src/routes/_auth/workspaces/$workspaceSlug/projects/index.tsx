import { DragDropContext } from "@hello-pangea/dnd";
import { useSuspenseQuery } from "@tanstack/react-query";
import {
  createFileRoute,
  notFound,
  stripSearchParams,
} from "@tanstack/react-router";
import { zodValidator } from "@tanstack/zod-adapter";
import { Grid2X2Icon, ListIcon, Plus, SearchIcon } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { useDebounceCallback } from "usehooks-ts";
import * as z from "zod/v4";

import NotFound from "@/components/layout/NotFound";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tooltip } from "@/components/ui/tooltip";
import Board from "@/components/workspaces/overview/Board";
import List from "@/components/workspaces/overview/List";
import {
  Role,
  useUpdateProjectMutation,
  useUpdateWorkspaceMutation,
} from "@/generated/graphql";
import { Hotkeys } from "@/lib/constants/hotkeys";
import useDialogStore, { DialogType } from "@/lib/hooks/store/useDialogStore";
import useDragStore from "@/lib/hooks/store/useDragStore";
import projectColumnsOptions from "@/lib/options/projectColumns.options";
import projectsOptions from "@/lib/options/projects.options";
import workspaceOptions from "@/lib/options/workspace.options";
import seo from "@/lib/util/seo";
import { cn } from "@/lib/utils";

import type { DropResult } from "@hello-pangea/dnd";
import type { ChangeEvent } from "react";

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
    context: { queryClient, workspaceBySlug },
  }) => {
    if (!workspaceBySlug) {
      throw notFound();
    }

    await Promise.all([
      queryClient.ensureQueryData(
        projectsOptions({ workspaceId: workspaceBySlug.rowId!, search }),
      ),
      queryClient.ensureQueryData(
        projectColumnsOptions({ workspaceId: workspaceBySlug.rowId!, search }),
      ),
    ]);

    return { name: workspaceBySlug.name, workspaceId: workspaceBySlug.rowId };
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
  const { session } = Route.useRouteContext();
  const { workspaceId } = Route.useLoaderData();
  const { search } = Route.useSearch();
  const navigate = Route.useNavigate();
  const { queryClient } = Route.useRouteContext();

  const { data: workspace } = useSuspenseQuery({
    ...workspaceOptions({
      rowId: workspaceId,
      userId: session?.user?.rowId!,
    }),
    select: (data) => data?.workspace,
  });

  const isMember = workspace?.workspaceUsers?.nodes?.[0]?.role === Role.Member;

  const { data: projects } = useSuspenseQuery({
    ...projectsOptions({ workspaceId, search }),
    select: (data) => data?.projects?.nodes ?? [],
  });

  const [localProjects, setLocalProjects] = useState(projects);

  const { setDraggableId } = useDragStore();

  const { mutate: updateViewMode } = useUpdateWorkspaceMutation({
    meta: {
      invalidates: [
        workspaceOptions({
          rowId: workspaceId,
          userId: session?.user?.rowId!,
        }).queryKey,
      ],
    },
    onMutate: (variables) => {
      queryClient.setQueryData(
        workspaceOptions({
          rowId: workspaceId,
          userId: session?.user?.rowId!,
        }).queryKey,
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

  const { mutateAsync: updateProject } = useUpdateProjectMutation({
    meta: {
      invalidates: [["all"]],
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

  const onDragEnd = useCallback(
    async (result: DropResult) => {
      const { destination, source, draggableId } = result;

      // Exit early if dropped outside a droppable area or in the same position
      if (!destination) return;

      if (
        destination.droppableId === source.droppableId &&
        destination.index === source.index
      )
        return;

      setDraggableId(draggableId);

      if (localProjects?.length) {
        const currentProject = localProjects.find(
          (project) => project.rowId === draggableId,
        )!;

        const destinationColumnProjects = localProjects.filter(
          (project) => project.projectColumnId === destination.droppableId,
        );

        if (source.droppableId === destination.droppableId) {
          const reorderedColumnProjects = [...destinationColumnProjects];
          const [projectToMove] = reorderedColumnProjects.splice(
            currentProject.columnIndex,
            1,
          );
          reorderedColumnProjects.splice(destination.index, 0, projectToMove);

          setLocalProjects((prev) => {
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
          const sourceColumnProjectsExcludingMovedProject =
            localProjects.filter(
              (project) =>
                project.projectColumnId === source.droppableId &&
                project.rowId !== draggableId,
            );

          const sourceProjectIds =
            sourceColumnProjectsExcludingMovedProject.map(
              (project) => project.rowId,
            );

          const projectsWithMovedInDestination = [...destinationColumnProjects];
          projectsWithMovedInDestination.splice(
            destination.index,
            0,
            currentProject,
          );

          const destinationProjectIds = projectsWithMovedInDestination.map(
            (project) => project.rowId,
          );

          setLocalProjects((prev) => {
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

        await queryClient.invalidateQueries({
          queryKey: ["Projects"],
          // NB: important to refetch all `Projects` queries *even* if they are inactive to prevent flashing when search params are updated
          refetchType: "all",
        });
      }
    },
    [updateProject, setDraggableId, localProjects, queryClient],
  );

  useEffect(() => setLocalProjects(projects), [projects]);

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
            <div className="flex flex-wrap gap-2 sm:flex-nowrap">
              <div className="relative flex-1 sm:flex-none">
                <SearchIcon className="-translate-y-1/2 absolute top-1/2 left-3 size-4 text-base-400" />
                <Input
                  defaultValue={search}
                  onChange={handleSearch}
                  placeholder="Search projects..."
                  className="pl-10"
                  id="project-search-input"
                  autoComplete="off"
                />
              </div>

              <Tooltip
                positioning={{ placement: "bottom" }}
                tooltip={
                  workspace?.viewMode === "list" ? "Board View" : "List View"
                }
                shortcut="V"
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
                  aria-label={
                    workspace?.viewMode === "list" ? "Board View" : "List View"
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
                tooltip="Create Project"
                shortcut="P"
              >
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setIsCreateProjectOpen(true)}
                  disabled={!workspace?.projectColumns?.nodes?.length}
                  aria-label="Create Project"
                  className={cn("hidden", !isMember && "inline-flex")}
                >
                  <Plus className="size-4" />
                </Button>
              </Tooltip>
            </div>
          </div>
        </div>

        <DragDropContext onDragEnd={onDragEnd}>
          {workspace?.viewMode === "board" ? (
            <Board projects={localProjects} />
          ) : (
            <List projects={localProjects} />
          )}
        </DragDropContext>
      </div>
    </div>
  );
}
