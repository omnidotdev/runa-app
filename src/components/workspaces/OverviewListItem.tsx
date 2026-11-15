import { Badge } from "@omnidotdev/thornberry/badge";
import { useNavigate, useParams } from "@tanstack/react-router";

import CircularProgress from "../core/CircularProgress";

import type { ProjectsQuery } from "@/generated/graphql";

type ProjectWithPreferences = NonNullable<
  ProjectsQuery["projects"]
>["nodes"][number];

interface Props {
  project: ProjectWithPreferences;
}

const ListItem = ({ project }: Props) => {
  const { workspaceSlug } = useParams({
    from: "/_app/@{$workspaceSlug}/",
  });

  const navigate = useNavigate();

  const completedTasks = project.completedTasks?.totalCount ?? 0;
  const totalTasks = project.allTasks?.totalCount ?? 0;
  const progressPercentage =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div
      className="cursor-pointer border-b p-4 last:border-b-0"
      onClick={() =>
        navigate({
          to: "/@{$workspaceSlug}/$projectSlug",
          params: {
            workspaceSlug,
            projectSlug: project.slug,
          },
        })
      }
    >
      <div className="flex h-full flex-col gap-3 overflow-hidden">
        <div className="min-w-0">
          <span className="text-base-400 dark:text-base-400 shrink-0 font-mono text-xs">
            {project.prefix ?? "PROJ"}
          </span>

          <p className="truncate py-1 text-sm font-semibold">{project.name}</p>

          <p className="text-muted-foreground line-clamp-2 text-xs leading-relaxed">
            {project.description}
          </p>
        </div>

        <div className="mt-auto flex flex-wrap items-center justify-end gap-1.5">
          <Badge variant="outline" className="group/progress">
            <CircularProgress
              progressPercentage={progressPercentage}
              color={project?.color ?? "var(--primary-400)"}
            />
            <span className="text-muted-foreground hidden tabular-nums group-hover/progress:inline">
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

export default ListItem;
