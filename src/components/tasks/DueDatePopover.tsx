import { parseAbsoluteToLocal } from "@internationalized/date";
import { useQueryClient } from "@tanstack/react-query";
import * as chrono from "chrono-node";
import dayjs from "dayjs";
import {
  CalendarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  XIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DatePickerContent,
  DatePickerContext,
  DatePickerControl,
  DatePickerNextTrigger,
  DatePickerPositioner,
  DatePickerPrevTrigger,
  DatePickerRangeText,
  DatePickerRoot,
  DatePickerTable,
  DatePickerTableBody,
  DatePickerTableCell,
  DatePickerTableCellTrigger,
  DatePickerTableHead,
  DatePickerTableHeader,
  DatePickerTableRow,
  DatePickerTrigger,
  DatePickerView,
  DatePickerViewControl,
  DatePickerViewTrigger,
} from "@/components/ui/date-picker";
import { Input } from "@/components/ui/input";
import { useTasksQuery, useUpdateTaskMutation } from "@/generated/graphql";
import taskOptions from "@/lib/options/task.options";
import getQueryKeyPrefix from "@/lib/util/getQueryKeyPrefix";

import type { TaskQuery } from "@/generated/graphql";

interface Props {
  taskId: string;
  dueDate?: Date | string | null;
  editable: boolean;
}

/** Editing surface, isolated so its hooks never mount in the read-only view. */
const DueDateEditor = ({
  taskId,
  dueDate,
}: {
  taskId: string;
  dueDate?: Date | string | null;
}) => {
  const dueDateIso = dueDate ? new Date(dueDate).toISOString() : null;

  const queryClient = useQueryClient();
  const taskQueryKey = taskOptions({ rowId: taskId }).queryKey;

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

  const setDueDate = (value: Date | null) =>
    updateTask({ rowId: taskId, patch: { dueDate: value } });

  return (
    <DatePickerRoot
      value={dueDateIso ? [parseAbsoluteToLocal(dueDateIso)] : []}
      onValueChange={({ value }) =>
        setDueDate(
          value.length ? new Date(value[0].add({ days: 1 }).toString()) : null,
        )
      }
    >
      <DatePickerControl>
        <DatePickerTrigger asChild>
          <button
            type="button"
            className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm outline-none transition-colors hover:bg-accent focus-visible:bg-accent data-[state=open]:bg-accent"
          >
            <CalendarIcon className="size-4 text-muted-foreground" />
            {dueDate ? (
              <span>{dayjs(dueDate).format("MMM D, YYYY")}</span>
            ) : (
              <span className="text-muted-foreground">Set due date</span>
            )}
          </button>
        </DatePickerTrigger>
      </DatePickerControl>

      <DatePickerPositioner>
        <DatePickerContent className="w-64 bg-background p-2">
          <Input
            autoComplete="off"
            placeholder="Try: tomorrow, in 2 days"
            className="mb-2 h-8 text-sm shadow-none"
            onKeyDown={(event) => {
              if (event.key !== "Enter") return;
              event.preventDefault();
              const parsed = chrono.parseDate(event.currentTarget.value);
              if (parsed) setDueDate(parsed);
            }}
          />

          <DatePickerView className="flex flex-col gap-3" view="day">
            <DatePickerContext>
              {(datePicker) => (
                <>
                  <DatePickerViewControl>
                    <DatePickerPrevTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <ChevronLeftIcon />
                      </Button>
                    </DatePickerPrevTrigger>

                    <DatePickerViewTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <DatePickerRangeText />
                      </Button>
                    </DatePickerViewTrigger>

                    <DatePickerNextTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <ChevronRightIcon />
                      </Button>
                    </DatePickerNextTrigger>
                  </DatePickerViewControl>

                  <DatePickerTable>
                    <DatePickerTableHead>
                      <DatePickerTableRow>
                        {datePicker.weekDays.map((weekDay) => (
                          <DatePickerTableHeader key={weekDay.long}>
                            {weekDay.narrow}
                          </DatePickerTableHeader>
                        ))}
                      </DatePickerTableRow>
                    </DatePickerTableHead>
                    <DatePickerTableBody>
                      {datePicker.weeks.map((week) => (
                        <DatePickerTableRow key={week[0]?.toString()}>
                          {week.map((day) => (
                            <DatePickerTableCell
                              key={day.toString()}
                              value={day}
                              className="size-8"
                            >
                              <DatePickerTableCellTrigger className="hover:bg-primary-50 data-outside-range:opacity-40 hover:data-outside-range:bg-transparent dark:hover:bg-primary-950">
                                {day.day}
                              </DatePickerTableCellTrigger>
                            </DatePickerTableCell>
                          ))}
                        </DatePickerTableRow>
                      ))}
                    </DatePickerTableBody>
                  </DatePickerTable>
                </>
              )}
            </DatePickerContext>
          </DatePickerView>

          {dueDate && (
            <Button
              variant="ghost"
              size="sm"
              className="mt-2 w-full justify-start text-muted-foreground"
              onClick={() => setDueDate(null)}
            >
              <XIcon className="size-4" />
              Clear due date
            </Button>
          )}
        </DatePickerContent>
      </DatePickerPositioner>
    </DatePickerRoot>
  );
};

const DueDatePopover = ({ taskId, dueDate, editable }: Props) => {
  if (!editable) {
    return (
      <div className="flex w-full items-center gap-2 px-2 py-1.5 text-sm">
        <CalendarIcon className="size-4 text-muted-foreground" />
        {dueDate ? (
          <span>{dayjs(dueDate).format("MMM D, YYYY")}</span>
        ) : (
          <span className="text-muted-foreground">No due date</span>
        )}
      </div>
    );
  }

  return <DueDateEditor taskId={taskId} dueDate={dueDate} />;
};

export default DueDatePopover;
