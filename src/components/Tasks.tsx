import { Draggable } from "@hello-pangea/dnd";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useNavigate, useParams, useSearch } from "@tanstack/react-router";
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

import RichTextEditor from "@/components/core/RichTextEditor";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import useDragStore from "@/lib/hooks/store/useDragStore";
import projectOptions from "@/lib/options/project.options";
import tasksOptions from "@/lib/options/tasks.options";
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

  const { search } = useSearch({
    from: "/_auth/workspaces/$workspaceId/projects/$projectId/",
  });

  const { draggableId } = useDragStore();

  const { data: project } = useSuspenseQuery({
    ...projectOptions(projectId),
    select: (data) => data?.project,
  });

  const { data: tasks } = useSuspenseQuery({
    ...tasksOptions(projectId, search),
    select: (data) =>
      data?.tasks?.nodes?.filter((task) => task?.columnId === columnId),
  });

  const columnTitle = project?.columns?.nodes?.find(
    (column) => column?.rowId === columnId,
  )?.title;

  const taskIndex = (taskId: string) =>
    project?.columns?.nodes
      ?.flatMap((column) => column?.tasks?.nodes?.map((task) => task))
      .sort(
        (a, b) =>
          new Date(a?.createdAt!).getTime()! -
          new Date(b?.createdAt!).getTime()!,
      )
      .map((task) => task?.rowId)
      .indexOf(taskId);

  return (
    <div
      className={cn(
        "flex-1 rounded-xl bg-background/60 p-2 dark:bg-background/20",
        className,
      )}
      {...rest}
    >
      {tasks
        ?.filter((task) => task?.rowId !== draggableId)
        .map((task, index) => {
          const displayId = `${prefix}-${taskIndex(task?.rowId!) ? taskIndex(task?.rowId!) : 0}`;
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
                  onClick={() => {
                    if (!snapshot.isDragging) {
                      navigate({
                        to: "/workspaces/$workspaceId/projects/$projectId/$taskId",
                        params: {
                          workspaceId,
                          projectId,
                          taskId: task?.rowId!,
                        },
                      });
                    }
                  }}
                  className="mb-2 cursor-pointer rounded-lg border bg-background p-3"
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

                        <div className="py-4">
                          <RichTextEditor
                            defaultContent={task?.content}
                            className="-mx-5 min-h-0 border-0 p-0 text-xs dark:bg-background"
                            skeletonClassName="-mx-5 h-4 p-0"
                            editable={false}
                          />
                        </div>
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
                                className="size-6 rounded-full border-2 bg-base-200 font-medium text-base-900 text-xs dark:bg-base-600 dark:text-base-100"
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
                            {/* TODO: remove need for `JSON.parse` used just from seed script stringifying JSON to get dynamic labels */}
                            {JSON.parse(task.labels).map(
                              (label: { name: string; color: string }) => {
                                const colors = getLabelClasses(label.color);

                                return (
                                  <Badge
                                    key={label.name}
                                    size="sm"
                                    variant="outline"
                                    className={cn(
                                      "border-border/50",
                                      colors.bg,
                                      colors.text,
                                    )}
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
                          {/* TODO: timezone handling */}
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
