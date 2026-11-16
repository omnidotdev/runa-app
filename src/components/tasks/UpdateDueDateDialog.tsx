import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "@tanstack/react-router";
import * as chrono from "chrono-node";
import dayjs from "dayjs";
import { useEffect, useRef, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { z } from "zod";

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
import { Input } from "@/components/ui/input";
import { useTasksQuery, useUpdateTaskMutation } from "@/generated/graphql";
import { Hotkeys } from "@/lib/constants/hotkeys";
import { taskFormDefaults } from "@/lib/constants/taskFormDefaults";
import useDialogStore, { DialogType } from "@/lib/hooks/store/useDialogStore";
import useTaskStore from "@/lib/hooks/store/useTaskStore";
import useForm from "@/lib/hooks/useForm";
import taskOptions from "@/lib/options/task.options";
import {
  allDayDueDate,
  dueDayKey,
  rescheduledDueDate,
  storedDueDateAtTime,
} from "@/lib/util/dueDate";
import getQueryKeyPrefix from "@/lib/util/getQueryKeyPrefix";
import { parseTaskParam } from "@/lib/util/taskUrl";
import CreateTaskDatePicker from "./CreateTaskDatePicker";

import type { TaskQuery } from "@/generated/graphql";

const UpdateDueDateDialog = () => {
  const inputRef = useRef<HTMLInputElement>(null);

  const { taskId: paramsTaskId } = useParams({ strict: false });

  const { taskId: storeTaskId } = useTaskStore();

  const { setTaskId } = useTaskStore();

  const { isOpen, setIsOpen } = useDialogStore({
    type: DialogType.UpdateDueDate,
  });

  // on the detail route the URL param is a vanity key, so fall back to the
  // store (set to the resolved rowId); only a legacy UUID param is a rowId
  const taskId =
    paramsTaskId && parseTaskParam(paramsTaskId).type === "uuid"
      ? paramsTaskId
      : storeTaskId;

  const queryClient = useQueryClient();
  const taskQueryKey = taskOptions({ rowId: taskId! }).queryKey;

  const { data: currentDue } = useQuery({
    ...taskOptions({ rowId: taskId! }),
    enabled: !!taskId,
    select: (data) => ({
      dueDate: data?.task?.dueDate,
      dueHasTime: data?.task?.dueHasTime,
    }),
  });
  // the form edits the due day; a timed task keeps its time-of-day on save
  // unless the typed phrase set one (`HH:mm`) or named only a day (`""`, which
  // makes it all-day). `null` means no phrase override: keep the current time
  const [timeOverride, setTimeOverride] = useState<string | null>(null);
  const defaultDueDay =
    dueDayKey(currentDue?.dueDate, currentDue?.dueHasTime) ?? "";

  const { mutate: updateTask } = useUpdateTaskMutation({
    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey: taskQueryKey });
      const previousTask = queryClient.getQueryData(taskQueryKey);

      queryClient.setQueryData<TaskQuery>(taskQueryKey, (old) => {
        if (!old?.task) return old;
        return {
          ...old,
          task: { ...old.task, ...variables.patch },
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
      dueDate: defaultDueDay,
    },
    onSubmit: ({ value: { dueDate }, formApi }) => {
      updateTask({
        rowId: taskId!,
        patch: !dueDate
          ? { dueDate: null, dueHasTime: false }
          : timeOverride === null
            ? rescheduledDueDate(dueDate, {
                dueDate: currentDue?.dueDate,
                dueHasTime: currentDue?.dueHasTime,
              })
            : timeOverride
              ? {
                  dueDate: storedDueDateAtTime(dueDate, timeOverride),
                  dueHasTime: true,
                }
              : { dueDate: allDayDueDate(dueDate), dueHasTime: false },
      });

      formApi.reset();
      setIsOpen(false);
      setTaskId(null);
    },
  });

  useHotkeys(Hotkeys.UpdateDueDate, () => setIsOpen(!isOpen), [
    isOpen,
    setIsOpen,
  ]);

  // Re-sync the form to the current task whenever the dialog opens or the target
  // task changes. The hotkey toggles `isOpen` directly, so `onOpenChange` never
  // fires on open; without this, a previously-hovered card's due date leaks in.
  // biome-ignore lint/correctness/useExhaustiveDependencies: reset is keyed on the resolved due date
  useEffect(() => {
    if (isOpen) {
      setTimeOverride(null);
      form.reset({
        ...taskFormDefaults,
        dueDate: defaultDueDay,
      });
    }
  }, [isOpen, taskId, defaultDueDay]);

  if (!taskId) return null;

  return (
    <DialogRoot
      open={isOpen}
      onOpenChange={({ open }) => {
        setIsOpen(open);

        if (!open) {
          setTaskId(null);
        }
      }}
      initialFocusEl={() => inputRef.current}
    >
      <DialogBackdrop />
      <DialogPositioner>
        <DialogContent>
          <DialogCloseTrigger />
          <DialogTitle>Update Due Date</DialogTitle>
          <DialogDescription>
            Update the due date of this task.
          </DialogDescription>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
            className="flex flex-col gap-2"
          >
            <div className="flex items-center gap-2">
              <form.Field
                name="dueDate"
                validators={{
                  onChangeAsyncDebounceMs: 300,
                  onChangeAsync: z.string().min(1),
                }}
              >
                {(field) => (
                  <Input
                    ref={inputRef}
                    onChange={(e) => {
                      const [result] = chrono.parse(e.target.value);
                      if (!result) {
                        setTimeOverride(null);
                        field.handleChange("");
                        return;
                      }
                      // timed only when the phrase specified an hour (chrono
                      // defaults an unset time to noon); otherwise all-day
                      const parsed = dayjs(result.start.date());
                      setTimeOverride(
                        result.start.isCertain("hour")
                          ? parsed.format("HH:mm")
                          : "",
                      );
                      field.handleChange(parsed.format("YYYY-MM-DD"));
                    }}
                    placeholder="Try: tomorrow, in 2 days, next wednesday"
                    id="due-date-input"
                    autoComplete="off"
                  />
                )}
              </form.Field>

              <CreateTaskDatePicker form={form} />
            </div>

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
                    Update Due Date
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

export default UpdateDueDateDialog;
