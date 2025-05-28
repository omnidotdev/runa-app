'use client';

import { Draggable, Droppable } from '@hello-pangea/dnd';
import { Plus, Trash2 } from 'lucide-react';
import { Task } from './Task';
import { Column as ColumnType } from '@/types';

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

const defaultColumns = ['backlog', 'todo', 'in-progress', 'awaiting-review', 'done'];
const overviewColumns = ['planned', 'in-progress', 'completed'];

export function Column({
  column,
  index,
  onTaskClick,
  onAddClick,
  onDeleteClick,
  isProjectView = false,
  projectPrefix,
  projectColor,
}: ColumnProps) {
  const isDefaultColumn = isProjectView
    ? overviewColumns.includes(column.id)
    : defaultColumns.includes(column.id);

  return (
    <Draggable draggableId={column.id} index={index} isDragDisabled={true}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className="flex-shrink-0 w-[320px] flex flex-col bg-neutral-50/30 dark:bg-neutral-950/10 rounded-md"
        >
          <div className="mb-3 flex items-center justify-between px-3 pt-3">
            <div className="flex items-center gap-2">
              <h2 className="font-semibold text-sm text-gray-900 dark:text-gray-100">{column.title}</h2>
              <span className="text-xs text-gray-500 dark:text-gray-400">{column.tasks.length}</span>
            </div>
            <div className="flex items-center gap-1">
              {!isDefaultColumn && onDeleteClick && (
                <button
                  onClick={() => onDeleteClick(column.id)}
                  className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                >
                  <Trash2 className="w-4 h-4 text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400" />
                </button>
              )}
              <button
                onClick={onAddClick}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
              >
                <Plus className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              </button>
            </div>
          </div>

          <Droppable droppableId={column.id}>
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className={`flex-1 px-3 py-2 rounded-b-md ${
                  snapshot.isDraggingOver
                    ? projectColor
                      ? 'bg-white/5 dark:bg-white/10'
                      : 'bg-blue-50/50 dark:bg-gray-800/50'
                    : ''
                }`}
                style={{
                  minHeight: '4px', // Ensures minimum height for drop target
                  ...(snapshot.isDraggingOver && projectColor ? {
                    backgroundColor: `${projectColor}20`,
                  } : {}),
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
}
