import { useNavigate, useParams } from "@tanstack/react-router";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

import CircularProgress from "../core/CircularProgress";
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
          <Badge variant="outline" className="group/progress">
            <CircularProgress
              progressPercentage={progressPercentage}
              color={project?.color ?? "var(--primary-400)"}
            />
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
