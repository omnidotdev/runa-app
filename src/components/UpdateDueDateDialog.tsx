import { useQuery } from "@tanstack/react-query";
import { useParams } from "@tanstack/react-router";
import * as dateFns from "date-fns";
// @ts-ignore no declaration file
import { createParseHumanRelativeTime } from "parse-human-relative-time/date-fns.js";
import { useHotkeys } from "react-hotkeys-hook";
import * as z from "zod/v4";

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
import useDialogStore, { DialogType } from "@/lib/hooks/store/useDialogStore";
import useTaskStore from "@/lib/hooks/store/useTaskStore";
import useForm from "@/lib/hooks/useForm";
import taskOptions from "@/lib/options/task.options";
import CreateTaskDatePicker from "./tasks/CreateTaskDatePicker";

const UpdateDueDateDialog = () => {
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
      title: "",
      description: "",
      labels: [] as {
        name: string;
        color: string;
        checked: boolean;
        rowId: string;
      }[],
      assignees: [] as string[],
      dueDate: defaultDueDate ? new Date(defaultDueDate).toISOString() : "",
      columnId: "",
      priority: "",
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
                  Update Due Date
                </Button>
              )}
            </form.Subscribe>
          </form>
        </DialogContent>
      </DialogPositioner>
    </DialogRoot>
  );
};

export default UpdateDueDateDialog;
