import { PanelLeft, PanelLeftClose } from "lucide-react";

interface SidebarToggleProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

const SidebarToggle = ({ isCollapsed, onToggle }: SidebarToggleProps) => {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`-translate-y-1/2 absolute top-1/2 z-50 rounded-full border border-base-200 bg-white p-1.5 shadow-md hover:bg-base-100 dark:border-base-700 dark:bg-base-800 dark:hover:bg-base-700 ${
        isCollapsed ? "left-3" : "left-[224px]"
      }`}
      title={isCollapsed ? "Show sidebar" : "Hide sidebar"}
    >
      {isCollapsed ? (
        <PanelLeft className="h-4 w-4 text-base-500 dark:text-base-400" />
      ) : (
        <PanelLeftClose className="h-4 w-4 text-base-500 dark:text-base-400" />
      )}
    </button>
  );
};

export default SidebarToggle;
