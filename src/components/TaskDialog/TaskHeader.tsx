import { Save, Trash, X } from "lucide-react";

import type { Task } from "@/types";

interface TaskHeaderProps {
  task: Task;
  content: string;
  isNew: boolean;
  isEditing: boolean;
  itemType: string;
  displayId: string;
  projectPrefix?: string;
  isSaving?: boolean;
  onContentChange: (content: string) => void;
  onSave: (e: React.MouseEvent) => void;
  onDelete: () => void;
  onClose: () => void;
  onEditStart: () => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
}

const TaskHeader = ({
  task,
  content,
  isNew,
  isEditing,
  itemType,
  displayId,
  projectPrefix,
  isSaving,
  onContentChange,
  onSave,
  onDelete,
  onClose,
  onEditStart,
  onKeyDown,
}: TaskHeaderProps) => {
  return (
    <div className="flex items-start justify-between border-gray-200 border-b p-6 dark:border-gray-700">
      <div className="flex-1">
        <div className="mb-2 flex items-center gap-2 text-sm">
          <span className="font-medium font-mono text-gray-400 dark:text-gray-500">
            {projectPrefix ? `${projectPrefix}-${displayId}` : `#${displayId}`}
          </span>
          {isNew || isEditing ? (
            <input
              type="text"
              value={content}
              onChange={(e) => onContentChange(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder={`${itemType} title`}
              className="w-full border-none bg-transparent font-semibold text-gray-900 text-xl focus:outline-none focus:ring-0 dark:text-gray-100"
              // biome-ignore lint/a11y/noAutofocus: TODO
              autoFocus
              disabled={isSaving}
            />
          ) : (
            <h2
              className="cursor-pointer font-semibold text-gray-900 text-xl hover:text-gray-700 dark:text-gray-100 dark:hover:text-gray-300"
              onClick={onEditStart}
            >
              {task.content}
            </h2>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2">
        {!isNew && (
          <>
            {isEditing ? (
              <button
                type="button"
                onClick={onSave}
                disabled={isSaving}
                className="text-gray-500 hover:text-green-500 disabled:cursor-not-allowed disabled:opacity-50 dark:text-gray-400 dark:hover:text-green-400"
              >
                <Save className="h-5 w-5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={onDelete}
                disabled={isSaving}
                className="text-gray-500 hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-50 dark:text-gray-400 dark:hover:text-red-400"
              >
                <Trash className="h-5 w-5" />
              </button>
            )}
          </>
        )}
        <button
          type="button"
          onClick={onClose}
          disabled={isSaving}
          className="text-gray-500 hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-50 dark:text-gray-400 dark:hover:text-gray-300"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default TaskHeader;
