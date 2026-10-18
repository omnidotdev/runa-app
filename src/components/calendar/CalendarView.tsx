import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import { bucketByDay, resolveCalendarDrop } from "@omnidotdev/cadence";
import {
  CalendarDayCell,
  CalendarGrid,
  CalendarHeader,
  CalendarItemChip,
  CalendarMoreToggle,
  CalendarWeekdays,
  useCalendarMonth,
  useDayOverflow,
} from "@omnidotdev/thornberry/calendar";
import dayjs from "dayjs";
import { useMemo } from "react";

import { cn } from "@/lib/utils";

import type { DropResult } from "@hello-pangea/dnd";
import type { CalendarDay } from "@omnidotdev/cadence";
import type { CalendarItemTone } from "@omnidotdev/thornberry/calendar";

/** Minimal task shape the calendar renders. */
export interface CalendarTask {
  id: string;
  title: string;
  dueDate?: string | Date | null;
  /** Drives the chip's tint. */
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

/**
 * The local day (`YYYY-MM-DD`) a due date buckets onto. Runa stores `dueDate` as
 * a tz-aware instant but renders it with `dayjs(dueDate).format` (local) on the
 * cards, so bucket by that same local day and the calendar matches the cards.
 * Deriving the local day here (rather than handing a `Z`-suffixed instant to
 * cadence's `toDayKey`, which rejects those) is where the off-by-one stays fixed.
 */
const dueDayKey = (dueDate: string | Date | null | undefined): string | null =>
  dueDate ? dayjs(dueDate).format("YYYY-MM-DD") : null;

/** Map a task's priority onto the shared chip tint (matches the Filter swatches). */
const priorityTone = (priority?: string | null): CalendarItemTone =>
  priority === "high"
    ? "danger"
    : priority === "medium"
      ? "warning"
      : priority === "low"
        ? "success"
        : "neutral";

/**
 * One day cell: a droppable keyed by its day key, its tasks as draggable chips,
 * and a shared "+N more" toggle so a busy day never stretches its grid row. The
 * overflow state comes from the shared `useDayOverflow` hook (hence a dedicated
 * component - the hook must run per cell, not inside the grid loop).
 */
const ProjectCalendarDay = ({
  day,
  tasks,
  onSelectTask,
}: {
  day: CalendarDay;
  tasks: CalendarTask[];
  onSelectTask?: (taskId: string) => void;
}) => {
  const { visibleCount, hiddenCount, hasOverflow, isExpanded, toggle } =
    useDayOverflow({ count: tasks.length });
  const visibleTasks = tasks.slice(0, visibleCount);

  return (
    <Droppable droppableId={day.key}>
      {(dropProvided, dropSnapshot) => (
        <div ref={dropProvided.innerRef} {...dropProvided.droppableProps}>
          <CalendarDayCell day={day} isOver={dropSnapshot.isDraggingOver}>
            {visibleTasks.map((task, index) => (
              <Draggable draggableId={task.id} index={index} key={task.id}>
                {(dragProvided, dragSnapshot) => (
                  <div
                    ref={dragProvided.innerRef}
                    {...dragProvided.draggableProps}
                    {...dragProvided.dragHandleProps}
                  >
                    <CalendarItemChip
                      isDragging={dragSnapshot.isDragging}
                      tone={priorityTone(task.priority)}
                      dots={task.labelColors}
                      onClick={() => onSelectTask?.(task.id)}
                      title={task.title}
                    >
                      {task.title}
                    </CalendarItemChip>
                  </div>
                )}
              </Draggable>
            ))}
            {dropProvided.placeholder}
            {hasOverflow && (
              <CalendarMoreToggle
                hiddenCount={hiddenCount}
                isExpanded={isExpanded}
                onClick={toggle}
              />
            )}
          </CalendarDayCell>
        </div>
      )}
    </Droppable>
  );
};

/**
 * Month calendar of tasks by due date, built on @omnidotdev/cadence (headless
 * grid + drop resolution) and the @omnidotdev/thornberry/calendar primitives
 * (presentational, incl. per-day overflow + chip tint/dots). Drag-to-reschedule
 * stays here via @hello-pangea/dnd (same library as the board): each day cell is
 * a droppable and each chip a draggable; a drop resolves through cadence's
 * resolveCalendarDrop.
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
          {grid.flat().map((day) => (
            <ProjectCalendarDay
              key={day.key}
              day={day}
              tasks={byDay[day.key] ?? []}
              onSelectTask={onSelectTask}
            />
          ))}
        </CalendarGrid>
      </DragDropContext>
    </div>
  );
};

export default CalendarView;
