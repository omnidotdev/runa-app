import {
  ChevronDownIcon,
  Grid2X2Icon,
  ListIcon,
  Plus,
  SearchIcon,
  Users,
} from "lucide-react";
import { useState } from "react";
import { useDebounceCallback } from "usehooks-ts";

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

import type { ChangeEvent } from "react";

// Mock data for projects
const mockProjects = [
  {
    id: "1",
    name: "Website Redesign",
    description: "Complete overhaul of the company website with modern design",
    status: "In Progress",
    assignees: ["Alice", "Bob"],
    tasksCount: 12,
    completedTasks: 7,
  },
  {
    id: "2",
    name: "Mobile App Development",
    description: "Native mobile app for iOS and Android platforms",
    status: "Planned",
    assignees: ["Charlie", "Diana", "Eve"],
    tasksCount: 25,
    completedTasks: 0,
  },
  {
    id: "3",
    name: "Database Migration",
    description: "Migrate legacy database to new cloud infrastructure",
    status: "Completed",
    assignees: ["Frank"],
    tasksCount: 8,
    completedTasks: 8,
  },
  {
    id: "4",
    name: "User Research Study",
    description: "Conduct user interviews and usability testing",
    status: "In Progress",
    assignees: ["Grace", "Henry"],
    tasksCount: 6,
    completedTasks: 3,
  },
  {
    id: "5",
    name: "API Documentation",
    description: "Create comprehensive API documentation for developers",
    status: "Planned",
    assignees: ["Ivan"],
    tasksCount: 4,
    completedTasks: 0,
  },
  {
    id: "6",
    name: "Security Audit",
    description: "Full security audit and penetration testing",
    status: "Completed",
    assignees: ["Julia", "Kevin"],
    tasksCount: 15,
    completedTasks: 15,
  },
];

export const Route = createFileRoute({
  component: ProjectsOverviewPage,
});

function ProjectsOverviewPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"board" | "list">("board");

  const handleSearch = useDebounceCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(e.target.value);
    },
    300,
  );

  const filteredProjects = mockProjects.filter(
    (project) =>
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const projectsByStatus = {
    Planned: filteredProjects.filter((p) => p.status === "Planned"),
    "In Progress": filteredProjects.filter((p) => p.status === "In Progress"),
    Completed: filteredProjects.filter((p) => p.status === "Completed"),
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

              <Button variant="outline" size="icon">
                <Plus className="size-4" />
              </Button>
            </div>
          </div>
        </div>

        {viewMode === "board" ? (
          <ProjectsBoard projectsByStatus={projectsByStatus} />
        ) : (
          <ProjectsList projects={filteredProjects} />
        )}
      </div>
    </div>
  );
}

function ProjectsBoard({
  projectsByStatus,
}: {
  projectsByStatus: {
    Planned: typeof mockProjects;
    "In Progress": typeof mockProjects;
    Completed: typeof mockProjects;
  };
}) {
  return (
    <div className="no-scrollbar h-full select-none overflow-x-auto">
      <div className="h-full min-w-fit p-4">
        <div className="flex h-full gap-3">
          {Object.entries(projectsByStatus).map(([status, projects]) => (
            <div
              key={status}
              className="no-scrollbar relative flex w-80 flex-col overflow-y-auto rounded-lg bg-base-50/80 shadow-sm dark:bg-background/60 dark:shadow-base-900"
              style={{ minHeight: "4px" }}
            >
              <div className="sticky top-0 z-10 flex items-center justify-between border-base-200 border-b bg-base-50 p-3 dark:border-base-800 dark:bg-base-900">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-base-800 dark:text-base-100">
                    {status}
                  </h3>
                  <span className="rounded-full bg-base-200 px-2 py-1 text-base-600 text-xs dark:bg-base-700 dark:text-base-300">
                    {projects.length}
                  </span>
                </div>
                <Button variant="ghost" size="icon">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-1 flex-col gap-3 p-3">
                {projects.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ProjectsList({ projects }: { projects: typeof mockProjects }) {
  const projectsByStatus = {
    Planned: projects.filter((p) => p.status === "Planned"),
    "In Progress": projects.filter((p) => p.status === "In Progress"),
    Completed: projects.filter((p) => p.status === "Completed"),
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
                <ProjectListItem key={project.id} project={project} />
              ))}
            </div>
          </CollapsibleContent>
        </CollapsibleRoot>
      ))}
    </div>
  );
}

function ProjectCard({ project }: { project: (typeof mockProjects)[0] }) {
  const progressPercentage = Math.round(
    (project.completedTasks / project.tasksCount) * 100,
  );

  return (
    <div className="rounded-lg border bg-card p-4 shadow-sm transition-shadow hover:shadow-md">
      <div className="mb-3 flex items-start justify-between">
        <h3 className="font-medium text-base-900 dark:text-base-100">
          {project.name}
        </h3>
        <div className="flex items-center gap-1 text-base-500 text-sm dark:text-base-400">
          <Users className="size-4" />
          <span>{project.assignees.length}</span>
        </div>
      </div>

      <p className="mb-3 text-base-600 text-sm dark:text-base-400">
        {project.description}
      </p>

      <div>
        <div className="mb-1 flex justify-end text-sm">
          <span className="text-base-900 dark:text-base-100">
            {project.completedTasks}/{project.tasksCount} tasks
          </span>
        </div>
        <div className="h-2 w-full rounded-full bg-base-200 dark:bg-base-700">
          <div
            className="h-2 rounded-full bg-primary transition-all"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>
    </div>
  );
}

function ProjectListItem({ project }: { project: (typeof mockProjects)[0] }) {
  const progressPercentage = Math.round(
    (project.completedTasks / project.tasksCount) * 100,
  );

  return (
    <div className="border-base-200 border-b bg-card p-4 last:border-b-0 dark:border-base-700">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="mb-2 flex items-start justify-between">
            <h3 className="font-medium text-base-900 text-lg dark:text-base-100">
              {project.name}
            </h3>
            <div className="flex items-center gap-1 text-base-500 text-sm dark:text-base-400">
              <Users className="size-4" />
              <span>{project.assignees.length}</span>
            </div>
          </div>

          <p className="mb-3 text-base-600 dark:text-base-400">
            {project.description}
          </p>

          <div className="flex items-center justify-end">
            <div className="w-32">
              <div className="mb-1 flex justify-between text-sm">
                <span className="text-base-600 dark:text-base-400">
                  {project.completedTasks}/{project.tasksCount} tasks
                </span>
                <span className="text-base-900 dark:text-base-100">
                  {progressPercentage}%
                </span>
              </div>
              <div className="h-2 w-full rounded-full bg-base-200 dark:bg-base-700">
                <div
                  className="h-2 rounded-full bg-primary transition-all"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
