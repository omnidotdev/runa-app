import { format } from "date-fns";
import { Calendar } from "lucide-react";
import { useRef } from "react";

interface DatePickerProps {
  dueDate?: string;
  isOpen: boolean;
  onToggle: () => void;
  onDateSubmit: () => void;
  onDateRemove: () => void;
  dateInput: string;
  onDateInputChange: (value: string) => void;
}

const DatePicker = ({
  dueDate,
  isOpen,
  onToggle,
  onDateSubmit,
  onDateRemove,
  dateInput,
  onDateInputChange,
}: DatePickerProps) => {
  const dateInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => {
          onToggle();
          if (!isOpen) {
            setTimeout(() => dateInputRef.current?.focus(), 0);
          }
        }}
        className="flex items-center gap-2 rounded-md border border-base-200 bg-white px-3 py-2 font-medium text-base-700 text-sm hover:bg-base-50 dark:border-base-700 dark:bg-base-800 dark:text-base-200 dark:hover:bg-base-700"
      >
        <Calendar className="h-4 w-4" />
        <span>
          {dueDate ? format(new Date(dueDate), "MMM d, yyyy") : "Set due date"}
        </span>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 z-20 mt-1 w-64 rounded-md border border-base-200 bg-white p-3 shadow-lg dark:border-base-700 dark:bg-base-800">
          <input
            ref={dateInputRef}
            type="text"
            value={dateInput}
            onChange={(e) => onDateInputChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                onDateSubmit();
              }
            }}
            placeholder="Type a date (e.g., next monday)"
            className="w-full rounded border border-base-200 bg-white px-2 py-1 text-base-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:border-base-700 dark:bg-base-700 dark:text-base-100"
          />
          <div className="mt-2 text-base-500 text-xs dark:text-base-400">
            Try: "tomorrow", "next monday", "in 2 weeks"
          </div>
          {dueDate && (
            <button
              type="button"
              onClick={onDateRemove}
              className="mt-2 text-red-500 text-xs hover:text-red-600 dark:text-red-400 dark:hover:text-red-300"
            >
              Remove due date
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default DatePicker;
