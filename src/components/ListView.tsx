import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import { format } from "date-fns";
import {
  AlertTriangle,
  Calendar,
  ChevronDown,
  CircleDot,
  MinusCircle,
  Tag,
} from "lucide-react";

import type { DropResult } from "@hello-pangea/dnd";
import type { Project, Task } from "@/types";

const priorityConfig = {
  high: { icon: AlertTriangle, className: "text-red-500 dark:text-red-400" },
  medium: {
    icon: CircleDot,
    className: "text-yellow-500 dark:text-yellow-400",
  },
  low: { icon: MinusCircle, className: "text-green-500 dark:text-green-400" },
};

interface ListViewProps {
  project: Project;
  expandedSections: { [key: string]: boolean };
  onToggleSection: (columnId: string) => void;
  onTaskClick: (taskId: string) => void;
  onProjectUpdate: (columns: Project["columns"]) => void;
  searchQuery: string;
}

const ListView = ({
  project,
  expandedSections,
  onToggleSection,
  onTaskClick,
  onProjectUpdate,
  searchQuery,
}: ListViewProps) => {
  const onDragEnd = (result: DropResult) => {
    const { destination, source } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const sourceColumn = project.columns[source.droppableId];
    const destColumn = project.columns[destination.droppableId];
    const sourceTasks = [...sourceColumn.tasks];
    const destTasks =
      source.droppableId === destination.droppableId
        ? sourceTasks
        : [...destColumn.tasks];

    const [removed] = sourceTasks.splice(source.index, 1);
    destTasks.splice(destination.index, 0, removed);

    onProjectUpdate({
      ...project.columns,
      [source.droppableId]: {
        ...sourceColumn,
        tasks: sourceTasks,
      },
      [destination.droppableId]: {
        ...destColumn,
        tasks: destTasks,
      },
    });
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div
        className="custom-scrollbar h-full overflow-y-auto p-6"
        style={{
          backgroundColor: project.color ? `${project.color}10` : undefined,
        }}
      >
        {Object.entries(project.columns).map(([columnId, column]) => {
          const filteredTasks = column.tasks.filter((task) =>
            searchQuery
              ? task.content
                  .toLowerCase()
                  .includes(searchQuery.toLowerCase()) ||
                task.description
                  .toLowerCase()
                  .includes(searchQuery.toLowerCase()) ||
                task.assignees.some((assignee) =>
                  assignee.name
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase()),
                )
              : true,
          );

          if (filteredTasks.length === 0) return null;

          return (
            <div
              key={columnId}
              className="mb-6 rounded-lg bg-white shadow-sm last:mb-0 dark:bg-base-800"
            >
              <button
                type="button"
                onClick={() => onToggleSection(columnId)}
                className="flex w-full items-center gap-2 rounded-t-lg px-4 py-3 text-left"
              >
                <ChevronDown
                  className={`h-4 w-4 text-base-500 transition-transform dark:text-base-400 ${
                    expandedSections[columnId] ? "" : "-rotate-90"
                  }`}
                />
                <span className="font-medium text-base-900 text-sm dark:text-base-100">
                  {column.title}
                </span>
                <span className="text-base-500 text-sm dark:text-base-400">
                  {filteredTasks.length}
                </span>
              </button>

              {expandedSections[columnId] && (
                <Droppable droppableId={columnId}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`divide-y divide-base-200 rounded-b-lg dark:divide-base-700 ${
                        snapshot.isDraggingOver
                          ? project.color
                            ? `${project.color}10`
                            : "bg-primary-50/50 dark:bg-base-800/50"
                          : ""
                      }`}
                    >
                      {filteredTasks.map((task, index) => (
                        <Draggable
                          key={task.id}
                          draggableId={task.id}
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`${snapshot.isDragging ? "z-10 bg-white shadow-lg ring-2 ring-primary-500 ring-opacity-50 dark:bg-base-700" : ""}`}
                            >
                              <TaskListItem
                                task={task}
                                project={project}
                                onClick={() => onTaskClick(task.id)}
                              />
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              )}
            </div>
          );
        })}
      </div>
    </DragDropContext>
  );
};

interface TaskListItemProps {
  task: Task;
  project: Project;
  onClick: () => void;
}

const TaskListItem = ({ task, project, onClick }: TaskListItemProps) => {
  const PriorityIcon = priorityConfig[task.priority].icon;
  const displayId = task.id.split("-").pop() || task.id;

  return (
    <div
      onClick={onClick}
      className="flex cursor-pointer items-start bg-base-50/70 px-4 py-3 hover:bg-base-100/50 dark:bg-base-900/70 dark:hover:bg-base-900/80"
    >
      <div className="flex min-w-0 flex-1 gap-2">
        <span className="flex-shrink-0 font-medium font-mono text-base-400 text-xs dark:text-base-500">
          {project.prefix ? `${project.prefix}-${displayId}` : `#${displayId}`}
        </span>
        <PriorityIcon
          className={`h-4 w-4 ${priorityConfig[task.priority].className} flex-shrink-0`}
        />
        <div className="-mt-0.5 min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="truncate font-medium text-base-900 text-sm dark:text-base-100">
              {task.content}
            </span>
          </div>
          <div className="mt-1 text-base-500 text-sm dark:text-base-400">
            {task.description || "No description provided"}
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-1">
            {task.assignees.length > 0 && (
              <div className="-space-x-2 flex">
                {task.assignees.map((assignee) => (
                  <div
                    key={assignee.id}
                    className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-base-200 font-medium text-base-900 text-xs dark:border-base-800 dark:bg-base-600 dark:text-base-100"
                    title={assignee.name}
                  >
                    {assignee.name[0].toUpperCase()}
                  </div>
                ))}
              </div>
            )}
            {!!task.labels?.length && (
              <div className="flex flex-wrap gap-1">
                {task.labels.map((label) => {
                  const colors = getColorClasses(label);
                  return (
                    <div
                      key={label}
                      className={`flex items-center gap-1 rounded-full px-1.5 py-0.5 ${colors.bg}`}
                    >
                      <Tag className={`h-3 w-3 ${colors.icon}`} />
                      <span className={`font-medium text-xs ${colors.text}`}>
                        {label}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
            {task.dueDate && (
              <div className="ml-2 flex items-center gap-1 text-base-500 text-xs dark:text-base-400">
                <Calendar className="h-3 w-3" />
                <span>{format(new Date(task.dueDate), "MMM d")}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

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
      bg: "bg-base-50 dark:bg-base-900/30",
      text: "text-base-700 dark:text-base-400",
      icon: "text-base-500",
    }
  );
};

export default ListView;
