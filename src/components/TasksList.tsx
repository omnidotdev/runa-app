import { Draggable } from "@hello-pangea/dnd";
import { useLiveQuery } from "@tanstack/react-db";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "@tanstack/react-router";
import { format } from "date-fns";
import {
  AlertTriangleIcon,
  CalendarIcon,
  CircleDotIcon,
  MinusCircleIcon,
  TagIcon,
} from "lucide-react";

import tasksCollection from "@/lib/collections/tasks.collection";
import projectOptions from "@/lib/options/project.options";
import { cn } from "@/lib/utils";

import type { DetailedHTMLProps, HTMLAttributes } from "react";

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

const getPriorityIcon = (priority: string) => {
  const config = priorityConfig[priority as keyof typeof priorityConfig];
  if (!config) return null;
  const Icon = config.icon;
  return <Icon className={`h-4 w-4 ${config.className} flex-shrink-0`} />;
};

interface TasksListProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  prefix: string;
  columnId: string;
}

const TasksList = ({
  prefix,
  columnId,
  className,
  children,
  ...rest
}: TasksListProps) => {
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
      .select("@*"),
  );

  const taskIndex = (taskId: string) =>
    project?.columns?.nodes
      ?.flatMap((column) => column?.tasks?.nodes?.map((task) => task?.rowId))
      // TODO: sort by createdAt or whatever we decide
      .sort()
      .indexOf(taskId);

  return (
    <div
      className={cn(
        "divide-y divide-base-200 rounded-b-lg dark:divide-base-700",
        className,
      )}
      {...rest}
    >
      {tasks?.map((task, index) => {
        const displayId = `${prefix}-${taskIndex(task?.rowId!) ? taskIndex(task?.rowId!) : 0}`;
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
                className={`flex cursor-pointer items-start bg-base-50/70 px-4 py-3 hover:bg-base-100/50 dark:bg-base-900/70 dark:hover:bg-base-900/80 ${
                  snapshot.isDragging
                    ? "z-10 bg-white shadow-lg ring-2 ring-primary-500 ring-opacity-50 dark:bg-base-700"
                    : ""
                }`}
              >
                <div className="flex min-w-0 flex-1 gap-2">
                  <span className="flex-shrink-0 font-medium font-mono text-base-400 text-xs dark:text-base-500">
                    {displayId}
                  </span>
                  {PriorityIcon}
                  <div className="-mt-0.5 min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="truncate font-medium text-base-900 text-sm dark:text-base-100">
                        {task?.content}
                      </span>
                    </div>
                    <div className="mt-3 flex flex-wrap items-center gap-1">
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
                      {!!task?.labels?.length && (
                        <div className="flex flex-wrap gap-1">
                          {task.labels.map(
                            (label: { name: string; color: string }) => {
                              return (
                                <div
                                  key={label.name}
                                  className="flex items-center gap-1 rounded-full px-1.5 py-0.5"
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
                      )}
                      {task?.dueDate && (
                        <div className="ml-2 flex items-center gap-1 text-base-500 text-xs dark:text-base-400">
                          <CalendarIcon className="h-3 w-3" />
                          <span>{format(new Date(task.dueDate), "MMM d")}</span>
                        </div>
                      )}
                    </div>
                  </div>
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

export default TasksList;
