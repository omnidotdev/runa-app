import { Draggable } from "@hello-pangea/dnd";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useNavigate, useParams, useSearch } from "@tanstack/react-router";
import { format } from "date-fns";
import { CalendarIcon, TagIcon, UserIcon } from "lucide-react";

import Assignees from "@/components/Assignees";
import RichTextEditor from "@/components/core/RichTextEditor";
import Labels from "@/components/Labels";
import { AvatarFallback, AvatarRoot } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { SidebarMenuShotcut } from "@/components/ui/sidebar";
import {
  TooltipContent,
  TooltipPositioner,
  TooltipRoot,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import useDialogStore, { DialogType } from "@/lib/hooks/store/useDialogStore";
import useDragStore from "@/lib/hooks/store/useDragStore";
import useTaskStore from "@/lib/hooks/store/useTaskStore";
import projectOptions from "@/lib/options/project.options";
import tasksOptions from "@/lib/options/tasks.options";
import { getPriorityIcon } from "@/lib/util/getPriorityIcon";
import { cn } from "@/lib/utils";

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

  const { search, assignees, labels } = useSearch({
    from: "/_auth/workspaces/$workspaceId/projects/$projectId/",
  });

  const { draggableId } = useDragStore();
  const { setTaskId } = useTaskStore();
  const { isOpen: isUpdateAssigneesDialogOpen } = useDialogStore({
    type: DialogType.UpdateAssignees,
  });
  const { isOpen: isUpdateDueDateDialogOpen } = useDialogStore({
    type: DialogType.UpdateDueDate,
  });
  const { isOpen: isUpdateTaskLabelsDialogOpen } = useDialogStore({
    type: DialogType.UpdateTaskLabels,
  });

  const isUpdateDialogOpen =
    isUpdateAssigneesDialogOpen ||
    isUpdateDueDateDialogOpen ||
    isUpdateTaskLabelsDialogOpen;

  const { data: project } = useSuspenseQuery({
    ...projectOptions({ rowId: projectId }),
    select: (data) => data?.project,
  });

  const { data: tasks } = useSuspenseQuery({
    ...tasksOptions({
      projectId: projectId,
      search: search,
      assignees: assignees.length
        ? { some: { user: { rowId: { in: assignees } } } }
        : undefined,
      labels: labels.length
        ? { some: { label: { rowId: { in: labels } } } }
        : undefined,
    }),
    select: (data) =>
      data?.tasks?.nodes?.filter((task) => task.columnId === columnId),
  });

  const taskIndex = (taskId: string) =>
    project?.columns?.nodes
      ?.flatMap((column) => column?.tasks?.nodes?.map((task) => task))
      .sort(
        (a, b) =>
          new Date(a?.createdAt!).getTime() - new Date(b?.createdAt!).getTime(),
      )
      .map((task) => task.rowId)
      .indexOf(taskId);

  return (
    <div
      className={cn(
        "divide-y divide-base-200 overflow-hidden dark:divide-base-700",
        className,
      )}
      {...rest}
    >
      {tasks?.length === 0 ? (
        <p className="ml-2 p-2 text-muted-foreground text-xs">No tasks</p>
      ) : (
        tasks
          ?.filter((task) => task.rowId !== draggableId)
          .map((task, index) => {
            const displayId = `${prefix}-${taskIndex(task.rowId) ? taskIndex(task.rowId) : 0}`;
            const PriorityIcon = getPriorityIcon(task.priority);

            return (
              <Draggable
                key={task.rowId}
                draggableId={task.rowId}
                index={index}
              >
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    onMouseEnter={() => setTaskId(task.rowId)}
                    onMouseLeave={() => !isUpdateDialogOpen && setTaskId(null)}
                    onClick={() => {
                      if (!snapshot.isDragging) {
                        navigate({
                          to: "/workspaces/$workspaceId/projects/$projectId/$taskId",
                          params: {
                            workspaceId,
                            projectId,
                            taskId: task.rowId,
                          },
                        });
                      }
                    }}
                    className={cn(
                      "group flex cursor-pointer flex-col gap-2 bg-background px-4 py-3 transition-colors last:rounded-b-lg",
                      snapshot.isDragging ? "z-10 rounded-md border" : "",
                    )}
                  >
                    <div className="flex items-center">
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2 text-base-400 text-xs dark:text-base-500">
                          <span className="font-mono">{displayId}</span>
                          {PriorityIcon}
                        </div>

                        <div className="py-2">
                          <RichTextEditor
                            defaultContent={task?.content}
                            className="min-h-0 border-0 p-0 text-xs dark:bg-background"
                            skeletonClassName="h-4 p-0 w-80"
                            editable={false}
                          />
                        </div>
                      </div>

                      <TooltipRoot
                        positioning={{
                          placement: "bottom-end",
                          gutter: -4,
                        }}
                      >
                        <TooltipTrigger asChild>
                          <div className="-mt-6 -mr-2 ml-auto flex items-center gap-1">
                            {task.assignees.nodes.length ? (
                              <Assignees
                                assignees={task.assignees.nodes.map(
                                  (assignee) => assignee.user?.rowId!,
                                )}
                                className="-space-x-5.5 flex"
                              />
                            ) : (
                              <AvatarRoot
                                aria-label="No Assignees"
                                className="mr-2 size-5.5"
                              >
                                <AvatarFallback className="border border-border border-dashed bg-transparent p-1 text-muted-foreground">
                                  <UserIcon />
                                </AvatarFallback>
                              </AvatarRoot>
                            )}
                          </div>
                        </TooltipTrigger>
                        <TooltipPositioner>
                          <TooltipContent className="border bg-background text-foreground">
                            <div className="inline-flex">
                              Update Assignees
                              <div className="ml-2 flex items-center gap-0.5">
                                <SidebarMenuShotcut>A</SidebarMenuShotcut>
                              </div>
                            </div>
                          </TooltipContent>
                        </TooltipPositioner>
                      </TooltipRoot>
                    </div>

                    <div className="hidden items-center justify-between sm:flex">
                      <TooltipRoot
                        positioning={{
                          placement: "top-start",
                          shift: -6,
                        }}
                      >
                        <TooltipTrigger asChild>
                          {task.taskLabels.nodes.length ? (
                            <Labels
                              labels={
                                task.taskLabels.nodes?.map(
                                  (label) => label?.label!,
                                ) ?? []
                              }
                              className="flex flex-wrap gap-1"
                            />
                          ) : (
                            <Badge
                              size="sm"
                              variant="outline"
                              className="border-border border-dashed"
                            >
                              <TagIcon className="!size-2.5" />
                            </Badge>
                          )}
                        </TooltipTrigger>
                        <TooltipPositioner>
                          <TooltipContent className="border bg-background text-foreground">
                            <div className="inline-flex">
                              Update Labels
                              <div className="ml-2 flex items-center gap-0.5">
                                <SidebarMenuShotcut>L</SidebarMenuShotcut>
                              </div>
                            </div>
                          </TooltipContent>
                        </TooltipPositioner>
                      </TooltipRoot>

                      <TooltipRoot
                        positioning={{
                          placement: "top-end",
                          shift: -8,
                        }}
                      >
                        <TooltipTrigger asChild>
                          {task?.dueDate ? (
                            <div className="flex h-5 items-center gap-1 text-base-500 text-xs dark:text-base-400">
                              <CalendarIcon className="h-3 w-3" />
                              <span>
                                {format(new Date(task.dueDate), "MMM d")}
                              </span>
                            </div>
                          ) : (
                            <Badge
                              size="sm"
                              variant="outline"
                              className="h-5 w-fit place-self-end border-border border-dashed"
                            >
                              <CalendarIcon className="!size-2.5" />
                            </Badge>
                          )}
                        </TooltipTrigger>

                        <TooltipPositioner>
                          <TooltipContent className="border bg-background text-foreground">
                            <div className="inline-flex">
                              Update Due Date
                              <div className="ml-2 flex items-center gap-0.5">
                                <SidebarMenuShotcut>D</SidebarMenuShotcut>
                              </div>
                            </div>
                          </TooltipContent>
                        </TooltipPositioner>
                      </TooltipRoot>
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
