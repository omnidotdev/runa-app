import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import { bucketByDay, resolveCalendarDrop } from "@omnidotdev/cadence";
import {
  CalendarDayCell,
  CalendarGrid,
  CalendarHeader,
  CalendarItemChip,
  CalendarMoreToggle,
  CalendarWeekdays,
  useCalendarView,
  useDayOverflow,
} from "@omnidotdev/thornberry/calendar";
import dayjs from "dayjs";
import { useMemo, useState } from "react";

import { cn } from "@/lib/utils";

import type { DropResult } from "@hello-pangea/dnd";
import type { CalendarDay } from "@omnidotdev/cadence";
import type {
  CalendarItemAvatar,
  CalendarItemTone,
  CalendarRange,
} from "@omnidotdev/thornberry/calendar";

/** Minimal task shape the calendar renders. */
export interface CalendarTask {
  id: string;
  title: string;
  dueDate?: string | Date | null;
  /** Drives the chip's tint. */
  priority?: string | null;
  /** Label colors (CSS color strings) shown as dots on the chip. */
  labelColors?: string[];
  /** Assignees shown as a trailing avatar stack on the chip. */
  assignees?: CalendarItemAvatar[];
  /** The task's column is the project's done column (struck through + muted). */
  isDone?: boolean;
  /** Past due and not done (a danger ring, distinct from the priority tint). */
  isOverdue?: boolean;
}

interface CalendarViewProps {
  tasks: CalendarTask[];
  /** Tasks with no due date, shown in a side rail to drag onto a day. Pass it
   * (even empty) to enable the rail + drag-to-unschedule; omit to hide it. */
  unscheduledTasks?: CalendarTask[];
  /** Called when a task chip is clicked. */
  onSelectTask?: (taskId: string) => void;
  /** Called when a task is dragged onto a day (its new due day key). */
  onReschedule?: (taskId: string, dayKey: string) => void;
  /** Called when a task is dragged into the rail (clear its due date). */
  onUnschedule?: (taskId: string) => void;
  /** 0 = Sunday (default), 1 = Monday. */
  weekStartsOn?: 0 | 1;
  className?: string;
}

/** Droppable id for the unscheduled rail (not a day key). */
const UNSCHEDULED_DROPPABLE = "unscheduled";

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

/** A task chip wrapped as a draggable (shared by day cells and the rail). */
const DraggableTaskChip = ({
  task,
  index,
  onSelectTask,
}: {
  task: CalendarTask;
  index: number;
  onSelectTask?: (taskId: string) => void;
}) => (
  // the chip renders a <button> (it is clickable to open the task), and
  // @hello-pangea/dnd refuses to start a drag from an interactive element
  // unless blocking is disabled, so without this the chip never picks up
  <Draggable
    draggableId={task.id}
    index={index}
    disableInteractiveElementBlocking
  >
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
          avatars={task.assignees}
          onClick={() => onSelectTask?.(task.id)}
          title={task.title}
          className={cn(
            task.isDone && "italic line-through opacity-60",
            task.isOverdue && "ring-1 ring-red-400 dark:ring-red-500",
          )}
        >
          {task.title}
        </CalendarItemChip>
      </div>
    )}
  </Draggable>
);

/** A compact month/week switch for the calendar header. */
const RangeToggle = ({
  range,
  onChange,
}: {
  range: CalendarRange;
  onChange: (next: CalendarRange) => void;
}) => (
  <div className="ml-1 inline-flex items-center gap-0.5 rounded-md border p-0.5">
    {(["month", "week"] as const).map((option) => (
      <button
        key={option}
        type="button"
        aria-pressed={range === option}
        onClick={() => onChange(option)}
        className={cn(
          "rounded px-2 py-1 font-medium text-xs capitalize transition-colors",
          range === option
            ? "bg-base-100 text-base-900 dark:bg-base-800 dark:text-base-100"
            : "text-base-500 hover:text-base-800 dark:hover:text-base-200",
        )}
      >
        {option}
      </button>
    ))}
  </div>
);

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
  cellClassName,
}: {
  day: CalendarDay;
  tasks: CalendarTask[];
  onSelectTask?: (taskId: string) => void;
  cellClassName?: string;
}) => {
  const { visibleCount, hiddenCount, hasOverflow, isExpanded, toggle } =
    useDayOverflow({ count: tasks.length });
  const visibleTasks = tasks.slice(0, visibleCount);

  return (
    <Droppable droppableId={day.key}>
      {(dropProvided, dropSnapshot) => (
        <div ref={dropProvided.innerRef} {...dropProvided.droppableProps}>
          <CalendarDayCell
            day={day}
            isOver={dropSnapshot.isDraggingOver}
            className={cellClassName}
          >
            {visibleTasks.map((task, index) => (
              <DraggableTaskChip
                key={task.id}
                task={task}
                index={index}
                onSelectTask={onSelectTask}
              />
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

/** Side rail of undated tasks; drag one onto a day to schedule it, or drag a
 * dated task in here to clear its due date. */
const UnscheduledRail = ({
  tasks,
  onSelectTask,
}: {
  tasks: CalendarTask[];
  onSelectTask?: (taskId: string) => void;
}) => (
  <aside className="w-44 shrink-0">
    <div className="mb-1 px-1 font-medium text-muted-foreground text-xs">
      Unscheduled
    </div>
    <Droppable droppableId={UNSCHEDULED_DROPPABLE}>
      {(dropProvided, dropSnapshot) => (
        <div
          ref={dropProvided.innerRef}
          {...dropProvided.droppableProps}
          className={cn(
            "flex min-h-24 flex-col gap-1 rounded-md border border-dashed p-1",
            dropSnapshot.isDraggingOver && "bg-accent/40",
          )}
        >
          {tasks.map((task, index) => (
            <DraggableTaskChip
              key={task.id}
              task={task}
              index={index}
              onSelectTask={onSelectTask}
            />
          ))}
          {dropProvided.placeholder}
          {tasks.length === 0 && !dropSnapshot.isDraggingOver && (
            <p className="px-1 py-2 text-muted-foreground text-xs">
              Drag a task here to clear its due date.
            </p>
          )}
        </div>
      )}
    </Droppable>
  </aside>
);

/**
 * Month/week calendar of tasks by due date, built on @omnidotdev/cadence
 * (headless grid + drop resolution) and the @omnidotdev/thornberry/calendar
 * primitives (presentational, incl. per-day overflow + chip tint/dots). Drag
 * stays here via @hello-pangea/dnd (same library as the board): each day cell
 * and the optional unscheduled rail are droppables and each chip a draggable; a
 * drop onto a day reschedules, a drop into the rail unschedules.
 */
const CalendarView = ({
  tasks,
  unscheduledTasks,
  onSelectTask,
  onReschedule,
  onUnschedule,
  weekStartsOn = 0,
  className,
}: CalendarViewProps) => {
  const [range, setRange] = useState<CalendarRange>("month");
  const { grid, label, goToPrevious, goToNext, goToToday } = useCalendarView({
    range,
    weekStartsOn,
  });
  const byDay = useMemo(
    () => bucketByDay(tasks, (task) => dueDayKey(task.dueDate)),
    [tasks],
  );

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    if (result.destination.droppableId === UNSCHEDULED_DROPPABLE) {
      onUnschedule?.(result.draggableId);
      return;
    }
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
      >
        <RangeToggle range={range} onChange={setRange} />
      </CalendarHeader>
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="flex gap-3">
          <div className="min-w-0 flex-1">
            {/* close the grid frame on the left/top so it matches the cells'
                own right/bottom borders (otherwise the grid is open on the
                left and top while framed on the right and bottom) */}
            <CalendarWeekdays
              weekStartsOn={weekStartsOn}
              className="border-border border-t border-r border-l"
            />
            <CalendarGrid className="border-border border-l">
              {grid.flat().map((day) => (
                <ProjectCalendarDay
                  key={day.key}
                  day={day}
                  tasks={byDay[day.key] ?? []}
                  onSelectTask={onSelectTask}
                  cellClassName={range === "week" ? "min-h-64" : undefined}
                />
              ))}
            </CalendarGrid>
          </div>
          {unscheduledTasks !== undefined && (
            <UnscheduledRail
              tasks={unscheduledTasks}
              onSelectTask={onSelectTask}
            />
          )}
        </div>
      </DragDropContext>
    </div>
  );
};

export default CalendarView;
