import { Draggable } from "@hello-pangea/dnd";

import { PriorityIcon } from "@/components/tasks";
import { AvatarFallback, AvatarRoot } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
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
          "group flex cursor-pointer flex-col gap-2 bg-background px-4 py-3 last:rounded-b-lg",
          snapshot.isDragging ? "z-10 rounded-md border" : "",
        )}
      >
        <div className="flex items-center">
          <div className="flex flex-col">
            <div className="flex items-center gap-2 text-base-400 text-xs dark:text-base-400">
              <span className="font-mono">{displayId}</span>
              {task.priority && (
                <PriorityIcon
                  priority={task.priority}
                  className="scale-75 opacity-50"
                />
              )}
            </div>

            <p className="py-2 text-foreground text-xs">{task.content}</p>
          </div>

          <div className="-mt-6 ml-auto flex items-center gap-1">
            {task.assignees.length > 0 ? (
              <div className="flex -space-x-1">
                {task.assignees.slice(0, 2).map((assignee) => (
                  <AvatarRoot
                    key={assignee.name}
                    className="size-6 border-2 border-background"
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
                  <AvatarRoot className="size-6 border-2 border-background">
                    <AvatarFallback className="bg-base-100 text-base-600 text-xs dark:bg-base-800 dark:text-base-400">
                      +{task.assignees.length - 2}
                    </AvatarFallback>
                  </AvatarRoot>
                )}
              </div>
            ) : (
              <AvatarRoot aria-label="No Assignees" className="size-5.5">
                <AvatarFallback className="border border-border border-dashed bg-transparent p-1 text-muted-foreground">
                  <span className="text-[10px]">?</span>
                </AvatarFallback>
              </AvatarRoot>
            )}
          </div>
        </div>

        {task.labels.length > 0 && (
          <div className="flex items-center justify-between">
            <div className="flex flex-wrap gap-1">
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
          </div>
        )}
      </div>
    )}
  </Draggable>
);

export default DemoListItem;
