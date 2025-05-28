'use client';

import { useState, useEffect, useRef } from 'react';
import { X, Download, Upload, Plus, GripVertical, Trash2, Palette, Tag } from 'lucide-react';
import { Project, Column } from '@/types';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { ConfirmDialog } from './ConfirmDialog';

interface ProjectSettingsProps {
  project: Project;
  onClose: () => void;
  onUpdate: (updates: Partial<Project>) => void;
  onImport: () => void;
  onExport: () => void;
}

const projectColors = [
  { name: 'Sky', value: '#0ea5e9' },
  { name: 'Blue', value: '#3b82f6' },
  { name: 'Indigo', value: '#6366f1' },
  { name: 'Purple', value: '#a855f7' },
  { name: 'Pink', value: '#ec4899' },
  { name: 'Rose', value: '#f43f5e' },
  { name: 'Orange', value: '#f97316' },
  { name: 'Amber', value: '#f59e0b' },
  { name: 'Yellow', value: '#eab308' },
  { name: 'Lime', value: '#84cc16' },
  { name: 'Green', value: '#22c55e' },
  { name: 'Emerald', value: '#10b981' },
  { name: 'Teal', value: '#14b8a6' },
  { name: 'Cyan', value: '#06b6d4' },
];

export function ProjectSettings({ project, onClose, onUpdate, onImport, onExport }: ProjectSettingsProps) {
  const [name, setName] = useState(project.name);
  const [description, setDescription] = useState(project.description || '');
  const [prefix, setPrefix] = useState(project.prefix || '');
  const [color, setColor] = useState(project.color || '');
  const [isAddingColumn, setIsAddingColumn] = useState(false);
  const [newColumnTitle, setNewColumnTitle] = useState('');
  const [columnToDelete, setColumnToDelete] = useState<string | null>(null);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [newLabel, setNewLabel] = useState('');
  const modalRef = useRef<HTMLDivElement>(null);
  const colorPickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (columnToDelete) {
          setColumnToDelete(null);
        } else if (showColorPicker) {
          setShowColorPicker(false);
        } else {
          onClose();
        }
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;

      if (modalRef.current && !modalRef.current.contains(target) && !columnToDelete) {
        onClose();
      }

      if (colorPickerRef.current && !colorPickerRef.current.contains(target)) {
        setShowColorPicker(false);
      }
    };

    window.addEventListener('keydown', handleEscape);
    window.addEventListener('mousedown', handleClickOutside);

    return () => {
      window.removeEventListener('keydown', handleEscape);
      window.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose, columnToDelete, showColorPicker]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const updates: Partial<Project> = {
      name: name.trim(),
      description: description.trim() || undefined,
      prefix: prefix.trim() || undefined,
      color: color || undefined,
      labels: project.labels,
    };

    onUpdate(updates);
    onClose();
  };

  const handleAddLabel = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLabel.trim()) return;

    const updatedLabels = [...(project.labels || []), newLabel.trim()];
    onUpdate({ labels: updatedLabels });
    setNewLabel('');
  };

  const handleRemoveLabel = (labelToRemove: string) => {
    const updatedLabels = (project.labels || []).filter(label => label !== labelToRemove);
    onUpdate({ labels: updatedLabels });
  };

  const handleAddColumn = () => {
    if (!newColumnTitle.trim()) return;

    const columnId = newColumnTitle.toLowerCase().replace(/\s+/g, '-');
    const newColumn: Column = {
      id: columnId,
      title: newColumnTitle.trim(),
      tasks: [],
    };

    onUpdate({
      columns: {
        ...project.columns,
        [columnId]: newColumn,
      },
    });

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
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Project Settings</h2>
          <button
            onClick={onClose}
            className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Project Name
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
            <label htmlFor="prefix" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Project Prefix
            </label>
            <input
              type="text"
              id="prefix"
              value={prefix}
              onChange={(e) => setPrefix(e.target.value.toUpperCase())}
              placeholder="e.g., RUNA"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Used for task IDs (e.g., RUNA-1, RUNA-2)
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Project Color
            </label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowColorPicker(!showColorPicker)}
                className="w-full flex items-center justify-between px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <div className="flex items-center gap-2">
                  {color && (
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: color }}
                    />
                  )}
                  <span className="text-sm text-gray-900 dark:text-gray-100">
                    {color ? projectColors.find(c => c.value === color)?.name || 'Custom' : 'Select color'}
                  </span>
                </div>
                <Palette className="w-4 h-4 text-gray-400" />
              </button>

              {showColorPicker && (
                <div
                  ref={colorPickerRef}
                  className="absolute top-full left-0 mt-1 w-full bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 p-2 z-10"
                >
                  <div className="grid grid-cols-7 gap-1">
                    {projectColors.map((projectColor) => (
                      <button
                        key={projectColor.value}
                        type="button"
                        onClick={() => {
                          setColor(projectColor.value);
                          setShowColorPicker(false);
                        }}
                        className={`w-6 h-6 rounded-full flex items-center justify-center ${
                          color === projectColor.value ? 'ring-2 ring-blue-500 ring-offset-2' : ''
                        }`}
                        style={{ backgroundColor: projectColor.value }}
                        title={projectColor.name}
                      />
                    ))}
                  </div>
                  {color && (
                    <button
                      type="button"
                      onClick={() => {
                        setColor('');
                        setShowColorPicker(false);
                      }}
                      className="mt-2 text-xs text-red-500 hover:text-red-600"
                    >
                      Remove color
                    </button>
                  )}
                </div>
              )}
            </div>
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
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Columns</h3>
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
                              className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-500 dark:hover:text-red-400"
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

          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Project Data</h3>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={onImport}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 rounded-md border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <Upload className="w-4 h-4" />
                Import Project
              </button>
              <button
                type="button"
                onClick={onExport}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 rounded-md border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <Download className="w-4 h-4" />
                Export Project
              </button>
            </div>
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
