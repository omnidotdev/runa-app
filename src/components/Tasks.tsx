import { Draggable } from "@hello-pangea/dnd";
import { useLiveQuery } from "@tanstack/react-db";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "@tanstack/react-router";
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
  MinusCircleIcon,
  TagIcon,
} from "lucide-react";

import tasksCollection from "@/lib/collections/tasks.collection";
import projectOptions from "@/lib/options/project.options";
import { cn } from "@/lib/utils";

import type { DetailedHTMLProps, HTMLAttributes } from "react";

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

interface TasksProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  prefix: string;
  columnId: string;
}

const Tasks = ({
  prefix,
  columnId,
  className,
  children,
  ...rest
}: TasksProps) => {
  const navigate = useNavigate();

  const { workspaceId, projectId } = useParams({
    from: "/_auth/workspaces/$workspaceId/projects/$projectId/",
  });

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
      .select("@*"),
  );

  const columnTitle = project?.columns?.nodes?.find(
    (column) => column?.rowId === columnId,
  )?.title;

  return (
    <div className={cn("flex-1 p-2", className)} {...rest}>
      {tasks?.map((task, index) => {
        const displayId = `${prefix}-0`;
        const PriorityIcon = getPriorityIcon(task?.priority!);

        return (
          <Draggable key={task?.rowId} draggableId={task?.rowId!} index={index}>
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
                                <TagIcon className="size-3 text-black" />
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
};

export default Tasks;
