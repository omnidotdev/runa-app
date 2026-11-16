import { parseAbsoluteToLocal, parseDate } from "@internationalized/date";
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
} from "@omnidotdev/thornberry/date-picker";
import { useQueryClient } from "@tanstack/react-query";
import * as chrono from "chrono-node";
import dayjs from "dayjs";
import {
  CalendarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ClockIcon,
  XIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTasksQuery, useUpdateTaskMutation } from "@/generated/graphql";
import taskOptions from "@/lib/options/task.options";
import {
  allDayDueDate,
  dueDayKey,
  dueTimeValue,
  formatDueDate,
  pickedLocalDay,
  storedDueDateAtTime,
} from "@/lib/util/dueDate";
import getQueryKeyPrefix from "@/lib/util/getQueryKeyPrefix";

import type { TaskQuery } from "@/generated/graphql";

interface Props {
  taskId: string;
  dueDate?: Date | string | null;
  /** Whether `dueDate` carries a time-of-day (otherwise it is all-day). */
  dueHasTime?: boolean | null;
  editable: boolean;
}

/** Editing surface, isolated so its hooks never mount in the read-only view. */
const DueDateEditor = ({
  taskId,
  dueDate,
  dueHasTime,
}: Omit<Props, "editable">) => {
  // the stored day (an unparseable value yields null instead of throwing), and
  // the picker value for it: a timed date seeds the picker in local time, an
  // all-day date as its plain calendar day (never shifted by the time zone)
  const dueDay = dueDayKey(dueDate, dueHasTime);
  const pickerValue = !dueDay
    ? []
    : dueHasTime
      ? [parseAbsoluteToLocal(new Date(dueDate!).toISOString())]
      : [parseDate(dueDay)];
  const time = dueTimeValue(dueDate, dueHasTime);

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

  const setDueDate = (value: Date | null, hasTime = false) =>
    updateTask({
      rowId: taskId,
      patch: { dueDate: value, dueHasTime: hasTime },
    });

  return (
    <DatePickerRoot
      value={pickerValue}
      onValueChange={({ value }) => {
        if (!value.length) {
          setDueDate(null);
          return;
        }
        // keep any existing time-of-day when the day changes
        const day = pickedLocalDay(value[0]);
        setDueDate(
          time ? storedDueDateAtTime(day, time) : allDayDueDate(day),
          !!time,
        );
      }}
    >
      <DatePickerControl>
        <DatePickerTrigger asChild>
          <button
            type="button"
            className="hover:bg-accent focus-visible:bg-accent data-[state=open]:bg-accent flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm transition-colors outline-none"
          >
            <CalendarIcon className="text-muted-foreground size-4" />
            {dueDay ? (
              <span>
                {formatDueDate(dueDate, dueHasTime, { withYear: true })}
              </span>
            ) : (
              <span className="text-muted-foreground">Set due date</span>
            )}
          </button>
        </DatePickerTrigger>
      </DatePickerControl>

      <DatePickerPositioner>
        <DatePickerContent className="bg-background w-64 p-2">
          <Input
            autoComplete="off"
            placeholder="Try: tomorrow, in 2 days"
            className="mb-2 h-8 text-sm shadow-none"
            onKeyDown={(event) => {
              if (event.key !== "Enter") return;
              event.preventDefault();
              const [result] = chrono.parse(event.currentTarget.value);
              if (result) {
                // timed only when the phrase specified an hour; otherwise
                // normalize to start-of-day (chrono defaults an unset time to
                // noon, which would otherwise read back as a timed due date)
                const hasTime = result.start.isCertain("hour");
                const parsed = result.start.date();
                setDueDate(
                  hasTime
                    ? parsed
                    : allDayDueDate(dayjs(parsed).format("YYYY-MM-DD")),
                  hasTime,
                );
              }
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
                              <DatePickerTableCellTrigger className="hover:bg-primary-50 dark:hover:bg-primary-950 data-outside-range:opacity-40 hover:data-outside-range:bg-transparent">
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

          <div className="mt-2 flex items-center gap-2 border-t pt-2">
            <ClockIcon className="text-muted-foreground size-4" />
            <input
              type="time"
              aria-label="Due time"
              value={time}
              onChange={(event) => {
                // the task's own day, or today when it has no due date yet
                const day = dueDay ?? dayjs().format("YYYY-MM-DD");
                setDueDate(
                  event.target.value
                    ? storedDueDateAtTime(day, event.target.value)
                    : allDayDueDate(day),
                  !!event.target.value,
                );
              }}
              className="focus-visible:ring-primary h-8 flex-1 rounded-md border bg-transparent px-2 text-sm outline-none focus-visible:ring-1"
            />
          </div>

          {dueDate && (
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground mt-2 w-full justify-start"
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

const DueDatePopover = ({ taskId, dueDate, dueHasTime, editable }: Props) => {
  if (!editable) {
    const label = formatDueDate(dueDate, dueHasTime, { withYear: true });
    return (
      <div className="flex w-full items-center gap-2 px-2 py-1.5 text-sm">
        <CalendarIcon className="text-muted-foreground size-4" />
        {label ? (
          <span>{label}</span>
        ) : (
          <span className="text-muted-foreground">No due date</span>
        )}
      </div>
    );
  }

  return (
    <DueDateEditor taskId={taskId} dueDate={dueDate} dueHasTime={dueHasTime} />
  );
};

export default DueDatePopover;
