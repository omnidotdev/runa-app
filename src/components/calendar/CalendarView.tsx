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
import { createContext, useContext, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";

import useMounted from "@/lib/hooks/useMounted";
import calendarDropLanding from "@/lib/util/calendarDropLanding";
import { dueDayKey } from "@/lib/util/dueDate";
import { cn } from "@/lib/utils";

import type {
  DraggableStateSnapshot,
  DraggableStyle,
  DropResult,
} from "@hello-pangea/dnd";
import type { CalendarDay } from "@omnidotdev/cadence";
import type {
  CalendarItemAvatar,
  CalendarItemTone,
  CalendarRange,
} from "@omnidotdev/thornberry/calendar";
import type { CSSProperties } from "react";

/** Minimal task shape the calendar renders. */
export interface CalendarTask {
  id: string;
  title: string;
  dueDate?: string | Date | null;
  /** Whether `dueDate` carries a time-of-day (otherwise it is an all-day date). */
  dueHasTime?: boolean | null;
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

/** Chips a day shows before collapsing the rest into "+N more". */
const DAY_MAX_VISIBLE = 3;

/** Viewport point where a dropped chip comes to rest, and whether it lands
 * collapsed behind "+N more" (it fades out there instead of showing). */
interface LandingPoint {
  x: number;
  y: number;
  /** Width of the destination list, so a wide rail chip narrows into a day cell. */
  width: number;
  hidden: boolean;
}

type ResolveLanding = (
  itemId: string,
  droppableId: string,
  chipHeight: number,
) => LandingPoint | null;

/** Resolves where a dropped chip will actually render (see `calendarDropLanding`). */
const LandingContext = createContext<ResolveLanding | null>(null);

/**
 * A chip's drag style, adjusted so a drop settles exactly where the task will
 * render. The drag library animates a drop to its own insertion point (the
 * cursor's row, or the top of the whole cell, over the day badge, for an empty
 * day), but a day lists tasks in board order, so the chip used to settle there
 * and then jump to its real row. Other chips also stay put while dragging over
 * a day: shifting them to open a gap would preview a row the task never takes
 */
const chipStyle = (
  style: DraggableStyle | undefined,
  snapshot: DraggableStateSnapshot,
  resolveLanding: ResolveLanding | null,
  itemId: string,
): CSSProperties | undefined => {
  if (!style) return style;
  if (!snapshot.isDragging) return { ...style, transform: undefined };

  const { dropAnimation, draggingOver } = snapshot;
  if (!dropAnimation || !draggingOver || !resolveLanding || !("top" in style))
    return style;

  const landing = resolveLanding(itemId, draggingOver, style.height);
  if (!landing) return style;

  const { duration, curve } = dropAnimation;
  const transitions = [style.transition, `width ${duration}s ${curve}`];
  if (landing.hidden) transitions.push(`opacity ${duration}s ease-out`);

  return {
    ...style,
    transform: `translate(${landing.x - style.left}px, ${landing.y - style.top}px)`,
    width: landing.width,
    transition: transitions.join(", "),
    ...(landing.hidden && { opacity: 0 }),
  };
};

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
}) => {
  const resolveLanding = useContext(LandingContext);

  return (
    // the chip renders a <button> (it is clickable to open the task), and
    // @hello-pangea/dnd refuses to start a drag from an interactive element
    // unless blocking is disabled, so without this the chip never picks up
    <Draggable
      draggableId={task.id}
      index={index}
      disableInteractiveElementBlocking
    >
      {(dragProvided, dragSnapshot) => {
        const node = (
          <div
            ref={dragProvided.innerRef}
            {...dragProvided.draggableProps}
            {...dragProvided.dragHandleProps}
            style={chipStyle(
              dragProvided.draggableProps.style,
              dragSnapshot,
              resolveLanding,
              task.id,
            )}
            className="outline-none"
          >
            <CalendarItemChip
              isDragging={dragSnapshot.isDragging}
              tone={priorityTone(task.priority)}
              dots={task.labelColors}
              avatars={task.assignees}
              onClick={() => onSelectTask?.(task.id)}
              title={task.title}
              className={cn(
                // the drag library focuses a chip on click/drop, which with a
                // focus ring reads as a stray outline, so suppress the focus
                // outline and ring (the chip opens on click, not a tab target)
                "outline-none focus:outline-none focus-visible:outline-none",
                task.isDone && "italic line-through opacity-60",
                // overdue (past due, not done): red text, not a ring (a ring
                // reads as a stray selection outline around the chip)
                task.isOverdue && "font-medium text-red-600 dark:text-red-400",
              )}
            >
              {task.title}
            </CalendarItemChip>
          </div>
        );

        // While dragging, render the lifted chip into a body-level portal so it
        // escapes the day cell's overflow clipping. This library lifts the item
        // with a transform, and any ancestor with overflow != visible would clip
        // it (snapping it to the cell top), so the portal is what lets the cells
        // scroll AND drag still work. The library keeps the item's size via the
        // dragging style, so it stays the same width in the portal.
        return dragSnapshot.isDragging && typeof document !== "undefined"
          ? createPortal(node, document.body)
          : node;
      }}
    </Draggable>
  );
};

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
    useDayOverflow({ count: tasks.length, maxVisible: DAY_MAX_VISIBLE });
  const visibleTasks = tasks.slice(0, visibleCount);

  return (
    <Droppable droppableId={day.key}>
      {(dropProvided, dropSnapshot) => (
        <div ref={dropProvided.innerRef} {...dropProvided.droppableProps}>
          <CalendarDayCell
            day={day}
            isOver={dropSnapshot.isDraggingOver}
            // keep the day badge from shrinking: while a chip hovers a full day
            // the drag placeholder overflows the fixed-height cell, and a
            // shrinkable badge squeezes 4px, shifting the chip list (a jitter,
            // and the drop would land 4px high)
            className={cn("[&>span]:shrink-0", cellClassName)}
            // read by the drop landing: an expanded day shows every chip
            data-day-expanded={isExpanded || undefined}
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
  <aside className="w-full md:w-44 md:shrink-0">
    <div className="text-muted-foreground mb-1 px-1 text-xs font-medium">
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
            <p className="text-muted-foreground px-1 py-2 text-xs">
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
  // "Today", the visible month, and a timed task's day all depend on the
  // viewer's local time zone, which the server cannot know. Defer bucketing to
  // the client (the grid renders empty until mounted), and remount the grid once
  // mounted (keyed below): hydration does not patch attribute mismatches, so the
  // server's "today" highlight would otherwise stick to the wrong cell whenever
  // the server's date differs from the viewer's (e.g. US evenings vs UTC).
  const mounted = useMounted();
  const byDay = useMemo(
    () =>
      mounted
        ? bucketByDay(tasks, (task) => dueDayKey(task.dueDate, task.dueHasTime))
        : {},
    [tasks, mounted],
  );

  const rootRef = useRef<HTMLDivElement>(null);

  // board order of every task, which is the order a day (and the rail) lists them
  const order = useMemo(
    () => [...tasks, ...(unscheduledTasks ?? [])].map((task) => task.id),
    [tasks, unscheduledTasks],
  );

  const resolveLanding: ResolveLanding = (itemId, droppableId, chipHeight) => {
    const root = rootRef.current;
    if (!root) return null;

    const isRail = droppableId === UNSCHEDULED_DROPPABLE;
    const cell = isRail
      ? null
      : root.querySelector(`[data-cadence-day="${droppableId}"]`);
    // a day cell is its day badge over the chip list (its last child); the
    // rail droppable is the chip list itself
    const list = isRail
      ? root.querySelector(`[data-rfd-droppable-id="${UNSCHEDULED_DROPPABLE}"]`)
      : cell?.lastElementChild;
    if (!(list instanceof HTMLElement)) return null;

    const destination = isRail
      ? (unscheduledTasks ?? [])
      : (byDay[droppableId] ?? []);
    const { slot, hidden } = calendarDropLanding({
      itemId,
      destinationIds: destination.map((task) => task.id),
      order,
      maxVisible:
        isRail || cell?.hasAttribute("data-day-expanded")
          ? null
          : DAY_MAX_VISIBLE,
    });

    const box = list.getBoundingClientRect();
    const css = getComputedStyle(list);
    const gap = Number.parseFloat(css.rowGap) || 0;

    return {
      x:
        box.left +
        Number.parseFloat(css.borderLeftWidth) +
        Number.parseFloat(css.paddingLeft),
      y:
        box.top +
        Number.parseFloat(css.borderTopWidth) +
        Number.parseFloat(css.paddingTop) +
        slot * (chipHeight + gap),
      width:
        list.clientWidth -
        Number.parseFloat(css.paddingLeft) -
        Number.parseFloat(css.paddingRight),
      hidden,
    };
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    if (result.destination.droppableId === UNSCHEDULED_DROPPABLE) {
      // a rail task dropped back on the rail is already unscheduled
      if (result.source.droppableId === UNSCHEDULED_DROPPABLE) return;
      onUnschedule?.(result.draggableId);
      return;
    }
    const drop = resolveCalendarDrop(result);
    if (drop) onReschedule?.(drop.itemId, drop.dayKey);
  };

  return (
    <div
      key={mounted ? "client" : "server"}
      ref={rootRef}
      className={cn("flex flex-col", className)}
      data-calendar-view
    >
      <CalendarHeader
        title={label}
        onPrevious={goToPrevious}
        onNext={goToNext}
        onToday={goToToday}
      >
        <RangeToggle range={range} onChange={setRange} />
      </CalendarHeader>
      <LandingContext.Provider value={resolveLanding}>
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="flex flex-col gap-3 md:flex-row">
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
                    // Fixed-height cells that scroll their items (uniform rows, no
                    // stretching). Safe now that a dragged chip renders in a body
                    // portal (see DraggableTaskChip), so the cell's overflow no
                    // longer clips the lifted item mid-drag
                    cellClassName={
                      range === "week"
                        ? "h-96 overflow-y-auto"
                        : "h-32 overflow-y-auto"
                    }
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
      </LandingContext.Provider>
    </div>
  );
};

export default CalendarView;
