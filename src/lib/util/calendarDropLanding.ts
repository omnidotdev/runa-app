interface CalendarDropLandingArgs {
  /** The dropped task. */
  itemId: string;
  /** Tasks currently rendered in the destination (day or rail), in order. */
  destinationIds: readonly string[];
  /** Board order of every task; a day lists its tasks in this order. */
  order: readonly string[];
  /** Chips a day shows before collapsing into "+N more" (null = uncapped). */
  maxVisible?: number | null;
}

export interface CalendarDropLanding {
  /** Position the task takes in the destination list after the drop. */
  index: number;
  /** Visible row it lands on (the "+N more" row when hidden). */
  slot: number;
  /** Whether it ends up collapsed behind "+N more". */
  hidden: boolean;
}

/**
 * Where a dropped calendar task will actually render.
 *
 * A day lists its tasks in board order, not in drop order, so the drag
 * library's own drop target (the cursor's insertion point, or the top of the
 * whole cell for an empty day) is the wrong place to animate to: the chip
 * would settle there and then jump to its real row. This resolves the real row
 * so the drop animation can land on it
 */
const calendarDropLanding = ({
  itemId,
  destinationIds,
  order,
  maxVisible = 3,
}: CalendarDropLandingArgs): CalendarDropLanding => {
  const rank = (id: string) => {
    const position = order.indexOf(id);
    return position === -1 ? order.length : position;
  };

  const others = destinationIds.filter((id) => id !== itemId);
  const index = others.filter((id) => rank(id) < rank(itemId)).length;
  const total = others.length + 1;

  const hidden =
    maxVisible != null && total > maxVisible && index >= maxVisible;

  return { index, slot: hidden ? maxVisible : index, hidden };
};

export default calendarDropLanding;
