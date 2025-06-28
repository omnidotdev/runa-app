import { format } from "date-fns";
import {
  AlertTriangleIcon,
  ArrowLeftIcon,
  CalendarIcon,
  CheckCircle2Icon,
  CircleDotIcon,
  ClockIcon,
  EditIcon,
  MessageSquareIcon,
  MinusCircleIcon,
  MoreHorizontalIcon,
  PlusIcon,
  SendIcon,
  TagIcon,
  TypeIcon,
  UserIcon,
} from "lucide-react";
import { useState } from "react";

import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CardContent, CardHeader, CardRoot } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export const Route = createFileRoute({
  ssr: false,
  component: TaskPage,
});

// Mock data - replace with actual queries
const mockTask = {
  id: "PROJ-123",
  title: "Implement user authentication system",
  description: `<p>We need to implement a comprehensive user authentication system that includes:</p>
  <ul>
    <li>Login and registration forms</li>
    <li>Password reset functionality</li>
    <li>Email verification</li>
    <li>Two-factor authentication</li>
  </ul>
  <p>This should integrate with our existing database schema and follow security best practices.</p>`,
  status: "in-progress",
  priority: "high",
  createdAt: "2024-01-15T10:30:00Z",
  updatedAt: "2024-01-16T14:22:00Z",
  dueDate: "2024-01-25T17:00:00Z",
  assignees: [
    {
      id: "1",
      name: "John Doe",
      email: "john@example.com",
      avatar: null,
    },
    {
      id: "2",
      name: "Jane Smith",
      email: "jane@example.com",
      avatar: null,
    },
  ],
  labels: [
    { name: "Frontend", color: "blue" },
    { name: "Backend", color: "green" },
    { name: "Security", color: "red" },
  ],
  author: {
    id: "3",
    name: "Bob Wilson",
    email: "bob@example.com",
    avatar: null,
  },
};

const mockComments = [
  {
    id: "1",
    content:
      "I've started working on the login form component. Should have the basic structure ready by EOD.",
    author: {
      id: "1",
      name: "John Doe",
      email: "john@example.com",
      avatar: null,
    },
    createdAt: "2024-01-16T09:15:00Z",
  },
  {
    id: "2",
    content:
      "Great! I'll work on the backend API endpoints in parallel. Let's sync up tomorrow to make sure we're aligned on the data structure.",
    author: {
      id: "2",
      name: "Jane Smith",
      email: "jane@example.com",
      avatar: null,
    },
    createdAt: "2024-01-16T10:30:00Z",
  },
  {
    id: "3",
    content:
      "Don't forget to implement proper input validation and rate limiting for the login attempts.",
    author: {
      id: "3",
      name: "Bob Wilson",
      email: "bob@example.com",
      avatar: null,
    },
    createdAt: "2024-01-16T14:22:00Z",
  },
];

const StatusBadge = ({ status }: { status: string }) => {
  const statusConfig = {
    "to-do": {
      icon: ClockIcon,
      label: "To Do",
      className:
        "bg-base-100 text-base-600 border-base-300 dark:bg-base-800 dark:text-base-300 dark:border-base-600",
    },
    "in-progress": {
      icon: AlertTriangleIcon,
      label: "In Progress",
      className:
        "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800",
    },
    "awaiting-review": {
      icon: CheckCircle2Icon,
      label: "Awaiting Review",
      className:
        "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:text-purple-300 dark:border-purple-800",
    },
    done: {
      icon: CheckCircle2Icon,
      label: "Done",
      className:
        "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800",
    },
    backlog: {
      icon: CircleDotIcon,
      label: "Backlog",
      className:
        "bg-base-100 text-base-600 border-base-300 dark:bg-base-800 dark:text-base-300 dark:border-base-600",
    },
  };

  const config = statusConfig[status as keyof typeof statusConfig];
  if (!config) return null;

  const Icon = config.icon;

  return (
    <Badge className={cn("gap-1.5", config.className)} variant="outline">
      <Icon className="size-3" />
      {config.label}
    </Badge>
  );
};

const PriorityBadge = ({ priority }: { priority: string }) => {
  const priorityConfig = {
    high: {
      icon: AlertTriangleIcon,
      label: "High",
      className:
        "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800",
    },
    medium: {
      icon: CircleDotIcon,
      label: "Medium",
      className:
        "bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-300 dark:border-yellow-800",
    },
    low: {
      icon: MinusCircleIcon,
      label: "Low",
      className:
        "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800",
    },
  };

  const config = priorityConfig[priority as keyof typeof priorityConfig];
  if (!config) return null;

  const Icon = config.icon;

  return (
    <Badge className={cn("gap-1.5", config.className)} variant="outline">
      <Icon className="size-3" />
      {config.label}
    </Badge>
  );
};

const LabelBadge = ({ label }: { label: { name: string; color: string } }) => {
  const colorClasses = {
    blue: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800",
    green:
      "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800",
    red: "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800",
    yellow:
      "bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-300 dark:border-yellow-800",
    purple:
      "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:text-purple-300 dark:border-purple-800",
    gray: "bg-base-50 text-base-700 border-base-200 dark:bg-base-900/20 dark:text-base-300 dark:border-base-800",
  };

  const colorClass =
    colorClasses[label.color as keyof typeof colorClasses] || colorClasses.gray;

  return (
    <Badge className={cn("gap-1", colorClass)} variant="outline" size="sm">
      <TagIcon className="size-2.5" />
      {label.name}
    </Badge>
  );
};

const CommentCard = ({ comment }: { comment: any }) => {
  return (
    <div className="flex gap-4">
      <Avatar
        fallback={comment.author.name.charAt(0)}
        src={comment.author.avatar}
        alt={comment.author.name}
        size="md"
      />
      <div className="flex-1 space-y-3">
        <div className="flex items-center gap-3">
          <span className="font-medium text-base text-base-900 dark:text-base-100">
            {comment.author.name}
          </span>
          <span className="text-base-500 text-sm dark:text-base-400">
            {format(new Date(comment.createdAt), "MMM d, yyyy 'at' h:mm a")}
          </span>
        </div>
        <div className="rounded-lg border bg-base-50 p-4 text-base text-base-700 leading-relaxed dark:border-base-700 dark:bg-base-800/50 dark:text-base-300">
          {comment.content}
        </div>
      </div>
    </div>
  );
};

function TaskPage() {
  const { workspaceId, projectId, taskId } = Route.useParams();

  const [newComment, setNewComment] = useState("");

  const handleAddComment = () => {
    if (newComment.trim()) {
      // TODO: Implement comment creation
      setNewComment("");
    }
  };

  return (
    <div className="flex h-full">
      {/* Main content */}
      <div className="flex-1 overflow-auto">
        <div className="h-full p-12">
          {/* Header */}
          <div className="mb-10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon">
                <ArrowLeftIcon className="size-4" />
              </Button>
              <div className="flex flex-col gap-2">
                <h1 className="mt-1 font-bold text-2xl text-base-900 dark:text-base-100">
                  {mockTask.title}
                </h1>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-base-400 text-sm dark:text-base-500">
                    {mockTask.id}
                  </span>
                  <StatusBadge status={mockTask.status} />
                  <PriorityBadge priority={mockTask.priority} />
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <EditIcon className="size-4" />
                Edit
              </Button>
              <Button variant="ghost" size="icon">
                <MoreHorizontalIcon className="size-4" />
              </Button>
            </div>
          </div>

          <div className="grid h-full grid-cols-1 gap-12 lg:grid-cols-3">
            {/* Main content column */}
            <div className="space-y-10 lg:col-span-2">
              {/* Description */}
              <CardRoot>
                <CardHeader className="flex flex-row items-center gap-2 pb-6">
                  <TypeIcon className="size-4 text-base-500 dark:text-base-400" />
                  <h2 className="font-semibold text-base-900 text-lg dark:text-base-100">
                    Description
                  </h2>
                </CardHeader>
                <CardContent className="pb-10">
                  <div className="prose prose-base dark:prose-invert max-w-none leading-relaxed">
                    {mockTask.description}
                  </div>
                </CardContent>
              </CardRoot>

              {/* Comments */}
              <CardRoot>
                <CardHeader className="flex flex-row items-center gap-2 pb-6">
                  <MessageSquareIcon className="size-4 text-base-500 dark:text-base-400" />
                  <h2 className="font-semibold text-base-900 text-lg dark:text-base-100">
                    Comments
                  </h2>
                  <Badge variant="subtle" size="sm">
                    {mockComments.length}
                  </Badge>
                </CardHeader>
                <CardContent className="space-y-8">
                  {mockComments.map((comment) => (
                    <CommentCard key={comment.id} comment={comment} />
                  ))}

                  {/* Add comment */}
                  <div className="flex gap-4 border-t pt-8">
                    <Avatar
                      fallback="You"
                      src={undefined}
                      alt="Your avatar"
                      size="sm"
                    />
                    <div className="flex-1 space-y-3">
                      <Input
                        placeholder="Write a comment..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            handleAddComment();
                          }
                        }}
                      />
                      <div className="flex justify-end">
                        <Button
                          size="sm"
                          onClick={handleAddComment}
                          disabled={!newComment.trim()}
                        >
                          <SendIcon className="size-3" />
                          Comment
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </CardRoot>
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Assignees */}
              <CardRoot>
                <CardHeader className="flex flex-row items-center justify-between p-3">
                  <div className="flex items-center gap-2">
                    <UserIcon className="size-4 text-base-500 dark:text-base-400" />
                    <h3 className="font-medium text-base text-base-900 dark:text-base-100">
                      Assignees
                    </h3>
                  </div>
                  <Button variant="ghost" size="icon">
                    <PlusIcon className="size-3" />
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  {mockTask.assignees.map((assignee) => (
                    <div key={assignee.id} className="flex items-center gap-2">
                      <Avatar
                        fallback={assignee.name.charAt(0)}
                        src={undefined}
                        alt={assignee.name}
                        size="xs"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-medium text-base-900 text-sm dark:text-base-100">
                          {assignee.name}
                        </p>
                        <p className="truncate text-base-500 text-xs dark:text-base-400">
                          {assignee.email}
                        </p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </CardRoot>

              {/* Labels */}
              <CardRoot>
                <CardHeader className="flex flex-row items-center justify-between p-3">
                  <div className="flex items-center gap-2">
                    <TagIcon className="size-4 text-base-500 dark:text-base-400" />
                    <h3 className="font-medium text-base text-base-900 dark:text-base-100">
                      Labels
                    </h3>
                  </div>
                  <Button variant="ghost" size="icon">
                    <PlusIcon className="size-3" />
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {mockTask.labels.map((label) => (
                      <LabelBadge key={label.name} label={label} />
                    ))}
                  </div>
                </CardContent>
              </CardRoot>

              {/* Metadata */}
              <CardRoot>
                <CardHeader className="pb-4">
                  <h3 className="font-medium text-base text-base-900 dark:text-base-100">
                    Details
                  </h3>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-base-500 dark:text-base-400">
                      Created
                    </span>
                    <span className="text-base-900 dark:text-base-100">
                      {format(new Date(mockTask.createdAt), "MMM d, yyyy")}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-base-500 dark:text-base-400">
                      Updated
                    </span>
                    <span className="text-base-900 dark:text-base-100">
                      {format(new Date(mockTask.updatedAt), "MMM d, yyyy")}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-base-500 dark:text-base-400">
                      Due Date
                    </span>
                    <div className="flex items-center gap-1 text-base-900 dark:text-base-100">
                      <CalendarIcon className="size-3" />
                      {format(new Date(mockTask.dueDate), "MMM d, yyyy")}
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-base-500 dark:text-base-400">
                      Author
                    </span>
                    <div className="flex items-center gap-2">
                      <Avatar
                        fallback={mockTask.author.name.charAt(0)}
                        src={undefined}
                        alt={mockTask.author.name}
                        size="xs"
                      />
                      <span className="text-base-900 dark:text-base-100">
                        {mockTask.author.name}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </CardRoot>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
