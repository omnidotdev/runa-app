import { useSuspenseQuery } from "@tanstack/react-query";
import { getRouteApi, useCanGoBack, useRouter } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { useDebounceCallback } from "usehooks-ts";
import { z } from "zod";

import { RichTextEditor } from "@/components/core";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  useUpdateWorkspaceMutation,
  useWorkspaceBySlugQuery,
  useWorkspaceQuery,
  useWorkspacesQuery,
} from "@/generated/graphql";
import getSdk from "@/lib/graphql/getSdk";
import workspaceOptions from "@/lib/options/workspace.options";
import { isAdminOrOwner } from "@/lib/permissions";
import capitalizeFirstLetter from "@/lib/util/capitalizeFirstLetter";
import generateSlug from "@/lib/util/generateSlug";
import getQueryKeyPrefix from "@/lib/util/getQueryKeyPrefix";

const routeApi = getRouteApi("/_auth/workspaces/$workspaceSlug/settings");

export default function WorkspaceSettingsHeader() {
  const { session } = routeApi.useRouteContext();
  const { workspaceId } = routeApi.useLoaderData();
  const { workspaceSlug } = routeApi.useParams();
  const router = useRouter();
  const navigate = routeApi.useNavigate();
  const canGoBack = useCanGoBack();

  const [nameError, setNameError] = useState<string | null>(null);

  const { data: workspace } = useSuspenseQuery({
    ...workspaceOptions({
      rowId: workspaceId,
      userId: session?.user?.rowId!,
    }),
    select: (data) => data?.workspace,
  });

  const currentUserRole = workspace?.members?.nodes?.[0]?.role;
  const canEditWorkspace = currentUserRole && isAdminOrOwner(currentUserRole);

  const editNameSchema = z
    .object({
      name: z
        .string()
        .min(3, { error: "Name must be at least 3 characters." })
        .default(workspace?.name!),
      currentSlug: z.string().default(workspace?.slug!),
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
          message: "Slug already exists.",
          input: ctx.value.name,
        });
      }
    });

  const { mutate: updateWorkspace } = useUpdateWorkspaceMutation({
    meta: {
      invalidates: [
        getQueryKeyPrefix(useWorkspaceQuery),
        getQueryKeyPrefix(useWorkspacesQuery),
        getQueryKeyPrefix(useWorkspaceBySlugQuery),
      ],
    },
    onSuccess: (_data, variables) => {
      if (variables.patch.slug) {
        navigate({
          to: "/workspaces/$workspaceSlug/settings",
          params: { workspaceSlug: variables.patch.slug },
          replace: true,
        });
      }
    },
  });

  const handleWorkspaceUpdate = useDebounceCallback(updateWorkspace, 300);

  return (
    <div className="mb-10 ml-2 flex items-center justify-between lg:ml-0">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          aria-label="Go back"
          onClick={() =>
            canGoBack
              ? router.history.back()
              : navigate({
                  to: "/workspaces/$workspaceSlug/projects",
                  params: { workspaceSlug },
                })
          }
        >
          <ArrowLeft className="size-4" />
        </Button>
        <div className="flex flex-col gap-2">
          <RichTextEditor
            defaultContent={workspace?.name}
            className="min-h-0 border-0 bg-transparent p-0 text-2xl dark:bg-transparent"
            skeletonClassName="h-8 w-80"
            editable={canEditWorkspace}
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
              handleWorkspaceUpdate({
                rowId: workspaceId,
                patch: {
                  name: text,
                  slug: generateSlug(text),
                },
              });
            }}
          />

          {nameError && (
            <p className="mt-1 text-red-500 text-sm">{nameError}</p>
          )}
        </div>
        <Badge className="bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300">
          {capitalizeFirstLetter(workspace?.tier!)}
        </Badge>
      </div>
    </div>
  );
}
