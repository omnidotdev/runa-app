import { Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { useRef } from 'react';

interface DatePickerProps {
  dueDate?: string;
  isOpen: boolean;
  onToggle: () => void;
  onDateSubmit: () => void;
  onDateRemove: () => void;
  dateInput: string;
  onDateInputChange: (value: string) => void;
}

export function DatePicker({
  dueDate,
  isOpen,
  onToggle,
  onDateSubmit,
  onDateRemove,
  dateInput,
  onDateInputChange,
}: DatePickerProps) {
  const dateInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="relative">
      <button
        onClick={() => {
          onToggle();
          if (!isOpen) {
            setTimeout(() => dateInputRef.current?.focus(), 0);
          }
        }}
        className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
      >
        <Calendar className="w-4 h-4" />
        <span>{dueDate ? format(new Date(dueDate), 'MMM d, yyyy') : 'Set due date'}</span>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-64 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 p-3 z-20">
          <input
            ref={dateInputRef}
            type="text"
            value={dateInput}
            onChange={(e) => onDateInputChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                onDateSubmit();
              }
            }}
            placeholder="Type a date (e.g., next monday)"
            className="w-full px-2 py-1 text-sm border border-gray-200 dark:border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          />
          <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            Try: "tomorrow", "next monday", "in 2 weeks"
          </div>
          {dueDate && (
            <button
              onClick={onDateRemove}
              className="mt-2 text-xs text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300"
            >
              Remove due date
            </button>
          )}
        </div>
      )}
    </div>
  );
}
