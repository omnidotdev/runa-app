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
  UserIcon,
} from "lucide-react";

import Assignees from "@/components/Assignees";
import RichTextEditor from "@/components/core/RichTextEditor";
import Labels from "@/components/Labels";
import { AvatarFallback, AvatarRoot } from "@/components/ui/avatar";
import useDialogStore, { DialogType } from "@/lib/hooks/store/useDialogStore";
import useDragStore from "@/lib/hooks/store/useDragStore";
import useTaskFiltersStore from "@/lib/hooks/store/useFilterStore";
import useTaskStore from "@/lib/hooks/store/useTaskStore";
import projectOptions from "@/lib/options/project.options";
import tasksOptions from "@/lib/options/tasks.options";
import { getPriorityIcon } from "@/lib/util/getPriorityIcon";
import { cn } from "@/lib/utils";
import { SidebarMenuShotcut } from "./ui/sidebar";
import {
  TooltipContent,
  TooltipPositioner,
  TooltipRoot,
  TooltipTrigger,
} from "./ui/tooltip";

import type { DetailedHTMLProps, HTMLAttributes } from "react";

export const columnIcons = {
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

  const {
    // selectedLabels,
    selectedUsers,
  } = useTaskFiltersStore();

  const { data: project } = useSuspenseQuery({
    ...projectOptions({ rowId: projectId }),
    select: (data) => data?.project,
  });

  const { data: tasks } = useSuspenseQuery({
    ...tasksOptions({
      projectId: projectId,
      search: search,
      assignees: selectedUsers.length ? selectedUsers : undefined,
    }),
    select: (data) =>
      data?.tasks?.nodes?.filter((task) => task.columnId === columnId),
  });

  const columnTitle = project?.columns?.nodes?.find(
    (column) => column?.rowId === columnId,
  )?.title;

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
          const PriorityIcon = getPriorityIcon(task.priority);

          return (
            <Draggable key={task.rowId} draggableId={task.rowId} index={index}>
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
                            className="-mx-5 min-h-0 w-fit border-0 p-0 text-xs dark:bg-background"
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
                                <AvatarFallback className="border border-muted-foreground border-dashed bg-transparent p-1 text-muted-foreground">
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

                    <div className="grid grid-cols-4">
                      <div className="-m-3 col-span-3 flex items-end p-2.5">
                        {!!task.labels.length && (
                          <TooltipRoot
                            positioning={{
                              placement: "top-start",
                              shift: -6,
                            }}
                          >
                            <TooltipTrigger asChild>
                              <Labels
                                labels={JSON.parse(task.labels)}
                                className="flex flex-wrap gap-1"
                              />
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
                        )}
                      </div>

                      {task?.dueDate && (
                        <TooltipRoot
                          positioning={{
                            placement: "top-end",
                            shift: -12,
                          }}
                        >
                          <TooltipTrigger asChild>
                            <div className="col-span-1 mr-1 flex items-center justify-end gap-1 place-self-end text-base-500 text-xs dark:text-base-400">
                              <CalendarIcon className="h-3 w-3" />
                              {/* TODO: timezone handling */}
                              <span>
                                {format(new Date(task.dueDate), "MMM d")}
                              </span>
                            </div>
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
