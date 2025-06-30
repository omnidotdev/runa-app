import { useSuspenseQuery } from "@tanstack/react-query";
import { notFound } from "@tanstack/react-router";
import { format } from "date-fns";
import {
  AlertCircleIcon,
  AlertTriangleIcon,
  ArrowLeftIcon,
  CalendarIcon,
  CheckCircle2Icon,
  CircleDotIcon,
  CircleIcon,
  ClockIcon,
  EditIcon,
  EyeIcon,
  InfoIcon,
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

import Link from "@/components/core/Link";
import RichTextEditor from "@/components/core/RichTextEditor";
import NotFound from "@/components/layout/NotFound";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CardContent, CardHeader, CardRoot } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import taskOptions from "@/lib/options/task.options";
import { getLabelClasses } from "@/lib/util/getLabelClasses";
import { cn } from "@/lib/utils";
import seo from "@/utils/seo";

export const Route = createFileRoute({
  ssr: false,
  loader: async ({ params: { taskId }, context: { queryClient } }) => {
    const { task } = await queryClient.ensureQueryData(taskOptions(taskId));

    if (!task) {
      throw notFound();
    }
  },
  head: () => ({
    meta: [...seo({ title: "Task" })],
  }),
  notFoundComponent: () => <NotFound>Task Not Found</NotFound>,
  component: TaskPage,
});

const StatusBadge = ({ status }: { status: string }) => {
  const statusConfig = {
    "To Do": {
      icon: ClockIcon,
      label: "To Do",
      className:
        "bg-base-100 text-base-600 border-base-300 dark:bg-base-800 dark:text-base-300 dark:border-base-600",
    },
    "In Progress": {
      icon: AlertCircleIcon,
      label: "In Progress",
      className:
        "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800",
    },
    "Awaiting Review": {
      icon: EyeIcon,
      label: "Awaiting Review",
      className:
        "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:text-purple-300 dark:border-purple-800",
    },
    Done: {
      icon: CheckCircle2Icon,
      label: "Done",
      className:
        "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800",
    },
    Backlog: {
      icon: CircleIcon,
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

function TaskPage() {
  const { workspaceId, projectId, taskId } = Route.useParams();

  const { data: task } = useSuspenseQuery({
    ...taskOptions(taskId),
    select: (data) => data?.task,
  });

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
              <Link
                to="/workspaces/$workspaceId/projects/$projectId"
                params={{
                  workspaceId,
                  projectId,
                }}
                variant="ghost"
                size="icon"
              >
                <ArrowLeftIcon className="size-4" />
              </Link>
              <div className="flex flex-col gap-2">
                <h1 className="mt-1 font-bold text-2xl text-base-900 dark:text-base-100">
                  {task?.content}
                </h1>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-base-400 text-sm dark:text-base-500">
                    PROJ-123
                  </span>
                  <StatusBadge status={task?.column?.title!} />
                  <PriorityBadge priority={task?.priority!} />
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
              <CardRoot className="border-0 p-0 dark:shadow-base-500/10">
                <CardHeader className="flex flex-row items-center gap-2 rounded-t-xl bg-base-50 p-3 dark:bg-base-800">
                  <TypeIcon className="size-4 text-base-500 dark:text-base-400" />
                  <h2 className="font-semibold text-base-900 text-lg dark:text-base-100">
                    Description
                  </h2>
                </CardHeader>
                <CardContent className="rounded-b-xl border-x border-b border-dashed p-0">
                  <RichTextEditor
                    defaultContent={task?.description}
                    className="border-0"
                  />
                </CardContent>
              </CardRoot>

              {/* Comments */}
              <CardRoot className="border-0 p-0 dark:shadow-base-500/10">
                <CardHeader className="flex flex-row items-center gap-2 rounded-t-xl bg-base-50 p-3 dark:bg-base-800">
                  <MessageSquareIcon className="size-4 text-base-500 dark:text-base-400" />
                  <h2 className="font-semibold text-base-900 text-lg dark:text-base-100">
                    Comments
                  </h2>
                  <Badge variant="subtle" size="sm">
                    {task?.posts?.totalCount ?? 0}
                  </Badge>
                </CardHeader>
                <CardContent className="mt-4 space-y-8">
                  {task?.posts?.nodes?.map((comment) => (
                    <div key={comment?.rowId} className="flex gap-4">
                      <Avatar
                        fallback={comment?.author?.name.charAt(0)}
                        src={comment?.author?.avatarUrl ?? undefined}
                        alt={comment?.author?.name}
                        size="md"
                      />
                      <div className="flex-1 space-y-3">
                        <div className="flex items-center gap-3">
                          <span className="font-medium text-base text-base-900 dark:text-base-100">
                            {comment?.author?.name}
                          </span>
                          <span className="text-base-500 text-sm dark:text-base-400">
                            {format(
                              new Date(comment?.createdAt!),
                              "MMM d, yyyy 'at' h:mm a",
                            )}
                          </span>
                        </div>
                        <div className="rounded-lg border bg-base-50 p-4 text-base text-base-700 leading-relaxed dark:border-base-700 dark:bg-base-800/50 dark:text-base-300">
                          {comment?.description}
                        </div>
                      </div>
                    </div>
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
              <CardRoot className="border-0 p-0 dark:shadow-base-500/10">
                <CardHeader className="flex flex-row items-center justify-between rounded-t-xl bg-base-50 p-3 dark:bg-base-800">
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
                <CardContent className="space-y-4 p-4">
                  {task?.assignees?.nodes?.map((assignee) => (
                    <div
                      key={assignee?.rowId}
                      className="flex items-center gap-2"
                    >
                      <Avatar
                        fallback={assignee?.user?.name.charAt(0)}
                        src={assignee?.user?.avatarUrl ?? undefined}
                        alt={assignee?.user?.name}
                        size="xs"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-medium text-base-900 text-sm dark:text-base-100">
                          {assignee?.user?.name}
                        </p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </CardRoot>

              {/* Labels */}
              <CardRoot className="border-0 p-0 dark:shadow-base-500/10">
                <CardHeader className="flex flex-row items-center justify-between rounded-t-xl bg-base-50 p-3 dark:bg-base-800">
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
                <CardContent className="p-4">
                  <div className="flex flex-wrap gap-2">
                    {/* TODO: remove need for `JSON.parse` used just from seed script stringifying JSON to get dynamic labels */}
                    {JSON.parse(task?.labels).map(
                      (label: { name: string; color: string }) => {
                        const colors = getLabelClasses(label.color);

                        return (
                          <Badge
                            key={label.name}
                            size="sm"
                            className={cn(colors.bg, colors.text)}
                          >
                            <TagIcon className={cn("!size-2.5", colors.icon)} />
                            <span className="font-medium text-[10px]">
                              {label.name}
                            </span>
                          </Badge>
                        );
                      },
                    )}
                  </div>
                </CardContent>
              </CardRoot>

              {/* Metadata */}
              <CardRoot className="border-0 p-0 dark:shadow-base-500/10">
                <CardHeader className="rounded-t-xl bg-base-50 p-3 dark:bg-base-800">
                  <div className="flex items-center gap-2">
                    <InfoIcon className="size-4 text-base-500 dark:text-base-400" />
                    <h3 className="font-medium text-base text-base-900 dark:text-base-100">
                      Details
                    </h3>
                  </div>
                </CardHeader>
                <CardContent className="space-y-5 p-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-base-500 dark:text-base-400">
                      Created
                    </span>
                    <span className="text-base-900 dark:text-base-100">
                      {format(new Date(task?.createdAt!), "MMM d, yyyy")}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-base-500 dark:text-base-400">
                      Updated
                    </span>
                    <span className="text-base-900 dark:text-base-100">
                      {format(new Date(task?.updatedAt!), "MMM d, yyyy")}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-base-500 dark:text-base-400">
                      Due Date
                    </span>
                    {task?.dueDate && (
                      <div className="flex items-center gap-1 text-base-900 dark:text-base-100">
                        <CalendarIcon className="size-3" />
                        {format(new Date(task.dueDate), "MMM d, yyyy")}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-base-500 dark:text-base-400">
                      Author
                    </span>
                    <div className="flex items-center gap-2">
                      <Avatar
                        fallback={task?.author?.name.charAt(0)}
                        src={task?.author?.avatarUrl ?? undefined}
                        alt={task?.author?.name}
                        size="xs"
                      />
                      <span className="text-base-900 dark:text-base-100">
                        {task?.author?.name}
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
