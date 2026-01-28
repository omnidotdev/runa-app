import { Draggable } from "@hello-pangea/dnd";

import { PriorityIcon } from "@/components/tasks";
import { cn } from "@/lib/utils";

import type { ReactNode } from "react";
import type { TaskFragment } from "@/generated/graphql";

interface Props {
  draggableId: string;
  index: number;
  displayId: string;
  priority?: TaskFragment["priority"] | null;
  content: ReactNode;
  assignees?: ReactNode;
  labels?: ReactNode;
  footer?: ReactNode;
  isFirst?: boolean;
  onClick?: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  onFocus?: () => void;
  onBlur?: () => void;
  onKeyDown?: (evt: React.KeyboardEvent) => void;
}

/**
 * Shared base component for board items (main app and demo)
 */
const BoardItemBase = ({
  draggableId,
  index,
  displayId,
  priority,
  content,
  assignees,
  labels,
  footer,
  isFirst,
  onClick,
  onMouseEnter,
  onMouseLeave,
  onFocus,
  onBlur,
  onKeyDown,
}: Props) => (
  <Draggable draggableId={draggableId} index={index}>
    {(provided, snapshot) => (
      <div
        ref={provided.innerRef}
        {...provided.draggableProps}
        {...provided.dragHandleProps}
        style={{
          ...provided.draggableProps.style,
          opacity: snapshot.isDragging ? 1 : undefined,
        }}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onFocus={onFocus}
        onBlur={onBlur}
        onKeyDown={onKeyDown}
        onClick={() => {
          if (!snapshot.isDragging) {
            onClick?.();
          }
        }}
        className={cn(
          "mb-2 h-35 shrink-0 cursor-pointer overflow-hidden border bg-background p-3 outline-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background dark:border-border",
          isFirst ? "rounded-xl" : "rounded-lg",
          snapshot.isDragging
            ? "cursor-grabbing shadow-xl ring-2 ring-primary-500/30"
            : "hover:shadow-sm dark:shadow-gray-400/10",
        )}
      >
        <div className="flex h-full flex-col overflow-hidden">
          <div className="flex items-start gap-2">
            <div className="mt-0.5 min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                {priority && (
                  <PriorityIcon
                    priority={priority}
                    className="size-2.5 shrink-0 opacity-60"
                  />
                )}
                <span className="shrink-0 font-medium font-mono text-base-400 text-xs dark:text-base-400">
                  {displayId}
                </span>
              </div>

              <div className="line-clamp-2 py-2 text-foreground text-xs">
                {content}
              </div>
            </div>

            {assignees}
          </div>

          <div className="mt-auto flex items-end justify-between gap-2">
            {labels}
            {footer}
          </div>
        </div>
      </div>
    )}
  </Draggable>
);

export default BoardItemBase;
