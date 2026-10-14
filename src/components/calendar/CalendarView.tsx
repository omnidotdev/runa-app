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
import { useMemo } from "react";

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

/**
 * Month calendar of tasks by due date, built on @omnidotdev/cadence (headless
 * grid + drop resolution) and the @omnidotdev/thornberry/calendar primitives
 * (presentational). Drag-to-reschedule stays here via @hello-pangea/dnd (same
 * library as the board): each day cell is a droppable keyed by its day key and
 * each chip a draggable; a drop resolves through cadence's resolveCalendarDrop.
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
                    {(byDay[day.key] ?? []).map((task, index) => (
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
                            >
                              {task.title}
                            </CalendarItemChip>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {dropProvided.placeholder}
                  </CalendarDayCell>
                </div>
              )}
            </Droppable>
          ))}
        </CalendarGrid>
      </DragDropContext>
    </div>
  );
};

export default CalendarView;
