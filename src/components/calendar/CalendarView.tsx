import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import dayjs from "dayjs";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useMemo, useState } from "react";

import {
  bucketTasksByDay,
  buildMonthGrid,
  resolveCalendarDrop,
} from "@/lib/calendar/grid";
import { cn } from "@/lib/utils";

import type { DropResult } from "@hello-pangea/dnd";

/** Minimal task shape the calendar renders. */
export interface CalendarTask {
  id: string;
  title: string;
  dueDate?: string | Date | null;
}

interface CalendarViewProps {
  tasks: CalendarTask[];
  /** Month to open on (defaults to the current month). */
  initialMonth?: string | Date;
  /** Called when a task chip is clicked. */
  onSelectTask?: (taskId: string) => void;
  /** Called when a task is dragged onto a different day (its new due day key). */
  onReschedule?: (taskId: string, dayKey: string) => void;
  className?: string;
}

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

/**
 * Month calendar of tasks by due date. Presentational: it owns only the viewed
 * month; tasks, selection, and rescheduling are supplied by the caller. Day
 * bucketing matches the board/list cards (see lib/calendar/grid). Drag-to-
 * reschedule uses @hello-pangea/dnd (same library as the board) so the dragged
 * chip follows the cursor; dropping on a day calls `onReschedule`.
 */
const CalendarView = ({
  tasks,
  initialMonth,
  onSelectTask,
  onReschedule,
  className,
}: CalendarViewProps) => {
  const [month, setMonth] = useState(() =>
    dayjs(initialMonth ?? undefined).startOf("month"),
  );
  const grid = useMemo(() => buildMonthGrid(month.toDate(), 0), [month]);
  const byDay = useMemo(() => bucketTasksByDay(tasks), [tasks]);

  const handleDragEnd = (result: DropResult) => {
    const drop = resolveCalendarDrop(result);
    if (drop) onReschedule?.(drop.taskId, drop.dayKey);
  };

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

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-7">
          {grid.flat().map((day) => (
            <Droppable droppableId={day.key} key={day.key}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  data-day={day.key}
                  className={cn(
                    "flex min-h-24 flex-col border-border border-r border-b p-1",
                    !day.inMonth && "bg-muted/30 text-muted-foreground",
                    snapshot.isDraggingOver && "bg-accent/40",
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
                    {(byDay[day.key] ?? []).map((task, index) => (
                      <Draggable
                        draggableId={task.id}
                        index={index}
                        key={task.id}
                      >
                        {(dragProvided, dragSnapshot) => (
                          <button
                            ref={dragProvided.innerRef}
                            {...dragProvided.draggableProps}
                            {...dragProvided.dragHandleProps}
                            type="button"
                            data-task-chip
                            onClick={() => onSelectTask?.(task.id)}
                            className={cn(
                              "truncate rounded bg-accent px-1.5 py-0.5 text-left text-xs hover:bg-accent/80",
                              dragSnapshot.isDragging &&
                                "shadow-lg ring-1 ring-primary",
                            )}
                            title={task.title}
                          >
                            {task.title}
                          </button>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
};

export default CalendarView;
