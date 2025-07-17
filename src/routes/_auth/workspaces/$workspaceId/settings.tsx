import { useSuspenseQuery } from "@tanstack/react-query";
import { notFound } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { useDebounceCallback } from "usehooks-ts";

import ConfirmDialog from "@/components/ConfirmDialog";
import Link from "@/components/core/Link";
import RichTextEditor from "@/components/core/RichTextEditor";
import NotFound from "@/components/layout/NotFound";
import { Button } from "@/components/ui/button";
import Projects from "@/components/workspaces/Projects";
import Team from "@/components/workspaces/Team";
import {
  useDeleteWorkspaceMutation,
  useUpdateWorkspaceMutation,
} from "@/generated/graphql";
import useDialogStore, { DialogType } from "@/lib/hooks/store/useDialogStore";
import workspaceOptions from "@/lib/options/workspace.options";
import workspacesOptions from "@/lib/options/workspaces.options";
import seo from "@/lib/util/seo";

export const Route = createFileRoute({
  loader: async ({ params: { workspaceId }, context: { queryClient } }) => {
    const { workspace } = await queryClient.ensureQueryData(
      workspaceOptions({ rowId: workspaceId }),
    );

    if (!workspace) {
      throw notFound();
    }

    return { name: workspace.name };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [...seo({ title: `${loaderData.name} Settings` })]
      : undefined,
  }),
  notFoundComponent: () => <NotFound>Workspace Not Found</NotFound>,
  component: SettingsPage,
});

function SettingsPage() {
  const { session } = Route.useRouteContext();

  const { workspaceId } = Route.useParams();
  const navigate = Route.useNavigate();
  const [nameError, setNameError] = useState<string | null>(null);

  const { data: workspace } = useSuspenseQuery({
    ...workspaceOptions({ rowId: workspaceId }),
    select: (data) => data?.workspace,
  });

  const { mutate: deleteWorkspace } = useDeleteWorkspaceMutation({
    meta: {
      invalidates: [
        workspacesOptions({ userId: session?.user.rowId! }).queryKey,
      ],
    },
    onMutate: () => navigate({ to: "/workspaces", replace: true }),
    onSettled: () => setIsDeleteWorkspaceOpen(false),
  });

  const { setIsOpen: setIsDeleteWorkspaceOpen } = useDialogStore({
    type: DialogType.DeleteWorkspace,
  });

  const { mutate: updateWorkspace } = useUpdateWorkspaceMutation({
    meta: {
      invalidates: [["all"]],
    },
  });

  const handleWorkspaceUpdate = useDebounceCallback(updateWorkspace, 300);

  return (
    <div className="no-scrollbar relative h-full overflow-auto p-8 lg:p-12">
      {/* Header */}
      <div className="mb-10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            to="/workspaces/$workspaceId/projects"
            params={{ workspaceId: workspaceId }}
            variant="ghost"
            size="icon"
          >
            <ArrowLeft className="size-4" />
          </Link>
          <div className="flex flex-col gap-2">
            <RichTextEditor
              defaultContent={workspace?.name}
              className="min-h-0 border-0 bg-transparent p-0 text-2xl dark:bg-transparent"
              skeletonClassName="h-8 w-80"
              onUpdate={({ editor }) => {
                const text = editor.getText().trim();

                if (text.length < 3) {
                  setNameError("Workspace name must be at least 3 characters.");
                  return;
                }

                setNameError(null);
                handleWorkspaceUpdate({
                  rowId: workspaceId,
                  patch: {
                    name: text,
                  },
                });
              }}
            />

            {nameError && (
              <p className="mt-1 text-red-500 text-sm">{nameError}</p>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-12">
        <Team />

        <Projects />

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-4">
            <h3 className="font-medium text-sm">Danger Zone</h3>

            <Button
              variant="destructive"
              className="w-fit text-background"
              onClick={() => setIsDeleteWorkspaceOpen(true)}
            >
              Delete Workspace
            </Button>
          </div>
        </div>

        <ConfirmDialog
          title="Danger Zone"
          description={`This will permanently delete ${workspace?.name} and all associated data. This action cannot be undone.`}
          onConfirm={() => {
            deleteWorkspace({ rowId: workspace?.rowId! });
          }}
          dialogType={DialogType.DeleteWorkspace}
          confirmation={`permanently delete ${workspace?.name}`}
          inputProps={{
            className: "focus-visible:ring-red-500",
          }}
        />
      </div>
    </div>
  );
}
