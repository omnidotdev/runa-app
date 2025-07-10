import { useSuspenseQuery } from "@tanstack/react-query";
import { notFound, stripSearchParams } from "@tanstack/react-router";
import { zodValidator } from "@tanstack/zod-adapter";
import {
  Grid2X2Icon,
  ListCollapse,
  ListIcon,
  SearchIcon,
  Settings2,
} from "lucide-react";
import { useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { useDebounceCallback } from "usehooks-ts";
import * as z from "zod/v4";

import Board from "@/components/Board";
import Link from "@/components/core/Link";
import Filter from "@/components/Filter";
import ListView from "@/components/ListView";
import NotFound from "@/components/layout/NotFound";
import CreateTaskDialog from "@/components/tasks/CreateTaskDialog";
import UpdateAssigneesDialog from "@/components/UpdateAssigneesDialog";
import UpdateDueDateDialog from "@/components/UpdateDueDateDialog";
import UpdateTaskLabelsDialog from "@/components/UpdateTaskLabelsDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SidebarMenuShotcut } from "@/components/ui/sidebar";
import { Tooltip } from "@/components/ui/tooltip";
import { useUpdateProjectMutation } from "@/generated/graphql";
import { Hotkeys } from "@/lib/constants/hotkeys";
import useTaskStore from "@/lib/hooks/store/useTaskStore";
import projectOptions from "@/lib/options/project.options";
import tasksOptions from "@/lib/options/tasks.options";
import workspaceOptions from "@/lib/options/workspace.options";
import workspaceUsersOptions from "@/lib/options/workspaceUsers.options";
import seo from "@/lib/util/seo";

import type { ChangeEvent } from "react";

const projectSearchParamsSchema = z.object({
  search: z.string().default(""),
  // See: https://zod.dev/v4/changelog?id=stricter-uuid
  assignees: z.array(z.guid()).default([]),
  labels: z.array(z.guid()).default([]),
});

export const Route = createFileRoute({
  loaderDeps: ({ search: { search, assignees, labels } }) => ({
    search,
    assignees,
    labels,
  }),
  loader: async ({
    deps: { search, assignees, labels },
    params: { projectId, workspaceId },
    context: { queryClient },
  }) => {
    const [{ project }] = await Promise.all([
      queryClient.ensureQueryData(projectOptions({ rowId: projectId })),
      queryClient.ensureQueryData(workspaceOptions({ rowId: workspaceId })),
      queryClient.ensureQueryData(
        workspaceUsersOptions({ rowId: workspaceId }),
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
        }),
      ),
    ]);

    if (!project) {
      throw notFound();
    }

    return { name: project.name };
  },
  validateSearch: zodValidator(projectSearchParamsSchema),
  search: {
    middlewares: [stripSearchParams({ search: "", assignees: [], labels: [] })],
  },
  head: ({ loaderData }) => ({
    meta: loaderData ? [...seo({ title: loaderData.name })] : undefined,
  }),
  notFoundComponent: () => <NotFound>Project Not Found</NotFound>,
  component: ProjectPage,
});

function ProjectPage() {
  const { projectId, workspaceId } = Route.useParams();
  const { search } = Route.useSearch();
  const [shouldForceClose, setShouldForceClose] = useState(false);

  const navigate = Route.useNavigate();

  const { queryClient } = Route.useRouteContext();

  const { taskId, columnId } = useTaskStore();

  const handleForceClose = () => {
    setShouldForceClose(true);
    setTimeout(() => {
      setShouldForceClose(false);
    }, 100);
  };

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

  const { data: project } = useSuspenseQuery({
    ...projectOptions({ rowId: projectId }),
    select: (data) => data?.project,
  });

  const { mutate: updateViewMode } = useUpdateProjectMutation({
    meta: {
      invalidates: [
        projectOptions({ rowId: projectId }).queryKey,
        workspaceOptions({ rowId: workspaceId }).queryKey,
      ],
    },
    onMutate: (variables) => {
      queryClient.setQueryData(
        projectOptions({ rowId: projectId }).queryKey,
        (old) => ({
          project: {
            ...old?.project!,
            viewMode: variables.patch?.viewMode!,
          },
        }),
      );
    },
  });

  useHotkeys(
    Hotkeys.ToggleViewMode,
    () =>
      updateViewMode({
        rowId: projectId,
        patch: {
          viewMode: project?.viewMode === "board" ? "list" : "board",
        },
      }),
    [updateViewMode, project?.viewMode, projectId],
  );

  return (
    <div className="flex size-full">
      <div className="flex size-full flex-col">
        <div className="border-b px-6 py-4">
          <div className="flex flex-col gap-4">
            <div>
              <h1 className="mb-1 font-bold text-2xl text-base-800 sm:mb-2 sm:text-3xl dark:text-base-100">
                {project?.name}
              </h1>
              {project?.description && (
                <p className="text-base-600 text-sm sm:text-base dark:text-base-300">
                  {project.description}
                </p>
              )}
            </div>
            <div className="flex flex-wrap gap-2 sm:flex-nowrap">
              <div className="relative flex-1 sm:flex-none">
                <SearchIcon className="-translate-y-1/2 absolute top-1/2 left-3 size-4 text-base-400" />
                <Input
                  defaultValue={search}
                  onChange={handleSearch}
                  placeholder="Search tasks..."
                  className="pl-10"
                />
              </div>
              <Tooltip
                positioning={{ placement: "bottom" }}
                tooltip={{
                  className: "bg-background text-foreground border",
                  children: (
                    <div className="inline-flex">
                      {project?.viewMode === "list"
                        ? "Board View"
                        : "List View"}
                      <div className="ml-2 flex items-center gap-0.5">
                        <SidebarMenuShotcut>V</SidebarMenuShotcut>
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
                      rowId: project?.rowId!,
                      patch: {
                        viewMode:
                          project?.viewMode === "board" ? "list" : "board",
                      },
                    })
                  }
                >
                  {project?.viewMode === "list" ? (
                    <Grid2X2Icon />
                  ) : (
                    <ListIcon />
                  )}
                </Button>
              </Tooltip>

              {project?.viewMode === "list" && (
                <Tooltip
                  positioning={{ placement: "bottom" }}
                  tooltip={{
                    className: "bg-background text-foreground border",
                    children: "Collapse List",
                  }}
                >
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleForceClose}
                  >
                    <ListCollapse />
                  </Button>
                </Tooltip>
              )}

              <Tooltip
                positioning={{ placement: "bottom" }}
                tooltip={{
                  className: "bg-background text-foreground border",
                  children: "Project Settings",
                }}
              >
                <Link
                  to="/workspaces/$workspaceId/projects/$projectId/settings"
                  params={{
                    workspaceId,
                    projectId,
                  }}
                  variant="outline"
                  size="icon"
                >
                  <Settings2 />
                </Link>
              </Tooltip>

              <Filter />
            </div>
          </div>
        </div>

        {project?.viewMode === "board" ? (
          <Board />
        ) : (
          <ListView shouldForceClose={shouldForceClose} />
        )}
      </div>

      <CreateTaskDialog columnId={columnId ?? undefined} />

      {taskId && <UpdateAssigneesDialog />}
      {taskId && <UpdateDueDateDialog />}
      {taskId && <UpdateTaskLabelsDialog />}
    </div>
  );
}
