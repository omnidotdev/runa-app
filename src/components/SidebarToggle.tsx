import { PanelLeft, PanelLeftClose } from 'lucide-react';

interface SidebarToggleProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

export function SidebarToggle({ isCollapsed, onToggle }: SidebarToggleProps) {
  return (
    <button
      onClick={onToggle}
      className={`absolute top-1/2 -translate-y-1/2 p-1.5 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full shadow-md transition-all z-50 ${
        isCollapsed ? 'left-3' : 'left-[232px]'
      }`}
      title={isCollapsed ? "Show sidebar" : "Hide sidebar"}
    >
      {isCollapsed ? (
        <PanelLeft className="w-4 h-4 text-gray-500 dark:text-gray-400" />
      ) : (
        <PanelLeftClose className="w-4 h-4 text-gray-500 dark:text-gray-400" />
      )}
    </button>
  );
}