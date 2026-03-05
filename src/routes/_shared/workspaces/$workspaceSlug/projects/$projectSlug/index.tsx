import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, notFound } from "@tanstack/react-router";
import { all } from "better-all";
import { ExternalLinkIcon } from "lucide-react";
import { Suspense } from "react";

import { Link } from "@/components/core";
import { PublicBoard } from "@/components/projects";
import { BASE_URL } from "@/lib/config/env.config";
import projectOptions from "@/lib/options/project.options";
import projectBySlugOptions from "@/lib/options/projectBySlug.options";
import tasksOptions from "@/lib/options/tasks.options";
import createMetaTags from "@/lib/util/createMetaTags";
import { fetchOrganizationBySlug } from "@/server/functions/organizations";

export const Route = createFileRoute(
  "/_shared/workspaces/$workspaceSlug/projects/$projectSlug/",
)({
  loader: async ({
    params: { workspaceSlug, projectSlug },
    context: { session, queryClient },
  }) => {
    // Resolve organization: try JWT claims first (fast path), fall back to unauthenticated fetch
    let organizationId: string | undefined;

    const orgFromClaim = session?.organizations?.find(
      (org) => org.slug === workspaceSlug,
    );

    if (orgFromClaim) {
      organizationId = orgFromClaim.id;
    } else {
      const fetchedOrg = await fetchOrganizationBySlug({
        data: { slug: workspaceSlug },
      });

      if (!fetchedOrg) throw notFound();
      organizationId = fetchedOrg.id;
    }

    // Resolve project by slug and check isPublic
    const { project } = await all({
      async project() {
        const { projectBySlugAndOrganizationId } =
          await queryClient.ensureQueryData(
            projectBySlugOptions({ slug: projectSlug, organizationId }),
          );

        if (!projectBySlugAndOrganizationId) throw notFound();
        if (!projectBySlugAndOrganizationId.isPublic) throw notFound();

        return projectBySlugAndOrganizationId;
      },
      async projectData() {
        const project = await this.$.project;
        return queryClient.ensureQueryData(
          projectOptions({ rowId: project.rowId }),
        );
      },
      async tasks() {
        const project = await this.$.project;
        return queryClient.ensureQueryData(
          tasksOptions({ projectId: project.rowId }),
        );
      },
    });

    return {
      name: project.name,
      projectId: project.rowId,
      organizationId,
      workspaceSlug,
      projectSlug,
    };
  },
  head: ({ loaderData, params }) => ({
    meta: loaderData
      ? [
          ...createMetaTags({
            title: loaderData.name,
            description: `View the ${loaderData.name} board`,
            url: `${BASE_URL}/workspaces/${params.workspaceSlug}/projects/${params.projectSlug}`,
          }),
        ]
      : undefined,
  }),
  notFoundComponent: () => (
    <div className="flex h-96 items-center justify-center">
      <p className="text-base-500 text-lg">Board not found</p>
    </div>
  ),
  component: PublicBoardPage,
});

function PublicBoardPage() {
  const { projectId, workspaceSlug, projectSlug } = Route.useLoaderData();

  const { data: project } = useSuspenseQuery({
    ...projectOptions({ rowId: projectId }),
    select: (data) => data?.project,
  });

  const { data: tasks } = useSuspenseQuery({
    ...tasksOptions({ projectId }),
    select: (data) => data?.tasks?.nodes ?? [],
  });

  if (!project) return null;

  return (
    <div className="flex size-full flex-col">
      <div className="border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="font-semibold text-2xl">{project.name}</h1>

          <Link
            to="/workspaces/$workspaceSlug/projects/$projectSlug"
            params={{ workspaceSlug, projectSlug }}
            variant="outline"
            size="sm"
            className="gap-1.5"
          >
            Open in Runa
            <ExternalLinkIcon className="size-3.5" />
          </Link>
        </div>

        {project.description && (
          <p className="mt-1 text-base-600 text-sm dark:text-base-400">
            {project.description}
          </p>
        )}
      </div>

      <Suspense>
        <PublicBoard project={project} tasks={tasks} />
      </Suspense>
    </div>
  );
}
