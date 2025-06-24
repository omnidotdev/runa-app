import { LayoutGrid, List, Search, Settings } from "lucide-react";

import type { Project } from "@/types";

interface HeaderProps {
  project: Project;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onViewModeChange: (viewMode: "board" | "list") => void;
  onOpenSettings: () => void;
}

const Header = ({
  project,
  searchQuery,
  onSearchChange,
  onViewModeChange,
  onOpenSettings,
}: HeaderProps) => {
  return (
    <div className="border-base-200 border-b px-6 py-4 dark:border-base-700">
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="mb-1 font-bold text-2xl text-base-800 sm:mb-2 sm:text-3xl dark:text-base-100">
            {project.name}
          </h1>
          {project.description && (
            <p className="text-base-600 text-sm sm:text-base dark:text-base-300">
              {project.description}
            </p>
          )}
        </div>
        <div className="flex flex-wrap gap-2 sm:flex-nowrap">
          <div className="relative flex-1 sm:flex-none">
            <Search className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 text-base-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search tasks..."
              className="w-full rounded-md border border-base-200 bg-white py-2 pr-4 pl-9 text-base-900 text-sm placeholder-base-500 focus:outline-none focus:ring-2 focus:ring-primary-500 sm:w-64 dark:border-base-700 dark:bg-base-800 dark:text-base-100 dark:placeholder-base-400"
            />
          </div>
          <button
            type="button"
            onClick={() =>
              onViewModeChange(project.viewMode === "board" ? "list" : "board")
            }
            className="flex items-center gap-2 whitespace-nowrap rounded-md border border-base-200 bg-white px-3 py-2 font-medium text-base-700 text-sm hover:bg-base-50 dark:border-base-700 dark:bg-base-800 dark:text-base-200 dark:hover:bg-base-700"
          >
            {project.viewMode === "board" ? (
              <>
                <List className="h-4 w-4" />
                List View
              </>
            ) : (
              <>
                <LayoutGrid className="h-4 w-4" />
                Board View
              </>
            )}
          </button>
          <button
            type="button"
            onClick={onOpenSettings}
            className="flex items-center gap-2 whitespace-nowrap rounded-md border border-base-200 bg-white px-3 py-2 font-medium text-base-700 text-sm hover:bg-base-50 dark:border-base-700 dark:bg-base-800 dark:text-base-200 dark:hover:bg-base-700"
          >
            <Settings className="h-4 w-4" />
            Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default Header;
