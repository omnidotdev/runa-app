import { useSuspenseQuery } from "@tanstack/react-query";
import { getRouteApi } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { useDebounceCallback } from "usehooks-ts";
import { z } from "zod";

import { Link, RichTextEditor } from "@/components/core";
import { ProjectColorPicker } from "@/components/projects";
import {
  Role,
  useProjectQuery,
  useProjectsQuery,
  useUpdateProjectMutation,
} from "@/generated/graphql";
import getSdk from "@/lib/graphql/getSdk";
import projectOptions from "@/lib/options/project.options";
import workspaceOptions from "@/lib/options/workspace.options";
import generateSlug from "@/lib/util/generateSlug";
import getQueryKeyPrefix from "@/lib/util/getQueryKeyPrefix";

import type { Editor } from "@tiptap/core";

const routeApi = getRouteApi(
  "/_auth/workspaces/$workspaceSlug/projects/$projectSlug/settings",
);

export default function ProjectSettingsHeader() {
  const { session } = routeApi.useRouteContext();
  const { workspaceSlug, projectSlug } = routeApi.useParams();
  const { projectId, workspaceId } = routeApi.useLoaderData();
  const navigate = routeApi.useNavigate();

  const [parseError, setParseError] = useState<string | null>(null);

  const { data: role } = useSuspenseQuery({
    ...workspaceOptions({ rowId: workspaceId, userId: session?.user?.rowId! }),
    select: (data) => data.workspace?.workspaceUsers.nodes?.[0]?.role,
  });

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
      invalidates: [
        getQueryKeyPrefix(useProjectQuery),
        getQueryKeyPrefix(useProjectsQuery),
      ],
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
  });

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
  );
}
