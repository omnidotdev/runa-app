import { useSuspenseQuery } from "@tanstack/react-query";
import { notFound, stripSearchParams } from "@tanstack/react-router";
import { zodValidator } from "@tanstack/zod-adapter";
import { Grid2X2Icon, ListIcon, SearchIcon } from "lucide-react";
import { useDebounceCallback } from "usehooks-ts";
import * as z from "zod/v4";

import Board from "@/components/Board";
import ListView from "@/components/ListView";
import NotFound from "@/components/layout/NotFound";
import ProjectSettings from "@/components/ProjectSettings";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  ssr: false,
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

  const navigate = Route.useNavigate();

  const { queryClient } = Route.useRouteContext();

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
    onMutate: (variables) => {
      queryClient.setQueryData(projectOptions(projectId).queryKey, (old) => ({
        project: {
          ...old?.project!,
          viewMode: variables.patch?.viewMode!,
        },
      }));
    },
    onSettled: async () =>
      await Promise.all([
        queryClient.invalidateQueries(projectOptions(projectId)),
        queryClient.invalidateQueries(workspaceOptions(workspaceId)),
      ]),
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
              <Button
                onClick={() =>
                  updateViewMode({
                    rowId: project?.rowId!,
                    patch: {
                      viewMode:
                        project?.viewMode === "board" ? "list" : "board",
                    },
                  })
                }
                variant="outline"
              >
                {project?.viewMode === "board" && (
                  <div className="flex items-center gap-2">
                    <ListIcon className="h-4 w-4" />
                    List View
                  </div>
                )}

                {project?.viewMode === "list" && (
                  <div className="flex items-center gap-2">
                    <Grid2X2Icon className="h-4 w-4" />
                    Board View
                  </div>
                )}
              </Button>

              <ProjectSettings />
            </div>
          </div>
        </div>

        {project?.viewMode === "board" ? <Board /> : <ListView />}
      </div>
    </div>
  );
}
