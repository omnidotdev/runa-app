import { useSuspenseQuery } from "@tanstack/react-query";
import { stripSearchParams } from "@tanstack/react-router";
import { zodValidator } from "@tanstack/zod-adapter";
import {
  ChevronDownIcon,
  Grid2X2Icon,
  ListIcon,
  Plus,
  SearchIcon,
} from "lucide-react";
import { useState } from "react";
import { useDebounceCallback } from "usehooks-ts";
import * as z from "zod/v4";

import { Button } from "@/components/ui/button";
import {
  CollapsibleContent,
  CollapsibleRoot,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import {
  TooltipContent,
  TooltipPositioner,
  TooltipRoot,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ProjectStatus } from "@/generated/graphql";
import useDialogStore, { DialogType } from "@/lib/hooks/store/useDialogStore";
import projectsOptions from "@/lib/options/projects.options";

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
    await queryClient.ensureQueryData(projectsOptions(workspaceId, search));
  },
  component: ProjectsOverviewPage,
});

function ProjectsOverviewPage() {
  const { workspaceId } = Route.useParams();
  const { search } = Route.useSearch();
  const navigate = Route.useNavigate();

  const { data: projects } = useSuspenseQuery({
    ...projectsOptions(workspaceId, search),
    select: (data) => data?.projects?.nodes,
  });

  // TODO: handle viewMode for workspace
  const [viewMode, setViewMode] = useState<"board" | "list">("board");

  const { isOpen: isCreateProjectOpen, setIsOpen: setIsCreateProjectOpen } =
    useDialogStore({
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
    Planned: projects?.filter(
      (p) => p?.status === ProjectStatus.Planned,
    ) as ProjectFragment[],
    "In Progress": projects?.filter(
      (p) => p?.status === ProjectStatus.InProgress,
    ) as ProjectFragment[],
    Completed: projects?.filter(
      (p) => p?.status === ProjectStatus.Completed,
    ) as ProjectFragment[],
  };

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

              <TooltipRoot>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() =>
                      setViewMode(viewMode === "board" ? "list" : "board")
                    }
                  >
                    {viewMode === "list" ? <Grid2X2Icon /> : <ListIcon />}
                  </Button>
                </TooltipTrigger>
                <TooltipPositioner>
                  <TooltipContent>
                    {viewMode === "list" ? "Board View" : "List View"}
                  </TooltipContent>
                </TooltipPositioner>
              </TooltipRoot>

              <TooltipRoot>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setIsCreateProjectOpen(true)}
                  >
                    <Plus className="size-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipPositioner>
                  <TooltipContent>Create Project</TooltipContent>
                </TooltipPositioner>
              </TooltipRoot>
            </div>
          </div>
        </div>

        {viewMode === "board" ? (
          <ProjectsBoard projectsByStatus={projectsByStatus} />
        ) : (
          <ProjectsList projects={projects as ProjectFragment[]} />
        )}
      </div>
    </div>
  );
}

function ProjectsBoard({
  projectsByStatus,
}: {
  projectsByStatus: {
    Planned: ProjectFragment[];
    "In Progress": ProjectFragment[];
    Completed: ProjectFragment[];
  };
}) {
  return (
    <div className="no-scrollbar h-full select-none overflow-x-auto">
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
                    {status}
                  </h3>
                  <span className="px-2 py-0.5 text-foreground text-xs">
                    {projects.length}
                  </span>
                </div>
                <Button variant="ghost" size="xs" className="size-5">
                  <Plus className="size-4" />
                </Button>
              </div>
              <div className="no-scrollbar flex h-full overflow-y-auto">
                <div className="flex flex-1 flex-col gap-3">
                  {projects.map((project) => (
                    <ProjectCard key={project.rowId} project={project} />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ProjectsList({ projects }: { projects: ProjectFragment[] }) {
  const projectsByStatus = {
    Planned: projects.filter((p) => p.status === ProjectStatus.Planned),
    "In Progress": projects.filter(
      (p) => p.status === ProjectStatus.InProgress,
    ),
    Completed: projects.filter((p) => p.status === ProjectStatus.Completed),
  };

  return (
    <div className="custom-scrollbar h-full overflow-y-auto p-4">
      {Object.entries(projectsByStatus).map(([status, statusProjects]) => (
        <CollapsibleRoot
          key={status}
          className="mb-4 rounded-lg bg-white shadow-sm last:mb-0 dark:bg-base-800"
          defaultOpen
        >
          <CollapsibleTrigger className="flex w-full items-center justify-between gap-2 rounded-t-lg px-4 py-3 text-left">
            <div className="flex items-center gap-2">
              <span className="font-medium text-base-900 text-sm dark:text-base-100">
                {status}
              </span>
              <span className="rounded-full bg-base-200 px-2 py-1 text-base-600 text-xs dark:bg-base-700 dark:text-base-300">
                {statusProjects.length}
              </span>
            </div>
            <ChevronDownIcon className="size-4 transition-transform" />
          </CollapsibleTrigger>

          <CollapsibleContent>
            <div className="border-t">
              {statusProjects.map((project) => (
                <ProjectListItem key={project.rowId} project={project} />
              ))}
            </div>
          </CollapsibleContent>
        </CollapsibleRoot>
      ))}
    </div>
  );
}

function ProjectCard({ project }: { project: ProjectFragment }) {
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
    <div className="rounded-lg border bg-card p-4 shadow-sm transition-shadow hover:shadow-md">
      <div className="mb-3 flex items-start justify-between">
        <h3 className="font-medium text-base-900 dark:text-base-100">
          {project.name}
        </h3>
      </div>

      <p className="mb-3 text-base-600 text-sm dark:text-base-400">
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

function ProjectListItem({ project }: { project: ProjectFragment }) {
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
    <div className="border-base-200 border-b bg-card p-4 last:border-b-0 dark:border-base-700">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="mb-2 flex items-start justify-between">
            <h3 className="font-medium text-base-900 text-lg dark:text-base-100">
              {project.name}
            </h3>
          </div>

          <p className="mb-3 text-base-600 dark:text-base-400">
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
