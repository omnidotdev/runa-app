import { X, Trash, Save } from 'lucide-react';
import { Task } from '@/types';

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

export function TaskHeader({
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
}: TaskHeaderProps) {
  return (
    <div className="p-6 flex items-start justify-between border-b border-gray-200 dark:border-gray-700">
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-2 text-sm">
          <span className="font-mono text-gray-400 dark:text-gray-500 font-medium">
            {projectPrefix ? `${projectPrefix}-${displayId}` : `#${displayId}`}
          </span>
          {(isNew || isEditing) ? (
            <input
              type="text"
              value={content}
              onChange={(e) => onContentChange(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder={`${itemType} title`}
              className="text-xl font-semibold text-gray-900 dark:text-gray-100 w-full bg-transparent border-none focus:outline-none focus:ring-0"
              autoFocus
              disabled={isSaving}
            />
          ) : (
            <h2
              className="text-xl font-semibold text-gray-900 dark:text-gray-100 cursor-pointer hover:text-gray-700 dark:hover:text-gray-300"
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
                onClick={onSave}
                disabled={isSaving}
                className="text-gray-500 dark:text-gray-400 hover:text-green-500 dark:hover:text-green-400 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="w-5 h-5" />
              </button>
            ) : (
              <button
                onClick={onDelete}
                disabled={isSaving}
                className="text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Trash className="w-5 h-5" />
              </button>
            )}
          </>
        )}
        <button
          onClick={onClose}
          disabled={isSaving}
          className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
