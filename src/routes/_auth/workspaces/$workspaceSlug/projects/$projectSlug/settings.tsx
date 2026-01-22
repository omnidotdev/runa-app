import { createFileRoute, notFound, useNavigate } from "@tanstack/react-router";
import { all } from "better-all";

import DestructiveActionDialog from "@/components/core/DestructiveActionDialog";
import { NotFound } from "@/components/layout";
import {
  ProjectColumnsForm,
  ProjectDangerZone,
  ProjectDataSection,
  ProjectGeneralForm,
  ProjectLabelsForm,
  ProjectSettingsHeader,
} from "@/components/projects";
import {
  useDeleteProjectMutation,
  useProjectColumnsQuery,
  useProjectsQuery,
  useProjectsSidebarQuery,
} from "@/generated/graphql";
import { BASE_URL } from "@/lib/config/env.config";
import { DialogType } from "@/lib/hooks/store/useDialogStore";
import columnsOptions from "@/lib/options/columns.options";
import labelsOptions from "@/lib/options/labels.options";
import projectOptions from "@/lib/options/project.options";
import projectBySlugOptions from "@/lib/options/projectBySlug.options";
import createMetaTags from "@/lib/util/createMetaTags";
import getQueryKeyPrefix from "@/lib/util/getQueryKeyPrefix";
import { useOrganization } from "@/providers/OrganizationProvider";

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
  const { projectId, organizationId } = Route.useLoaderData();
  const { projectSlug, workspaceSlug } = Route.useParams();

  const navigate = useNavigate();
  const orgContext = useOrganization();

  // Resolve organization name from JWT claims
  const orgName = organizationId
    ? orgContext?.getOrganizationById(organizationId)?.name
    : undefined;

  const { mutate: deleteProject } = useDeleteProjectMutation({
    meta: {
      invalidates: [
        getQueryKeyPrefix(useProjectsQuery),
        getQueryKeyPrefix(useProjectColumnsQuery),
        getQueryKeyPrefix(useProjectsSidebarQuery),
      ],
    },
  });

  return (
    <div className="no-scrollbar relative h-full overflow-auto px-4 py-8 lg:p-12">
      <ProjectSettingsHeader />

      <div className="ml-2 flex flex-col gap-12 lg:ml-0">
        <ProjectGeneralForm />

        <ProjectLabelsForm />

        <ProjectColumnsForm />

        <ProjectDataSection />

        <ProjectDangerZone />
      </div>

      <DestructiveActionDialog
        title="Danger Zone"
        // TODO: should we use name or is slug okay here?
        description={
          <span>
            This will delete the project{" "}
            <strong className="font-medium text-base-900 dark:text-base-100">
              {projectSlug}
            </strong>{" "}
            from{" "}
            <strong className="font-medium text-base-900 dark:text-base-100">
              {orgName}
            </strong>{" "}
            workspace . This action cannot be undone.
          </span>
        }
        onConfirm={() => {
          deleteProject({ rowId: projectId });
          navigate({
            to: "/workspaces/$workspaceSlug/projects",
            params: { workspaceSlug: workspaceSlug! },
          });
        }}
        dialogType={DialogType.DeleteProject}
      />
    </div>
  );
}
