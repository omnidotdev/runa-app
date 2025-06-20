import { UserPlus } from "lucide-react";

import type { Assignee } from "@/types";

interface AssigneePickerProps {
  assignees: Assignee[];
  team: Assignee[];
  isOpen: boolean;
  onToggle: () => void;
  onAssigneeToggle: (assignee: Assignee) => void;
}

const AssigneePicker = ({
  assignees,
  team,
  isOpen,
  onToggle,
  onAssigneeToggle,
}: AssigneePickerProps) => {
  return (
    <div className="relative">
      <button
        type="button"
        onClick={onToggle}
        className="flex items-center gap-2 rounded-md border border-gray-200 bg-white px-3 py-2 font-medium text-gray-700 text-sm hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
      >
        {assignees.length > 0 ? (
          <div className="-space-x-2 flex">
            {assignees.map((assignee) => (
              <div
                key={assignee.id}
                className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-gray-200 font-medium text-gray-900 text-xs dark:border-gray-800 dark:bg-gray-600 dark:text-gray-100"
              >
                {assignee.name[0].toUpperCase()}
              </div>
            ))}
          </div>
        ) : (
          <UserPlus className="h-4 w-4" />
        )}
        <span>
          {assignees.length > 0 ? `${assignees.length} assigned` : "Assign"}
        </span>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 z-20 mt-1 w-64 rounded-md border border-gray-200 bg-white py-1 shadow-lg dark:border-gray-700 dark:bg-gray-800">
          {team.map((assignee) => (
            <button
              type="button"
              key={assignee.id}
              onClick={() => onAssigneeToggle(assignee)}
              className="flex w-full items-center justify-between px-4 py-2 text-left text-gray-900 text-sm hover:bg-gray-50 dark:text-gray-100 dark:hover:bg-gray-700"
            >
              <div className="flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-200 font-medium text-gray-900 text-xs dark:bg-gray-600 dark:text-gray-100">
                  {assignee.name[0].toUpperCase()}
                </div>
                <span>{assignee.name}</span>
              </div>
              {assignees.some((a) => a.id === assignee.id) && (
                <div className="h-2 w-2 rounded-full bg-primary-500" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default AssigneePicker;
