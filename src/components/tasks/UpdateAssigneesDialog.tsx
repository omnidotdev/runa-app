import { useQuery } from "@tanstack/react-query";
import { useLoaderData, useParams } from "@tanstack/react-router";
import { useHotkeys } from "react-hotkeys-hook";
import { match } from "ts-pattern";

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
import pricesOptions from "@/lib/options/prices.options";
import subscriptionOptions from "@/lib/options/subscription.options";
import taskOptions from "@/lib/options/task.options";
import { Tier, getTierFromSubscription } from "@/lib/types/tier";
import getQueryKeyPrefix from "@/lib/util/getQueryKeyPrefix";
import UpdateAssignees from "./UpdateAssignees";

export default function UpdateAssigneesDialog() {
  const { taskId: paramsTaskId } = useParams({ strict: false });
  const { organizationId } = useLoaderData({ from: "/_app" });

  const { taskId: storeTaskId, setTaskId } = useTaskStore();
  const taskId = paramsTaskId ?? storeTaskId;

  const { isOpen, setIsOpen } = useDialogStore({
    type: DialogType.UpdateAssignees,
  });

  const taskQueryKey = taskOptions({ rowId: taskId! }).queryKey;

  const { data: task } = useQuery({
    ...taskOptions({ rowId: taskId! }),
    enabled: !!taskId,
    select: (data) => data?.task,
  });

  // TODO: Fetch subscriptions from loader data
  const { data: subscription } = useQuery({
    ...subscriptionOptions(organizationId!),
    enabled: !!organizationId,
  });

  const { data: prices } = useQuery({
    ...pricesOptions(),
  });

  const tier = getTierFromSubscription(
    subscription,
    prices,
    subscription?.priceId,
  );

  // TODO: get from subscription instead of hardcoding based on tier
  const maxAssignees = match(tier)
    .with(Tier.Team, Tier.Enterprise, () => Infinity)
    .with(Tier.Pro, () => 5)
    .otherwise(() => 1);

  const defaultAssignees = task?.assignees?.nodes?.map(
    (assignee) => assignee?.user?.identityProviderId!,
  );

  const mutationOptions = {
    meta: {
      invalidates: [taskQueryKey, getQueryKeyPrefix(useTasksQuery)],
    },
  };

  const { mutateAsync: removeAssigneeAsync } =
    useDeleteAssigneeMutation(mutationOptions);
  const { mutateAsync: addNewAssigneeAsync } =
    useCreateAssigneeMutation(mutationOptions);

  const form = useForm({
    defaultValues: {
      ...taskFormDefaults,
      assignees: defaultAssignees ?? [],
    },
    onSubmit: async ({ value: { assignees }, formApi }) => {
      const currentNodes = task?.assignees?.nodes ?? [];

      const toRemove = currentNodes.filter(
        (node) => !assignees.includes(node?.user?.identityProviderId!),
      );
      const toAdd = assignees.filter(
        (node) => !defaultAssignees?.includes(node),
      );

      // TODO: shouldn't be necessary
      if (toRemove.length === 0 && toAdd.length === 0) {
        formApi.reset();
        setIsOpen(false);
        setTaskId(null);
        return;
      }

      const mutations: Promise<unknown>[] = [];
      for (const node of toRemove) {
        mutations.push(
          removeAssigneeAsync({ taskId: taskId!, userId: node.userId }).then(
            (data) => {
              return data;
            },
          ),
        );
      }

      for (const userId of toAdd) {
        mutations.push(
          addNewAssigneeAsync({
            input: { assignee: { taskId: taskId!, userId } },
          }).then((data) => {
            return data;
          }),
        );
      }

      await Promise.allSettled(mutations);

      formApi.reset();
      setIsOpen(false);
      setTaskId(null);
    },
    // onSubmit: async ({ value: { assignees }, formApi }) => {
    //   const currentNodes = task?.assignees?.nodes ?? [];

    //   const toRemove = currentNodes.filter(
    //     (node) => !assignees.includes(node?.user?.identityProviderId!),
    //   );
    //   const toAdd = assignees.filter(
    //     (node) => !defaultAssignees?.includes(node),
    //   );

    //   // Fire all mutations and wait for them to settle
    //   const mutations: Promise<unknown>[] = [];

    //   for (const node of toRemove) {
    //     mutations.push(
    //       new Promise((resolve, reject) =>
    //         removeAssignee(
    //           { taskId: taskId!, userId: node.userId },
    //           { onSuccess: resolve, onError: reject },
    //         ),
    //       ),
    //     );
    //   }

    //   for (const userId of toAdd) {
    //     mutations.push(
    //       new Promise((resolve, reject) =>
    //         addNewAssignee(
    //           { input: { assignee: { taskId: taskId!, userId } } },
    //           { onSuccess: resolve, onError: reject },
    //         ),
    //       ),
    //     );
    //   }

    //   // Wait so invalidation refetches happen while the query is still enabled
    //   await Promise.allSettled(mutations);

    //   // const failures = results.filter((result) => result.status === "rejected");

    //   // if (failures.length > 0) {
    //   //   toast.error("Failed to update some assignees. Please try again.");
    //   // } else if (results.length > 0) {
    //   //   toast.success("Assignees updated");
    //   // }

    //   formApi.reset();
    //   setIsOpen(false);
    //   setTaskId(null);
    // },
  });

  useHotkeys(
    Hotkeys.UpdateAssignees,
    () => setIsOpen(!isOpen),
    { description: "Create/Update Assignees" },
    [isOpen],
  );

  if (!taskId) return null;

  return (
    <DialogRoot
      open={isOpen}
      onOpenChange={({ open }) => {
        setIsOpen(open);
        if (!open) {
          form.reset();
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
            Update the users assigned to this task.
            {maxAssignees < Infinity && (
              <span className="ml-1 text-base-400 text-xs">
                (max {maxAssignees} on {tier} tier)
              </span>
            )}
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
              maxAssignees={maxAssignees}
              // pass default assignees instead of relying on form values
              initialAssignees={defaultAssignees}
            />

            <div className="mt-4 flex justify-end gap-2">
              <DialogCloseTrigger asChild>
                <Button variant="outline">Cancel</Button>
              </DialogCloseTrigger>

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
}
