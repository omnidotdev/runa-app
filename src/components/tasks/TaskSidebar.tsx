import { useQuery } from "@tanstack/react-query";
import { useParams } from "@tanstack/react-router";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

import Label from "@/components/shared/Label";
import {
  AvatarFallback,
  AvatarImage,
  AvatarRoot,
} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { CardContent, CardHeader, CardRoot } from "@/components/ui/card";
import { Shortcut } from "@/components/ui/shortcut";
import useDialogStore, { DialogType } from "@/lib/hooks/store/useDialogStore";
import taskOptions from "@/lib/options/task.options";

import type { LabelFragment } from "@/generated/graphql";

const TaskSidebar = () => {
  const { taskId } = useParams({
    from: "/_auth/workspaces/$workspaceSlug/projects/$projectSlug/$taskId",
  });

  const { data: task } = useQuery({
    ...taskOptions({ rowId: taskId }),
    select: (data) => data?.task,
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
    <div className="no-scrollbar sticky top-0 col-span-4 flex w-full flex-col gap-8 lg:col-span-1">
      {/* TODO: better name for this, it sucks */}
      <CardHeader className="mt-4 p-0 lg:hidden">Management Panel</CardHeader>

      <CardRoot
        tabIndex={0}
        role="button"
        onClick={() => setIsUpdateAssigneesDialogOpen(true)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setIsUpdateAssigneesDialogOpen(true);
          }
        }}
        className="cursor-pointer overflow-hidden p-0 shadow-none outline-none outline-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        <CardHeader className="flex h-10 flex-row items-center justify-between bg-base-50 px-3 dark:bg-base-800">
          <h3 className="font-medium text-base-900 text-sm dark:text-base-100">
            Assignees
          </h3>
          <Shortcut>A</Shortcut>
        </CardHeader>

        <CardContent className="flex max-h-80 overflow-y-auto p-4">
          {task?.assignees?.nodes?.length ? (
            <div>
              {task?.assignees?.nodes?.map(({ user }) => (
                <div key={user?.rowId} className="flex items-center gap-2">
                  <AvatarRoot className="size-6 rounded-full border-2 bg-background font-medium text-xs">
                    <AvatarImage
                      src={user?.avatarUrl ?? undefined}
                      alt={user?.name}
                    />
                    <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
                  </AvatarRoot>

                  <p className="text-xs">{user?.name}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="mx-auto flex place-self-center p-4 text-muted-foreground text-sm">
              No Assignees
            </p>
          )}
        </CardContent>
      </CardRoot>

      <CardRoot
        tabIndex={0}
        role="button"
        onClick={() => setIsUpdateTaskLabelsDialogOpen(true)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setIsUpdateTaskLabelsDialogOpen(true);
          }
        }}
        className="cursor-pointer overflow-hidden p-0 shadow-none outline-none outline-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        <CardHeader className="flex h-10 flex-row items-center justify-between bg-base-50 px-3 dark:bg-base-800">
          <h3 className="font-medium text-base-900 text-sm dark:text-base-100">
            Labels
          </h3>
          <Shortcut>L</Shortcut>
        </CardHeader>

        <CardContent className="space-y-4 p-4">
          {task?.taskLabels?.nodes?.length ? (
            <div className="flex flex-wrap gap-2">
              {task?.taskLabels.nodes?.map(({ label }) => (
                <Label key={label?.rowId} label={label as LabelFragment} />
              ))}
            </div>
          ) : (
            <p className="mx-auto flex place-self-center text-muted-foreground text-sm">
              No Labels
            </p>
          )}
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
            <span className="text-base-500 dark:text-base-400">Author</span>
            <span className="text-base-900 dark:text-base-100">
              {task?.author?.name ?? "Anonymous"}
            </span>
          </div>

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
            <Button
              variant="ghost"
              className="group h-fit px-0 py-0 font-normal text-base-500 text-xs hover:bg-transparent dark:text-base-400"
              onClick={() => setIsUpdateDueDateDialogOpen(true)}
            >
              Due Date
              <Shortcut>D</Shortcut>
            </Button>

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
