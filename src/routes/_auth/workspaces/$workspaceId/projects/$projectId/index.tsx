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
import { useDebounceCallback } from "usehooks-ts";
import * as z from "zod/v4";

import Board from "@/components/Board";
import Link from "@/components/core/Link";
import ListView from "@/components/ListView";
import NotFound from "@/components/layout/NotFound";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  TooltipContent,
  TooltipPositioner,
  TooltipRoot,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useUpdateProjectMutation } from "@/generated/graphql";
import projectOptions from "@/lib/options/project.options";
import tasksOptions from "@/lib/options/tasks.options";
import workspaceOptions from "@/lib/options/workspace.options";
import seo from "@/utils/seo";

import type { ChangeEvent } from "react";

const projectSearchSchema = z.object({
  search: z.string().default(""),
});

export const Route = createFileRoute({
  loaderDeps: ({ search: { search } }) => ({ search }),
  loader: async ({
    deps: { search },
    params: { projectId, workspaceId },
    context,
  }) => {
    const [{ project }] = await Promise.all([
      context.queryClient.ensureQueryData(projectOptions(projectId)),
      context.queryClient.ensureQueryData(workspaceOptions(workspaceId)),
    ]);

    if (!project) {
      throw notFound();
    }

    const columnIds = project.columns?.nodes?.map((col) => col?.rowId);

    await Promise.all(
      columnIds.map((colId) =>
        context.queryClient.ensureQueryData(tasksOptions(colId!, search)),
      ),
    );

    return { name: project.name };
  },
  validateSearch: zodValidator(projectSearchSchema),
  search: {
    middlewares: [stripSearchParams({ search: "" })],
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
    ...projectOptions(projectId),
    select: (data) => data?.project,
  });

  const { mutate: updateViewMode } = useUpdateProjectMutation({
    meta: {
      invalidates: [
        projectOptions(projectId).queryKey,
        workspaceOptions(workspaceId).queryKey,
      ],
    },
    onMutate: (variables) => {
      queryClient.setQueryData(projectOptions(projectId).queryKey, (old) => ({
        project: {
          ...old?.project!,
          viewMode: variables.patch?.viewMode!,
        },
      }));
    },
  });

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

              <TooltipRoot>
                <TooltipTrigger asChild>
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
                </TooltipTrigger>
                <TooltipPositioner>
                  <TooltipContent>
                    {project?.viewMode === "list" ? "Board View" : "list View"}
                  </TooltipContent>
                </TooltipPositioner>
              </TooltipRoot>

              {/* <div className="relative">
                <ProjectSettings />
              </div> */}

              {project?.viewMode === "list" && (
                <TooltipRoot>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={handleForceClose}
                    >
                      <ListCollapse />
                    </Button>
                  </TooltipTrigger>
                  <TooltipPositioner>
                    <TooltipContent>Collapse List</TooltipContent>
                  </TooltipPositioner>
                </TooltipRoot>
              )}

              <TooltipRoot>
                <TooltipTrigger asChild>
                  <Link
                    to="/workspaces/$workspaceId/projects/$projectId/settings"
                    params={{
                      workspaceId: workspaceId!,
                      projectId: projectId!,
                    }}
                    variant="outline"
                    size="icon"
                  >
                    <Settings2 />
                  </Link>
                </TooltipTrigger>
                <TooltipPositioner>
                  <TooltipContent>Project Settings</TooltipContent>
                </TooltipPositioner>
              </TooltipRoot>
            </div>
          </div>
        </div>

        {project?.viewMode === "board" ? (
          <Board />
        ) : (
          <ListView shouldForceClose={shouldForceClose} />
        )}
      </div>
    </div>
  );
}
