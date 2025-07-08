import { Draggable } from "@hello-pangea/dnd";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useNavigate, useParams, useSearch } from "@tanstack/react-router";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

import useDragStore from "@/lib/hooks/store/useDragStore";
import projectOptions from "@/lib/options/project.options";
import tasksOptions from "@/lib/options/tasks.options";
import { getPriorityIcon } from "@/lib/util/getPriorityIcon";
import { cn } from "@/lib/utils";
import RichTextEditor from "./core/RichTextEditor";
import Labels from "./Labels";
import { Avatar } from "./ui/avatar";

import type { DetailedHTMLProps, HTMLAttributes } from "react";

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
        "divide-y divide-base-200 overflow-hidden rounded-b-lg dark:divide-base-700",
        className,
      )}
      {...rest}
    >
      {tasks?.length === 0 ? (
        <p className="ml-2 p-2 text-muted-foreground text-xs">No tasks</p>
      ) : (
        tasks
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
                    className={cn(
                      "group flex cursor-pointer flex-col gap-2 rounded-md bg-background px-4 py-3 transition-colors",
                      snapshot.isDragging
                        ? "z-10 shadow-lg"
                        : "hover:bg-base-50/50 dark:hover:bg-background/90",
                    )}
                  >
                    {/* Row 1: Metadata (ID, Priority, Due Date) */}
                    <div className="flex items-center">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-base-400 text-xs dark:text-base-500">
                          <span className="font-mono">{displayId}</span>
                          {PriorityIcon}
                        </div>
                      </div>

                      <div className="ml-4 py-2">
                        <RichTextEditor
                          defaultContent={task?.content}
                          className="min-h-0 border-0 p-0 text-xs dark:bg-background"
                          skeletonClassName="h-4 p-0 w-80"
                          editable={false}
                        />
                      </div>

                      {!!task?.assignees?.nodes?.length && (
                        <div className="-space-x-5.5 -mx-2 ml-auto flex h-8 items-center">
                          {task.assignees.nodes.map((assignee) => (
                            <Avatar
                              key={assignee?.rowId}
                              fallback={assignee?.user?.name?.[0]}
                              src={assignee?.user?.avatarUrl ?? ""}
                              alt={assignee?.user?.name}
                              className="size-6 rounded-full border-2 border-base-100 bg-base-200 font-medium text-base-900 text-xs dark:border-base-900 dark:bg-base-600 dark:text-base-100"
                            />
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="hidden items-center justify-between sm:flex">
                      {!!task?.labels?.length && (
                        <Labels
                          labels={
                            typeof task.labels === "string"
                              ? JSON.parse(task.labels)
                              : task.labels
                          }
                          className="flex flex-wrap gap-1"
                        />
                      )}

                      {task?.dueDate && (
                        <div className="flex items-center gap-1 text-base-500 text-xs dark:text-base-400">
                          <CalendarIcon className="h-3 w-3" />
                          <span>{format(new Date(task.dueDate), "MMM d")}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </Draggable>
            );
          })
      )}

      {children}
    </div>
  );
};

export default TasksList;
