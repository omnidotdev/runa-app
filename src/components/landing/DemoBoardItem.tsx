import { Draggable } from "@hello-pangea/dnd";

import { PriorityIcon } from "@/components/tasks";
import { AvatarFallback, AvatarRoot } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

import type { DemoTask } from "./demoBoardData";

interface Props {
  task: DemoTask;
  index: number;
  onSelect: () => void;
}

/**
 * Item on the demo board.
 */
const DemoBoardItem = ({ task, index, onSelect }: Props) => (
  <Draggable draggableId={task.rowId} index={index}>
    {(provided, snapshot) => (
      <div
        ref={provided.innerRef}
        {...provided.draggableProps}
        {...provided.dragHandleProps}
        style={{
          ...provided.draggableProps.style,
          opacity: snapshot.isDragging ? 1 : undefined,
        }}
        onClick={() => {
          if (!snapshot.isDragging) {
            onSelect();
          }
        }}
        className={cn(
          "mb-2 h-[140px] cursor-pointer rounded-lg border bg-background p-3 outline-hidden dark:border-border",
          snapshot.isDragging
            ? "cursor-grabbing shadow-xl ring-2 ring-primary-500/30"
            : "hover:shadow-sm dark:shadow-gray-400/10",
        )}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-start gap-2">
            <div className="mt-0.5 min-w-0 flex-1">
              <div className="flex items-center gap-2">
                {task.priority && (
                  <PriorityIcon
                    priority={task.priority}
                    className="size-2.5 shrink-0 opacity-60"
                  />
                )}
              </div>

              <p className="line-clamp-2 py-2 text-foreground text-xs">
                {task.content}
              </p>
            </div>

            {task.assignees.length > 0 && (
              <div className="flex -space-x-1">
                {task.assignees.slice(0, 2).map((assignee) => (
                  <AvatarRoot
                    key={assignee.name}
                    className="size-6 border-2 border-background"
                  >
                    <AvatarFallback className="bg-primary-100 text-primary-700 text-xs dark:bg-primary-900 dark:text-primary-300">
                      {assignee.name.charAt(0)}
                    </AvatarFallback>
                  </AvatarRoot>
                ))}
                {task.assignees.length > 2 && (
                  <AvatarRoot className="size-6 border-2 border-background">
                    <AvatarFallback className="bg-base-100 text-base-600 text-xs dark:bg-base-800 dark:text-base-400">
                      +{task.assignees.length - 2}
                    </AvatarFallback>
                  </AvatarRoot>
                )}
              </div>
            )}
          </div>

          {task.labels.length > 0 && (
            <div className="mt-auto flex max-h-[20px] flex-wrap gap-1 overflow-hidden">
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
        </div>
      </div>
    )}
  </Draggable>
);

export default DemoBoardItem;
