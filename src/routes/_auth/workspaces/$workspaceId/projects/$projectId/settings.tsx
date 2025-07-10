import { useForm } from "@tanstack/react-form";
import { useSuspenseQuery } from "@tanstack/react-query";
import { notFound } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";

import Link from "@/components/core/Link";
import RichTextEditor from "@/components/core/RichTextEditor";
import NotFound from "@/components/layout/NotFound";
import ProjectLabelsForm from "@/components/projects/ProjectLabelsForm";
import { useUpdateProjectMutation } from "@/generated/graphql";
import labelsOptions from "@/lib/options/labels.options";
import projectOptions from "@/lib/options/project.options";
import seo from "@/lib/util/seo";

export const Route = createFileRoute({
  loader: async ({ params: { projectId }, context: { queryClient } }) => {
    const [{ project }] = await Promise.all([
      queryClient.ensureQueryData(projectOptions({ rowId: projectId })),
      queryClient.ensureQueryData(labelsOptions({ projectId })),
    ]);

    if (!project) {
      throw notFound();
    }

    return { name: project.name };
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
  const { workspaceId, projectId } = Route.useParams();

  const { data: project } = useSuspenseQuery({
    ...projectOptions({ rowId: projectId }),
    select: (data) => data?.project,
  });

  const { mutate: updateProject } = useUpdateProjectMutation({
    meta: {
      invalidates: [["all"]],
    },
    onSettled: () => form.reset(),
  });

  const form = useForm({
    defaultValues: {
      name: project?.name || "",
      prefix: project?.prefix || "",
      description: project?.description || "",
    },
    onSubmit: ({ value }) => {
      updateProject({
        rowId: projectId,
        patch: {
          name: value.name,
          prefix: value.prefix,
          description: value.description,
        },
      });
    },
  });

  const [nameError, setNameError] = useState<string | null>(null);

  return (
    <div className="no-scrollbar relative h-full overflow-auto p-6">
      <Link
        to="/workspaces/$workspaceId/projects/$projectId"
        className="inset-0 flex w-fit justify-start"
        params={{ workspaceId: workspaceId, projectId: projectId }}
        variant="ghost"
      >
        <ArrowLeft />
        Back to Project
      </Link>

      <div className="flex flex-col gap-12 p-8">
        <h1 className="text-2xl">Project Settings</h1>

        <div className="flex flex-col gap-3">
          <RichTextEditor
            defaultContent={project?.name}
            className="min-h-0 border-0 bg-transparent p-0 text-2xl text-base-600 dark:bg-transparent dark:text-base-400"
            skeletonClassName="h-8 max-w-80"
            onUpdate={({ editor }) => {
              const text = editor.getText().trim();

              if (text.length < 3) {
                setNameError("Project name must be at least 3 characters.");
                return;
              }

              setNameError(null);
              updateProject({
                rowId: projectId,
                patch: { name: text },
              });
            }}
          />

          {nameError && (
            <p className="mt-1 text-red-500 text-sm">{nameError}</p>
          )}

          <RichTextEditor
            defaultContent={project?.prefix || ""}
            className="min-h-0 border-0 bg-transparent p-0 text-base-600 text-sm dark:bg-transparent dark:text-base-400"
            placeholder="Add a prefix..."
            skeletonClassName="h-5 w-12"
            onUpdate={({ editor }) =>
              updateProject({
                rowId: projectId,
                patch: {
                  prefix: editor.getText(),
                },
              })
            }
          />

          <RichTextEditor
            defaultContent={project?.description || ""}
            className="min-h-0 border-0 bg-transparent p-0 text-base-600 text-sm dark:bg-transparent dark:text-base-400"
            placeholder="Add a short description..."
            skeletonClassName="h-5 max-w-40"
            onUpdate={({ editor }) =>
              updateProject({
                rowId: projectId,
                patch: {
                  description: editor.getText(),
                },
              })
            }
          />
        </div>

        <ProjectLabelsForm />
      </div>
    </div>
  );
}
