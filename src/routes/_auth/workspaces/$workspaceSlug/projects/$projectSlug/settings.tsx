import { createFileRoute, notFound } from "@tanstack/react-router";

import { NotFound } from "@/components/layout";
import {
  ProjectColumnsForm,
  ProjectDangerZone,
  ProjectDataSection,
  ProjectLabelsForm,
  ProjectSettingsHeader,
} from "@/components/projects";
import { BASE_URL } from "@/lib/config/env.config";
import columnsOptions from "@/lib/options/columns.options";
import labelsOptions from "@/lib/options/labels.options";
import projectOptions from "@/lib/options/project.options";
import createMetaTags from "@/lib/util/createMetaTags";

export const Route = createFileRoute(
  "/_auth/workspaces/$workspaceSlug/projects/$projectSlug/settings",
)({
  loader: async ({ context: { queryClient, workspaceBySlug } }) => {
    if (!workspaceBySlug || !workspaceBySlug.projects.nodes.length) {
      throw notFound();
    }

    const projectId = workspaceBySlug.projects.nodes[0].rowId;
    const projectName = workspaceBySlug.projects.nodes[0].name;

    await Promise.all([
      queryClient.ensureQueryData(projectOptions({ rowId: projectId })),
      queryClient.ensureQueryData(labelsOptions({ projectId })),
      queryClient.ensureQueryData(columnsOptions({ projectId })),
    ]);

    return { name: projectName, projectId, workspaceId: workspaceBySlug.rowId };
  },
  head: ({ loaderData, params }) => ({
    meta: loaderData
      ? [
          ...createMetaTags({
            title: `${loaderData.name} Settings`,
            description: `View and manage ${loaderData.name} settings.`,
            url: `${BASE_URL}/workspaces/${params.workspaceSlug}/projects/${params.projectSlug}/settings`,
          }),
        ]
      : undefined,
  }),
  notFoundComponent: () => <NotFound>Project Not Found</NotFound>,
  component: ProjectSettingsPage,
});

function ProjectSettingsPage() {
  return (
    <div className="no-scrollbar relative h-full overflow-auto py-8 lg:p-12">
      <ProjectSettingsHeader />

      <div className="flex flex-col gap-12">
        <ProjectLabelsForm />

        <ProjectColumnsForm />

        <ProjectDataSection />

        <ProjectDangerZone />
      </div>
    </div>
  );
}
