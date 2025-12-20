import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useLoaderData, useParams } from "@tanstack/react-router";
import { useHotkeys } from "react-hotkeys-hook";

import { Button } from "@/components/ui/button";
import {
  DialogBackdrop,
  DialogCloseTrigger,
  DialogContent,
  DialogDescription,
  DialogPositioner,
  DialogRoot,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  useCreateAssigneeMutation,
  useDeleteAssigneeMutation,
  useTasksQuery,
} from "@/generated/graphql";
import { Hotkeys } from "@/lib/constants/hotkeys";
import { taskFormDefaults } from "@/lib/constants/taskFormDefaults";
import useDialogStore, { DialogType } from "@/lib/hooks/store/useDialogStore";
import useTaskStore from "@/lib/hooks/store/useTaskStore";
import useForm from "@/lib/hooks/useForm";
import taskOptions from "@/lib/options/task.options";
import workspaceUsersOptions from "@/lib/options/workspaceUsers.options";
import getQueryKeyPrefix from "@/lib/util/getQueryKeyPrefix";
import UpdateAssignees from "./UpdateAssignees";

import type { TaskQuery } from "@/generated/graphql";

const UpdateAssigneesDialog = () => {
  const { taskId: paramsTaskId } = useParams({
    strict: false,
  });

  const { workspaceId } = useLoaderData({ from: "/_auth" });

  const { taskId: storeTaskId, setTaskId } = useTaskStore();

  const taskId = paramsTaskId ?? storeTaskId;

  const queryClient = useQueryClient();
  const taskQueryKey = taskOptions({ rowId: taskId! }).queryKey;

  const { isOpen, setIsOpen } = useDialogStore({
    type: DialogType.UpdateAssignees,
  });

  const { data: workspaceUsers } = useQuery({
    ...workspaceUsersOptions({ workspaceId: workspaceId! }),
    enabled: !!workspaceId,
    select: (data) => data?.workspaceUsers?.nodes.map((wu) => wu.user),
  });

  useHotkeys(
    Hotkeys.UpdateAssignees,
    () => setIsOpen(!isOpen),
    {
      description: "Create/Update Assignees",
    },
    [isOpen, setIsOpen],
  );

  const { data: task } = useQuery({
    ...taskOptions({ rowId: taskId! }),
    enabled: !!taskId,
    select: (data) => data?.task,
  });

  const defaultAssignees = task?.assignees?.nodes?.map(
    (assignee) => assignee?.user?.rowId!,
  );

  const { mutate: addNewAssignee } = useCreateAssigneeMutation({
    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey: taskQueryKey });
      const previousTask = queryClient.getQueryData(taskQueryKey);

      const user = workspaceUsers?.find(
        (u) => u?.rowId === variables.input.assignee?.userId,
      );

      if (user) {
        queryClient.setQueryData<TaskQuery>(taskQueryKey, (old) => {
          if (!old?.task) return old;
          return {
            ...old,
            task: {
              ...old.task,
              assignees: {
                ...old.task.assignees,
                nodes: [
                  ...old.task.assignees.nodes,
                  {
                    __typename: "Assignee" as const,
                    taskId: variables.input.assignee?.taskId!,
                    userId: user.rowId,
                    user: {
                      __typename: "User" as const,
                      rowId: user.rowId,
                      name: user.name,
                      avatarUrl: user.avatarUrl,
                    },
                  },
                ],
              },
            },
          } as TaskQuery;
        });
      }

      return { previousTask };
    },
    onError: (_err, _variables, context) => {
      if (context?.previousTask) {
        queryClient.setQueryData(taskQueryKey, context.previousTask);
      }
    },
    meta: {
      invalidates: [taskQueryKey, getQueryKeyPrefix(useTasksQuery)],
    },
  });

  const { mutate: removeAssignee } = useDeleteAssigneeMutation({
    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey: taskQueryKey });
      const previousTask = queryClient.getQueryData(taskQueryKey);

      queryClient.setQueryData<TaskQuery>(taskQueryKey, (old) => {
        if (!old?.task) return old;
        return {
          ...old,
          task: {
            ...old.task,
            assignees: {
              ...old.task.assignees,
              nodes: old.task.assignees.nodes.filter(
                (a) => a.userId !== variables.userId,
              ),
            },
          },
        } as TaskQuery;
      });

      return { previousTask };
    },
    onError: (_err, _variables, context) => {
      if (context?.previousTask) {
        queryClient.setQueryData(taskQueryKey, context.previousTask);
      }
    },
    meta: {
      invalidates: [taskQueryKey, getQueryKeyPrefix(useTasksQuery)],
    },
  });

  const form = useForm({
    defaultValues: {
      ...taskFormDefaults,
      assignees: defaultAssignees ?? [],
    },
    onSubmit: ({ value: { assignees }, formApi }) => {
      for (const assignee of assignees) {
        // Add any new assignees
        if (!defaultAssignees?.includes(assignee)) {
          addNewAssignee({
            input: {
              assignee: {
                taskId: taskId!,
                userId: assignee,
              },
            },
          });
        }
      }

      if (defaultAssignees?.length) {
        for (const assignee of defaultAssignees) {
          // remove any assignees that are no longer assigned
          if (!assignees.includes(assignee)) {
            removeAssignee({
              taskId: taskId!,
              userId: assignee,
            });
          }
        }
      }

      formApi.reset();
      setIsOpen(false);
      setTaskId(null);
    },
  });

  if (!taskId) return null;

  return (
    <DialogRoot
      open={isOpen}
      onOpenChange={({ open }) => {
        setIsOpen(open);
        form.reset();

        if (!open) {
          setTaskId(null);
        }
      }}
    >
      <DialogBackdrop />
      <DialogPositioner>
        <DialogContent>
          <DialogCloseTrigger />
          <DialogTitle>Update Assignees</DialogTitle>
          <DialogDescription>
            Update the users that are assigned to this task.
          </DialogDescription>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
            className="flex flex-col gap-2"
          >
            <UpdateAssignees
              form={form}
              comboboxInputProps={{
                className:
                  "rounded-md border-x-px border-t-px focus-visible:ring-ring",
              }}
            />

            <div className="mt-4 flex justify-end gap-2">
              <DialogCloseTrigger asChild>
                <Button variant="outline">Cancel</Button>
              </DialogCloseTrigger>

              <form.Subscribe
                selector={(state) => [
                  state.canSubmit,
                  state.isSubmitting,
                  state.isDefaultValue,
                ]}
              >
                {([canSubmit, isSubmitting, isDefaultValue]) => (
                  <Button
                    type="submit"
                    disabled={!canSubmit || isSubmitting || isDefaultValue}
                  >
                    Update Assignees
                  </Button>
                )}
              </form.Subscribe>
            </div>
          </form>
        </DialogContent>
      </DialogPositioner>
    </DialogRoot>
  );
};

export default UpdateAssigneesDialog;
