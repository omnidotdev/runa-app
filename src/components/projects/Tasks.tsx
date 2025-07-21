import { Draggable } from "@hello-pangea/dnd";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "@tanstack/react-router";
import { format } from "date-fns";
import { CalendarIcon, TagIcon, UserIcon } from "lucide-react";

import Assignees from "@/components/Assignees";
import RichTextEditor from "@/components/core/RichTextEditor";
import Labels from "@/components/Labels";
import PriorityIcon from "@/components/tasks/PriorityIcon";
import { AvatarFallback, AvatarRoot } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { SidebarMenuShortcut } from "@/components/ui/sidebar";
import {
  TooltipContent,
  TooltipPositioner,
  TooltipRoot,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import useDialogStore, { DialogType } from "@/lib/hooks/store/useDialogStore";
import useDragStore from "@/lib/hooks/store/useDragStore";
import useTaskStore from "@/lib/hooks/store/useTaskStore";
import useReorderTasks from "@/lib/hooks/useReorderTasks";
import projectOptions from "@/lib/options/project.options";
import { cn } from "@/lib/utils";

import type { DetailedHTMLProps, HTMLAttributes } from "react";

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

  const { draggableId } = useDragStore();
  const { setTaskId } = useTaskStore();
  const { isOpen: isUpdateAssigneesDialogOpen } = useDialogStore({
      type: DialogType.UpdateAssignees,
    }),
    { isOpen: isUpdateDueDateDialogOpen } = useDialogStore({
      type: DialogType.UpdateDueDate,
    }),
    { isOpen: isUpdateTaskLabelsDialogOpen } = useDialogStore({
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

  const { tasks: projectTasks } = useReorderTasks();

  const tasks = projectTasks?.filter((task) => task.columnId === columnId);

  const taskIndex = (taskId: string) =>
    project?.columns?.nodes
      ?.flatMap((column) => column?.tasks?.nodes?.map((task) => task))
      .sort(
        (a, b) =>
          new Date(a.createdAt!).getTime() - new Date(b.createdAt!).getTime(),
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
        ?.filter((task) => task.rowId !== draggableId)
        .map((task, index) => {
          const displayId = `${prefix}-${taskIndex(task.rowId) ? taskIndex(task.rowId) : 0}`;

          return (
            <Draggable key={task.rowId} draggableId={task.rowId} index={index}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}
                  onMouseEnter={() =>
                    !isUpdateDialogOpen && setTaskId(task.rowId)
                  }
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
                  className="mb-2 cursor-pointer rounded-lg border bg-background p-3"
                >
                  <div className="flex flex-col gap-1">
                    <div className="flex items-start gap-2">
                      <div className="mt-0.5 min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="flex-shrink-0 font-medium font-mono text-base-400 text-xs dark:text-base-500">
                            {displayId}
                          </span>
                          <PriorityIcon
                            priority={task.priority}
                            className="scale-75 opacity-50"
                          />
                        </div>

                        <div className="py-4">
                          <RichTextEditor
                            defaultContent={task?.content}
                            className="min-h-0 w-fit border-0 p-0 text-xs dark:bg-background"
                            skeletonClassName="-mx-5 h-4 p-0 w-40"
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
                          <div className="-mt-2.5 -mr-2 flex items-center gap-1">
                            {task.assignees.nodes.length ? (
                              <Assignees
                                assignees={task?.assignees.nodes.map(
                                  (assignee) => assignee.user?.rowId!,
                                )}
                                className="-space-x-5.5 flex"
                              />
                            ) : (
                              <AvatarRoot
                                aria-label="No Assignees"
                                className="mt-2.5 mr-2 size-5.5"
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
                                <SidebarMenuShortcut>A</SidebarMenuShortcut>
                              </div>
                            </div>
                          </TooltipContent>
                        </TooltipPositioner>
                      </TooltipRoot>
                    </div>

                    <div className="grid grid-cols-4">
                      <div className="-m-3 col-span-3 flex items-end p-2.5">
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
                                  <SidebarMenuShortcut>L</SidebarMenuShortcut>
                                </div>
                              </div>
                            </TooltipContent>
                          </TooltipPositioner>
                        </TooltipRoot>
                      </div>

                      <TooltipRoot
                        positioning={{
                          placement: "top-end",
                          shift: -8,
                        }}
                      >
                        <TooltipTrigger asChild>
                          {task?.dueDate ? (
                            <div className="col-span-1 mr-1 flex h-5 items-center justify-end gap-1 place-self-end text-base-500 text-xs dark:text-base-400">
                              <CalendarIcon className="h-3 w-3" />
                              {/* TODO: timezone handling */}
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
                                <SidebarMenuShortcut>D</SidebarMenuShortcut>
                              </div>
                            </div>
                          </TooltipContent>
                        </TooltipPositioner>
                      </TooltipRoot>
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
