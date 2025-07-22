import { DragDropContext } from "@hello-pangea/dnd";
import { useSuspenseQuery } from "@tanstack/react-query";
import { notFound, stripSearchParams } from "@tanstack/react-router";
import { zodValidator } from "@tanstack/zod-adapter";
import { Grid2X2Icon, ListIcon, Plus, SearchIcon } from "lucide-react";
import { useCallback } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { useDebounceCallback } from "usehooks-ts";
import * as z from "zod";

import NotFound from "@/components/layout/NotFound";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SidebarMenuShortcut } from "@/components/ui/sidebar";
import { Tooltip } from "@/components/ui/tooltip";
import Board from "@/components/workspaces/overview/Board";
import List from "@/components/workspaces/overview/List";
import {
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

import type { DropResult } from "@hello-pangea/dnd";
import type { ChangeEvent } from "react";

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
    context: { queryClient, session, workspaceBySlug },
  }) => {
    if (!workspaceBySlug) {
      throw notFound();
    }

    await Promise.all([
      queryClient.ensureQueryData(
        workspaceOptions({
          rowId: workspaceBySlug.rowId!,
          userId: session?.user?.rowId!,
        }),
      ),
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

  const { mutate: updateProject } = useUpdateProjectMutation({
    meta: {
      invalidates: [
        projectsOptions({ workspaceId, search }).queryKey,
        projectColumnsOptions({ workspaceId }).queryKey,
      ],
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
                  projectColumnId: variables.patch.projectColumnId,
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
          projectColumnId: destination.droppableId,
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
          {workspace?.viewMode === "board" ? <Board /> : <List />}
        </DragDropContext>
      </div>
    </div>
  );
}
