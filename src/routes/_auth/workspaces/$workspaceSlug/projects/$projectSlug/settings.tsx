import { createFileRoute, notFound } from "@tanstack/react-router";
import { all } from "better-all";

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
import projectBySlugOptions from "@/lib/options/projectBySlug.options";
import createMetaTags from "@/lib/util/createMetaTags";

export const Route = createFileRoute(
  "/_auth/workspaces/$workspaceSlug/projects/$projectSlug/settings",
)({
  loader: async ({
    params: { projectSlug },
    context: { queryClient, organizationId },
  }) => {
    if (!organizationId) throw notFound();

    const { project } = await all({
      async project() {
        const { projectBySlugAndOrganizationId } =
          await queryClient.ensureQueryData(
            projectBySlugOptions({ slug: projectSlug, organizationId }),
          );
        if (!projectBySlugAndOrganizationId) throw notFound();
        return projectBySlugAndOrganizationId;
      },
      async projectData() {
        const project = await this.$.project;
        return queryClient.ensureQueryData(
          projectOptions({ rowId: project.rowId }),
        );
      },
      async labels() {
        const project = await this.$.project;
        return queryClient.ensureQueryData(
          labelsOptions({ projectId: project.rowId }),
        );
      },
      async columns() {
        const project = await this.$.project;
        return queryClient.ensureQueryData(
          columnsOptions({ projectId: project.rowId }),
        );
      },
    });

    return {
      name: project.name,
      projectId: project.rowId,
      organizationId,
    };
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
