'use client';

import { Draggable } from '@hello-pangea/dnd';
import { AlertCircle, Circle, Clock, CheckCircle2, Rocket, Archive, Calendar, Eye, Tag, AlertTriangle, CircleDot, MinusCircle } from 'lucide-react';
import { Task as TaskType } from '@/types';
import { format } from 'date-fns';

const labelColors: { [key: string]: { bg: string; text: string; border: string; icon: string } } = {
  bug: { bg: 'bg-red-50 dark:bg-red-900/10', text: 'text-red-700 dark:text-red-400', border: 'border-red-500 dark:border-red-400', icon: 'text-red-500' },
  feature: { bg: 'bg-blue-50 dark:bg-blue-900/10', text: 'text-blue-700 dark:text-blue-400', border: 'border-blue-500 dark:border-blue-400', icon: 'text-blue-500' },
  documentation: { bg: 'bg-purple-50 dark:bg-purple-900/10', text: 'text-purple-700 dark:text-purple-400', border: 'border-purple-500 dark:border-purple-400', icon: 'text-purple-500' },
  enhancement: { bg: 'bg-green-50 dark:bg-green-900/10', text: 'text-green-700 dark:text-green-400', border: 'border-green-500 dark:border-green-400', icon: 'text-green-500' },
  design: { bg: 'bg-orange-50 dark:bg-orange-900/10', text: 'text-orange-700 dark:text-orange-400', border: 'border-orange-500 dark:border-orange-400', icon: 'text-orange-500' },
  performance: { bg: 'bg-yellow-50 dark:bg-yellow-900/10', text: 'text-yellow-700 dark:text-yellow-400', border: 'border-yellow-500 dark:border-yellow-400', icon: 'text-yellow-500' },
  data: { bg: 'bg-cyan-50 dark:bg-cyan-900/10', text: 'text-cyan-700 dark:text-cyan-400', border: 'border-cyan-500 dark:border-cyan-400', icon: 'text-cyan-500' },
  ui: { bg: 'bg-pink-50 dark:bg-pink-900/10', text: 'text-pink-700 dark:text-pink-400', border: 'border-pink-500 dark:border-pink-400', icon: 'text-pink-500' },
  content: { bg: 'bg-indigo-50 dark:bg-indigo-900/10', text: 'text-indigo-700 dark:text-indigo-400', border: 'border-indigo-500 dark:border-indigo-400', icon: 'text-indigo-500' },
  seo: { bg: 'bg-teal-50 dark:bg-teal-900/10', text: 'text-teal-700 dark:text-teal-400', border: 'border-teal-500 dark:border-teal-400', icon: 'text-teal-500' },
};

const getColorClasses = (label: string) => {
  return labelColors[label] || { bg: 'bg-gray-50 dark:bg-gray-900/10', text: 'text-gray-700 dark:text-gray-400', border: 'border-gray-700 dark:border-gray-400', icon: 'text-gray-500' };
};

interface TaskProps {
  task: TaskType;
  index: number;
  onClick: () => void;
  columnId: string;
  isProject?: boolean;
  projectPrefix?: string;
}

const columnIcons = {
  'todo': <Clock className="w-4 h-4 text-gray-400 dark:text-gray-500" />,
  'in-progress': <AlertCircle className="w-4 h-4 text-blue-500" />,
  'awaiting-review': <Eye className="w-4 h-4 text-purple-500" />,
  'done': <CheckCircle2 className="w-4 h-4 text-green-500" />,
  'planned': <Rocket className="w-4 h-4 text-purple-500" />,
  'completed': <Archive className="w-4 h-4 text-green-500" />,
  'backlog': <Circle className="w-4 h-4 text-gray-400 dark:text-gray-500" />
};

const priorityConfig = {
  high: { icon: AlertTriangle, className: 'text-red-500 dark:text-red-400' },
  medium: { icon: CircleDot, className: 'text-yellow-500 dark:text-yellow-400' },
  low: { icon: MinusCircle, className: 'text-green-500 dark:text-green-400' }
};

export function Task({ task, index, onClick, columnId, isProject = false, projectPrefix }: TaskProps) {
  const displayId = projectPrefix
    ? `${projectPrefix}-${task.id.split('-').pop() || task.id}`
    : `#${task.id.split('-').pop() || task.id}`;
  const PriorityIcon = priorityConfig[task.priority].icon;

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onClick={onClick}
          className={`p-3 mb-2 rounded-lg bg-white/70 dark:bg-gray-900/70 border border-gray-200/50 dark:border-gray-800/50 cursor-pointer
            ${snapshot.isDragging ? 'shadow-lg ring-2 ring-blue-500 ring-opacity-50' : 'shadow-sm hover:shadow-md'}`}
        >
          <div className="flex flex-col gap-2">
            <div className="flex items-start gap-2">
              <div className="flex-shrink-0 mt-1">
                {columnIcons[columnId as keyof typeof columnIcons]}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-xs font-mono text-gray-400 dark:text-gray-500 flex-shrink-0 font-medium">{displayId}</span>
                  <PriorityIcon className={`w-3 h-3 mb-0.5 ${priorityConfig[task.priority].className} flex-shrink-0`} />
                </div>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100 line-clamp-2 mb-2">{task.content}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {task.assignees.length > 0 && (
                <div className="flex -space-x-2">
                  {task.assignees.map((assignee) => (
                    <div
                      key={assignee.id}
                      className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center text-xs font-medium border-2 border-white dark:border-gray-800 text-gray-900 dark:text-gray-100"
                      title={assignee.name}
                    >
                      {assignee.name[0].toUpperCase()}
                    </div>
                  ))}
                </div>
              )}

              {task.labels && task.labels.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {task.labels.map((label, index) => {
                    const colors = getColorClasses(label);
                    return (
                      <div
                        key={index}
                        className={`flex items-center gap-1 px-1.5 py-0.5 rounded-full border ${colors.border}`}
                      >
                        <Tag className={`w-3 h-3 ${colors.icon}`} />
                        <span className={`text-xs font-medium ${colors.text}`}>
                          {label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}

              {task.dueDate && (
                <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                  <Calendar className="w-3 h-3" />
                  <span>{format(new Date(task.dueDate), 'MMM d')}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
}
