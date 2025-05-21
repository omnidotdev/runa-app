import { forwardRef } from 'react';
import { Users, FileText, Folder } from 'lucide-react';

interface MentionListProps {
  items: any[];
  command: (item: any) => void;
  selectedIndex: number;
}

export const MentionList = forwardRef<HTMLDivElement, MentionListProps>(
  ({ items, command, selectedIndex }, ref) => {
    const getIcon = (type: string) => {
      switch (type) {
        case 'user':
          return <Users className="w-4 h-4 text-blue-500" />;
        case 'task':
          return <FileText className="w-4 h-4 text-purple-500" />;
        case 'project':
          return <Folder className="w-4 h-4 text-orange-500" />;
        default:
          return null;
      }
    };

    return (
      <div 
        ref={ref} 
        className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden z-50 min-w-[200px]"
      >
        {items.length ? (
          <div className="max-h-[300px] overflow-y-auto">
            {items.map((item, index) => (
              <button
                key={item.id}
                onMouseDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  command(item);
                }}
                className={`w-full flex items-center gap-2 px-3 py-2 text-sm text-left transition-colors ${
                  index === selectedIndex
                    ? 'bg-gray-100 dark:bg-gray-700'
                    : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
                }`}
              >
                {getIcon(item.type)}
                <div className="flex-1 min-w-0">
                  <span className="font-medium text-gray-900 dark:text-gray-100 flex items-center gap-2">
                    {item.label}
                    {item.type === 'task' && (
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        #{item.id}
                      </span>
                    )}
                  </span>
                  {item.description && (
                    <div className="text-gray-500 dark:text-gray-400 text-xs truncate">
                      {item.description}
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="p-4 text-sm text-gray-500 dark:text-gray-400 text-center">
            No results found
          </div>
        )}
      </div>
    );
  }
);