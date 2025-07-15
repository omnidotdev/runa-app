import { useQuery } from "@tanstack/react-query";
import { useParams } from "@tanstack/react-router";
import { format } from "date-fns";
import { CalendarIcon, EditIcon } from "lucide-react";

import Assignees from "@/components/Assignees";
import ColumnSelector from "@/components/core/selectors/ColumnSelector";
import PrioritySelector from "@/components/core/selectors/PrioritySelector";
import Labels from "@/components/Labels";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { CardContent, CardHeader, CardRoot } from "@/components/ui/card";
import { SidebarMenuShotcut } from "@/components/ui/sidebar";
import { Tooltip } from "@/components/ui/tooltip";
import { useUpdateTaskMutation } from "@/generated/graphql";
import useDialogStore, { DialogType } from "@/lib/hooks/store/useDialogStore";
import taskOptions from "@/lib/options/task.options";

const TaskSidebar = () => {
  const { taskId } = useParams({
    from: "/_auth/workspaces/$workspaceId/projects/$projectId/$taskId",
  });

  const { data: task } = useQuery({
    ...taskOptions({ rowId: taskId }),
    select: (data) => data?.task,
  });

  const { mutate: updateTask } = useUpdateTaskMutation({
    meta: {
      invalidates: [["all"]],
    },
  });

  const { setIsOpen: setIsUpdateAssigneesDialogOpen } = useDialogStore({
      type: DialogType.UpdateAssignees,
    }),
    { setIsOpen: setIsUpdateTaskLabelsDialogOpen } = useDialogStore({
      type: DialogType.UpdateTaskLabels,
    }),
    { setIsOpen: setIsUpdateDueDateDialogOpen } = useDialogStore({
      type: DialogType.UpdateDueDate,
    });

  return (
    <div className="no-scrollbar sticky top-0 col-span-4 flex flex-col gap-8 lg:col-span-1">
      <div className="flex gap-4 pt-4 lg:hidden">
        <div className="flex w-full flex-col gap-1">
          <h3 className="font-medium text-base-900 text-sm dark:text-base-100">
            Status{" "}
          </h3>
          <ColumnSelector
            defaultValue={[task?.columnId!]}
            triggerValue={task?.column?.title}
            size="xs"
            onValueChange={({ value }) =>
              updateTask({
                rowId: taskId,
                patch: {
                  columnId: value[0],
                },
              })
            }
          />
        </div>

        <div className="flex w-full flex-col gap-1">
          <h3 className="font-medium text-base-900 text-sm dark:text-base-100">
            Priority
          </h3>
          <PrioritySelector
            defaultValue={[task?.priority!]}
            triggerValue={task?.priority}
            size="xs"
            onValueChange={({ value }) =>
              updateTask({
                rowId: taskId,
                patch: {
                  priority: value[0],
                },
              })
            }
          />
        </div>
      </div>

      <Tooltip
        positioning={{ placement: "left" }}
        tooltip={{
          className: "bg-background text-foreground border",
          children: (
            <div className="inline-flex">
              Update Assignees
              <div className="ml-2 flex items-center gap-0.5">
                <SidebarMenuShotcut>A</SidebarMenuShotcut>
              </div>
            </div>
          ),
        }}
      >
        <CardRoot
          onClick={() => setIsUpdateAssigneesDialogOpen(true)}
          className="cursor-pointer p-0 shadow-none"
        >
          <CardHeader className="flex h-10 flex-row items-center justify-between rounded-t-xl bg-base-50 px-3 dark:bg-base-800">
            <h3 className="font-medium text-base-900 text-sm dark:text-base-100">
              Assignees
            </h3>
          </CardHeader>

          <CardContent className="flex max-h-80 overflow-y-auto p-0">
            {task?.assignees?.nodes?.length ? (
              <Assignees
                assignees={task?.assignees.nodes.map(
                  (assignee) => assignee.user?.rowId!,
                )}
                showUsername={true}
                className="flex flex-col gap-0"
              />
            ) : (
              <p className="mx-auto flex place-self-center p-4 text-muted-foreground text-sm">
                No Assignees
              </p>
            )}
          </CardContent>
        </CardRoot>
      </Tooltip>

      <Tooltip
        positioning={{ placement: "right" }}
        tooltip={{
          className: "bg-background text-foreground border",
          children: (
            <div className="inline-flex">
              Update Labels
              <div className="ml-2 flex items-center gap-0.5">
                <SidebarMenuShotcut>L</SidebarMenuShotcut>
              </div>
            </div>
          ),
        }}
      >
        <CardRoot
          onClick={() => setIsUpdateTaskLabelsDialogOpen(true)}
          className="cursor-pointer p-0 shadow-none"
        >
          <CardHeader className="flex h-10 flex-row items-center justify-between rounded-t-xl bg-base-50 px-3 dark:bg-base-800">
            <h3 className="font-medium text-base-900 text-sm dark:text-base-100">
              Labels
            </h3>
          </CardHeader>

          <CardContent className="space-y-4 p-4">
            <Labels
              labels={task?.taskLabels?.nodes?.map((node) => node.label!) ?? []}
              className="flex flex-wrap gap-2"
            />
          </CardContent>
        </CardRoot>
      </Tooltip>

      <CardRoot className="p-0 shadow-none">
        <CardHeader className="flex h-10 flex-row items-center justify-between rounded-t-xl bg-base-50 px-3 dark:bg-base-800">
          <h3 className="font-medium text-base-900 text-sm dark:text-base-100">
            Author
          </h3>
        </CardHeader>
        <CardContent className="flex items-center p-0">
          <Avatar
            fallback={task?.author?.name.charAt(0)}
            src={task?.author?.avatarUrl ?? undefined}
            alt={task?.author?.name}
            className="size-6 rounded-full border-2 border-base-100 dark:border-base-900"
          />
          <span className="text-xs">{task?.author?.name}</span>
        </CardContent>
      </CardRoot>

      <CardRoot className="p-0 shadow-none">
        <CardHeader className="flex h-10 flex-row items-center justify-between rounded-t-xl bg-base-50 px-3 dark:bg-base-800">
          <h3 className="font-medium text-base-900 text-sm dark:text-base-100">
            Details
          </h3>
        </CardHeader>

        <CardContent className="space-y-4 p-4">
          <div className="flex items-center justify-between text-xs">
            <span className="text-base-500 dark:text-base-400">Created</span>
            <span className="text-base-900 dark:text-base-100">
              {format(new Date(task?.createdAt!), "MMM d, yyyy")}
            </span>
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="text-base-500 dark:text-base-400">Updated</span>
            <span className="text-base-900 dark:text-base-100">
              {format(new Date(task?.updatedAt!), "MMM d, yyyy")}
            </span>
          </div>

          <div className="flex items-center justify-between text-xs">
            <Tooltip
              positioning={{ placement: "top" }}
              tooltip={{
                className: "bg-background text-foreground border",
                children: (
                  <div className="inline-flex">
                    Update Due Date
                    <div className="ml-2 flex items-center gap-0.5">
                      <SidebarMenuShotcut>D</SidebarMenuShotcut>
                    </div>
                  </div>
                ),
              }}
            >
              <Button
                variant="ghost"
                className="group h-fit py-0 font-normal text-base-500 text-xs hover:bg-transparent has-[>svg]:px-0 dark:text-base-400"
                onClick={() => setIsUpdateDueDateDialogOpen(true)}
              >
                Due Date
                <EditIcon className="size-3.5" />
              </Button>
            </Tooltip>

            {task?.dueDate ? (
              <div className="flex items-center gap-1 text-base-900 dark:text-base-100">
                <CalendarIcon className="size-3" />
                {format(new Date(task.dueDate), "MMM d, yyyy")}
              </div>
            ) : (
              <div>--</div>
            )}
          </div>
        </CardContent>
      </CardRoot>
    </div>
  );
};

export default TaskSidebar;
