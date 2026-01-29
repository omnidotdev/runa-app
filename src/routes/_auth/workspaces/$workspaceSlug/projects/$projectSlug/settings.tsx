import {
  createFileRoute,
  notFound,
  useLoaderData,
} from "@tanstack/react-router";
import { all } from "better-all";

import { AgentScheduleConfig } from "@/components/agent/AgentScheduleConfig";
import { AgentWebhookConfig } from "@/components/agent/AgentWebhookConfig";
import { NotFound } from "@/components/layout";
import {
  ProjectColumnsForm,
  ProjectDangerZone,
  ProjectDataSection,
  ProjectGeneralForm,
  ProjectLabelsForm,
  ProjectSettingsHeader,
} from "@/components/projects";
import { BASE_URL } from "@/lib/config/env.config";
import agentSchedulesOptions from "@/lib/options/agentSchedules.options";
import agentWebhooksOptions from "@/lib/options/agentWebhooks.options";
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
    context: { queryClient, organizationId, session },
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
      async agentWebhooks() {
        const project = await this.$.project;
        return queryClient.ensureQueryData(
          agentWebhooksOptions({
            projectId: project.rowId,
            accessToken: session?.accessToken!,
          }),
        );
      },
      async agentSchedules() {
        const project = await this.$.project;
        return queryClient.ensureQueryData(
          agentSchedulesOptions({
            projectId: project.rowId,
            accessToken: session?.accessToken!,
          }),
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
  const { projectId, organizationId } = useLoaderData({
    from: "/_auth/workspaces/$workspaceSlug/projects/$projectSlug/settings",
  });

  return (
    <div className="no-scrollbar relative h-full overflow-auto px-4 py-8 lg:p-12">
      <ProjectSettingsHeader />

      <div className="ml-2 flex flex-col gap-12 lg:ml-0">
        <ProjectGeneralForm />

        <ProjectLabelsForm />

        <ProjectColumnsForm />

        <AgentWebhookConfig projectId={projectId} />

        <AgentScheduleConfig
          projectId={projectId}
          organizationId={organizationId}
        />

        <ProjectDataSection />

        <ProjectDangerZone />
      </div>
    </div>
  );
}
