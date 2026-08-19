import { createFileRoute, notFound } from "@tanstack/react-router";
import { all } from "better-all";
import { toast } from "sonner";

import { DestructiveActionDialog } from "@/components/core";
import { NotFound } from "@/components/layout";
import {
  ProjectColumnsForm,
  ProjectDangerZone,
  ProjectDataSection,
  ProjectGeneralForm,
  ProjectLabelsForm,
  ProjectLinksForm,
  ProjectSettingsHeader,
} from "@/components/projects";
import {
  useDeleteProjectMutation,
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

export const Route = createFileRoute(
  "/_app/workspaces/$workspaceSlug/projects/$projectSlug/settings",
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
  const projectData = Route.useLoaderData();
  const navigate = Route.useNavigate();

  const { mutateAsync: deleteProject } = useDeleteProjectMutation({
    meta: {
      invalidates: [
        getQueryKeyPrefix(useProjectsQuery),
        getQueryKeyPrefix(useProjectsSidebarQuery),
      ],
    },
    onSuccess: (_data) => {
      navigate({
        to: "/workspaces/$workspaceSlug/projects",
      });
    },
  });

  const handleDeleteProject = () => {
    // TODO: Incorporate a toast action that allows users to undo the deletion.
    toast.promise(deleteProject({ rowId: projectData.projectId }), {
      loading: "Deleting project...",
      success: "Project deleted successfully!",
      error: "Failed to delete project. Please try again.",
    });
  };

  return (
    <div className="no-scrollbar relative h-full overflow-auto px-4 py-8 lg:p-12">
      <ProjectSettingsHeader />

      <div className="ml-2 flex flex-col gap-12 lg:ml-0">
        <ProjectGeneralForm />

        <ProjectLinksForm />

        <ProjectLabelsForm />

        <ProjectColumnsForm />

        <ProjectDataSection />

        <ProjectDangerZone />
      </div>

      <DestructiveActionDialog
        title="Delete project"
        description={
          <span>
            This will permanently delete the{" "}
            <strong className="font-medium text-base-900 dark:text-base-100">
              {projectData.name}
            </strong>{" "}
            project, including all tasks, labels, and member assignments. This
            action cannot be undone.
          </span>
        }
        onConfirm={handleDeleteProject}
        dialogType={DialogType.DeleteProject}
        confirmation={projectData.name}
      />
    </div>
  );
}
