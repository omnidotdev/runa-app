import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import { useLiveQuery } from "@tanstack/react-db";
import { useSuspenseQuery } from "@tanstack/react-query";
import { notFound, useNavigate } from "@tanstack/react-router";
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
} from "lucide-react";
import { useCallback, useRef } from "react";
import { useIsClient } from "usehooks-ts";

import NotFound from "@/components/layout/NotFound";
import { Button } from "@/components/ui/button";
import tasksCollection from "@/lib/collections/tasks.collection";
import projectOptions from "@/lib/options/project.options";
import tasksOptions from "@/lib/options/tasks.options";
import workspaceOptions from "@/lib/options/workspace.options";
import { cn } from "@/lib/utils";
import seo from "@/utils/seo";

import type { DropResult } from "@hello-pangea/dnd";
import type { DetailedHTMLProps, HTMLAttributes } from "react";

export const Route = createFileRoute({
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

const columnIcons = {
  "to-do": <ClockIcon className="h-4 w-4 text-base-400 dark:text-base-500" />,
  "in-progress": <AlertCircleIcon className="h-4 w-4 text-primary-500" />,
  "awaiting-review": <EyeIcon className="h-4 w-4 text-purple-500" />,
  done: <CheckCircle2Icon className="h-4 w-4 text-green-500" />,
  backlog: <CircleIcon className="h-4 w-4 text-base-400 dark:text-base-500" />,
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

function ProjectPage() {
  const { projectId } = Route.useParams();

  const isClient = useIsClient();

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const autoScrollIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const { data: project } = useSuspenseQuery({
    ...projectOptions(projectId),
    select: (data) => data?.project,
  });

  const startAutoScroll = useCallback((direction: "left" | "right") => {
    if (autoScrollIntervalRef.current) return;

    autoScrollIntervalRef.current = setInterval(() => {
      if (scrollContainerRef.current) {
        const scrollAmount = direction === "left" ? -10 : 10;
        scrollContainerRef.current.scrollLeft += scrollAmount;
      }
    }, 16); // ~60fps
  }, []);

  const stopAutoScroll = useCallback(() => {
    if (autoScrollIntervalRef.current) {
      clearInterval(autoScrollIntervalRef.current);
      autoScrollIntervalRef.current = null;
    }
  }, []);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!scrollContainerRef.current) return;

      const container = scrollContainerRef.current;
      const rect = container.getBoundingClientRect();
      const scrollZone = 100; // pixels from edge to trigger scroll

      const mouseX = e.clientX - rect.left;

      if (mouseX < scrollZone && container.scrollLeft > 0) {
        startAutoScroll("left");
      } else if (
        mouseX > rect.width - scrollZone &&
        container.scrollLeft < container.scrollWidth - container.clientWidth
      ) {
        startAutoScroll("right");
      } else {
        stopAutoScroll();
      }
    },
    [startAutoScroll, stopAutoScroll],
  );

  const onDragStart = useCallback(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.addEventListener(
        "mousemove",
        // biome-ignore lint/suspicious/noExplicitAny: needed for conversion
        handleMouseMove as any,
      );
    }
  }, [handleMouseMove]);

  const onDragEnd = useCallback(
    (result: DropResult) => {
      stopAutoScroll();
      if (scrollContainerRef.current) {
        scrollContainerRef.current.removeEventListener(
          "mousemove",
          // biome-ignore lint/suspicious/noExplicitAny: needed for conversion
          handleMouseMove as any,
        );
      }

      const { destination, source, draggableId } = result;

      // Exit early if dropped outside a droppable area or in the same position
      if (!destination) return;

      if (
        destination.droppableId === source.droppableId &&
        destination.index === source.index
      )
        return;

      // TODO: bulk update to properly handle index changes? Not sure tbh...
      tasksCollection(projectId).update(draggableId, (draft) => {
        draft.columnId = destination.droppableId;
        draft.columnIndex = destination.index;
      });
    },
    [projectId, stopAutoScroll, handleMouseMove],
  );

  const projectTasksCollection = tasksCollection(projectId);

  const { data: tasks } = useLiveQuery((q) =>
    q.from({ projectTasksCollection }),
  );

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

        <div
          ref={scrollContainerRef}
          className="custom-scrollbar h-full select-none overflow-x-auto"
        >
          <div className="h-full min-w-fit px-4 py-4">
            <DragDropContext onDragStart={onDragStart} onDragEnd={onDragEnd}>
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
                    {project?.columns?.nodes?.map((column) => (
                      <div
                        key={column?.rowId}
                        className="no-scrollbar relative flex w-80 flex-col overflow-y-auto rounded-lg bg-base-50/80 shadow-sm dark:bg-base-800/30 dark:shadow-base-50/10"
                        style={{ minHeight: "4px" }}
                      >
                        <div className="sticky top-0 flex items-center justify-between border-base-200 border-b bg-base-50 p-3 dark:border-base-700 dark:bg-base-800">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-base-800 dark:text-base-100">
                              {column?.title}
                            </h3>
                            {isClient && (
                              <span className="rounded-full bg-base-200 px-2 py-1 text-base-600 text-xs dark:bg-base-700 dark:text-base-300">
                                {
                                  tasks?.filter(
                                    (t) => t.columnId === column?.rowId,
                                  ).length
                                }
                              </span>
                            )}
                          </div>
                          <Button variant="ghost" size="icon">
                            <PlusIcon className="h-4 w-4" />
                          </Button>
                        </div>
                        <Droppable droppableId={column?.rowId!}>
                          {(provided, snapshot) => (
                            <Tasks
                              ref={provided.innerRef}
                              {...provided.droppableProps}
                              prefix={project?.prefix ?? "PROJ"}
                              columnId={column?.rowId!}
                              className={
                                // TODO: dynamic on project color
                                snapshot.isDraggingOver
                                  ? "bg-primary-50/50 dark:bg-base-800/50"
                                  : ""
                              }
                              style={{
                                backgroundColor: project?.color
                                  ? snapshot.isDraggingOver
                                    ? `${project?.color}33`
                                    : `${project?.color}0D`
                                  : undefined,
                              }}
                            >
                              {provided.placeholder}
                            </Tasks>
                          )}
                        </Droppable>
                      </div>
                    ))}
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

interface TasksProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  prefix: string;
  columnId: string;
}

function Tasks({ prefix, columnId, className, children, ...rest }: TasksProps) {
  const navigate = useNavigate();

  const isClient = useIsClient();

  const { workspaceId, projectId } = Route.useParams();

  const { data: project } = useSuspenseQuery({
    ...projectOptions(projectId),
    select: (data) => data?.project,
  });

  const projectTasksCollection = tasksCollection(projectId);

  const { data: tasks } = useLiveQuery((q) =>
    q
      .from({ projectTasksCollection })
      .where("@columnId", "=", columnId)
      .orderBy({ "@columnIndex": "asc" })
      // Unfortunately `select` is needed for the time being when using `orderBy`. See: https://github.com/orgs/TanStack/projects/5?pane=issue&itemId=115700338&issue=TanStack%7Cdb%7C177
      .select(
        "@rowId",
        "@content",
        "@columnIndex",
        "@priority",
        "@dueDate",
        "@assignees",
        "@labels",
      ),
  );

  const columnTitle = project?.columns?.nodes?.find(
    (column) => column?.rowId === columnId,
  )?.title;

  return (
    <div className={cn("flex-1 p-2", className)} {...rest}>
      {isClient &&
        tasks?.map((task, index) => {
          const displayId = `${prefix}-0`;
          const PriorityIcon = getPriorityIcon(task?.priority!);

          return (
            <Draggable
              key={task?.rowId}
              draggableId={task?.rowId!}
              index={index}
            >
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}
                  onClick={() =>
                    navigate({
                      to: "/workspaces/$workspaceId/projects/$projectId/$taskId",
                      params: {
                        workspaceId,
                        projectId,
                        taskId: task?.rowId!,
                      },
                    })
                  }
                  className={`mb-2 cursor-pointer rounded-lg border border-base-200/50 bg-white p-3 dark:border-base-800/50 dark:bg-base-900 ${
                    snapshot.isDragging
                      ? "shadow-lg ring-2 ring-primary-500 ring-opacity-50"
                      : "shadow-sm hover:shadow-md"
                  }`}
                >
                  <div className="flex flex-col gap-3">
                    <div className="flex items-start gap-2">
                      {columnTitle && (
                        <div className="flex-shrink-0">
                          {
                            columnIcons[
                              columnTitle
                                .toLowerCase()
                                .replace(/ /g, "-") as keyof typeof columnIcons
                            ]
                          }
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="flex-shrink-0 font-medium font-mono text-base-400 text-xs dark:text-base-500">
                            {displayId}
                          </span>
                          {PriorityIcon}
                        </div>
                        <p className="my-2 line-clamp-2 font-medium text-base-900 text-sm dark:text-base-100">
                          {task?.content}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        {!!task?.assignees?.nodes?.length && (
                          <div className="-space-x-2 flex">
                            {task.assignees.nodes?.map((assignee) => (
                              <div
                                key={assignee?.rowId}
                                className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-base-200 font-medium text-base-900 text-xs dark:border-base-800 dark:bg-base-600 dark:text-base-100"
                                title={assignee?.user?.name}
                              >
                                {assignee?.user?.name[0].toUpperCase()}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {task?.dueDate && (
                        <div className="mr-1 flex items-center gap-1 text-base-500 text-xs dark:text-base-400">
                          <CalendarIcon className="h-3 w-3" />
                          <span>{format(new Date(task.dueDate), "MMM d")}</span>
                        </div>
                      )}
                    </div>

                    {!!task?.labels?.length && (
                      <div className="-mx-3 -mb-3 flex items-center bg-base-50/80 px-3 py-3 dark:bg-base-800/20">
                        <div className="flex flex-wrap gap-1">
                          {task.labels.map(
                            (label: { name: string; color: string }) => {
                              return (
                                <div
                                  key={label.name}
                                  className="flex items-center gap-1 rounded-full px-2 py-1"
                                  style={{
                                    backgroundColor: `${label.color}99`,
                                  }}
                                >
                                  <span className="font-medium text-black text-xs">
                                    {label.name}
                                  </span>
                                </div>
                              );
                            },
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </Draggable>
          );
        })}
      {children}
    </div>
  );
}
