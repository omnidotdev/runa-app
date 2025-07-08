import { formatDistanceToNowStrict } from "date-fns";
import {
  Bell,
  CheckCheck,
  CheckIcon,
  GitBranch,
  MessageCircle,
  User,
} from "lucide-react";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const Route = createFileRoute({
  component: NotificationsPage,
});

type NotificationType =
  | "mention"
  | "comment"
  | "column_update"
  | "task_assignment";

interface NotificationsItem {
  id: string;
  type: NotificationType;
  title: string;
  description: string;
  timestamp: Date;
  isRead: boolean;
  author: {
    name: string;
    avatar?: string;
  };
  taskTitle?: string;
  projectName?: string;
}

const mockNotificationsItems: NotificationsItem[] = [
  {
    id: "1",
    type: "mention",
    title: "You were mentioned in a comment",
    description:
      "Sarah mentioned you in the discussion about the new feature implementation.",
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    isRead: false,
    author: { name: "Sarah Johnson" },
    taskTitle: "Implement user authentication",
    projectName: "Web App Project",
  },
  {
    id: "2",
    type: "comment",
    title: "New comment on your task",
    description:
      "Mike added a comment to your task with additional requirements.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    isRead: false,
    author: { name: "Mike Chen" },
    taskTitle: "Fix login bug",
    projectName: "Bug Fixes",
  },
  {
    id: "3",
    type: "column_update",
    title: 'Task moved to "In Progress"',
    description:
      'Your task "Design new dashboard" was moved from "To Do" to "In Progress".',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4), // 4 hours ago
    isRead: true,
    author: { name: "Alex Rodriguez" },
    taskTitle: "Design new dashboard",
    projectName: "UI/UX Project",
  },
  {
    id: "4",
    type: "task_assignment",
    title: "New task assigned to you",
    description: "You have been assigned a new task in the Mobile App project.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6), // 6 hours ago
    isRead: true,
    author: { name: "Emma Wilson" },
    taskTitle: "Implement push notifications",
    projectName: "Mobile App Project",
  },
  {
    id: "5",
    type: "mention",
    title: "You were mentioned in a comment",
    description: "John mentioned you in the code review discussion.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    isRead: false,
    author: { name: "John Smith" },
    taskTitle: "Code review cleanup",
    projectName: "Development",
  },
  {
    id: "6",
    type: "comment",
    title: "New comment on your task",
    description: "Lisa provided feedback on the API documentation.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
    isRead: true,
    author: { name: "Lisa Park" },
    taskTitle: "Write API documentation",
    projectName: "Documentation",
  },
];

function NotificationsPage() {
  const [items, setItems] = useState<NotificationsItem[]>(
    mockNotificationsItems,
  );
  const [filter, setFilter] = useState<"all" | "unread" | NotificationType>(
    "all",
  );

  const filteredItems = items.filter((item) => {
    if (filter === "all") return true;
    if (filter === "unread") return !item.isRead;
    return item.type === filter;
  });

  const unreadCount = items.filter((item) => !item.isRead).length;

  const markAsRead = (id: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isRead: true } : item)),
    );
  };

  const markAllAsRead = () => {
    setItems((prev) => prev.map((item) => ({ ...item, isRead: true })));
  };

  const getTypeIcon = (type: NotificationType) => {
    switch (type) {
      case "mention":
        return <User className="size-4" />;
      case "comment":
        return <MessageCircle className="size-4" />;
      case "column_update":
        return <GitBranch className="size-4" />;
      case "task_assignment":
        return <Bell className="size-4" />;
      default:
        return <Bell className="size-4" />;
    }
  };

  const getTypeColor = (type: NotificationType) => {
    switch (type) {
      case "mention":
        return "text-primary-600 bg-primary-50 dark:text-primary-400 dark:bg-primary-950";
      case "comment":
        return "text-green-600 bg-green-50 dark:text-green-400 dark:bg-green-950";
      case "column_update":
        return "text-purple-600 bg-purple-50 dark:text-purple-400 dark:bg-purple-950";
      case "task_assignment":
        return "text-orange-600 bg-orange-50 dark:text-orange-400 dark:bg-orange-950";
      default:
        return "text-gray-600 bg-gray-50 dark:text-gray-400 dark:bg-gray-800";
    }
  };

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="font-semibold text-2xl">Notifications</h1>
            <Badge
              size="sm"
              className={cn(
                "mt-0.5 bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400",
                unreadCount === 0 && "invisible",
              )}
            >
              {unreadCount} unread
            </Badge>
          </div>

          <Button
            variant="outline"
            onClick={markAllAsRead}
            className={cn(unreadCount === 0 && "invisible")}
          >
            <CheckCheck className="size-4" />
            <span>Mark all as read</span>
          </Button>
        </div>
      </div>

      {/* TODO: dropdown select, allow select of multiple */}
      {/* Filter Bar */}
      <div className="border-b px-2 py-3">
        <div className="flex gap-2 pl-2">
          {(
            [
              { key: "all", label: "All" },
              { key: "unread", label: "Unread" },
              { key: "mention", label: "Mentions" },
              { key: "comment", label: "Comments" },
              { key: "column_update", label: "Updates" },
              { key: "task_assignment", label: "Assignments" },
            ] as const
          ).map(({ key, label }) => (
            <Button
              key={key}
              variant={filter === key ? "solid" : "ghost"}
              onClick={() => setFilter(key)}
            >
              {label}
            </Button>
          ))}
        </div>
      </div>

      {/* Notifications Items */}
      <div className="flex-1 overflow-y-auto">
        {filteredItems.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <div className="text-center">
              <Bell className="mx-auto h-12 w-12" />
              <h3 className="mt-2 font-medium">No notifications</h3>
              <p className="mt-1">
                {filter === "all"
                  ? "You're all caught up!"
                  : `No ${filter} notifications found.`}
              </p>
            </div>
          </div>
        ) : (
          <div className="divide-y">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className={cn(
                  "relative p-4",
                  !item.isRead && "bg-primary-50/60 dark:bg-primary-950/20",
                )}
              >
                <div className="flex items-start gap-3">
                  {/* Type Icon */}
                  <div
                    className={cn(
                      "flex-shrink-0 rounded-full p-2",
                      getTypeColor(item.type),
                    )}
                  >
                    {getTypeIcon(item.type)}
                  </div>

                  {/* Content */}
                  <div className="mr-0 w-full">
                    <div
                      className={cn(
                        "flex items-center justify-between",
                        !item.isRead && "-mt-2",
                      )}
                    >
                      <p className="font-medium text-sm">{item.title}</p>
                      <div className="flex items-center gap-1">
                        {!item.isRead && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => markAsRead(item.id)}
                            title="Mark as read"
                          >
                            <CheckIcon className="size-4" />
                          </Button>
                        )}

                        <span className="text-muted-foreground text-xs">
                          {formatDistanceToNowStrict(item.timestamp, {
                            addSuffix: true,
                          })}
                        </span>
                      </div>
                    </div>

                    <p className="text-sm">{item.description}</p>

                    {/* TODO: workspace / project info */}
                    {/* Task and Project Info */}
                    <div className="mt-3 flex items-center gap-1 text-muted-foreground text-xs">
                      <span>By {item.author.name}</span>
                      {item.taskTitle && (
                        <>
                          <span>•</span>
                          <span>{item.taskTitle}</span>
                        </>
                      )}
                      {item.projectName && (
                        <>
                          <span>•</span>
                          <span>{item.projectName}</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Unread Indicator */}
                  {!item.isRead && (
                    <div className="absolute right-2 bottom-4 h-2 w-2 rounded-full bg-primary-600 dark:bg-primary-400" />
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
