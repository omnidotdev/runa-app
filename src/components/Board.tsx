import { DragDropContext, Droppable } from "@hello-pangea/dnd";
import { useEffect, useRef, useState } from "react";

import Column from "@/components/Column";
import ConfirmDialog from "@/components/ConfirmDialog";
import TaskDialog from "@/components/TaskDialog";

import type { DropResult } from "@hello-pangea/dnd";
import type { Project, Task } from "@/types";

interface BoardProps {
  project: Project;
  onProjectUpdate: (columns: Project["columns"]) => void;
  isProjectView?: boolean;
}

const Board = ({
  project,
  onProjectUpdate,
  isProjectView = false,
}: BoardProps) => {
  const [selectedTask, setSelectedTask] = useState<string | null>(null);
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newTaskColumn, setNewTaskColumn] = useState<string | null>(null);
  const [columnToDelete, setColumnToDelete] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const isMouseDown = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    // Don't initiate board scroll if clicking on interactive elements
    const target = e.target as HTMLElement;
    if (
      target.closest("[data-rbd-draggable-id]") || // Draggable elements
      target.closest("button") || // Buttons
      target.closest("input") || // Input fields
      target.closest("[data-rbd-droppable-id]") || // Droppable areas
      target.closest('[role="dialog"]') // Dialog content
    ) {
      return;
    }

    isMouseDown.current = true;
    startX.current = e.pageX;
    scrollLeft.current = containerRef.current?.scrollLeft || 0;
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isMouseDown.current || isDragging.current || !containerRef.current)
        return;

      e.preventDefault();
      const dx = e.pageX - startX.current;
      containerRef.current.scrollLeft = scrollLeft.current - dx;
    };

    const handleMouseUp = () => {
      isMouseDown.current = false;
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  const onDragStart = () => {
    isDragging.current = true;
  };

  const onDragEnd = (result: DropResult) => {
    isDragging.current = false;

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

  const handleDeleteColumn = (columnId: string) => {
    const columnCount = Object.keys(project.columns).length;
    if (columnCount <= 1) {
      alert("Cannot delete the last column");
      setColumnToDelete(null);
      return;
    }

    // Get all tasks from the column being deleted
    const tasksToMove = project.columns[columnId].tasks;

    // Create new columns object without the deleted column
    const { [columnId]: _deletedColumn, ...remainingColumns } = project.columns;

    // If there are tasks in the deleted column, move them to the first remaining column
    if (tasksToMove.length > 0) {
      const firstColumnId = Object.keys(remainingColumns)[0];
      remainingColumns[firstColumnId] = {
        ...remainingColumns[firstColumnId],
        tasks: [...remainingColumns[firstColumnId].tasks, ...tasksToMove],
      };
    }

    // Update the project with the new columns structure
    onProjectUpdate(remainingColumns);
    setColumnToDelete(null);
  };

  const getTaskById = (taskId: string) => {
    for (const column of Object.values(project.columns)) {
      const task = column.tasks.find((t) => t.id === taskId);
      if (task) return task;
    }
    return null;
  };

  const handleAddTask = (columnId: string, task: Task) => {
    const column = project.columns[columnId];
    onProjectUpdate({
      ...project.columns,
      [columnId]: {
        ...column,
        tasks: [...column.tasks, task],
      },
    });
  };

  const handleUpdateTask = (task: Task) => {
    for (const columnId in project.columns) {
      const column = project.columns[columnId];
      const taskIndex = column.tasks.findIndex((t) => t.id === task.id);
      if (taskIndex !== -1) {
        const updatedTasks = [...column.tasks];
        updatedTasks[taskIndex] = task;
        onProjectUpdate({
          ...project.columns,
          [columnId]: {
            ...column,
            tasks: updatedTasks,
          },
        });
        break;
      }
    }
  };

  const handleDeleteTask = (columnId: string, taskId: string) => {
    const column = project.columns[columnId];
    onProjectUpdate({
      ...project.columns,
      [columnId]: {
        ...column,
        tasks: column.tasks.filter((t) => t.id !== taskId),
      },
    });
    setSelectedTask(null);
  };

  return (
    <div
      ref={containerRef}
      className="custom-scrollbar h-full select-none overflow-x-auto"
      onMouseDown={handleMouseDown}
      style={
        project.color
          ? {
              backgroundColor: `${project.color}12`,
            }
          : {}
      }
    >
      <div className="h-full min-w-fit px-4 py-4">
        <DragDropContext onDragStart={onDragStart} onDragEnd={onDragEnd}>
          <Droppable droppableId="board" direction="horizontal" type="column">
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="flex h-full gap-3"
              >
                {Object.entries(project.columns).map(
                  ([columnId, column], index) => (
                    <Column
                      key={columnId}
                      column={column}
                      index={index}
                      onTaskClick={(taskId) => setSelectedTask(taskId)}
                      onAddClick={() => {
                        setIsAddingTask(true);
                        setNewTaskColumn(columnId);
                      }}
                      onDeleteClick={(columnId) => setColumnToDelete(columnId)}
                      isProjectView={isProjectView}
                      projectPrefix={project.prefix}
                      projectColor={project.color}
                    />
                  ),
                )}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>

      {selectedTask && (
        <TaskDialog
          task={getTaskById(selectedTask)!}
          team={project.team}
          isProject={isProjectView}
          projectPrefix={project.prefix}
          onClose={() => setSelectedTask(null)}
          onDelete={(taskId) => {
            for (const columnId in project.columns) {
              const column = project.columns[columnId];
              if (column.tasks.some((t) => t.id === taskId)) {
                handleDeleteTask(columnId, taskId);
                break;
              }
            }
          }}
          // @ts-ignore: TODO
          onUpdate={handleUpdateTask}
        />
      )}

      {isAddingTask && newTaskColumn && (
        <TaskDialog
          isNew
          team={project.team}
          isProject={isProjectView}
          projectPrefix={project.prefix}
          task={{
            id: `${isProjectView ? "project" : "task"}-${Date.now()}`,
            content: "",
            description: "",
            priority: "medium",
            assignees: [],
            dueDate: undefined,
          }}
          onClose={() => {
            setIsAddingTask(false);
            setNewTaskColumn(null);
          }}
          onSave={(task) => {
            handleAddTask(newTaskColumn, task);
            setIsAddingTask(false);
            setNewTaskColumn(null);
          }}
        />
      )}

      {columnToDelete && (
        <ConfirmDialog
          title="Delete Column"
          message={`Are you sure you want to delete this column? All tasks will be moved to the first remaining column.`}
          onConfirm={() => handleDeleteColumn(columnToDelete)}
          onCancel={() => setColumnToDelete(null)}
        />
      )}
    </div>
  );
};

export default Board;
