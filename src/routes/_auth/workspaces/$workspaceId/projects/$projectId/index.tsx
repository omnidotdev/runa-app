import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import { useSuspenseQuery } from "@tanstack/react-query";
import { notFound } from "@tanstack/react-router";
import { format } from "date-fns";
import {
  AlertCircleIcon,
  AlertTriangleIcon,
  CalendarIcon,
  CheckCircle2Icon,
  CircleDotIcon,
  CircleIcon,
  ClockIcon,
  EyeIcon,
  ListIcon,
  MinusCircleIcon,
  PlusIcon,
  SearchIcon,
  SettingsIcon,
  TagIcon,
} from "lucide-react";

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

  // Placeholder tasks for each column
  const placeholderTasks = {
    backlog: [
      {
        id: "001",
        content: "Set up project structure and initialize configuration files",
        priority: "medium" as const,
        assignees: [
          { id: "user-1", name: "John Doe" },
          { id: "user-2", name: "Sarah Wilson" },
        ],
        labels: ["feature", "documentation"],
        dueDate: "2024-02-15",
      },
      {
        id: "002",
        content: "Define user requirements and create specifications document",
        priority: "high" as const,
        assignees: [{ id: "user-3", name: "Mike Chen" }],
        labels: ["bug", "enhancement"],
        dueDate: "2024-02-10",
      },
    ],
    to_do: [
      {
        id: "003",
        content: "Design database schema and create entity relationships",
        priority: "high" as const,
        assignees: [{ id: "user-4", name: "Emma Rodriguez" }],
        labels: ["data", "design"],
        dueDate: "2024-02-20",
      },
      {
        id: "004",
        content: "Create wireframes for main application screens",
        priority: "medium" as const,
        assignees: [{ id: "user-5", name: "Alex Thompson" }],
        labels: ["ui", "design"],
        dueDate: "2024-02-18",
      },
    ],
    in_progress: [
      {
        id: "005",
        content: "Implement user authentication and authorization system",
        priority: "high" as const,
        assignees: [
          { id: "user-1", name: "John Doe" },
          { id: "user-6", name: "Lisa Park" },
        ],
        labels: ["feature", "performance"],
        dueDate: "2024-02-25",
      },
    ],
    awaiting_review: [
      {
        id: "006",
        content: "Document all API endpoints with usage examples",
        priority: "low" as const,
        assignees: [{ id: "user-7", name: "David Kim" }],
        labels: ["documentation", "content"],
        dueDate: "2024-02-12",
      },
    ],
    done: [
      {
        id: "007",
        content: "Setup development environment and toolchain",
        priority: "medium" as const,
        assignees: [{ id: "user-8", name: "Rachel Green" }],
        labels: ["seo", "ui"],
        dueDate: "2024-01-30",
      },
      {
        id: "008",
        content: "Complete initial project planning and timeline creation",
        priority: "high" as const,
        assignees: [
          { id: "user-3", name: "Mike Chen" },
          { id: "user-9", name: "Tom Wilson" },
        ],
        labels: ["enhancement", "data"],
        dueDate: "2024-01-25",
      },
    ],
  };

  const getColumnIcon = (columnId: string) => {
    const columnIcons = {
      to_do: <ClockIcon className="h-4 w-4 text-base-400 dark:text-base-500" />,
      backlog: (
        <CircleIcon className="h-4 w-4 text-base-400 dark:text-base-500" />
      ),
      in_progress: <AlertCircleIcon className="h-4 w-4 text-primary-500" />,
      awaiting_review: <EyeIcon className="h-4 w-4 text-purple-500" />,
      done: (
        <CheckCircle2Icon className="h-4 w-4 text-green-500 dark:text-green-400" />
      ),
    };
    return columnIcons[columnId as keyof typeof columnIcons];
  };

  const getPriorityIcon = (priority: string) => {
    const priorityConfig = {
      high: {
        icon: AlertTriangleIcon,
        className: "text-red-500 dark:text-red-400",
      },
      medium: {
        icon: CircleDotIcon,
        className: "text-yellow-500 dark:text-yellow-400",
      },
      low: {
        icon: MinusCircleIcon,
        className: "text-green-500 dark:text-green-400",
      },
    };
    const config = priorityConfig[priority as keyof typeof priorityConfig];
    if (!config) return null;
    const Icon = config.icon;
    return <Icon className={`h-4 w-4 ${config.className} flex-shrink-0`} />;
  };

  const getLabelColors = (label: string) => {
    const labelColors: {
      [key: string]: { bg: string; text: string; icon: string };
    } = {
      bug: {
        bg: "bg-red-50 dark:bg-red-900/30",
        text: "text-red-700 dark:text-red-400",
        icon: "text-red-500",
      },
      feature: {
        bg: "bg-primary-50 dark:bg-primary-900/30",
        text: "text-primary-700 dark:text-primary-400",
        icon: "text-primary-500",
      },
      documentation: {
        bg: "bg-purple-50 dark:bg-purple-900/30",
        text: "text-purple-700 dark:text-purple-400",
        icon: "text-purple-500",
      },
      enhancement: {
        bg: "bg-green-50 dark:bg-green-900/30",
        text: "text-green-700 dark:text-green-400",
        icon: "text-green-500",
      },
      design: {
        bg: "bg-orange-50 dark:bg-orange-900/30",
        text: "text-orange-700 dark:text-orange-400",
        icon: "text-orange-500",
      },
      performance: {
        bg: "bg-yellow-50 dark:bg-yellow-900/30",
        text: "text-yellow-700 dark:text-yellow-400",
        icon: "text-yellow-500",
      },
      data: {
        bg: "bg-cyan-50 dark:bg-cyan-900/30",
        text: "text-cyan-700 dark:text-cyan-400",
        icon: "text-cyan-500",
      },
      ui: {
        bg: "bg-pink-50 dark:bg-pink-900/30",
        text: "text-pink-700 dark:text-pink-400",
        icon: "text-pink-500",
      },
      content: {
        bg: "bg-indigo-50 dark:bg-indigo-900/30",
        text: "text-indigo-700 dark:text-indigo-400",
        icon: "text-indigo-500",
      },
      seo: {
        bg: "bg-teal-50 dark:bg-teal-900/30",
        text: "text-teal-700 dark:text-teal-400",
        icon: "text-teal-500",
      },
    };
    return (
      labelColors[label] || {
        bg: "bg-base-50 dark:bg-base-900/30",
        text: "text-base-700 dark:text-base-400",
        icon: "text-base-500",
      }
    );
  };

  const renderTask = (task: any, index: number, columnId: string) => {
    const displayId = `PROJ-${task.id}`;
    const PriorityIcon = getPriorityIcon(task.priority);

    return (
      <Draggable key={task.id} draggableId={task.id} index={index}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            onClick={() => {}}
            className={`mb-2 cursor-pointer rounded-lg border border-base-200/50 bg-white p-3 dark:border-base-800/50 dark:bg-base-900 ${
              snapshot.isDragging
                ? "shadow-lg ring-2 ring-primary-500 ring-opacity-50"
                : "shadow-sm hover:shadow-md"
            }`}
          >
            <div className="flex flex-col gap-2">
              <div className="flex items-start gap-2">
                <div className="flex-shrink-0">{getColumnIcon(columnId)}</div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="flex-shrink-0 font-medium font-mono text-base-400 text-xs dark:text-base-500">
                      {displayId}
                    </span>
                    {PriorityIcon}
                  </div>
                  <p className="my-2 line-clamp-2 font-medium text-base-900 text-sm dark:text-base-100">
                    {task.content}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  {!!task.assignees?.length && (
                    <div className="-space-x-2 flex">
                      {task.assignees.map((assignee: any) => (
                        <div
                          key={assignee.id}
                          className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-base-200 font-medium text-base-900 text-xs dark:border-base-800 dark:bg-base-600 dark:text-base-100"
                          title={assignee.name}
                        >
                          {assignee.name[0].toUpperCase()}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {task.dueDate && (
                  <div className="mr-1 flex items-center gap-1 text-base-500 text-xs dark:text-base-400">
                    <CalendarIcon className="h-3 w-3" />
                    <span>{format(new Date(task.dueDate), "MMM d")}</span>
                  </div>
                )}
              </div>

              {!!task.labels?.length && (
                <div className="-mx-3 -mb-3 mt-2 flex items-center bg-base-50/80 px-3 py-2 dark:bg-base-800/20">
                  <div className="flex flex-wrap gap-1">
                    {task.labels.map((label: string) => {
                      const colors = getLabelColors(label);
                      return (
                        <div
                          key={label}
                          className={`flex items-center gap-1 rounded-full px-1.5 py-0.5 ${colors.bg}`}
                        >
                          <TagIcon className={`h-3 w-3 ${colors.icon}`} />
                          <span
                            className={`font-medium text-xs ${colors.text}`}
                          >
                            {label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </Draggable>
    );
  };

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

        {/* Board Placeholder */}
        <div className="custom-scrollbar h-full select-none overflow-x-auto">
          <div className="h-full min-w-fit px-4 py-4">
            <DragDropContext onDragEnd={() => {}}>
              <Droppable
                droppableId="board"
                direction="horizontal"
                type="column"
              >
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="flex h-full gap-3"
                  >
                    {/* Backlog Column */}
                    <div className="flex w-80 flex-col rounded-lg bg-base-50/80 shadow-sm dark:bg-base-800/30 dark:shadow-base-50/20">
                      <div className="flex items-center justify-between border-base-200 border-b p-4 dark:border-base-700">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-base-800 dark:text-base-100">
                            Backlog
                          </h3>
                          <span className="rounded-full bg-base-200 px-2 py-1 text-base-600 text-xs dark:bg-base-700 dark:text-base-300">
                            {placeholderTasks.backlog.length}
                          </span>
                        </div>
                        <Button variant="ghost" size="icon">
                          <PlusIcon className="h-4 w-4" />
                        </Button>
                      </div>
                      <Droppable droppableId="backlog">
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            className="flex-1 p-2"
                            style={{ minHeight: "4px" }}
                          >
                            {placeholderTasks.backlog.map((task, index) =>
                              renderTask(task, index, "backlog"),
                            )}
                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>
                    </div>

                    {/* To Do Column */}
                    <div className="flex w-80 flex-col rounded-lg bg-base-50/80 shadow-sm dark:bg-base-800/30 dark:shadow-base-50/20">
                      <div className="flex items-center justify-between border-base-200 border-b p-4 dark:border-base-700">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-base-800 dark:text-base-100">
                            To Do
                          </h3>
                          <span className="rounded-full bg-base-200 px-2 py-1 text-base-600 text-xs dark:bg-base-700 dark:text-base-300">
                            {placeholderTasks.to_do.length}
                          </span>
                        </div>
                        <Button variant="ghost" size="icon">
                          <PlusIcon className="h-4 w-4" />
                        </Button>
                      </div>
                      <Droppable droppableId="to_do">
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            className="flex-1 p-2"
                            style={{ minHeight: "4px" }}
                          >
                            {placeholderTasks.to_do.map((task, index) =>
                              renderTask(task, index, "to_do"),
                            )}
                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>
                    </div>

                    {/* In Progress Column */}
                    <div className="flex w-80 flex-col rounded-lg bg-base-50/80 shadow-sm dark:bg-base-800/30 dark:shadow-base-50/20">
                      <div className="flex items-center justify-between border-base-200 border-b p-4 dark:border-base-700">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-base-800 dark:text-base-100">
                            In Progress
                          </h3>
                          <span className="rounded-full bg-base-200 px-2 py-1 text-base-600 text-xs dark:bg-base-700 dark:text-base-300">
                            {placeholderTasks.in_progress.length}
                          </span>
                        </div>
                        <Button variant="ghost" size="icon">
                          <PlusIcon className="h-4 w-4" />
                        </Button>
                      </div>
                      <Droppable droppableId="in_progress">
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            className="flex-1 p-2"
                            style={{ minHeight: "4px" }}
                          >
                            {placeholderTasks.in_progress.map((task, index) =>
                              renderTask(task, index, "in_progress"),
                            )}
                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>
                    </div>

                    {/* In Review Column */}
                    <div className="flex w-80 flex-col rounded-lg bg-base-50/80 shadow-sm dark:bg-base-800/30 dark:shadow-base-50/20">
                      <div className="flex items-center justify-between border-base-200 border-b p-4 dark:border-base-700">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-base-800 dark:text-base-100">
                            Awaiting Review
                          </h3>
                          <span className="rounded-full bg-base-200 px-2 py-1 text-base-600 text-xs dark:bg-base-700 dark:text-base-300">
                            {placeholderTasks.awaiting_review.length}
                          </span>
                        </div>
                        <Button variant="ghost" size="icon">
                          <PlusIcon className="h-4 w-4" />
                        </Button>
                      </div>
                      <Droppable droppableId="awaiting_review">
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            className="flex-1 p-2"
                            style={{ minHeight: "4px" }}
                          >
                            {placeholderTasks.awaiting_review.map(
                              (task, index) =>
                                renderTask(task, index, "awaiting_review"),
                            )}
                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>
                    </div>

                    {/* Done Column */}
                    <div className="flex w-80 flex-col rounded-lg bg-base-50/80 shadow-sm dark:bg-base-800/30 dark:shadow-base-50/20">
                      <div className="flex items-center justify-between border-base-200 border-b p-4 dark:border-base-700">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-base-800 dark:text-base-100">
                            Done
                          </h3>
                          <span className="rounded-full bg-base-200 px-2 py-1 text-base-600 text-xs dark:bg-base-700 dark:text-base-300">
                            {placeholderTasks.done.length}
                          </span>
                        </div>
                        <Button variant="ghost" size="icon">
                          <PlusIcon className="h-4 w-4" />
                        </Button>
                      </div>
                      <Droppable droppableId="done">
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            className="flex-1 p-2"
                            style={{ minHeight: "4px" }}
                          >
                            {placeholderTasks.done.map((task, index) =>
                              renderTask(task, index, "done"),
                            )}
                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>
                    </div>

                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </div>
        </div>
      </div>
    </div>
  );
}
