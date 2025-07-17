import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { useLoaderData, useParams } from "@tanstack/react-router";
import { useHotkeys } from "react-hotkeys-hook";

import UpdateAssignees from "@/components/tasks/UpdateAssignees";
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
} from "@/generated/graphql";
import { Hotkeys } from "@/lib/constants/hotkeys";
import { taskFormDefaults } from "@/lib/constants/taskFormDefaults";
import useDialogStore, { DialogType } from "@/lib/hooks/store/useDialogStore";
import useTaskStore from "@/lib/hooks/store/useTaskStore";
import useForm from "@/lib/hooks/useForm";
import projectOptions from "@/lib/options/project.options";
import taskOptions from "@/lib/options/task.options";
import workspaceOptions from "@/lib/options/workspace.options";

const UpdateAssigneesDialog = () => {
  const { workspaceId } = useLoaderData({ from: "/_auth" });

  const { taskId: paramsTaskId } = useParams({
    strict: false,
  });

  const { data: workspace } = useSuspenseQuery({
    ...workspaceOptions({ rowId: workspaceId! }),
    select: (data) => data?.workspace,
  });

  const { taskId: storeTaskId, setTaskId } = useTaskStore();

  const taskId = paramsTaskId ?? storeTaskId;

  const { isOpen, setIsOpen } = useDialogStore({
    type: DialogType.UpdateAssignees,
  });

  useHotkeys(Hotkeys.UpdateAssignees, () => setIsOpen(!isOpen), [
    isOpen,
    setIsOpen,
  ]);

  const { data: task } = useQuery({
    ...taskOptions({ rowId: taskId! }),
    enabled: !!taskId,
    select: (data) => data?.task,
  });

  const defaultAssignees = task?.assignees?.nodes?.map(
    (assignee) => assignee?.user?.rowId!,
  );

  const { mutate: addNewAssignee } = useCreateAssigneeMutation({
    meta: {
      invalidates: [
        taskOptions({ rowId: taskId! }).queryKey,
        projectOptions({ rowId: workspace?.projects?.nodes?.[0].rowId! })
          .queryKey,
      ],
    },
  });
  const { mutate: removeAssignee } = useDeleteAssigneeMutation({
    meta: {
      invalidates: [
        taskOptions({ rowId: taskId! }).queryKey,
        projectOptions({ rowId: workspace?.projects?.nodes?.[0].rowId! })
          .queryKey,
      ],
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
              rowId: task?.assignees?.nodes?.find(
                (a) => a?.user?.rowId === assignee,
              )?.rowId!,
            });
          }
        }
      }

      formApi.reset();
      setIsOpen(false);
      setTaskId(null);
    },
  });

  return (
    <DialogRoot
      open={isOpen}
      onOpenChange={({ open }) => {
        setIsOpen(open);

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
          >
            <UpdateAssignees
              form={form}
              comboboxInputProps={{
                className:
                  "rounded-md border-x-px border-t-px focus-visible:ring-ring",
              }}
            />

            <form.Subscribe
              selector={(state) => [
                state.canSubmit,
                state.isSubmitting,
                state.isDirty,
              ]}
            >
              {([canSubmit, isSubmitting, isDirty]) => (
                <Button
                  type="submit"
                  disabled={!canSubmit || isSubmitting || !isDirty}
                  size="sm"
                  className="mt-4 w-full"
                >
                  Update Assignees
                </Button>
              )}
            </form.Subscribe>
          </form>
        </DialogContent>
      </DialogPositioner>
    </DialogRoot>
  );
};

export default UpdateAssigneesDialog;
