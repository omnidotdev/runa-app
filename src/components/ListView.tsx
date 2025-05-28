import { Calendar, ChevronDown } from 'lucide-react';
import { Project, Task, Column } from '@/types';
import { format } from 'date-fns';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { AlertTriangle, CircleDot, MinusCircle, Tag } from 'lucide-react';

const priorityConfig = {
  high: { icon: AlertTriangle, className: 'text-red-500 dark:text-red-400' },
  medium: { icon: CircleDot, className: 'text-yellow-500 dark:text-yellow-400' },
  low: { icon: MinusCircle, className: 'text-green-500 dark:text-green-400' }
};

interface ListViewProps {
  project: Project;
  expandedSections: { [key: string]: boolean };
  onToggleSection: (columnId: string) => void;
  onTaskClick: (taskId: string) => void;
  onProjectUpdate: (columns: Project['columns']) => void;
  searchQuery: string;
}

export function ListView({
  project,
  expandedSections,
  onToggleSection,
  onTaskClick,
  onProjectUpdate,
  searchQuery,
}: ListViewProps) {
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
    const destTasks = source.droppableId === destination.droppableId
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
        className="p-6 h-full overflow-y-auto custom-scrollbar"
        style={{
          backgroundColor: project.color ? `${project.color}10` : undefined
        }}
      >
      {Object.entries(project.columns).map(([columnId, column]) => {
        const filteredTasks = column.tasks.filter(task =>
          searchQuery ? (
            task.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
            task.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            task.assignees.some(assignee =>
              assignee.name.toLowerCase().includes(searchQuery.toLowerCase())
            )
          ) : true
        );

        if (filteredTasks.length === 0) return null;

        return (
          <div
            key={columnId}
            className="mb-6 last:mb-0 bg-white dark:bg-gray-800 rounded-lg shadow-sm"
          >
            <button
              onClick={() => onToggleSection(columnId)}
              className="w-full flex items-center gap-2 text-left px-4 py-3 rounded-t-lg"
            >
              <ChevronDown className={`w-4 h-4 text-gray-500 dark:text-gray-400 transition-transform ${
                expandedSections[columnId] ? '' : '-rotate-90'
              }`} />
              <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{column.title}</span>
              <span className="text-sm text-gray-500 dark:text-gray-400">{filteredTasks.length}</span>
            </button>

            {expandedSections[columnId] && (
              <Droppable droppableId={columnId}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`rounded-b-lg divide-y divide-gray-200 dark:divide-gray-700 ${
                      snapshot.isDraggingOver ? project.color ? `${project.color}10` : 'bg-blue-50/50 dark:bg-gray-800/50' : ''
                    }`}
                  >
                    {filteredTasks.map((task, index) => (
                      <Draggable key={task.id} draggableId={task.id} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`${snapshot.isDragging ? 'bg-white dark:bg-gray-700 shadow-lg ring-2 ring-blue-500 ring-opacity-50 z-10' : ''}`}
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
}

interface TaskListItemProps {
  task: Task;
  project: Project;
  onClick: () => void;
}

function TaskListItem({ task, project, onClick }: TaskListItemProps) {
  const PriorityIcon = priorityConfig[task.priority].icon;
  const displayId = task.id.split('-').pop() || task.id;

  return (
    <div
      onClick={onClick}
      className="flex items-start px-4 py-3 cursor-pointer bg-gray-50/70 dark:bg-gray-900/70 hover:bg-gray-100/50 dark:hover:bg-gray-900/80"
    >
      <div className="flex gap-2 flex-1 min-w-0">
        <span className="text-xs font-mono text-gray-400 dark:text-gray-500 font-medium flex-shrink-0">
          {project.prefix ? `${project.prefix}-${displayId}` : `#${displayId}`}
        </span>
        <PriorityIcon className={`w-4 h-4 ${priorityConfig[task.priority].className} flex-shrink-0`} />
        <div className="flex-1 min-w-0 -mt-0.5">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-900 dark:text-gray-100 font-medium truncate">
              {task.content}
            </span>
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {task.description || 'No description provided'}
          </div>
          <div className="flex items-center gap-1 mt-3 flex-wrap">
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
                      className={`flex items-center gap-1 px-1.5 py-0.5 rounded-full ${colors.bg}`}
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
                <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 ml-2">
                  <Calendar className="w-3 h-3" />
                  <span>{format(new Date(task.dueDate), 'MMM d')}</span>
                </div>
              )}
          </div>
        </div>
      </div>
    </div>
  );
}

const getColorClasses = (label: string) => {
  const labelColors: { [key: string]: { bg: string; text: string; icon: string } } = {
    bug: { bg: 'bg-red-50 dark:bg-red-900/30', text: 'text-red-700 dark:text-red-400', icon: 'text-red-500' },
    feature: { bg: 'bg-blue-50 dark:bg-blue-900/30', text: 'text-blue-700 dark:text-blue-400', icon: 'text-blue-500' },
    documentation: { bg: 'bg-purple-50 dark:bg-purple-900/30', text: 'text-purple-700 dark:text-purple-400', icon: 'text-purple-500' },
    enhancement: { bg: 'bg-green-50 dark:bg-green-900/30', text: 'text-green-700 dark:text-green-400', icon: 'text-green-500' },
    design: { bg: 'bg-orange-50 dark:bg-orange-900/30', text: 'text-orange-700 dark:text-orange-400', icon: 'text-orange-500' },
    performance: { bg: 'bg-yellow-50 dark:bg-yellow-900/30', text: 'text-yellow-700 dark:text-yellow-400', icon: 'text-yellow-500' },
    data: { bg: 'bg-cyan-50 dark:bg-cyan-900/30', text: 'text-cyan-700 dark:text-cyan-400', icon: 'text-cyan-500' },
    ui: { bg: 'bg-pink-50 dark:bg-pink-900/30', text: 'text-pink-700 dark:text-pink-400', icon: 'text-pink-500' },
    content: { bg: 'bg-indigo-50 dark:bg-indigo-900/30', text: 'text-indigo-700 dark:text-indigo-400', icon: 'text-indigo-500' },
    seo: { bg: 'bg-teal-50 dark:bg-teal-900/30', text: 'text-teal-700 dark:text-teal-400', icon: 'text-teal-500' },
  };
  return labelColors[label] || { bg: 'bg-gray-50 dark:bg-gray-900/30', text: 'text-gray-700 dark:text-gray-400', icon: 'text-gray-500' };
};
