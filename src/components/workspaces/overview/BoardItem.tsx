import { useSuspenseQuery } from "@tanstack/react-query";
import {
  useNavigate,
  useParams,
  useRouteContext,
} from "@tanstack/react-router";

import userPreferencesOptions from "@/lib/options/userPreferences.options";

import type { ProjectFragment } from "@/generated/graphql";

interface Props {
  project: ProjectFragment;
}

const BoardItem = ({ project }: Props) => {
  const { workspaceSlug } = useParams({
    from: "/_auth/workspaces/$workspaceSlug/projects/",
  });

  const { session } = useRouteContext({
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

  const { data: userPreferences } = useSuspenseQuery({
    ...userPreferencesOptions({
      userId: session?.user?.rowId!,
      projectId: project.rowId,
    }),
    select: (data) => data?.userPreferenceByUserIdAndProjectId,
  });

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
      <div className="mb-3 flex items-center gap-2">
        <p className="text-base-600 text-sm dark:text-base-400">
          #{project.prefix ?? "PROJ"}
        </p>
      </div>

      <p className="mb-1 font-medium text-sm">{project.name}</p>

      <p className="mb-2 text-muted-foreground text-sm">
        {project.description}
      </p>

      <div>
        <div className="mb-1 flex justify-end text-sm">
          <span className="text-base-900 dark:text-base-100">
            {completedTasks}/{totalTasks} tasks
          </span>
        </div>
        <div className="h-2 w-full rounded-full bg-base-200 dark:bg-base-700">
          <div
            className="h-2 rounded-full bg-primary transition-all"
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
