import { Draggable } from "@hello-pangea/dnd";
import { useLiveQuery } from "@tanstack/react-db";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "@tanstack/react-router";
import { format } from "date-fns";
import {
  AlertCircleIcon,
  CalendarIcon,
  CheckCircle2Icon,
  CircleIcon,
  ClockIcon,
  EyeIcon,
  TagIcon,
} from "lucide-react";

import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import tasksCollection from "@/lib/collections/tasks.collection";
import projectOptions from "@/lib/options/project.options";
import { getLabelClasses } from "@/lib/util/getLabelClasses";
import { getPriorityIcon } from "@/lib/util/getPriorityIcon";
import { cn } from "@/lib/utils";

import type { DetailedHTMLProps, HTMLAttributes } from "react";

const columnIcons = {
  "to-do": <ClockIcon className="h-4 w-4 text-base-400 dark:text-base-500" />,
  "in-progress": <AlertCircleIcon className="h-4 w-4 text-primary-500" />,
  "awaiting-review": <EyeIcon className="h-4 w-4 text-purple-500" />,
  done: <CheckCircle2Icon className="h-4 w-4 text-green-500" />,
  backlog: <CircleIcon className="h-4 w-4 text-base-400 dark:text-base-500" />,
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

  const taskIndex = (taskId: string) =>
    project?.columns?.nodes
      ?.flatMap((column) => column?.tasks?.nodes?.map((task) => task?.rowId))
      // TODO: sort by createdAt or whatever we decide
      .sort()
      .indexOf(taskId);

  return (
    <div className={cn("flex-1 p-2", className)} {...rest}>
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
                className={`mb-2 cursor-pointer rounded-lg border border-base-200/50 bg-white p-3 dark:border-base-800/50 dark:bg-base-900 ${
                  snapshot.isDragging
                    ? "shadow-lg ring-2 ring-primary-500 ring-opacity-50"
                    : "shadow-sm hover:shadow-md"
                }`}
              >
                <div className="flex flex-col gap-1">
                  <div className="flex items-start gap-2">
                    {columnTitle && (
                      <div className="mt-0.5 flex-shrink-0">
                        {
                          columnIcons[
                            columnTitle
                              .toLowerCase()
                              .replace(/ /g, "-") as keyof typeof columnIcons
                          ]
                        }
                      </div>
                    )}
                    <div className="mt-0.5 min-w-0 flex-1">
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

                    <div className="-mt-2.5 -mr-2 flex items-center gap-1">
                      {!!task?.assignees?.nodes?.length && (
                        <div className="-space-x-5.5 flex">
                          {task.assignees.nodes?.map((assignee) => (
                            <Avatar
                              key={assignee?.rowId}
                              fallback={assignee?.user?.name?.charAt(0)}
                              src={assignee?.user?.avatarUrl!}
                              alt={assignee?.user?.name}
                              className="size-6 rounded-full border-2 border-base-100 bg-base-200 font-medium text-base-900 text-xs dark:border-base-900 dark:bg-base-600 dark:text-base-100"
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-4">
                    {!!task?.labels?.length && (
                      <div className="-m-3 col-span-3 flex items-end p-2.5">
                        <div className="flex flex-wrap gap-1">
                          {JSON.parse(task.labels).map(
                            (label: { name: string; color: string }) => {
                              const colors = getLabelClasses(label.color);

                              return (
                                <Badge
                                  key={label.name}
                                  size="sm"
                                  className={cn(colors.bg, colors.text)}
                                >
                                  <TagIcon
                                    className={cn("!size-2.5", colors.icon)}
                                  />
                                  <span className="font-medium text-[10px]">
                                    {label.name}
                                  </span>
                                </Badge>
                              );
                            },
                          )}
                        </div>
                      </div>
                    )}

                    {task?.dueDate && (
                      <div className="col-span-1 mr-1 flex items-center justify-end gap-1 place-self-end text-base-500 text-xs dark:text-base-400">
                        <CalendarIcon className="h-3 w-3" />
                        <span>{format(new Date(task.dueDate), "MMM d")}</span>
                      </div>
                    )}
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

export default Tasks;
