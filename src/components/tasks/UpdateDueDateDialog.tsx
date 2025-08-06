import { useQuery } from "@tanstack/react-query";
import { useParams } from "@tanstack/react-router";
import * as dateFns from "date-fns";
// @ts-ignore no declaration file
import { createParseHumanRelativeTime } from "parse-human-relative-time/date-fns.js";
import { useRef } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import * as z from "zod/v4";

import CreateTaskDatePicker from "@/components/tasks/CreateTaskDatePicker";
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
import { useUpdateTaskMutation } from "@/generated/graphql";
import { Hotkeys } from "@/lib/constants/hotkeys";
import { taskFormDefaults } from "@/lib/constants/taskFormDefaults";
import useDialogStore, { DialogType } from "@/lib/hooks/store/useDialogStore";
import useTaskStore from "@/lib/hooks/store/useTaskStore";
import useForm from "@/lib/hooks/useForm";
import taskOptions from "@/lib/options/task.options";

const UpdateDueDateDialog = () => {
  const inputRef = useRef<HTMLInputElement>(null);

  const { taskId: paramsTaskId } = useParams({ strict: false });

  const parseHumanRelativeTime = createParseHumanRelativeTime(dateFns);

  const { taskId: storeTaskId } = useTaskStore();

  const { setTaskId } = useTaskStore();

  const { isOpen, setIsOpen } = useDialogStore({
    type: DialogType.UpdateDueDate,
  });

  const taskId = paramsTaskId ?? storeTaskId;

  const { data: defaultDueDate } = useQuery({
    ...taskOptions({ rowId: taskId! }),
    enabled: !!taskId,
    select: (data) => data?.task?.dueDate,
  });

  const { mutate: updateTask } = useUpdateTaskMutation({
    meta: {
      invalidates: [["all"]],
    },
  });

  const form = useForm({
    defaultValues: {
      ...taskFormDefaults,
      dueDate: defaultDueDate ? new Date(defaultDueDate).toISOString() : "",
    },
    onSubmit: ({ value: { dueDate }, formApi }) => {
      updateTask({
        rowId: taskId!,
        patch: {
          dueDate: new Date(dueDate),
        },
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
            <div className="flex items-center gap-1">
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
                    onChange={async (e) => {
                      try {
                        const date = await parseHumanRelativeTime(
                          e.target.value,
                        );

                        field.handleChange(new Date(date).toISOString());
                      } catch (_error) {
                        field.handleChange("");
                      }
                    }}
                    placeholder="Try: tomorrow, in 2 days, next wednesday"
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
                  state.isDirty,
                ]}
              >
                {([canSubmit, isSubmitting, isDirty]) => (
                  <Button
                    type="submit"
                    disabled={!canSubmit || isSubmitting || !isDirty}
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
