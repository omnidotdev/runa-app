"use client";

import { Tag, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { parseDate } from "@/utils/dates";
import { ConfirmDialog } from "../ConfirmDialog";
import { AssigneePicker } from "./AssigneePicker";
import { DatePicker } from "./DatePicker";
import { TaskDescription } from "./TaskDescription";
import { TaskHeader } from "./TaskHeader";

import type { Assignee, Project, Task } from "@/types";

interface TaskDialogProps {
  task: Task;
  team: Assignee[];
  projects?: Project[];
  tasks?: Task[];
  isNew?: boolean;
  isProject?: boolean;
  projectPrefix?: string;
  currentProject?: Project;
  onClose: () => void;
  onDelete?: (taskId: string) => void;
  onSave?: (task: Task) => void;
  onUpdate?: (taskId: string, updates: Partial<Task>) => void;
}

export function TaskDialog({
  task: initialTask,
  team,
  projects = [],
  tasks = [],
  isNew = false,
  isProject = false,
  projectPrefix,
  currentProject,
  onClose,
  onDelete,
  onSave,
  onUpdate,
}: TaskDialogProps) {
  const [task, setTask] = useState(initialTask);
  const [isEditing, setIsEditing] = useState(isNew);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showAssigneePicker, setShowAssigneePicker] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showLabelPicker, setShowLabelPicker] = useState(false);
  const [newLabel, setNewLabel] = useState("");
  const [dateInput, setDateInput] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [localContent, setLocalContent] = useState(initialTask.content);
  const [localDescription, setLocalDescription] = useState(
    initialTask.description,
  );
  const modalRef = useRef<HTMLDivElement>(null);
  const assigneePickerRef = useRef<HTMLDivElement>(null);
  const datePickerRef = useRef<HTMLDivElement>(null);
  const mounted = useRef(true);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        if (showDeleteConfirm) {
          setShowDeleteConfirm(false);
        } else if (
          showDatePicker &&
          !datePickerRef.current?.contains(e.target as Node)
        ) {
          setShowDatePicker(false);
        } else if (
          showAssigneePicker &&
          !assigneePickerRef.current?.contains(e.target as Node)
        ) {
          setShowAssigneePicker(false);
        } else if (!isSaving) {
          onClose();
        }
      }
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (showDeleteConfirm) {
          setShowDeleteConfirm(false);
        } else if (showDatePicker) {
          setShowDatePicker(false);
        } else if (showAssigneePicker) {
          setShowAssigneePicker(false);
        } else if (!isSaving) {
          onClose();
        }
      }
    };

    window.addEventListener("keydown", handleEscape);
    window.addEventListener("mousedown", handleClickOutside);
    return () => {
      window.removeEventListener("keydown", handleEscape);
      window.removeEventListener("mousedown", handleClickOutside);
    };
  }, [
    onClose,
    showDeleteConfirm,
    showDatePicker,
    showAssigneePicker,
    isSaving,
  ]);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (!mounted.current) return;

    setLocalContent(initialTask.content);
    setLocalDescription(initialTask.description);
    setTask((prev) => ({
      ...initialTask,
      content: prev.content,
      description: prev.description,
    }));
    setIsEditing(isNew);
    setShowDatePicker(false);
    setShowAssigneePicker(false);
    setShowDeleteConfirm(false);
    setDateInput("");
    setIsSaving(false);
  }, [initialTask, isNew]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSave(e as unknown as React.MouseEvent);
    }
  };

  const handleSave = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!localContent.trim() || isSaving || !mounted.current) return;

    setIsSaving(true);

    try {
      const updatedTask = {
        ...task,
        content: localContent,
        description: localDescription,
      };

      if (isNew && onSave) {
        await Promise.resolve(onSave(updatedTask));
        if (mounted.current) {
          onClose();
        }
      } else if (isEditing && onUpdate) {
        await Promise.resolve(onUpdate(task.id, updatedTask));
        if (mounted.current) {
          setIsEditing(false);
        }
      }
    } catch (error) {
      console.error("Error saving task:", error);
    } finally {
      if (mounted.current) {
        setIsSaving(false);
      }
    }
  };

  const handleDateSubmit = () => {
    if (!mounted.current || isSaving) return;

    const parsedDate = parseDate(dateInput);
    if (parsedDate) {
      const newTask = { ...task, dueDate: parsedDate.toISOString() };
      setTask(newTask);
      setDateInput("");
      setShowDatePicker(false);
      onUpdate?.(task.id, newTask);
    }
  };

  const handleAssigneeToggle = (assignee: Assignee) => {
    if (!mounted.current || isSaving) return;

    const isAssigned = task.assignees.some((a) => a.id === assignee.id);
    const newTask = {
      ...task,
      assignees: isAssigned
        ? task.assignees.filter((a) => a.id !== assignee.id)
        : [...task.assignees, assignee],
    };
    setTask(newTask);
    onUpdate?.(task.id, newTask);
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!onDelete || isSaving || !mounted.current) return;

    setIsSaving(true);
    try {
      await Promise.resolve(onDelete(task.id));
      if (mounted.current) {
        onClose();
      }
    } catch (error) {
      console.error("Error deleting task:", error);
    } finally {
      if (mounted.current) {
        setIsSaving(false);
      }
    }
  };

  const handleAddLabel = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLabel.trim() || isSaving) return;

    const updatedLabels = [...(task.labels || []), newLabel.trim()];
    const updatedTask = { ...task, labels: updatedLabels };
    setTask(updatedTask);
    onUpdate?.(task.id, updatedTask);
    setNewLabel("");
  };

  const handleRemoveLabel = (labelToRemove: string) => {
    if (isSaving) return;
    const updatedLabels = (task.labels || []).filter(
      (label) => label !== labelToRemove,
    );
    const updatedTask = { ...task, labels: updatedLabels };
    setTask(updatedTask);
    onUpdate?.(task.id, updatedTask);
  };

  const handleToggleLabel = (label: string) => {
    if (isSaving) return;
    const isSelected = task.labels?.includes(label);
    const updatedLabels = isSelected
      ? (task.labels || []).filter((l) => l !== label)
      : [...(task.labels || []), label];
    const updatedTask = { ...task, labels: updatedLabels };
    setTask(updatedTask);
    onUpdate?.(task.id, updatedTask);
  };

  const handleDescriptionChange = (content: string) => {
    if (!mounted.current || isSaving) return;

    setLocalDescription(content);
  };

  const displayId = task.id.match(/\d+/)?.[0] || task.id;
  const itemType = isProject ? "Project" : "Task";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 dark:bg-black/70">
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        className="max-h-[85vh] min-h-[600px] w-full max-w-3xl overflow-auto rounded-lg bg-white dark:bg-gray-800"
      >
        <TaskHeader
          task={task}
          isNew={isNew}
          isEditing={isEditing}
          content={localContent}
          itemType={itemType}
          displayId={displayId}
          projectPrefix={projectPrefix}
          onContentChange={(content) => !isSaving && setLocalContent(content)}
          onSave={handleSave}
          onDelete={() => !isSaving && setShowDeleteConfirm(true)}
          onClose={onClose}
          onEditStart={() => !isSaving && setIsEditing(true)}
          onKeyDown={handleKeyDown}
          isSaving={isSaving}
        />

        <div className="p-6">
          <div className="mb-6 flex items-center gap-4">
            <div ref={assigneePickerRef}>
              <AssigneePicker
                assignees={task.assignees}
                team={team}
                isOpen={showAssigneePicker}
                onToggle={() => {
                  if (!isSaving) {
                    setShowAssigneePicker(!showAssigneePicker);
                    setShowDatePicker(false);
                  }
                }}
                onAssigneeToggle={handleAssigneeToggle}
              />
            </div>

            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  if (!isSaving) {
                    setShowLabelPicker(!showLabelPicker);
                    setShowDatePicker(false);
                    setShowAssigneePicker(false);
                  }
                }}
                className="flex items-center gap-2 rounded-md border border-gray-200 bg-white px-3 py-2 font-medium text-gray-700 text-sm hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
              >
                <Tag className="h-4 w-4" />
                <span>
                  {task.labels?.length
                    ? `${task.labels.length} labels`
                    : "Add labels"}
                </span>
              </button>

              {showLabelPicker && (
                <div className="absolute top-full left-0 z-20 mt-1 w-64 rounded-md border border-gray-200 bg-white p-2 shadow-lg dark:border-gray-700 dark:bg-gray-800">
                  <form onSubmit={handleAddLabel} className="mb-2">
                    <input
                      type="text"
                      value={newLabel}
                      onChange={(e) => setNewLabel(e.target.value)}
                      placeholder="Add new label..."
                      className="w-full rounded border border-gray-200 bg-white px-2 py-1 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                      // biome-ignore lint/a11y/noAutofocus: allow
                      autoFocus
                    />
                  </form>

                  {task.labels?.length && (
                    <div className="mb-2 rounded bg-gray-50 p-2 dark:bg-gray-700/50">
                      <div className="mb-1 font-medium text-gray-500 text-xs dark:text-gray-400">
                        Applied Labels
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {task.labels.map((label, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-1 font-medium text-gray-700 text-xs dark:bg-gray-700 dark:text-gray-300"
                          >
                            {label}
                            <button
                              type="button"
                              onClick={() => handleRemoveLabel(label)}
                              className="hover:text-red-500 dark:hover:text-red-400"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {currentProject?.labels &&
                    currentProject.labels.length > 0 && (
                      <div>
                        <div className="mb-1 font-medium text-gray-500 text-xs dark:text-gray-400">
                          Project Labels
                        </div>
                        <div className="space-y-1">
                          {currentProject.labels.map((label, index) => (
                            <button
                              type="button"
                              key={index}
                              onClick={() => handleToggleLabel(label)}
                              className="flex w-full items-center justify-between rounded px-2 py-1 text-sm hover:bg-gray-50 dark:hover:bg-gray-700"
                            >
                              <span className="text-gray-900 dark:text-gray-100">
                                {label}
                              </span>
                              {task.labels?.includes(label) && (
                                <div className="h-2 w-2 rounded-full bg-primary-500" />
                              )}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                </div>
              )}
            </div>

            <div ref={datePickerRef}>
              <DatePicker
                dueDate={task.dueDate}
                isOpen={showDatePicker}
                onToggle={() => {
                  if (!isSaving) {
                    setShowDatePicker(!showDatePicker);
                    setShowAssigneePicker(false);
                  }
                }}
                onDateSubmit={handleDateSubmit}
                onDateRemove={() => {
                  if (!isSaving) {
                    const newTask = { ...task, dueDate: undefined };
                    setTask(newTask);
                    onUpdate?.(task.id, newTask);
                    setShowDatePicker(false);
                  }
                }}
                dateInput={dateInput}
                onDateInputChange={(value) => !isSaving && setDateInput(value)}
              />
            </div>
          </div>

          <TaskDescription
            description={localDescription}
            isNew={isNew}
            isEditing={isEditing}
            projects={projects}
            tasks={tasks}
            team={team}
            onDescriptionChange={handleDescriptionChange}
            onEditStart={() => !isSaving && setIsEditing(true)}
          />

          {isNew && onSave && (
            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={handleSave}
                disabled={!task.content.trim() || isSaving}
                className="rounded-md bg-primary-500 px-4 py-2 text-white hover:bg-primary-600 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSaving ? "Creating..." : `Create ${itemType}`}
              </button>
            </div>
          )}
        </div>
      </div>

      {showDeleteConfirm && (
        <ConfirmDialog
          title={`Delete ${itemType}`}
          message={`Are you sure you want to delete this ${itemType.toLowerCase()}? This action cannot be undone.`}
          // @ts-ignore TODO
          onConfirm={handleDelete}
          onCancel={() => !isSaving && setShowDeleteConfirm(false)}
        />
      )}
    </div>
  );
}
