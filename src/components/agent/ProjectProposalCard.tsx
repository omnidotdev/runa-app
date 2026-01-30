import {
  ArrowRightIcon,
  CheckIcon,
  GripVerticalIcon,
  LayersIcon,
  ListTodoIcon,
  PencilIcon,
  PlusIcon,
  TagIcon,
  Trash2Icon,
  XIcon,
} from "lucide-react";
import { useCallback, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

/** Label color mapping to Tailwind classes. */
const LABEL_COLORS: Record<string, string> = {
  gray: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
  red: "bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300",
  orange:
    "bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-300",
  yellow:
    "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-300",
  green: "bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300",
  blue: "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300",
  purple:
    "bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300",
  pink: "bg-pink-100 text-pink-700 dark:bg-pink-900/50 dark:text-pink-300",
};

/** Available label colors for selection. */
const LABEL_COLOR_OPTIONS = [
  "gray",
  "red",
  "orange",
  "yellow",
  "green",
  "blue",
  "purple",
  "pink",
] as const;

/** Proposed column structure. */
interface ProposedColumn {
  title: string;
  icon?: string;
}

/** Proposed label structure. */
interface ProposedLabel {
  name: string;
  color: string;
}

/** Proposed initial task structure. */
interface ProposedTask {
  title: string;
  columnIndex: number;
  priority?: string;
  description?: string;
}

/** Full project proposal structure. */
export interface ProjectProposal {
  name: string;
  prefix: string;
  description?: string;
  columns: ProposedColumn[];
  labels?: ProposedLabel[];
  initialTasks?: ProposedTask[];
}

interface ProjectProposalCardProps {
  proposal: ProjectProposal;
  /** Enable inline editing of the proposal. */
  editable?: boolean;
  /** Called when the proposal is modified (only in editable mode). */
  onProposalChange?: (proposal: ProjectProposal) => void;
}

/** Inline editable text field. */
function EditableText({
  value,
  onChange,
  placeholder,
  className,
  inputClassName,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  inputClassName?: string;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleStartEdit = useCallback(() => {
    setEditValue(value);
    setIsEditing(true);
    // Focus input after render
    setTimeout(() => inputRef.current?.focus(), 0);
  }, [value]);

  const handleConfirm = useCallback(() => {
    if (editValue.trim()) {
      onChange(editValue.trim());
    }
    setIsEditing(false);
  }, [editValue, onChange]);

  const handleCancel = useCallback(() => {
    setEditValue(value);
    setIsEditing(false);
  }, [value]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        handleConfirm();
      } else if (e.key === "Escape") {
        handleCancel();
      }
    },
    [handleConfirm, handleCancel],
  );

  if (isEditing) {
    return (
      <div className={cn("flex items-center gap-1", className)}>
        <Input
          ref={inputRef}
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleConfirm}
          className={cn("h-auto py-0.5", inputClassName)}
          placeholder={placeholder}
        />
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={handleStartEdit}
      className={cn(
        "group inline-flex items-center gap-1 rounded px-0.5 text-left transition-colors hover:bg-muted",
        className,
      )}
    >
      <span>{value || placeholder}</span>
      <PencilIcon className="size-3 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
    </button>
  );
}

/** Editable column chip with drag handle. */
function EditableColumnChip({
  column,
  index,
  isLast,
  onUpdate,
  onRemove,
  canRemove,
  onDragStart,
  onDragOver,
  onDrop,
}: {
  column: ProposedColumn;
  index: number;
  isLast: boolean;
  onUpdate: (index: number, updates: Partial<ProposedColumn>) => void;
  onRemove: (index: number) => void;
  canRemove: boolean;
  onDragStart: (index: number) => void;
  onDragOver: (e: React.DragEvent, index: number) => void;
  onDrop: (index: number) => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(column.title);
  const [editIcon, setEditIcon] = useState(column.icon ?? "");

  const handleConfirm = useCallback(() => {
    if (editTitle.trim()) {
      onUpdate(index, {
        title: editTitle.trim(),
        icon: editIcon.trim() || undefined,
      });
    }
    setIsEditing(false);
  }, [editTitle, editIcon, index, onUpdate]);

  const handleCancel = useCallback(() => {
    setEditTitle(column.title);
    setEditIcon(column.icon ?? "");
    setIsEditing(false);
  }, [column]);

  if (isEditing) {
    return (
      <div className="flex items-center gap-1 rounded-md border border-primary bg-background p-1">
        <Input
          value={editIcon}
          onChange={(e) => setEditIcon(e.target.value)}
          className="h-6 w-8 px-1 text-center text-xs"
          placeholder="📋"
          maxLength={2}
        />
        <Input
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          className="h-6 w-20 px-1 text-xs"
          placeholder="Title"
          onKeyDown={(e) => {
            if (e.key === "Enter") handleConfirm();
            if (e.key === "Escape") handleCancel();
          }}
          autoFocus
        />
        <Button
          variant="ghost"
          size="icon"
          className="size-5"
          onClick={handleConfirm}
        >
          <CheckIcon className="size-3" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="size-5"
          onClick={handleCancel}
        >
          <XIcon className="size-3" />
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center">
      <div
        className="group flex cursor-pointer items-center gap-1 rounded-md bg-muted px-2 py-1 text-xs transition-colors hover:bg-muted/80"
        draggable
        onDragStart={() => onDragStart(index)}
        onDragOver={(e) => onDragOver(e, index)}
        onDrop={() => onDrop(index)}
      >
        <GripVerticalIcon className="size-3 cursor-grab text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
        {column.icon && <span>{column.icon}</span>}
        <span className="font-medium">{column.title}</span>
        <button
          type="button"
          onClick={() => setIsEditing(true)}
          className="ml-1 opacity-0 transition-opacity group-hover:opacity-100"
        >
          <PencilIcon className="size-3 text-muted-foreground hover:text-foreground" />
        </button>
        {canRemove && (
          <button
            type="button"
            onClick={() => onRemove(index)}
            className="opacity-0 transition-opacity group-hover:opacity-100"
          >
            <Trash2Icon className="size-3 text-muted-foreground hover:text-destructive" />
          </button>
        )}
      </div>
      {!isLast && (
        <ArrowRightIcon className="mx-1 size-3 text-muted-foreground/50" />
      )}
    </div>
  );
}

/** Editable label chip. */
function EditableLabelChip({
  label,
  index,
  onUpdate,
  onRemove,
}: {
  label: ProposedLabel;
  index: number;
  onUpdate: (index: number, updates: Partial<ProposedLabel>) => void;
  onRemove: (index: number) => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(label.name);
  const [editColor, setEditColor] = useState(label.color);

  const handleConfirm = useCallback(() => {
    if (editName.trim()) {
      onUpdate(index, {
        name: editName.trim(),
        color: editColor,
      });
    }
    setIsEditing(false);
  }, [editName, editColor, index, onUpdate]);

  const handleCancel = useCallback(() => {
    setEditName(label.name);
    setEditColor(label.color);
    setIsEditing(false);
  }, [label]);

  if (isEditing) {
    return (
      <div className="flex items-center gap-1 rounded-md border border-primary bg-background p-1">
        <Input
          value={editName}
          onChange={(e) => setEditName(e.target.value)}
          className="h-6 w-20 px-1 text-xs"
          placeholder="Label"
          onKeyDown={(e) => {
            if (e.key === "Enter") handleConfirm();
            if (e.key === "Escape") handleCancel();
          }}
          autoFocus
        />
        <select
          value={editColor}
          onChange={(e) => setEditColor(e.target.value)}
          className="h-6 rounded border bg-background px-1 text-xs"
        >
          {LABEL_COLOR_OPTIONS.map((color) => (
            <option key={color} value={color}>
              {color}
            </option>
          ))}
        </select>
        <Button
          variant="ghost"
          size="icon"
          className="size-5"
          onClick={handleConfirm}
        >
          <CheckIcon className="size-3" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="size-5"
          onClick={handleCancel}
        >
          <XIcon className="size-3" />
        </Button>
      </div>
    );
  }

  return (
    <div className="group relative inline-flex">
      <span
        className={cn(
          "rounded-full px-2 py-0.5 font-medium text-xs",
          LABEL_COLORS[label.color] ?? LABEL_COLORS.gray,
        )}
      >
        {label.name}
      </span>
      <div className="absolute -top-1 -right-1 flex gap-0.5 opacity-0 transition-opacity group-hover:opacity-100">
        <button
          type="button"
          onClick={() => setIsEditing(true)}
          className="rounded-full bg-background p-0.5 shadow-sm"
        >
          <PencilIcon className="size-2.5 text-muted-foreground hover:text-foreground" />
        </button>
        <button
          type="button"
          onClick={() => onRemove(index)}
          className="rounded-full bg-background p-0.5 shadow-sm"
        >
          <XIcon className="size-2.5 text-muted-foreground hover:text-destructive" />
        </button>
      </div>
    </div>
  );
}

/**
 * Visual preview card for a project proposal.
 *
 * Shows the proposed project structure including name, prefix,
 * columns (as workflow flow), labels, and initial tasks.
 *
 * When `editable` is true, enables inline editing of all fields.
 */
export function ProjectProposalCard({
  proposal,
  editable = false,
  onProposalChange,
}: ProjectProposalCardProps) {
  // Drag state for column reordering
  const [draggedColumnIndex, setDraggedColumnIndex] = useState<number | null>(
    null,
  );
  const [addingColumn, setAddingColumn] = useState(false);
  const [newColumnTitle, setNewColumnTitle] = useState("");
  const [newColumnIcon, setNewColumnIcon] = useState("");
  const [addingLabel, setAddingLabel] = useState(false);
  const [newLabelName, setNewLabelName] = useState("");
  const [newLabelColor, setNewLabelColor] = useState("blue");

  // Update handlers
  const updateProposal = useCallback(
    (updates: Partial<ProjectProposal>) => {
      if (onProposalChange) {
        onProposalChange({ ...proposal, ...updates });
      }
    },
    [proposal, onProposalChange],
  );

  const handleNameChange = useCallback(
    (name: string) => {
      updateProposal({ name });
    },
    [updateProposal],
  );

  const handlePrefixChange = useCallback(
    (prefix: string) => {
      updateProposal({
        prefix: prefix.toUpperCase().replace(/[^A-Z0-9]/g, ""),
      });
    },
    [updateProposal],
  );

  const handleDescriptionChange = useCallback(
    (description: string) => {
      updateProposal({ description: description || undefined });
    },
    [updateProposal],
  );

  // Column handlers
  const handleColumnUpdate = useCallback(
    (index: number, updates: Partial<ProposedColumn>) => {
      const newColumns = [...proposal.columns];
      newColumns[index] = { ...newColumns[index], ...updates };
      updateProposal({ columns: newColumns });
    },
    [proposal.columns, updateProposal],
  );

  const handleColumnRemove = useCallback(
    (index: number) => {
      if (proposal.columns.length <= 2) return; // Min 2 columns
      const newColumns = proposal.columns.filter((_, i) => i !== index);
      // Update task columnIndex for tasks after removed column
      const newTasks = proposal.initialTasks?.map((task) => ({
        ...task,
        columnIndex:
          task.columnIndex > index
            ? task.columnIndex - 1
            : task.columnIndex >= newColumns.length
              ? newColumns.length - 1
              : task.columnIndex,
      }));
      updateProposal({ columns: newColumns, initialTasks: newTasks });
    },
    [proposal.columns, proposal.initialTasks, updateProposal],
  );

  const handleAddColumn = useCallback(() => {
    if (!newColumnTitle.trim()) return;
    const newColumns = [
      ...proposal.columns,
      { title: newColumnTitle.trim(), icon: newColumnIcon.trim() || undefined },
    ];
    updateProposal({ columns: newColumns });
    setNewColumnTitle("");
    setNewColumnIcon("");
    setAddingColumn(false);
  }, [newColumnTitle, newColumnIcon, proposal.columns, updateProposal]);

  const handleColumnDragStart = useCallback((index: number) => {
    setDraggedColumnIndex(index);
  }, []);

  const handleColumnDragOver = useCallback(
    (e: React.DragEvent, _index: number) => {
      e.preventDefault();
    },
    [],
  );

  const handleColumnDrop = useCallback(
    (targetIndex: number) => {
      if (draggedColumnIndex === null || draggedColumnIndex === targetIndex)
        return;

      const newColumns = [...proposal.columns];
      const [draggedColumn] = newColumns.splice(draggedColumnIndex, 1);
      newColumns.splice(targetIndex, 0, draggedColumn);

      // Update task columnIndex for tasks
      const newTasks = proposal.initialTasks?.map((task) => {
        if (task.columnIndex === draggedColumnIndex) {
          return { ...task, columnIndex: targetIndex };
        }
        if (draggedColumnIndex < targetIndex) {
          if (
            task.columnIndex > draggedColumnIndex &&
            task.columnIndex <= targetIndex
          ) {
            return { ...task, columnIndex: task.columnIndex - 1 };
          }
        } else {
          if (
            task.columnIndex >= targetIndex &&
            task.columnIndex < draggedColumnIndex
          ) {
            return { ...task, columnIndex: task.columnIndex + 1 };
          }
        }
        return task;
      });

      updateProposal({ columns: newColumns, initialTasks: newTasks });
      setDraggedColumnIndex(null);
    },
    [
      draggedColumnIndex,
      proposal.columns,
      proposal.initialTasks,
      updateProposal,
    ],
  );

  // Label handlers
  const handleLabelUpdate = useCallback(
    (index: number, updates: Partial<ProposedLabel>) => {
      const newLabels = [...(proposal.labels ?? [])];
      newLabels[index] = { ...newLabels[index], ...updates };
      updateProposal({ labels: newLabels });
    },
    [proposal.labels, updateProposal],
  );

  const handleLabelRemove = useCallback(
    (index: number) => {
      const newLabels = (proposal.labels ?? []).filter((_, i) => i !== index);
      updateProposal({ labels: newLabels.length > 0 ? newLabels : undefined });
    },
    [proposal.labels, updateProposal],
  );

  const handleAddLabel = useCallback(() => {
    if (!newLabelName.trim()) return;
    const newLabels = [
      ...(proposal.labels ?? []),
      { name: newLabelName.trim(), color: newLabelColor },
    ];
    updateProposal({ labels: newLabels });
    setNewLabelName("");
    setNewLabelColor("blue");
    setAddingLabel(false);
  }, [newLabelName, newLabelColor, proposal.labels, updateProposal]);

  return (
    <div className="rounded-lg border border-border bg-card shadow-sm">
      {/* Header */}
      <div className="border-border border-b px-4 py-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            {editable ? (
              <EditableText
                value={proposal.name}
                onChange={handleNameChange}
                className="font-semibold text-base text-foreground"
                inputClassName="font-semibold text-base"
                placeholder="Project name"
              />
            ) : (
              <h3 className="font-semibold text-base text-foreground">
                {proposal.name}
              </h3>
            )}
            <p className="mt-0.5 text-muted-foreground text-xs">
              Task prefix:{" "}
              {editable ? (
                <EditableText
                  value={proposal.prefix}
                  onChange={handlePrefixChange}
                  className="inline font-mono"
                  inputClassName="w-16 font-mono"
                  placeholder="PRE"
                />
              ) : (
                <span className="font-mono">{proposal.prefix}</span>
              )}
            </p>
          </div>
          <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
            <LayersIcon className="size-4" />
          </div>
        </div>
        {editable ? (
          <EditableText
            value={proposal.description ?? ""}
            onChange={handleDescriptionChange}
            className="mt-2 text-muted-foreground text-sm"
            inputClassName="text-sm"
            placeholder="Add description..."
          />
        ) : (
          proposal.description && (
            <p className="mt-2 text-muted-foreground text-sm">
              {proposal.description}
            </p>
          )
        )}
      </div>

      {/* Columns Flow */}
      <div className="border-border border-b px-4 py-3">
        <div className="mb-2 flex items-center gap-1.5 text-muted-foreground text-xs">
          <CheckIcon className="size-3" />
          <span className="font-medium">Workflow Columns</span>
          <span className="text-muted-foreground/60">
            ({proposal.columns.length})
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-1">
          {editable
            ? proposal.columns.map((col, index) => (
                <EditableColumnChip
                  key={`${col.title}-${index}`}
                  column={col}
                  index={index}
                  isLast={index === proposal.columns.length - 1}
                  onUpdate={handleColumnUpdate}
                  onRemove={handleColumnRemove}
                  canRemove={proposal.columns.length > 2}
                  onDragStart={handleColumnDragStart}
                  onDragOver={handleColumnDragOver}
                  onDrop={handleColumnDrop}
                />
              ))
            : proposal.columns.map((col, index) => (
                <div key={col.title} className="flex items-center">
                  <div className="flex items-center gap-1 rounded-md bg-muted px-2 py-1 text-xs">
                    {col.icon && <span>{col.icon}</span>}
                    <span className="font-medium">{col.title}</span>
                  </div>
                  {index < proposal.columns.length - 1 && (
                    <ArrowRightIcon className="mx-1 size-3 text-muted-foreground/50" />
                  )}
                </div>
              ))}
          {editable && proposal.columns.length < 10 && (
            <>
              {addingColumn ? (
                <div className="flex items-center gap-1 rounded-md border border-primary bg-background p-1">
                  <Input
                    value={newColumnIcon}
                    onChange={(e) => setNewColumnIcon(e.target.value)}
                    className="h-6 w-8 px-1 text-center text-xs"
                    placeholder="📋"
                    maxLength={2}
                  />
                  <Input
                    value={newColumnTitle}
                    onChange={(e) => setNewColumnTitle(e.target.value)}
                    className="h-6 w-20 px-1 text-xs"
                    placeholder="Title"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleAddColumn();
                      if (e.key === "Escape") {
                        setAddingColumn(false);
                        setNewColumnTitle("");
                        setNewColumnIcon("");
                      }
                    }}
                    autoFocus
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-5"
                    onClick={handleAddColumn}
                  >
                    <CheckIcon className="size-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-5"
                    onClick={() => {
                      setAddingColumn(false);
                      setNewColumnTitle("");
                      setNewColumnIcon("");
                    }}
                  >
                    <XIcon className="size-3" />
                  </Button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setAddingColumn(true)}
                  className="flex items-center gap-1 rounded-md border border-muted-foreground/30 border-dashed px-2 py-1 text-muted-foreground text-xs transition-colors hover:border-primary hover:text-primary"
                >
                  <PlusIcon className="size-3" />
                  Add
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {/* Labels */}
      {(editable || (proposal.labels && proposal.labels.length > 0)) && (
        <div className="border-border border-b px-4 py-3">
          <div className="mb-2 flex items-center gap-1.5 text-muted-foreground text-xs">
            <TagIcon className="size-3" />
            <span className="font-medium">Labels</span>
            <span className="text-muted-foreground/60">
              ({proposal.labels?.length ?? 0})
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {editable
              ? proposal.labels?.map((label, index) => (
                  <EditableLabelChip
                    key={`${label.name}-${index}`}
                    label={label}
                    index={index}
                    onUpdate={handleLabelUpdate}
                    onRemove={handleLabelRemove}
                  />
                ))
              : proposal.labels?.map((label) => (
                  <span
                    key={label.name}
                    className={cn(
                      "rounded-full px-2 py-0.5 font-medium text-xs",
                      LABEL_COLORS[label.color] ?? LABEL_COLORS.gray,
                    )}
                  >
                    {label.name}
                  </span>
                ))}
            {editable && (proposal.labels?.length ?? 0) < 10 && (
              <>
                {addingLabel ? (
                  <div className="flex items-center gap-1 rounded-md border border-primary bg-background p-1">
                    <Input
                      value={newLabelName}
                      onChange={(e) => setNewLabelName(e.target.value)}
                      className="h-6 w-20 px-1 text-xs"
                      placeholder="Label"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleAddLabel();
                        if (e.key === "Escape") {
                          setAddingLabel(false);
                          setNewLabelName("");
                          setNewLabelColor("blue");
                        }
                      }}
                      autoFocus
                    />
                    <select
                      value={newLabelColor}
                      onChange={(e) => setNewLabelColor(e.target.value)}
                      className="h-6 rounded border bg-background px-1 text-xs"
                    >
                      {LABEL_COLOR_OPTIONS.map((color) => (
                        <option key={color} value={color}>
                          {color}
                        </option>
                      ))}
                    </select>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-5"
                      onClick={handleAddLabel}
                    >
                      <CheckIcon className="size-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-5"
                      onClick={() => {
                        setAddingLabel(false);
                        setNewLabelName("");
                        setNewLabelColor("blue");
                      }}
                    >
                      <XIcon className="size-3" />
                    </Button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setAddingLabel(true)}
                    className="flex items-center gap-1 rounded-full border border-muted-foreground/30 border-dashed px-2 py-0.5 text-muted-foreground text-xs transition-colors hover:border-primary hover:text-primary"
                  >
                    <PlusIcon className="size-3" />
                    Add
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {/* Initial Tasks */}
      {proposal.initialTasks && proposal.initialTasks.length > 0 && (
        <div className="px-4 py-3">
          <div className="mb-2 flex items-center gap-1.5 text-muted-foreground text-xs">
            <ListTodoIcon className="size-3" />
            <span className="font-medium">Initial Tasks</span>
            <span className="text-muted-foreground/60">
              ({proposal.initialTasks.length})
            </span>
          </div>
          <ul className="space-y-1">
            {proposal.initialTasks.slice(0, 5).map((task, index) => (
              <li
                key={`${task.title}-${index}`}
                className="flex items-center gap-2 text-sm"
              >
                <span className="size-1.5 shrink-0 rounded-full bg-muted-foreground/30" />
                <span className="truncate text-foreground">{task.title}</span>
                <span className="shrink-0 text-muted-foreground text-xs">
                  in {proposal.columns[task.columnIndex]?.title ?? "Unknown"}
                </span>
              </li>
            ))}
            {proposal.initialTasks.length > 5 && (
              <li className="text-muted-foreground text-xs">
                +{proposal.initialTasks.length - 5} more tasks
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
