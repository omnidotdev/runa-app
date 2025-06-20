import { Draggable, Droppable } from "@hello-pangea/dnd";
import { Plus, Trash2 } from "lucide-react";

import Task from "@/components/Task";

import type { Column as ColumnType } from "@/types";

interface ColumnProps {
  column: ColumnType;
  index: number;
  onTaskClick: (taskId: string) => void;
  onAddClick: () => void;
  onDeleteClick?: (columnId: string) => void;
  isProjectView?: boolean;
  projectPrefix?: string;
  projectColor?: string;
}

const defaultColumns = [
  "backlog",
  "todo",
  "in-progress",
  "awaiting-review",
  "done",
];
const overviewColumns = ["planned", "in-progress", "completed"];

const Column = ({
  column,
  index,
  onTaskClick,
  onAddClick,
  onDeleteClick,
  isProjectView = false,
  projectPrefix,
  projectColor,
}: ColumnProps) => {
  const isDefaultColumn = isProjectView
    ? overviewColumns.includes(column.id)
    : defaultColumns.includes(column.id);

  return (
    <Draggable draggableId={column.id} index={index} isDragDisabled={true}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className="flex w-[320px] flex-shrink-0 flex-col rounded-md bg-neutral-50/60 dark:bg-neutral-950/10"
        >
          <div className="mb-3 flex items-center justify-between px-3 pt-3">
            <div className="flex items-center gap-2">
              <h2 className="font-semibold text-gray-900 text-sm dark:text-gray-100">
                {column.title}
              </h2>
              <span className="text-gray-500 text-xs dark:text-gray-400">
                {column.tasks.length}
              </span>
            </div>
            <div className="flex items-center gap-1">
              {!isDefaultColumn && onDeleteClick && (
                <button
                  type="button"
                  onClick={() => onDeleteClick(column.id)}
                  className="rounded-md p-1 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <Trash2 className="h-4 w-4 text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400" />
                </button>
              )}
              <button
                type="button"
                onClick={onAddClick}
                className="rounded-md p-1 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <Plus className="h-4 w-4 text-gray-500 dark:text-gray-400" />
              </button>
            </div>
          </div>

          <Droppable droppableId={column.id}>
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className={`flex-1 rounded-b-md px-3 py-2 ${
                  snapshot.isDraggingOver
                    ? projectColor
                      ? "bg-white/5 dark:bg-white/10"
                      : "bg-primary-50/50 dark:bg-gray-800/50"
                    : ""
                }`}
                style={{
                  minHeight: "4px", // Ensures minimum height for drop target
                  ...(snapshot.isDraggingOver && projectColor
                    ? {
                        backgroundColor: `${projectColor}20`,
                      }
                    : {}),
                }}
              >
                {column.tasks.map((task, index) => (
                  <Task
                    key={task.id}
                    task={task}
                    index={index}
                    onClick={() => onTaskClick(task.id)}
                    columnId={column.id}
                    isProject={isProjectView}
                    projectPrefix={projectPrefix}
                  />
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </div>
      )}
    </Draggable>
  );
};

export default Column;
