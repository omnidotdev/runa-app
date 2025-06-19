import { Draggable } from "@hello-pangea/dnd";
import { format } from "date-fns";
import {
  AlertCircle,
  AlertTriangle,
  Archive,
  Calendar,
  CheckCircle2,
  Circle,
  CircleDot,
  Clock,
  Eye,
  MinusCircle,
  Rocket,
  Tag,
} from "lucide-react";

import type { Task as TaskType } from "@/types";

const getColorClasses = (label: string) => {
  const labelColors: {
    [key: string]: { bg: string; text: string; icon: string };
  } = {
    bug: {
      bg: "bg-red-50 dark:bg-red-900/30",
      text: "text-red-700 dark:text-red-400",
      icon: "text-red-500",
    },
    feature: {
      bg: "bg-primary-50 dark:bg-primary-900/30",
      text: "text-primary-700 dark:text-primary-400",
      icon: "text-primary-500",
    },
    documentation: {
      bg: "bg-purple-50 dark:bg-purple-900/30",
      text: "text-purple-700 dark:text-purple-400",
      icon: "text-purple-500",
    },
    enhancement: {
      bg: "bg-green-50 dark:bg-green-900/30",
      text: "text-green-700 dark:text-green-400",
      icon: "text-green-500",
    },
    design: {
      bg: "bg-orange-50 dark:bg-orange-900/30",
      text: "text-orange-700 dark:text-orange-400",
      icon: "text-orange-500",
    },
    performance: {
      bg: "bg-yellow-50 dark:bg-yellow-900/30",
      text: "text-yellow-700 dark:text-yellow-400",
      icon: "text-yellow-500",
    },
    data: {
      bg: "bg-cyan-50 dark:bg-cyan-900/30",
      text: "text-cyan-700 dark:text-cyan-400",
      icon: "text-cyan-500",
    },
    ui: {
      bg: "bg-pink-50 dark:bg-pink-900/30",
      text: "text-pink-700 dark:text-pink-400",
      icon: "text-pink-500",
    },
    content: {
      bg: "bg-indigo-50 dark:bg-indigo-900/30",
      text: "text-indigo-700 dark:text-indigo-400",
      icon: "text-indigo-500",
    },
    seo: {
      bg: "bg-teal-50 dark:bg-teal-900/30",
      text: "text-teal-700 dark:text-teal-400",
      icon: "text-teal-500",
    },
  };
  return (
    labelColors[label] || {
      bg: "bg-gray-50 dark:bg-gray-900/30",
      text: "text-gray-700 dark:text-gray-400",
      icon: "text-gray-500",
    }
  );
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
  todo: <Clock className="h-4 w-4 text-gray-400 dark:text-gray-500" />,
  "in-progress": <AlertCircle className="h-4 w-4 text-primary-500" />,
  "awaiting-review": <Eye className="h-4 w-4 text-purple-500" />,
  done: <CheckCircle2 className="h-4 w-4 text-green-500" />,
  planned: <Rocket className="h-4 w-4 text-purple-500" />,
  completed: <Archive className="h-4 w-4 text-green-500" />,
  backlog: <Circle className="h-4 w-4 text-gray-400 dark:text-gray-500" />,
};

const priorityConfig = {
  high: { icon: AlertTriangle, className: "text-red-500 dark:text-red-400" },
  medium: {
    icon: CircleDot,
    className: "text-yellow-500 dark:text-yellow-400",
  },
  low: { icon: MinusCircle, className: "text-green-500 dark:text-green-400" },
};

const Task = ({ task, index, onClick, columnId, projectPrefix }: TaskProps) => {
  const displayId = projectPrefix
    ? `${projectPrefix}-${task.id.split("-").pop() || task.id}`
    : `#${task.id.split("-").pop() || task.id}`;
  const PriorityIcon = priorityConfig[task.priority].icon;

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onClick={onClick}
          className={`mb-2 cursor-pointer rounded-lg border border-gray-200/50 bg-white/70 p-3 dark:border-gray-800/50 dark:bg-gray-900/70 ${snapshot.isDragging ? "shadow-lg ring-2 ring-primary-500 ring-opacity-50" : "shadow-sm hover:shadow-md"}`}
        >
          <div className="flex flex-col gap-2">
            <div className="flex items-start gap-2">
              <div className="flex-shrink-0">
                {columnIcons[columnId as keyof typeof columnIcons]}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="flex-shrink-0 font-medium font-mono text-gray-400 text-xs dark:text-gray-500">
                    {displayId}
                  </span>
                  <PriorityIcon
                    className={`h-4 w-4 ${priorityConfig[task.priority].className} flex-shrink-0`}
                  />
                </div>
                <p className="my-2 line-clamp-2 font-medium text-gray-900 text-sm dark:text-gray-100">
                  {task.content}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                {task.assignees.length > 0 && (
                  <div className="-space-x-2 flex">
                    {task.assignees.map((assignee) => (
                      <div
                        key={assignee.id}
                        className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-gray-200 font-medium text-gray-900 text-xs dark:border-gray-800 dark:bg-gray-600 dark:text-gray-100"
                        title={assignee.name}
                      >
                        {assignee.name[0].toUpperCase()}
                      </div>
                    ))}
                  </div>
                )}

                {task.labels && task.labels.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {task.labels.map((label) => {
                      const colors = getColorClasses(label);
                      return (
                        <div
                          key={label}
                          className={`flex items-center gap-1 rounded-full px-1.5 py-0.5 ${colors.bg}`}
                        >
                          <Tag className={`h-3 w-3 ${colors.icon}`} />
                          <span
                            className={`font-medium text-xs ${colors.text}`}
                          >
                            {label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {task.dueDate && (
                <div className="mr-1 flex items-center gap-1 text-gray-500 text-xs dark:text-gray-400">
                  <Calendar className="h-3 w-3" />
                  <span>{format(new Date(task.dueDate), "MMM d")}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default Task;
