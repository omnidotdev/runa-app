'use client';

import { useState, useEffect, useRef } from 'react';
import { X, Plus, GripVertical, Trash2 } from 'lucide-react';
import { Project, Column } from '@/types';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { ConfirmDialog } from './ConfirmDialog';

interface ProjectOverviewSettingsProps {
  project: Project;
  onClose: () => void;
  onUpdate: (updates: Partial<Project>) => void;
}

export function ProjectOverviewSettings({ project, onClose, onUpdate }: ProjectOverviewSettingsProps) {
  const [name, setName] = useState(project.name);
  const [description, setDescription] = useState(project.description || '');
  const [isAddingColumn, setIsAddingColumn] = useState(false);
  const [newColumnTitle, setNewColumnTitle] = useState('');
  const [columnToDelete, setColumnToDelete] = useState<string | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (columnToDelete) {
          setColumnToDelete(null);
        } else {
          onClose();
        }
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node) && !columnToDelete) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscape);
    window.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      window.removeEventListener('keydown', handleEscape);
      window.removeEventListener('mousedown', handleClickOutside);
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

    const columnId = newColumnTitle.toLowerCase().replace(/\s+/g, '-');
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
    setNewColumnTitle('');
    setIsAddingColumn(false);
  };

  const handleDeleteColumn = (columnId: string) => {
    const columnCount = Object.keys(project.columns).length;
    if (columnCount <= 1) {
      alert('Cannot delete the last column');
      setColumnToDelete(null);
      return;
    }

    // Get all tasks from the column being deleted
    const tasksToMove = project.columns[columnId].tasks;
    
    // Create new columns object without the deleted column
    const { [columnId]: deletedColumn, ...remainingColumns } = project.columns;

    // If there are tasks in the deleted column, move them to the first remaining column
    if (tasksToMove.length > 0) {
      const firstColumnId = Object.keys(remainingColumns)[0];
      remainingColumns[firstColumnId] = {
        ...remainingColumns[firstColumnId],
        tasks: [...remainingColumns[firstColumnId].tasks, ...tasksToMove]
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

    const reorderedColumns = columnOrder.reduce((acc, columnId) => {
      acc[columnId] = project.columns[columnId];
      return acc;
    }, {} as Project['columns']);

    onUpdate({ columns: reorderedColumns });
  };

  return (
    <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center p-4 z-50">
      <div 
        ref={modalRef}
        className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-lg max-h-[85vh] overflow-auto"
      >
        <div className="p-6 flex items-center justify-between border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Overview Settings</h2>
          <button
            onClick={onClose}
            className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Title
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Project Status Columns</h3>
              {!isAddingColumn && (
                <button
                  type="button"
                  onClick={() => setIsAddingColumn(true)}
                  className="flex items-center gap-2 px-3 py-1 text-sm font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
                >
                  <Plus className="w-4 h-4" />
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
                  className="w-full px-3 py-2 text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-gray-100"
                  autoFocus
                />
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsAddingColumn(false);
                      setNewColumnTitle('');
                    }}
                    className="px-3 py-1 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleAddColumn}
                    disabled={!newColumnTitle.trim()}
                    className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
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
                    {Object.entries(project.columns).map(([columnId, column], index) => (
                      <Draggable key={columnId} draggableId={columnId} index={index}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg group"
                          >
                            <div className="flex items-center gap-3">
                              <div {...provided.dragHandleProps}>
                                <GripVertical className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                              </div>
                              <span className="text-sm text-gray-900 dark:text-gray-100">{column.title}</span>
                              <span className="text-xs text-gray-500 dark:text-gray-400">{column.tasks.length}</span>
                            </div>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setColumnToDelete(columnId);
                              }}
                              className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-all"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
}