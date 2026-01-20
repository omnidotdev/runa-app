/**
 * Shared styles and constants for board components.
 * Used across project boards, overview boards, and demo boards.
 */

/** Board container styles */
export const boardContainerStyles = {
  base: "custom-scrollbar h-full cursor-grab select-none overflow-x-auto",
  background: "bg-primary-100/30 dark:bg-primary-950/15",
} as const;

/** Board column styles */
export const boardColumnStyles = {
  wrapper: "relative flex h-full w-[320px] flex-col gap-2",
  droppable: "flex flex-1 flex-col rounded-xl",
  droppableActive: "bg-primary-100/40 dark:bg-primary-950/40",
  itemsContainer: "no-scrollbar flex h-full flex-col overflow-y-auto",
} as const;

/** Board layout styles */
export const boardLayoutStyles = {
  columnsGap: "flex h-full gap-3",
  innerPadding: "h-full min-w-fit p-4",
} as const;
