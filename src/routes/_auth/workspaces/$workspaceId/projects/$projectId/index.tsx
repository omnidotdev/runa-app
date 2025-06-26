import { useSuspenseQuery } from "@tanstack/react-query";
import { notFound } from "@tanstack/react-router";
import { Grid2X2Icon, ListIcon, SearchIcon } from "lucide-react";

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
import getQueryClient from "@/utils/getQueryClient";
import seo from "@/utils/seo";

export const Route = createFileRoute({
  ssr: false,
  loader: async ({ params: { projectId, workspaceId }, context }) => {
    const [{ project }] = await Promise.all([
      context.queryClient.ensureQueryData(projectOptions(projectId)),
      context.queryClient.ensureQueryData(workspaceOptions(workspaceId)),
      context.queryClient.ensureQueryData(tasksOptions(projectId)),
    ]);

    if (!project) {
      throw notFound();
    }

    return { name: project.name };
  },
  head: ({ loaderData }) => ({
    meta: loaderData ? [...seo({ title: loaderData.name })] : undefined,
  }),
  notFoundComponent: () => <NotFound>Project Not Found</NotFound>,
  component: ProjectPage,
});

function ProjectPage() {
  const { projectId, workspaceId } = Route.useParams();

  const queryClient = getQueryClient();

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
        <div className="border-base-200 border-b px-6 py-4 dark:border-base-700">
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
                  // value={searchQuery}
                  // onChange={(e) => onSearchChange(e.target.value)}
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
