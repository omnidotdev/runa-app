import { useSuspenseQuery } from "@tanstack/react-query";
import { notFound } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { useDebounceCallback } from "usehooks-ts";
import * as z from "zod";

import ConfirmDialog from "@/components/ConfirmDialog";
import Link from "@/components/core/Link";
import RichTextEditor from "@/components/core/RichTextEditor";
import NotFound from "@/components/layout/NotFound";
import ColorPicker from "@/components/projects/settings/ColorPicker";
import ProjectColumnsForm from "@/components/projects/settings/columns/ColumnsForm";
import ProjectLabelsForm from "@/components/projects/settings/ProjectLabelsForm";
import { Button } from "@/components/ui/button";
import {
  useDeleteProjectMutation,
  useUpdateProjectMutation,
} from "@/generated/graphql";
import getSdk from "@/lib/graphql/getSdk";
import useDialogStore, { DialogType } from "@/lib/hooks/store/useDialogStore";
import columnsOptions from "@/lib/options/columns.options";
import labelsOptions from "@/lib/options/labels.options";
import projectOptions from "@/lib/options/project.options";
import generateSlug from "@/lib/util/generateSlug";
import seo from "@/lib/util/seo";

export const Route = createFileRoute({
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
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [...seo({ title: `${loaderData.name} Settings` })]
      : undefined,
  }),
  notFoundComponent: () => <NotFound>Project Not Found</NotFound>,
  component: RouteComponent,
});

function RouteComponent() {
  const { workspaceSlug, projectSlug } = Route.useParams();

  const { projectId } = Route.useLoaderData();

  const navigate = Route.useNavigate();

  const { data: project } = useSuspenseQuery({
    ...projectOptions({ rowId: projectId }),
    select: (data) => data?.project,
  });

  const editNameSchema = z
    .object({
      name: z
        .string()
        .min(3, { error: "Name must be at least 3 characters." })
        .default(project?.name!),
      currentSlug: z.string().default(project?.slug!),
    })
    .check(async (ctx) => {
      const sdk = await getSdk();

      const updatedSlug = generateSlug(ctx.value.name);

      if (!updatedSlug?.length || updatedSlug === ctx.value.currentSlug)
        return z.NEVER;

      const { workspaceBySlug } = await sdk.WorkspaceBySlug({
        slug: workspaceSlug,
        projectSlug: updatedSlug,
      });

      if (workspaceBySlug?.projects.nodes.length) {
        ctx.issues.push({
          code: "custom",
          message: "Project slug already exists for this workspace.",
          input: ctx.value.name,
        });
      }
    });

  const { mutate: updateProject } = useUpdateProjectMutation({
      meta: {
        invalidates: [["all"]],
      },
      onSuccess: (_data, variables) => {
        if (variables.patch.slug) {
          navigate({
            to: "/workspaces/$workspaceSlug/projects/$projectSlug/settings",
            params: { workspaceSlug, projectSlug: variables.patch.slug },
            replace: true,
          });
        }
      },
    }),
    { mutate: deleteWorkspace } = useDeleteProjectMutation({
      meta: {
        invalidates: [["all"]],
      },
    });

  const { setIsOpen: setIsDeleteProjectOpen } = useDialogStore({
    type: DialogType.DeleteProject,
  });

  const [nameError, setNameError] = useState<string | null>(null);

  const handleProjectUpdate = useDebounceCallback(updateProject, 300);

  return (
    <div className="no-scrollbar relative h-full overflow-auto p-8 lg:p-12">
      {/* Header */}
      <div className="mb-10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            to="/workspaces/$workspaceSlug/projects/$projectSlug"
            params={{ workspaceSlug, projectSlug }}
            variant="ghost"
            size="icon"
          >
            <ArrowLeft className="size-4" />
          </Link>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <RichTextEditor
                defaultContent={project?.name}
                className="min-h-0 border-0 bg-transparent p-0 text-2xl dark:bg-transparent"
                skeletonClassName="h-8 w-80"
                onUpdate={async ({ editor }) => {
                  const text = editor.getText().trim();

                  const result = await editNameSchema.safeParseAsync({
                    name: text,
                  });

                  if (!result.success) {
                    setNameError(result.error.issues[0].message);
                    return;
                  }

                  setNameError(null);
                  handleProjectUpdate({
                    rowId: projectId,
                    patch: { name: text, slug: generateSlug(text) },
                  });
                }}
              />
              <div className="mt-1 flex items-center">
                <span className="font-mono text-base-400 text-sm dark:text-base-500">
                  #
                </span>
                <RichTextEditor
                  defaultContent={project?.prefix || "PROJ"}
                  className="min-h-0 border-0 bg-transparent p-0 font-mono text-base-400 text-sm dark:bg-transparent dark:text-base-500"
                  placeholder="prefix"
                  skeletonClassName="h-5 w-12"
                  onUpdate={({ editor }) =>
                    handleProjectUpdate({
                      rowId: projectId,
                      patch: {
                        prefix: editor.getText(),
                      },
                    })
                  }
                />
              </div>
            </div>

            {nameError && (
              <p className="mt-1 text-red-500 text-sm">{nameError}</p>
            )}

            <RichTextEditor
              defaultContent={project?.description || ""}
              className="min-h-0 border-0 bg-transparent p-0 text-base-600 text-sm dark:bg-transparent dark:text-base-400"
              placeholder="Add a short description..."
              skeletonClassName="h-5 max-w-40"
              onUpdate={({ editor }) =>
                handleProjectUpdate({
                  rowId: projectId,
                  patch: {
                    description: editor.getText(),
                  },
                })
              }
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-12">
        <ProjectLabelsForm />

        <ProjectColumnsForm />

        <ColorPicker />

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-4">
            <h3 className="font-medium text-sm">Danger Zone</h3>

            <Button
              variant="destructive"
              className="w-fit text-background"
              onClick={() => setIsDeleteProjectOpen(true)}
            >
              Delete Project
            </Button>
          </div>
        </div>

        <ConfirmDialog
          title="Danger Zone"
          description={
            <span>
              This will delete the project{" "}
              <strong className="font-medium text-base-900 dark:text-base-100">
                {project?.name}
              </strong>{" "}
              including{" "}
              <strong className="font-medium text-base-900 dark:text-base-100">
                {project?.tasks.totalCount ?? 0} tasks
              </strong>
              . This action cannot be undone.
            </span>
          }
          onConfirm={() => {
            deleteWorkspace({ rowId: project?.rowId! });
          }}
          dialogType={DialogType.DeleteProject}
          confirmation={`Delete ${project?.name}`}
          inputProps={{
            className: "focus-visible:ring-red-500",
          }}
        />
      </div>
    </div>
  );
}
