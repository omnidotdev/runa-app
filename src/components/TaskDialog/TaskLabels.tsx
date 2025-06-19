import { Tag, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface TaskLabelsProps {
  labels: string[];
  projectLabels: string[];
  onChange: (labels: string[]) => void;
}

const TaskLabels = ({ labels, projectLabels, onChange }: TaskLabelsProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [newLabel, setNewLabel] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
        setNewLabel("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleAddLabel = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLabel.trim()) return;

    const updatedLabels = [...labels, newLabel.trim()];
    onChange(updatedLabels);
    setNewLabel("");
    inputRef.current?.focus();
  };

  const handleRemoveLabel = (labelToRemove: string) => {
    const updatedLabels = labels.filter((label) => label !== labelToRemove);
    onChange(updatedLabels);
  };

  const handleToggleLabel = (label: string) => {
    const isSelected = labels.includes(label);
    const updatedLabels = isSelected
      ? labels.filter((l) => l !== label)
      : [...labels, label];
    onChange(updatedLabels);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-md border border-gray-200 bg-white px-3 py-2 font-medium text-gray-700 text-sm hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
      >
        <Tag className="h-4 w-4" />
        <span>
          {labels.length > 0 ? `${labels.length} labels` : "Add labels"}
        </span>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 z-20 mt-1 w-64 rounded-md border border-gray-200 bg-white p-2 shadow-lg dark:border-gray-700 dark:bg-gray-800">
          <form onSubmit={handleAddLabel} className="mb-2">
            <input
              ref={inputRef}
              type="text"
              value={newLabel}
              onChange={(e) => setNewLabel(e.target.value)}
              placeholder="Add new label..."
              className="w-full rounded border border-gray-200 bg-white px-2 py-1 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
              // biome-ignore lint/a11y/noAutofocus: TODO
              autoFocus
            />
          </form>

          {labels.length > 0 && (
            <div className="mb-2 rounded bg-gray-50 p-2 dark:bg-gray-700/50">
              <div className="mb-1 font-medium text-gray-500 text-xs dark:text-gray-400">
                Applied Labels
              </div>
              <div className="flex flex-wrap gap-1">
                {labels.map((label, index) => (
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

          {projectLabels.length > 0 && (
            <div>
              <div className="mb-1 font-medium text-gray-500 text-xs dark:text-gray-400">
                Project Labels
              </div>
              <div className="space-y-1">
                {projectLabels.map((label, index) => (
                  <button
                    type="button"
                    key={index}
                    onClick={() => handleToggleLabel(label)}
                    className="flex w-full items-center justify-between rounded px-2 py-1 text-sm hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <span className="text-gray-900 dark:text-gray-100">
                      {label}
                    </span>
                    {labels.includes(label) && (
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
  );
};

export default TaskLabels;
