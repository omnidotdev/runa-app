import BoardItemBase from "@/components/projects/BoardItemBase";
import { AvatarFallback, AvatarRoot } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

import type { DemoTask } from "./demoBoardData";

interface Props {
  task: DemoTask;
  index: number;
  displayId: string;
  onSelect: () => void;
  isFirst?: boolean;
}

/**
 * Item on the demo board
 */
const DemoBoardItem = ({
  task,
  index,
  displayId,
  onSelect,
  isFirst,
}: Props) => (
  <BoardItemBase
    draggableId={task.rowId}
    index={index}
    displayId={displayId}
    priority={task.priority}
    isFirst={isFirst}
    onClick={onSelect}
    content={task.content}
    assignees={
      task.assignees.length > 0 ? (
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
      ) : undefined
    }
    labels={
      task.labels.length > 0 ? (
        <div className="flex max-h-5 flex-wrap gap-1 overflow-hidden">
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
      ) : undefined
    }
  />
);

export default DemoBoardItem;
