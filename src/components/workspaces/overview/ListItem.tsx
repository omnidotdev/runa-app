import { useNavigate, useParams } from "@tanstack/react-router";

import type { ProjectFragment as Project } from "@/generated/graphql";

interface Props {
  project: Project;
}

const ListItem = ({ project }: Props) => {
  const { workspaceId } = useParams({
    from: "/_auth/workspaces/$workspaceId/projects/",
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

  return (
    <div
      className="cursor-pointer border-base-200 border-b bg-card p-4 last:border-b-0 dark:border-base-700"
      onClick={() =>
        navigate({
          to: "/workspaces/$workspaceId/projects/$projectId",
          params: {
            workspaceId,
            projectId: project.rowId,
          },
        })
      }
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="mb-3 flex items-center gap-2">
            {/* {getStatusIcon(status)} */}
            <p className="text-base-600 text-sm dark:text-base-400">
              #{project.prefix ?? "PROJ"}
            </p>
          </div>

          <p className="mb-1 font-medium text-sm">{project.name}</p>

          <p className="mb-2 text-muted-foreground text-sm">
            {project.description}
          </p>

          <div className="flex items-center justify-end">
            <div className="w-32">
              <div className="mb-1 flex justify-between text-sm">
                <span className="text-base-600 dark:text-base-400">
                  {completedTasks}/{totalTasks} tasks
                </span>
                <span className="text-base-900 dark:text-base-100">
                  {progressPercentage}%
                </span>
              </div>
              <div className="h-2 w-full rounded-full bg-base-200 dark:bg-base-700">
                <div
                  className="h-2 rounded-full bg-primary transition-all"
                  style={{
                    width: `${progressPercentage}%`,
                    backgroundColor: project?.color ?? undefined,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListItem;
