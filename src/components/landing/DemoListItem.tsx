import { Draggable } from "@hello-pangea/dnd";
import { AvatarFallback, AvatarRoot } from "@omnidotdev/thornberry/avatar";
import { Badge } from "@omnidotdev/thornberry/badge";

import { PriorityIcon } from "@/components/tasks";
import { cn } from "@/lib/utils";

import type { DemoTask } from "./demoBoardData";

interface Props {
  task: DemoTask;
  index: number;
  displayId: string;
  onSelect: () => void;
}

/**
 * List item for the demo board list view.
 */
const DemoListItem = ({ task, index, displayId, onSelect }: Props) => (
  <Draggable draggableId={task.rowId} index={index}>
    {(provided, snapshot) => (
      <div
        ref={provided.innerRef}
        {...provided.draggableProps}
        {...provided.dragHandleProps}
        onClick={() => {
          if (!snapshot.isDragging) {
            onSelect();
          }
        }}
        className={cn(
          "group flex cursor-pointer items-center gap-3 bg-background px-3 py-1.5 last:rounded-b-lg",
          snapshot.isDragging ? "z-10 rounded-md border" : "",
        )}
      >
        {task.priority && (
          <PriorityIcon
            priority={task.priority}
            className="shrink-0 scale-75 opacity-50"
          />
        )}

        <span className="text-base-400 dark:text-base-400 shrink-0 font-mono text-xs">
          {displayId}
        </span>

        <p className="text-foreground min-w-0 flex-1 truncate text-xs">
          {task.content}
        </p>

        {task.labels.length > 0 && (
          <div className="hidden shrink-0 items-center gap-1 sm:flex">
            {task.labels.map((label) => (
              <Badge
                key={label.name}
                variant="outline"
                className="border-0 px-1.5 py-0 text-xs"
                style={{
                  backgroundColor: `${label.color}20`,
                  color: label.color,
                }}
              >
                {label.name}
              </Badge>
            ))}
          </div>
        )}

        <div className="flex shrink-0 items-center gap-1">
          {task.assignees.length > 0 ? (
            <div className="flex -space-x-1">
              {task.assignees.slice(0, 2).map((assignee) => (
                <AvatarRoot
                  key={assignee.name}
                  className="border-background size-6 border-2"
                >
                  <AvatarFallback
                    className="text-xs"
                    style={{
                      backgroundColor: `${assignee.color}20`,
                      color: assignee.color,
                    }}
                  >
                    {assignee.name.charAt(0)}
                  </AvatarFallback>
                </AvatarRoot>
              ))}
              {task.assignees.length > 2 && (
                <AvatarRoot className="border-background size-6 border-2">
                  <AvatarFallback className="bg-base-100 text-base-600 dark:bg-base-800 dark:text-base-400 text-xs">
                    +{task.assignees.length - 2}
                  </AvatarFallback>
                </AvatarRoot>
              )}
            </div>
          ) : (
            <AvatarRoot aria-label="No Assignees" className="size-5.5">
              <AvatarFallback className="border-border text-muted-foreground border border-dashed bg-transparent p-1">
                <span className="text-[10px]">?</span>
              </AvatarFallback>
            </AvatarRoot>
          )}
        </div>
      </div>
    )}
  </Draggable>
);

export default DemoListItem;
