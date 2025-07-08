import { useForm } from "@tanstack/react-form";
import { useSuspenseQuery } from "@tanstack/react-query";
import { notFound } from "@tanstack/react-router";
import { ArrowLeft, Edit } from "lucide-react";
import { useState } from "react";

import Link from "@/components/core/Link";
import NotFound from "@/components/layout/NotFound";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tooltip } from "@/components/ui/tooltip";
import { useUpdateProjectMutation } from "@/generated/graphql";
import projectOptions from "@/lib/options/project.options";
import seo from "@/lib/util/seo";

export const Route = createFileRoute({
  loader: async ({ params: { projectId }, context: { queryClient } }) => {
    const { project } = await queryClient.ensureQueryData(
      projectOptions({ rowId: projectId }),
    );

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
  const { queryClient } = Route.useRouteContext();

  const [editProject, setEditProject] = useState(false);

  const { data: project } = useSuspenseQuery({
    ...projectOptions({ rowId: projectId }),
    select: (data) => data?.project,
  });

  const { mutate: updateProject } = useUpdateProjectMutation({
    onSettled: () => {
      reset();

      return queryClient.invalidateQueries();
    },
  });

  const { Field, Subscribe, handleSubmit, reset } = useForm({
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

  return (
    <div className="relative h-full p-6">
      <Link
        to="/workspaces/$workspaceId/projects/$projectId"
        className="inset-0 flex w-fit justify-start"
        params={{ workspaceId: workspaceId, projectId: projectId }}
        variant="ghost"
      >
        <ArrowLeft />
        Back to Project
      </Link>

      <div className="mt-4 flex flex-col gap-6 p-8">
        <h1 className="text-2xl">Project Settings</h1>

        <div className="flex flex-col gap-3 rounded-lg">
          <div className="flex items-center justify-between">
            <h2 className="block font-medium text-base-700 text-sm dark:text-base-300">
              Project Details
            </h2>

            <Tooltip tooltip="Edit project details">
              <Button
                variant="ghost"
                size="icon"
                aria-label="Edit project details"
                onClick={() => setEditProject((prev) => !prev)}
              >
                <Edit />
              </Button>
            </Tooltip>
          </div>

          <form
            className="flex flex-col gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleSubmit();
            }}
          >
            <Field name="name">
              {(field) => (
                <div>
                  <label
                    htmlFor="name"
                    className="mb-1 block font-medium text-base-700 text-sm dark:text-base-300"
                  >
                    Name
                  </label>
                  <Input
                    id="name"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="Runa"
                    className="disabled:opacity-100"
                    disabled={!editProject}
                  />
                </div>
              )}
            </Field>

            <Field name="prefix">
              {(field) => (
                <div>
                  <label
                    htmlFor="prefix"
                    className="mb-1 block font-medium text-base-700 text-sm dark:text-base-300"
                  >
                    Prefix
                  </label>
                  <Input
                    id="prefix"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="PROJ"
                    className="disabled:opacity-100"
                    disabled={!editProject}
                  />
                </div>
              )}
            </Field>

            <Field name="description">
              {(field) => (
                <div>
                  <label
                    htmlFor="description"
                    className="mb-1 block font-medium text-base-700 text-sm dark:text-base-300"
                  >
                    Description
                  </label>
                  <textarea
                    id="description"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    rows={4}
                    className="w-full rounded-md border border-input bg-transparent p-3 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:font-medium file:text-foreground file:text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                    disabled={!editProject}
                  />
                </div>
              )}
            </Field>

            {editProject && (
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditProject(false)}
                >
                  Cancel
                </Button>

                <Subscribe
                  selector={(state) => [
                    state.canSubmit,
                    state.isSubmitting,
                    state.isDirty,
                  ]}
                >
                  {([canSubmit, isSubmitting, isDirty]) => (
                    <Button
                      type="submit"
                      disabled={!canSubmit || isSubmitting || !isDirty}
                    >
                      Save Changes
                    </Button>
                  )}
                </Subscribe>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
