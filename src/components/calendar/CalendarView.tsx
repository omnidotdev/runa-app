import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import { bucketByDay, resolveCalendarDrop } from "@omnidotdev/cadence";
import {
  CalendarDayCell,
  CalendarGrid,
  CalendarHeader,
  CalendarItemChip,
  CalendarWeekdays,
  useCalendarMonth,
} from "@omnidotdev/thornberry/calendar";
import dayjs from "dayjs";
import { useMemo, useState } from "react";

import { cn } from "@/lib/utils";

import type { DropResult } from "@hello-pangea/dnd";

/** Minimal task shape the calendar renders. */
export interface CalendarTask {
  id: string;
  title: string;
  dueDate?: string | Date | null;
  /** Drives the chip's left-edge accent color. */
  priority?: string | null;
  /** Label colors (CSS color strings) shown as dots on the chip. */
  labelColors?: string[];
}

interface CalendarViewProps {
  tasks: CalendarTask[];
  /** Called when a task chip is clicked. */
  onSelectTask?: (taskId: string) => void;
  /** Called when a task is dragged onto a different day (its new due day key). */
  onReschedule?: (taskId: string, dayKey: string) => void;
  /** 0 = Sunday (default), 1 = Monday. */
  weekStartsOn?: 0 | 1;
  className?: string;
}

/** How many chips a day cell shows before collapsing the rest behind "+N more". */
const VISIBLE_PER_DAY = 3;

/**
 * The local day (`YYYY-MM-DD`) a due date buckets onto. Runa stores `dueDate` as
 * a tz-aware instant but renders it with `dayjs(dueDate).format` (local) on the
 * cards, so bucket by that same local day and the calendar matches the cards.
 * Deriving the local day here (rather than handing a `Z`-suffixed instant to
 * cadence's `toDayKey`, which rejects those) is where the off-by-one stays fixed.
 */
const dueDayKey = (dueDate: string | Date | null | undefined): string | null =>
  dueDate ? dayjs(dueDate).format("YYYY-MM-DD") : null;

/**
 * A soft full-chip tint for a task's priority (matches the Filter swatches). A
 * background tint reads as color without the hard edge a border draws around
 * the chip's rounded corners. Unset priority keeps the default chip surface.
 */
const priorityTint = (priority?: string | null): string =>
  priority === "high"
    ? "bg-red-500/15 hover:bg-red-500/25"
    : priority === "medium"
      ? "bg-yellow-500/15 hover:bg-yellow-500/25"
      : priority === "low"
        ? "bg-green-500/15 hover:bg-green-500/25"
        : "";

/**
 * Month calendar of tasks by due date, built on @omnidotdev/cadence (headless
 * grid + drop resolution) and the @omnidotdev/thornberry/calendar primitives
 * (presentational). Drag-to-reschedule stays here via @hello-pangea/dnd (same
 * library as the board): each day cell is a droppable keyed by its day key and
 * each chip a draggable; a drop resolves through cadence's resolveCalendarDrop.
 *
 * Each cell shows a few chips and collapses the rest behind a "+N more" toggle,
 * so a busy day never stretches its grid row (the overflow fix). Chips carry a
 * priority accent and label-color dots for a quick visual read.
 */
const CalendarView = ({
  tasks,
  onSelectTask,
  onReschedule,
  weekStartsOn = 0,
  className,
}: CalendarViewProps) => {
  const { grid, label, goToPrevious, goToNext, goToToday } = useCalendarMonth({
    weekStartsOn,
  });
  const byDay = useMemo(
    () => bucketByDay(tasks, (task) => dueDayKey(task.dueDate)),
    [tasks],
  );

  // day keys the user has expanded to see every task (the rest stay collapsed)
  const [expandedDays, setExpandedDays] = useState<ReadonlySet<string>>(
    new Set(),
  );

  const toggleDay = (dayKey: string) =>
    setExpandedDays((previous) => {
      const next = new Set(previous);
      if (next.has(dayKey)) next.delete(dayKey);
      else next.add(dayKey);
      return next;
    });

  const handleDragEnd = (result: DropResult) => {
    const drop = resolveCalendarDrop(result);
    if (drop) onReschedule?.(drop.itemId, drop.dayKey);
  };

  return (
    <div className={cn("flex flex-col", className)} data-calendar-view>
      <CalendarHeader
        title={label}
        onPrevious={goToPrevious}
        onNext={goToNext}
        onToday={goToToday}
      />
      <CalendarWeekdays weekStartsOn={weekStartsOn} />
      <DragDropContext onDragEnd={handleDragEnd}>
        <CalendarGrid>
          {grid.flat().map((day) => {
            const dayTasks = byDay[day.key] ?? [];
            const isExpanded = expandedDays.has(day.key);
            const overflow = dayTasks.length - VISIBLE_PER_DAY;
            const visibleTasks =
              isExpanded || overflow <= 0
                ? dayTasks
                : dayTasks.slice(0, VISIBLE_PER_DAY);

            return (
              <Droppable droppableId={day.key} key={day.key}>
                {(dropProvided, dropSnapshot) => (
                  <div
                    ref={dropProvided.innerRef}
                    {...dropProvided.droppableProps}
                  >
                    <CalendarDayCell
                      day={day}
                      isOver={dropSnapshot.isDraggingOver}
                    >
                      {visibleTasks.map((task, index) => (
                        <Draggable
                          draggableId={task.id}
                          index={index}
                          key={task.id}
                        >
                          {(dragProvided, dragSnapshot) => (
                            <div
                              ref={dragProvided.innerRef}
                              {...dragProvided.draggableProps}
                              {...dragProvided.dragHandleProps}
                            >
                              <CalendarItemChip
                                isDragging={dragSnapshot.isDragging}
                                onClick={() => onSelectTask?.(task.id)}
                                title={task.title}
                                className={cn(
                                  "flex w-full items-center gap-1",
                                  priorityTint(task.priority),
                                )}
                              >
                                {task.labelColors
                                  ?.slice(0, 3)
                                  .map((color, i) => (
                                    <span
                                      // biome-ignore lint/suspicious/noArrayIndexKey: colors are positional dots
                                      key={i}
                                      className="size-1.5 shrink-0 rounded-full"
                                      style={{ backgroundColor: color }}
                                    />
                                  ))}
                                <span className="min-w-0 flex-1 truncate">
                                  {task.title}
                                </span>
                              </CalendarItemChip>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {dropProvided.placeholder}
                      {(overflow > 0 || isExpanded) &&
                        dayTasks.length > VISIBLE_PER_DAY && (
                          <button
                            type="button"
                            onClick={() => toggleDay(day.key)}
                            className="px-1.5 py-0.5 text-left text-muted-foreground text-xs hover:text-foreground"
                          >
                            {isExpanded ? "Show less" : `+${overflow} more`}
                          </button>
                        )}
                    </CalendarDayCell>
                  </div>
                )}
              </Droppable>
            );
          })}
        </CalendarGrid>
      </DragDropContext>
    </div>
  );
};

export default CalendarView;
