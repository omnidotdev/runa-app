import { List, LayoutGrid, Settings, Search } from 'lucide-react';
import { Project } from '@/types';

interface HeaderProps {
  project: Project;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onViewModeChange: (viewMode: 'board' | 'list') => void;
  onOpenSettings: () => void;
}

export function Header({
  project,
  searchQuery,
  onSearchChange,
  onViewModeChange,
  onOpenSettings,
}: HeaderProps) {
  return (
    <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-100 mb-1 sm:mb-2">
            {project.name}
          </h1>
          {project.description && (
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
              {project.description}
            </p>
          )}
        </div>
        <div className="flex gap-2 flex-wrap sm:flex-nowrap">
          <div className="relative flex-1 sm:flex-none">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search tasks..."
              className="pl-9 pr-4 py-2 w-full sm:w-64 text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
            />
          </div>
          <button
            onClick={() => onViewModeChange(project.viewMode === 'board' ? 'list' : 'board')}
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 whitespace-nowrap"
          >
            {project.viewMode === 'board' ? (
              <>
                <List className="w-4 h-4" />
                List View
              </>
            ) : (
              <>
                <LayoutGrid className="w-4 h-4" />
                Board View
              </>
            )}
          </button>
          <button
            onClick={onOpenSettings}
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 whitespace-nowrap"
          >
            <Settings className="w-4 h-4" />
            Settings
          </button>
        </div>
      </div>
    </div>
  );
}
