import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import { GripVertical, Plus, Trash2, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import ConfirmDialog from "@/components/ConfirmDialog";

import type { DropResult } from "@hello-pangea/dnd";
import type { Column, Project } from "@/types";

interface ProjectOverviewSettingsProps {
  project: Project;
  onClose: () => void;
  onUpdate: (updates: Partial<Project>) => void;
}

const ProjectOverviewSettings = ({
  project,
  onClose,
  onUpdate,
}: ProjectOverviewSettingsProps) => {
  const [name, setName] = useState(project.name);
  const [description, setDescription] = useState(project.description || "");
  const [isAddingColumn, setIsAddingColumn] = useState(false);
  const [newColumnTitle, setNewColumnTitle] = useState("");
  const [columnToDelete, setColumnToDelete] = useState<string | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (columnToDelete) {
          setColumnToDelete(null);
        } else {
          onClose();
        }
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(e.target as Node) &&
        !columnToDelete
      ) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEscape);
    window.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("keydown", handleEscape);
      window.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose, columnToDelete]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onUpdate({
      name: name.trim(),
      description: description.trim() || undefined,
    });
    onClose();
  };

  const handleAddColumn = () => {
    if (!newColumnTitle.trim()) return;

    const columnId = newColumnTitle.toLowerCase().replace(/\s+/g, "-");
    const newColumn: Column = {
      id: columnId,
      title: newColumnTitle.trim(),
      tasks: [],
    };

    const updatedColumns = {
      ...project.columns,
      [columnId]: newColumn,
    };

    onUpdate({ columns: updatedColumns });
    setNewColumnTitle("");
    setIsAddingColumn(false);
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
    onUpdate({ columns: remainingColumns });
    setColumnToDelete(null);
  };

  const onDragEnd = (result: DropResult) => {
    const { destination, source } = result;

    if (!destination || destination.index === source.index) return;

    const columnOrder = Object.keys(project.columns);
    const [removed] = columnOrder.splice(source.index, 1);
    columnOrder.splice(destination.index, 0, removed);

    const reorderedColumns = columnOrder.reduce(
      (acc, columnId) => {
        acc[columnId] = project.columns[columnId];
        return acc;
      },
      {} as Project["columns"],
    );

    onUpdate({ columns: reorderedColumns });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 dark:bg-black/70">
      <div
        ref={modalRef}
        className="max-h-[85vh] w-full max-w-lg overflow-auto rounded-lg bg-white dark:bg-base-800"
      >
        <div className="flex items-center justify-between border-base-200 border-b p-6 dark:border-base-700">
          <h2 className="font-semibold text-base-900 text-xl dark:text-base-100">
            Overview Settings
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-base-500 hover:text-base-700 dark:text-base-400 dark:hover:text-base-300"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6 p-6">
          <div>
            <label
              htmlFor="name"
              className="mb-1 block font-medium text-base-700 text-sm dark:text-base-300"
            >
              Title
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-md border border-base-300 bg-white px-3 py-2 text-base-900 shadow-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500 dark:border-base-600 dark:bg-base-700 dark:text-base-100"
              required
            />
          </div>
          <div>
            <label
              htmlFor="description"
              className="mb-1 block font-medium text-base-700 text-sm dark:text-base-300"
            >
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full resize-none rounded-md border border-base-300 bg-white px-3 py-2 text-base-900 shadow-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500 dark:border-base-600 dark:bg-base-700 dark:text-base-100"
            />
          </div>

          <div>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-medium text-base-700 text-sm dark:text-base-300">
                Project Status Columns
              </h3>
              {!isAddingColumn && (
                <button
                  type="button"
                  onClick={() => setIsAddingColumn(true)}
                  className="flex items-center gap-2 rounded bg-base-100 px-3 py-1 font-medium text-base-600 text-sm hover:bg-base-200 dark:bg-base-700 dark:text-base-300 dark:hover:bg-base-600"
                >
                  <Plus className="h-4 w-4" />
                  Add Column
                </button>
              )}
            </div>

            {isAddingColumn && (
              <div className="mb-4 space-y-2">
                <input
                  type="text"
                  value={newColumnTitle}
                  onChange={(e) => setNewColumnTitle(e.target.value)}
                  placeholder="Enter column title..."
                  className="w-full rounded-md border border-base-300 bg-white px-3 py-2 text-base-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:border-base-600 dark:bg-base-700 dark:text-base-100"
                  // biome-ignore lint/a11y/noAutofocus: TODO
                  autoFocus
                />
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsAddingColumn(false);
                      setNewColumnTitle("");
                    }}
                    className="px-3 py-1 text-base-600 text-sm hover:text-base-900 dark:text-base-400 dark:hover:text-base-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleAddColumn}
                    disabled={!newColumnTitle.trim()}
                    className="rounded bg-primary-500 px-3 py-1 text-sm text-white hover:bg-primary-600 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Add
                  </button>
                </div>
              </div>
            )}

            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="columns" direction="vertical">
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="space-y-2"
                  >
                    {Object.entries(project.columns).map(
                      ([columnId, column], index) => (
                        <Draggable
                          key={columnId}
                          draggableId={columnId}
                          index={index}
                        >
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              className="group flex items-center justify-between rounded-lg bg-base-50 p-3 dark:bg-base-700/50"
                            >
                              <div className="flex items-center gap-3">
                                <div {...provided.dragHandleProps}>
                                  <GripVertical className="h-4 w-4 text-base-400 dark:text-base-500" />
                                </div>
                                <span className="text-base-900 text-sm dark:text-base-100">
                                  {column.title}
                                </span>
                                <span className="text-base-500 text-xs dark:text-base-400">
                                  {column.tasks.length}
                                </span>
                              </div>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setColumnToDelete(columnId);
                                }}
                                className="p-1 text-base-400 opacity-0 hover:text-red-500 group-hover:opacity-100 dark:hover:text-red-400"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          )}
                        </Draggable>
                      ),
                    )}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </div>

          <div className="flex justify-end gap-2 border-base-200 border-t pt-4 dark:border-base-700">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-base-300 bg-white px-4 py-2 font-medium text-base-700 text-sm hover:bg-base-50 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:border-base-600 dark:bg-base-800 dark:text-base-200 dark:hover:bg-base-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-md bg-primary-500 px-4 py-2 font-medium text-sm text-white hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>

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

export default ProjectOverviewSettings;
