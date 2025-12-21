import { useNavigate, useParams } from "@tanstack/react-router";

import { cn } from "@/lib/utils";

import type { ProjectsQuery } from "@/generated/graphql";

type ProjectWithPreferences = NonNullable<
  ProjectsQuery["projects"]
>["nodes"][number];

interface Props {
  project: ProjectWithPreferences;
}

const BoardItem = ({ project }: Props) => {
  const { workspaceSlug } = useParams({
    from: "/_auth/workspaces/$workspaceSlug/projects/",
  });

  const navigate = useNavigate();

  const completedTasks = project.columns?.nodes?.reduce(
    (acc, col) => acc + (col?.completedTasks.totalCount || 0),
    0,
  );
  const totalTasks = project.columns?.nodes?.reduce(
    (acc, col) => acc + (col?.allTasks.totalCount || 0),
    0,
  );

  const progressPercentage =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const userPreferences = project.userPreferences?.nodes?.[0];

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
      className="cursor-pointer rounded-lg border bg-card p-4 shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="flex flex-col gap-1">
        <p className="text-base-600 text-xs dark:text-base-400">
          #{project.prefix ?? "PROJ"}
        </p>

        <p className="font-medium text-md">{project.name}</p>

        <p className="text-muted-foreground text-sm">{project.description}</p>
      </div>

      <div className="mt-3">
        <div className="mb-1 flex justify-end text-xs">
          <span className="text-base-900 dark:text-base-100">
            {completedTasks}/{totalTasks} {totalTasks === 1 ? "task" : "tasks"}
          </span>
        </div>

        <div className="h-2 w-full rounded-full bg-base-200 dark:bg-base-700">
          <div
            className={cn(
              "h-2 rounded-full bg-primary transition-all",
              !userPreferences && "bg-transparent",
            )}
            style={{
              width: `${progressPercentage}%`,
              backgroundColor: userPreferences?.color ?? undefined,
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default BoardItem;
