import { useSuspenseQuery } from "@tanstack/react-query";
import { notFound } from "@tanstack/react-router";
import { ListIcon, SearchIcon, SettingsIcon } from "lucide-react";

import NotFound from "@/components/layout/NotFound";
import { Button } from "@/components/ui/button";
import projectOptions from "@/lib/options/project.options";
import workspaceOptions from "@/lib/options/workspace.options";
import seo from "@/utils/seo";

export const Route = createFileRoute({
  loader: async ({ params: { projectId, workspaceId }, context }) => {
    const [{ project }] = await Promise.all([
      context.queryClient.ensureQueryData(projectOptions(projectId)),
      context.queryClient.ensureQueryData(workspaceOptions(workspaceId)),
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
  const { projectId } = Route.useParams();

  const { data: project } = useSuspenseQuery({
    ...projectOptions(projectId),
    select: (data) => data?.project,
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
                <input
                  type="text"
                  // value={searchQuery}
                  // onChange={(e) => onSearchChange(e.target.value)}
                  placeholder="Search tasks..."
                  className="w-full rounded-md border border-base-200 bg-white py-2 pr-4 pl-9 text-base-900 text-sm placeholder-base-500 focus:outline-none focus:ring-2 focus:ring-primary-500 sm:w-64 dark:border-base-700 dark:bg-base-800 dark:text-base-100 dark:placeholder-base-400"
                />
              </div>
              <Button
                // onClick={() =>
                //   onViewModeChange(project.viewMode === "board" ? "list" : "board")
                // }
                className="flex items-center gap-2 whitespace-nowrap rounded-md border border-base-200 bg-white px-3 py-2 font-medium text-base-700 text-sm hover:bg-base-50 dark:border-base-700 dark:bg-base-800 dark:text-base-200 dark:hover:bg-base-700"
              >
                {/* TODO: make dynamic */}
                <ListIcon className="h-4 w-4" />
                List View
              </Button>
              <Button
                // onClick={onOpenSettings}
                className="flex items-center gap-2 whitespace-nowrap rounded-md border border-base-200 bg-white px-3 py-2 font-medium text-base-700 text-sm hover:bg-base-50 dark:border-base-700 dark:bg-base-800 dark:text-base-200 dark:hover:bg-base-700"
              >
                <SettingsIcon className="h-4 w-4" />
                Settings
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
