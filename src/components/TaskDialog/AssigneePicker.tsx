import { UserPlus } from 'lucide-react';
import { Assignee } from '@/types';

interface AssigneePickerProps {
  assignees: Assignee[];
  team: Assignee[];
  isOpen: boolean;
  onToggle: () => void;
  onAssigneeToggle: (assignee: Assignee) => void;
}

export function AssigneePicker({
  assignees,
  team,
  isOpen,
  onToggle,
  onAssigneeToggle,
}: AssigneePickerProps) {
  return (
    <div className="relative">
      <button
        onClick={onToggle}
        className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
      >
        {assignees.length > 0 ? (
          <div className="flex -space-x-2">
            {assignees.map((assignee) => (
              <div
                key={assignee.id}
                className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center text-xs font-medium border-2 border-white dark:border-gray-800 text-gray-900 dark:text-gray-100"
              >
                {assignee.name[0].toUpperCase()}
              </div>
            ))}
          </div>
        ) : (
          <UserPlus className="w-4 h-4" />
        )}
        <span>{assignees.length > 0 ? `${assignees.length} assigned` : 'Assign'}</span>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-64 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-20">
          {team.map((assignee) => (
            <button
              key={assignee.id}
              onClick={() => onAssigneeToggle(assignee)}
              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center justify-between text-gray-900 dark:text-gray-100"
            >
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center text-xs font-medium text-gray-900 dark:text-gray-100">
                  {assignee.name[0].toUpperCase()}
                </div>
                <span>{assignee.name}</span>
              </div>
              {assignees.some(a => a.id === assignee.id) && (
                <div className="w-2 h-2 rounded-full bg-blue-500" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
