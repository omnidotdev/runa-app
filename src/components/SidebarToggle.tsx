import { PanelLeft, PanelLeftClose } from "lucide-react";

interface SidebarToggleProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

export function SidebarToggle({ isCollapsed, onToggle }: SidebarToggleProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`-translate-y-1/2 absolute top-1/2 z-50 rounded-full border border-gray-200 bg-white p-1.5 shadow-md hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 ${
        isCollapsed ? "left-3" : "left-[224px]"
      }`}
      title={isCollapsed ? "Show sidebar" : "Hide sidebar"}
    >
      {isCollapsed ? (
        <PanelLeft className="h-4 w-4 text-gray-500 dark:text-gray-400" />
      ) : (
        <PanelLeftClose className="h-4 w-4 text-gray-500 dark:text-gray-400" />
      )}
    </button>
  );
}
