import { FileText, Folder, Users } from "lucide-react";
import { forwardRef } from "react";

interface MentionListProps {
  items: any[];
  command: (item: any) => void;
  selectedIndex: number;
}

export const MentionList = forwardRef<HTMLDivElement, MentionListProps>(
  ({ items, command, selectedIndex }, ref) => {
    const getIcon = (type: string) => {
      switch (type) {
        case "user":
          return <Users className="h-4 w-4 text-primary-500" />;
        case "task":
          return <FileText className="h-4 w-4 text-purple-500" />;
        case "project":
          return <Folder className="h-4 w-4 text-orange-500" />;
        default:
          return null;
      }
    };

    return (
      <div
        ref={ref}
        className="z-50 min-w-[200px] overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800"
      >
        {items.length ? (
          <div className="max-h-[300px] overflow-y-auto">
            {items.map((item, index) => (
              <button
                type="button"
                key={item.id}
                onMouseDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  command(item);
                }}
                className={`flex w-full items-center gap-2 px-3 py-2 text-left text-sm ${
                  index === selectedIndex
                    ? "bg-gray-100 dark:bg-gray-700"
                    : "hover:bg-gray-50 dark:hover:bg-gray-700/50"
                }`}
              >
                {getIcon(item.type)}
                <div className="min-w-0 flex-1">
                  <span className="flex items-center gap-2 font-medium text-gray-900 dark:text-gray-100">
                    {item.label}
                    {item.type === "task" && (
                      <span className="text-gray-500 text-xs dark:text-gray-400">
                        #{item.id}
                      </span>
                    )}
                  </span>
                  {item.description && (
                    <div className="truncate text-gray-500 text-xs dark:text-gray-400">
                      {item.description}
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="p-4 text-center text-gray-500 text-sm dark:text-gray-400">
            No results found
          </div>
        )}
      </div>
    );
  },
);
