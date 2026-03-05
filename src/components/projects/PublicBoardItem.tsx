// import { useNavigate, useParams } from "@tanstack/react-router";
import dayjs from "dayjs";
import { AlignLeftIcon, CalendarIcon, MessageCircleIcon } from "lucide-react";

import { Label, RichTextEditor } from "@/components/core";
import { PriorityIcon } from "@/components/tasks";
import { Badge } from "@/components/ui/badge";

import type { LabelFragment, TaskFragment } from "@/generated/graphql";

interface Props {
  task: TaskFragment;
  displayId: string;
}

const PublicBoardItem = ({ task, displayId }: Props) => {
  // TODO: enable card click-through to read-only task detail
  // const navigate = useNavigate();
  // const { workspaceSlug, projectSlug } = useParams({
  //   from: "/_app/workspaces/$workspaceSlug/projects/$projectSlug/",
  // });

  return (
    <div className="mb-2 h-35 shrink-0 overflow-hidden rounded-lg border bg-background p-3 outline-hidden dark:border-border">
      {/* TODO: re-enable click-through to task detail
      onClick={() =>
        navigate({
          to: "/workspaces/$workspaceSlug/projects/$projectSlug/$taskId",
          params: { workspaceSlug, projectSlug, taskId: task.rowId },
        })
      }
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          navigate({
            to: "/workspaces/$workspaceSlug/projects/$projectSlug/$taskId",
            params: { workspaceSlug, projectSlug, taskId: task.rowId },
          });
        }
      }}
      role="button"
      tabIndex={0}
      */}
      <div className="flex h-full flex-col overflow-hidden">
        <div className="flex items-start gap-2">
          <div className="mt-0.5 min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              {task.priority && (
                <PriorityIcon
                  priority={task.priority}
                  className="size-2.5 shrink-0 opacity-60"
                />
              )}
              <span className="shrink-0 font-medium font-mono text-base-400 text-xs dark:text-base-400">
                {displayId}
              </span>
            </div>

            <div className="line-clamp-2 py-2 text-foreground text-xs">
              <RichTextEditor
                defaultContent={task.content}
                className="min-h-0! w-fit border-0 bg-transparent p-0 text-xs dark:bg-transparent [&_.ProseMirror]:line-clamp-2 [&_.ProseMirror]:overflow-hidden"
                skeletonClassName="h-4 w-40"
                editable={false}
              />
            </div>
          </div>
        </div>

        <div className="mt-auto flex items-end justify-between gap-2">
          {task.taskLabels.nodes.length > 0 && (
            <div className="flex max-h-6 flex-wrap gap-1 overflow-hidden">
              {task.taskLabels.nodes.slice(0, 3).map(({ label }) => (
                <Label key={label?.rowId} label={label as LabelFragment} />
              ))}
              {task.taskLabels.nodes.length > 3 && (
                <Badge variant="outline" className="border-border text-xs">
                  +{task.taskLabels.nodes.length - 3}
                </Badge>
              )}
            </div>
          )}

          <div className="ml-auto flex items-center gap-2 text-base-500 text-xs dark:text-base-400">
            {task.description && (
              <div className="flex items-center">
                <AlignLeftIcon className="size-3" />
              </div>
            )}

            {task.posts.totalCount > 0 && (
              <div className="flex items-center gap-0.5">
                <MessageCircleIcon className="size-3" />
                <span>{task.posts.totalCount}</span>
              </div>
            )}

            {task.dueDate && (
              <div className="flex items-center gap-1">
                <CalendarIcon className="size-3" />
                <span>{dayjs(task.dueDate).format("MMM D")}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicBoardItem;
