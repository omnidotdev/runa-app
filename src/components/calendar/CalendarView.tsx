import dayjs from "dayjs";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useMemo, useState } from "react";

import { bucketTasksByDay, buildMonthGrid } from "@/lib/calendar/grid";
import { cn } from "@/lib/utils";

/** Minimal task shape the calendar renders. */
export interface CalendarTask {
  id: string;
  title: string;
  dueDate?: string | null;
}

interface CalendarViewProps {
  tasks: CalendarTask[];
  /** Month to open on (defaults to the current month). */
  initialMonth?: string | Date;
  /** Called when a task chip is clicked. */
  onSelectTask?: (taskId: string) => void;
  className?: string;
}

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

/**
 * Month calendar of tasks by due date. Presentational: it owns only the viewed
 * month; tasks and selection are supplied by the caller. Day bucketing matches
 * the board/list cards (see lib/calendar/grid), so a task shows on the day its
 * card shows. Drag-to-reschedule is wired by the container in a later slice.
 */
const CalendarView = ({
  tasks,
  initialMonth,
  onSelectTask,
  className,
}: CalendarViewProps) => {
  const [month, setMonth] = useState(() =>
    dayjs(initialMonth ?? undefined).startOf("month"),
  );
  const grid = useMemo(() => buildMonthGrid(month.toDate(), 0), [month]);
  const byDay = useMemo(() => bucketTasksByDay(tasks), [tasks]);

  return (
    <div className={cn("flex flex-col", className)} data-calendar-view>
      <div className="flex items-center justify-between px-1 py-3">
        <h2 className="font-semibold text-lg">{month.format("MMMM YYYY")}</h2>
        <div className="flex items-center gap-1">
          <button
            type="button"
            aria-label="Previous month"
            onClick={() => setMonth((m) => m.subtract(1, "month"))}
            className="rounded-md p-1.5 hover:bg-muted"
          >
            <ChevronLeftIcon className="size-4" />
          </button>
          <button
            type="button"
            onClick={() => setMonth(dayjs().startOf("month"))}
            className="rounded-md border px-2 py-1 text-sm hover:bg-muted"
          >
            Today
          </button>
          <button
            type="button"
            aria-label="Next month"
            onClick={() => setMonth((m) => m.add(1, "month"))}
            className="rounded-md p-1.5 hover:bg-muted"
          >
            <ChevronRightIcon className="size-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 border-border border-b">
        {WEEKDAYS.map((day) => (
          <div
            key={day}
            className="px-2 py-1 text-center font-medium text-muted-foreground text-xs"
          >
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7">
        {grid.flat().map((day) => (
          <div
            key={day.key}
            data-day={day.key}
            className={cn(
              "flex min-h-24 flex-col border-border border-r border-b p-1",
              !day.inMonth && "bg-muted/30 text-muted-foreground",
            )}
          >
            <span
              className={cn(
                "inline-flex size-6 items-center justify-center self-start text-xs",
                day.isToday &&
                  "rounded-full bg-primary font-semibold text-primary-foreground",
              )}
            >
              {day.dayOfMonth}
            </span>
            <div className="mt-1 flex flex-col gap-1 overflow-hidden">
              {(byDay[day.key] ?? []).map((task) => (
                <button
                  key={task.id}
                  type="button"
                  data-task-chip
                  onClick={() => onSelectTask?.(task.id)}
                  className="truncate rounded bg-accent px-1.5 py-0.5 text-left text-xs hover:bg-accent/80"
                  title={task.title}
                >
                  {task.title}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CalendarView;
