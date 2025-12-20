import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, notFound } from "@tanstack/react-router";
import { ArrowLeft, FileJsonIcon } from "lucide-react";
import { useState } from "react";
import { useDebounceCallback } from "usehooks-ts";
import { z } from "zod";

import { Link, RichTextEditor } from "@/components/core";
import { NotFound } from "@/components/layout";
import {
  ProjectColorPicker,
  ProjectColumnsForm,
  ProjectLabelsForm,
} from "@/components/projects";
import { Button } from "@/components/ui/button";
import {
  Role,
  useDeleteProjectMutation,
  useUpdateProjectMutation,
} from "@/generated/graphql";
import { BASE_URL } from "@/lib/config/env.config";
import getSdk from "@/lib/graphql/getSdk";
import useDialogStore, { DialogType } from "@/lib/hooks/store/useDialogStore";
import columnsOptions from "@/lib/options/columns.options";
import labelsOptions from "@/lib/options/labels.options";
import projectOptions from "@/lib/options/project.options";
import workspaceOptions from "@/lib/options/workspace.options";
import createMetaTags from "@/lib/util/createMetaTags";
import generateSlug from "@/lib/util/generateSlug";
import { cn } from "@/lib/utils";

import type { Editor } from "@tiptap/core";

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
  const { session } = Route.useRouteContext();
  const { workspaceSlug, projectSlug } = Route.useParams();

  const { projectId, workspaceId } = Route.useLoaderData();

  const navigate = Route.useNavigate();

  const { data: role } = useSuspenseQuery({
    ...workspaceOptions({ rowId: workspaceId, userId: session?.user?.rowId! }),
    select: (data) => data.workspace?.workspaceUsers.nodes?.[0]?.role,
  });

  const isOwner = role === Role.Owner;
  const isMember = role === Role.Member;

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
    { mutate: deleteProject } = useDeleteProjectMutation({
      meta: {
        invalidates: [["all"]],
      },
    });

  const { setIsOpen: setIsDeleteProjectOpen } = useDialogStore({
    type: DialogType.DeleteProject,
  });

  const [parseError, setParseError] = useState<string | null>(null);

  // TODO: determine how to properly keep focus after successful callback. Issue is that the mutation invalidates the project query (necessary) but that forces a re-render and thus focus is lost
  // The above applies to each callback below
  const updateProjectName = useDebounceCallback(
    async ({ editor }: { editor: Editor }) => {
      const text = editor.getText().trim();

      const result = await editNameSchema.safeParseAsync({
        name: text,
      });

      if (!result.success) {
        setParseError(result.error.issues[0].message);
        return;
      }

      setParseError(null);
      updateProject({
        rowId: projectId,
        patch: { name: text, slug: generateSlug(text) },
      });
    },
    500,
  );

  const updateProjectPrefix = useDebounceCallback(
    async ({ editor }: { editor: Editor }) => {
      const prefixSchema = z
        .string()
        .min(3, { error: "Prefix must be at least 3 characters" });

      const result = await prefixSchema.safeParseAsync(editor.getText().trim());

      if (!result.success) {
        setParseError(result.error.issues[0].message);
        return;
      }

      setParseError(null);
      updateProject({
        rowId: projectId,
        patch: { prefix: result.data },
      });
    },
    500,
  );

  const updateProjectDescription = useDebounceCallback(
    async ({ editor }: { editor: Editor }) => {
      const text = editor.getText().trim();

      updateProject({
        rowId: projectId,
        patch: { description: text.length ? text : null },
      });
    },
    500,
  );

  return (
    <div className="no-scrollbar relative h-full overflow-auto py-8 lg:p-12">
      {/* Header */}
      <div className="mb-10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            to="/workspaces/$workspaceSlug/projects/$projectSlug"
            params={{ workspaceSlug, projectSlug }}
            variant="ghost"
            size="icon"
            aria-label="Back to project"
          >
            <ArrowLeft className="size-4" />
          </Link>

          <div className="flex flex-col gap-2">
            {/** NB: `w-fit` is to prevent layout shift when there is a `parseError` */}
            <div className="flex w-fit items-center gap-2">
              <ProjectColorPicker disabled={isMember} />

              <RichTextEditor
                defaultContent={project?.name}
                editable={!isMember}
                className="min-h-0 border-0 bg-transparent p-0 text-2xl dark:bg-transparent"
                skeletonClassName="h-8 w-80"
                onUpdate={updateProjectName}
              />
              <div className="mt-1 flex items-center">
                <span className="font-mono text-base-400 text-sm dark:text-base-500">
                  #
                </span>
                <RichTextEditor
                  defaultContent={project?.prefix || "PROJ"}
                  editable={!isMember}
                  className="min-h-0 border-0 bg-transparent p-0 font-mono text-base-400 text-sm dark:bg-transparent dark:text-base-500"
                  placeholder="prefix"
                  skeletonClassName="h-5 w-12"
                  onUpdate={updateProjectPrefix}
                />
              </div>
            </div>

            {parseError && (
              <p className="mt-1 text-red-500 text-sm">{parseError}</p>
            )}

            <RichTextEditor
              defaultContent={project?.description || ""}
              editable={!isMember}
              className="min-h-0 border-0 bg-transparent p-0 text-base-600 text-sm dark:bg-transparent dark:text-base-400"
              placeholder="Add a short description..."
              skeletonClassName="h-5 max-w-40"
              onUpdate={updateProjectDescription}
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-12">
        <ProjectLabelsForm />

        <ProjectColumnsForm />

        {/* Export/Import Coming Soon */}
        <div className="ml-2 flex flex-col gap-4 lg:ml-0">
          <h3 className="font-medium text-sm">Data</h3>
          <div className="flex items-center gap-2 rounded-lg border border-primary-200 bg-primary-50 px-4 py-3 text-primary-700 dark:border-primary-800 dark:bg-primary-950/50 dark:text-primary-300">
            <FileJsonIcon className="size-4 shrink-0" />
            <span className="text-sm">
              Exporting and importing project data as JSON is coming soon.
            </span>
          </div>
        </div>

        <div
          className={cn(
            "ml-2 hidden flex-col gap-4 lg:ml-0",
            isOwner && "flex",
          )}
        >
          <div className="flex flex-col gap-4">
            <h3 className="font-medium text-sm">Danger Zone</h3>

            <Button
              variant="destructive"
              className="w-fit"
              onClick={() => setIsDeleteProjectOpen(true)}
            >
              Delete Project
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
