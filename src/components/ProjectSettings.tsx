"use client";

import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import {
  Download,
  GripVertical,
  Palette,
  Plus,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

import ConfirmDialog from "@/components/ConfirmDialog";

import type { DropResult } from "@hello-pangea/dnd";
import type { Column, Project } from "@/types";

interface ProjectSettingsProps {
  project: Project;
  onClose: () => void;
  onUpdate: (updates: Partial<Project>) => void;
  onImport: () => void;
  onExport: () => void;
}

const projectColors = [
  { name: "Sky", value: "#0ea5e9" },
  { name: "Blue", value: "#3b82f6" },
  { name: "Indigo", value: "#6366f1" },
  { name: "Purple", value: "#a855f7" },
  { name: "Pink", value: "#ec4899" },
  { name: "Rose", value: "#f43f5e" },
  { name: "Orange", value: "#f97316" },
  { name: "Amber", value: "#f59e0b" },
  { name: "Yellow", value: "#eab308" },
  { name: "Lime", value: "#84cc16" },
  { name: "Green", value: "#22c55e" },
  { name: "Emerald", value: "#10b981" },
  { name: "Teal", value: "#14b8a6" },
  { name: "Cyan", value: "#06b6d4" },
];

const ProjectSettings = ({
  project,
  onClose,
  onUpdate,
  onImport,
  onExport,
}: ProjectSettingsProps) => {
  const [name, setName] = useState(project.name);
  const [description, setDescription] = useState(project.description || "");
  const [prefix, setPrefix] = useState(project.prefix || "");
  const [color, setColor] = useState(project.color || "");
  const [isAddingColumn, setIsAddingColumn] = useState(false);
  const [newColumnTitle, setNewColumnTitle] = useState("");
  const [columnToDelete, setColumnToDelete] = useState<string | null>(null);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const colorPickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
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

      if (
        modalRef.current &&
        !modalRef.current.contains(target) &&
        !columnToDelete
      ) {
        onClose();
      }

      if (colorPickerRef.current && !colorPickerRef.current.contains(target)) {
        setShowColorPicker(false);
      }
    };

    window.addEventListener("keydown", handleEscape);
    window.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("keydown", handleEscape);
      window.removeEventListener("mousedown", handleClickOutside);
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

  const handleAddColumn = () => {
    if (!newColumnTitle.trim()) return;

    const columnId = newColumnTitle.toLowerCase().replace(/\s+/g, "-");
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
        className="max-h-[85vh] w-full max-w-lg overflow-auto rounded-lg bg-white dark:bg-gray-800"
      >
        <div className="flex items-center justify-between border-gray-200 border-b p-6 dark:border-gray-700">
          <h2 className="font-semibold text-gray-900 text-xl dark:text-gray-100">
            Project Settings
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6 p-6">
          <div>
            <label
              htmlFor="name"
              className="mb-1 block font-medium text-gray-700 text-sm dark:text-gray-300"
            >
              Project Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
              required
            />
          </div>
          <div>
            <label
              htmlFor="prefix"
              className="mb-1 block font-medium text-gray-700 text-sm dark:text-gray-300"
            >
              Project Prefix
            </label>
            <input
              type="text"
              id="prefix"
              value={prefix}
              onChange={(e) => setPrefix(e.target.value.toUpperCase())}
              placeholder="e.g., RUNA"
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
            />
            <p className="mt-1 text-gray-500 text-xs dark:text-gray-400">
              Used for task IDs (e.g., RUNA-1, RUNA-2)
            </p>
          </div>
          <div>
            <p className="mb-1 block font-medium text-gray-700 text-sm dark:text-gray-300">
              Project Color
            </p>
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowColorPicker(!showColorPicker)}
                className="flex w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700"
              >
                <div className="flex items-center gap-2">
                  {color && (
                    <div
                      className="h-4 w-4 rounded-full"
                      style={{ backgroundColor: color }}
                    />
                  )}
                  <span className="text-gray-900 text-sm dark:text-gray-100">
                    {color
                      ? projectColors.find((c) => c.value === color)?.name ||
                        "Custom"
                      : "Select color"}
                  </span>
                </div>
                <Palette className="h-4 w-4 text-gray-400" />
              </button>

              {showColorPicker && (
                <div
                  ref={colorPickerRef}
                  className="absolute top-full left-0 z-10 mt-1 w-full rounded-md border border-gray-200 bg-white p-2 shadow-lg dark:border-gray-700 dark:bg-gray-800"
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
                        className={`flex h-6 w-6 items-center justify-center rounded-full ${
                          color === projectColor.value
                            ? "ring-2 ring-primary-500 ring-offset-2"
                            : ""
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
                        setColor("");
                        setShowColorPicker(false);
                      }}
                      className="mt-2 text-red-500 text-xs hover:text-red-600"
                    >
                      Remove color
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
          <div>
            <label
              htmlFor="description"
              className="mb-1 block font-medium text-gray-700 text-sm dark:text-gray-300"
            >
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full resize-none rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
            />
          </div>

          <div>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-medium text-gray-700 text-sm dark:text-gray-300">
                Columns
              </h3>
              {!isAddingColumn && (
                <button
                  type="button"
                  onClick={() => setIsAddingColumn(true)}
                  className="flex items-center gap-2 rounded bg-gray-100 px-3 py-1 font-medium text-gray-600 text-sm hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
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
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
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
                    className="px-3 py-1 text-gray-600 text-sm hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
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
                              className="group flex items-center justify-between rounded-lg bg-gray-50 p-3 dark:bg-gray-700/50"
                            >
                              <div className="flex items-center gap-3">
                                <div {...provided.dragHandleProps}>
                                  <GripVertical className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                                </div>
                                <span className="text-gray-900 text-sm dark:text-gray-100">
                                  {column.title}
                                </span>
                                <span className="text-gray-500 text-xs dark:text-gray-400">
                                  {column.tasks.length}
                                </span>
                              </div>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setColumnToDelete(columnId);
                                }}
                                className="p-1 text-gray-400 opacity-0 hover:text-red-500 group-hover:opacity-100 dark:hover:text-red-400"
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

          <div className="border-gray-200 border-t pt-4 dark:border-gray-700">
            <h3 className="mb-2 font-medium text-gray-700 text-sm dark:text-gray-300">
              Project Data
            </h3>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={onImport}
                className="flex items-center gap-2 rounded-md border border-gray-300 bg-white px-3 py-2 font-medium text-gray-700 text-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
              >
                <Upload className="h-4 w-4" />
                Import Project
              </button>
              <button
                type="button"
                onClick={onExport}
                className="flex items-center gap-2 rounded-md border border-gray-300 bg-white px-3 py-2 font-medium text-gray-700 text-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
              >
                <Download className="h-4 w-4" />
                Export Project
              </button>
            </div>
          </div>

          <div className="flex justify-end gap-2 border-gray-200 border-t pt-4 dark:border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-gray-300 bg-white px-4 py-2 font-medium text-gray-700 text-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
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

export default ProjectSettings;
