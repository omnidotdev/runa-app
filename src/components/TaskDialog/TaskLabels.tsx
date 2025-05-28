import { useState, useRef, useEffect } from 'react';
import { Tag, Plus, X } from 'lucide-react';

interface TaskLabelsProps {
  labels: string[];
  projectLabels: string[];
  onChange: (labels: string[]) => void;
}

export function TaskLabels({ labels, projectLabels, onChange }: TaskLabelsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [newLabel, setNewLabel] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setNewLabel('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleAddLabel = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLabel.trim()) return;

    const updatedLabels = [...labels, newLabel.trim()];
    onChange(updatedLabels);
    setNewLabel('');
    inputRef.current?.focus();
  };

  const handleRemoveLabel = (labelToRemove: string) => {
    const updatedLabels = labels.filter(label => label !== labelToRemove);
    onChange(updatedLabels);
  };

  const handleToggleLabel = (label: string) => {
    const isSelected = labels.includes(label);
    const updatedLabels = isSelected
      ? labels.filter(l => l !== label)
      : [...labels, label];
    onChange(updatedLabels);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
      >
        <Tag className="w-4 h-4" />
        <span>{labels.length > 0 ? `${labels.length} labels` : 'Add labels'}</span>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-64 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 p-2 z-20">
          <form onSubmit={handleAddLabel} className="mb-2">
            <input
              ref={inputRef}
              type="text"
              value={newLabel}
              onChange={(e) => setNewLabel(e.target.value)}
              placeholder="Add new label..."
              className="w-full px-2 py-1 text-sm bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-gray-100"
              autoFocus
            />
          </form>

          {labels.length > 0 && (
            <div className="mb-2 p-2 bg-gray-50 dark:bg-gray-700/50 rounded">
              <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                Applied Labels
              </div>
              <div className="flex flex-wrap gap-1">
                {labels.map((label, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                  >
                    {label}
                    <button
                      onClick={() => handleRemoveLabel(label)}
                      className="hover:text-red-500 dark:hover:text-red-400"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}

          {projectLabels.length > 0 && (
            <div>
              <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                Project Labels
              </div>
              <div className="space-y-1">
                {projectLabels.map((label, index) => (
                  <button
                    key={index}
                    onClick={() => handleToggleLabel(label)}
                    className="w-full flex items-center justify-between px-2 py-1 text-sm rounded hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <span className="text-gray-900 dark:text-gray-100">{label}</span>
                    {labels.includes(label) && (
                      <div className="w-2 h-2 rounded-full bg-blue-500" />
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
}
