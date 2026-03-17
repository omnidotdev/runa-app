import { useNavigate, useParams } from "@tanstack/react-router";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { CheckCircle2Icon } from "lucide-react";

import { Badge } from "../ui/badge";

import type { ProjectsQuery } from "@/generated/graphql";

dayjs.extend(relativeTime);

type ProjectWithPreferences = NonNullable<
  ProjectsQuery["projects"]
>["nodes"][number];

interface Props {
  project: ProjectWithPreferences;
}

const OverviewBoardItem = ({ project }: Props) => {
  const { workspaceSlug } = useParams({
    from: "/_app/workspaces/$workspaceSlug/projects/",
  });

  const navigate = useNavigate();

  const completedTasks = project.completedTasks?.totalCount ?? 0;
  const totalTasks = project.allTasks?.totalCount ?? 0;
  const progressPercentage =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const accentColor = project?.color ?? "var(--primary-400)";
  const lastActivity = project.updatedAt ?? project.createdAt;

  return (
    <div
      onClick={() =>
        navigate({
          to: "/workspaces/$workspaceSlug/projects/$projectSlug",
          params: {
            workspaceSlug,
            projectSlug: project.slug,
          },
        })
      }
      className="h-auto shrink-0 cursor-pointer overflow-hidden rounded-lg border bg-background p-3 outline-hidden hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background dark:border-border dark:shadow-gray-400/10"
    >
      <div className="flex h-full flex-col gap-3 overflow-hidden">
        <div className="min-w-0">
          <span className="shrink-0 font-mono text-base-400 text-xs dark:text-base-400">
            {project.prefix ?? "PROJ"}
          </span>

          <p className="truncate py-1 font-semibold text-sm">{project.name}</p>

          <p className="line-clamp-2 text-muted-foreground text-xs leading-relaxed">
            {project.description}
          </p>
        </div>

        <div className="mt-auto flex flex-wrap items-center justify-end gap-1.5">
          <Badge
            variant="outline"
            className="group/progress transition-all duration-500"
          >
            {progressPercentage === 100 ? (
              <CheckCircle2Icon className="size-3.5 text-green-500" />
            ) : (
              <svg className="size-3.5" viewBox="0 0 20 20">
                <title>Progress</title>
                <circle
                  cx="10"
                  cy="10"
                  r="8"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  className="text-input"
                />
                <circle
                  cx="10"
                  cy="10"
                  r="8"
                  fill="none"
                  stroke={accentColor}
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeDasharray={`${progressPercentage * 0.503} 50.3`}
                  transform="rotate(-90 10 10)"
                  className="transition-all duration-500"
                />
              </svg>
            )}
            <span className="hidden text-muted-foreground tabular-nums group-hover/progress:inline">
              {completedTasks}/{totalTasks} tasks
            </span>
            <span className="text-muted-foreground tabular-nums group-hover/progress:hidden">
              {progressPercentage === 100
                ? "Complete"
                : `${progressPercentage}%`}
            </span>
          </Badge>
        </div>
      </div>
    </div>
  );
};

export default OverviewBoardItem;
