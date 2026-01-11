import { createFileRoute, notFound } from "@tanstack/react-router";

import { NotFound } from "@/components/layout";
import {
  Projects,
  Team,
  WorkspaceBenefits,
  WorkspaceColumnsForm,
  WorkspaceDangerZone,
  WorkspaceSettingsHeader,
} from "@/components/workspaces";
import { BASE_URL } from "@/lib/config/env.config";
import projectColumnsOptions from "@/lib/options/projectColumns.options";
import createMetaTags from "@/lib/util/createMetaTags";
import { getPrices } from "@/server/functions/prices";
import { getSubscription } from "@/server/functions/subscriptions";

export const Route = createFileRoute(
  "/_auth/workspaces/$workspaceSlug/settings",
)({
  loader: async ({ context: { queryClient, workspaceBySlug } }) => {
    if (!workspaceBySlug) {
      throw notFound();
    }

    const [subscription, prices] = await Promise.all([
      getSubscription({
        data: { workspaceId: workspaceBySlug.rowId },
      }),
      getPrices(),
      queryClient.ensureQueryData({
        ...projectColumnsOptions({
          workspaceId: workspaceBySlug.rowId!,
        }),
      }),
    ]);

    return {
      name: workspaceBySlug.name,
      workspaceId: workspaceBySlug.rowId,
      subscription,
      prices,
    };
  },
  head: ({ loaderData, params }) => ({
    meta: loaderData
      ? [
          ...createMetaTags({
            title: `${loaderData.name} Settings`,
            description: `Settings for the ${loaderData.name} workspace.`,
            url: `${BASE_URL}/workspaces/${params.workspaceSlug}/settings`,
          }),
        ]
      : undefined,
  }),
  notFoundComponent: () => <NotFound>Workspace Not Found</NotFound>,
  component: SettingsPage,
});

function SettingsPage() {
  return (
    <div className="no-scrollbar relative h-full overflow-auto py-8 lg:p-12">
      <WorkspaceSettingsHeader />

      <div className="flex flex-col gap-12">
        <Team />

        <Projects />

        <WorkspaceColumnsForm />

        <WorkspaceBenefits />

        <WorkspaceDangerZone />
      </div>
    </div>
  );
}
