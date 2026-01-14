import { createFileRoute, notFound } from "@tanstack/react-router";

import { NotFound } from "@/components/layout";
import {
  Projects,
  Team,
  WorkspaceBenefits,
  WorkspaceColumnsForm,
  WorkspaceSettingsHeader,
} from "@/components/workspaces";
import { BASE_URL } from "@/lib/config/env.config";
import projectColumnsOptions from "@/lib/options/projectColumns.options";
import settingByOrganizationIdOptions from "@/lib/options/settingByOrganizationId.options";
import createMetaTags from "@/lib/util/createMetaTags";
import { getPrices } from "@/server/functions/prices";
import { getSubscription } from "@/server/functions/subscriptions";

export const Route = createFileRoute(
  "/_auth/workspaces/$workspaceSlug/settings",
)({
  loader: async ({ context: { queryClient, organizationId } }) => {
    if (!organizationId) throw notFound();

    const { settingByOrganizationId } = await queryClient.ensureQueryData(
      settingByOrganizationIdOptions({ organizationId }),
    );

    if (!settingByOrganizationId) throw notFound();

    const [subscription, prices] = await Promise.all([
      getSubscription({
        data: { settingId: settingByOrganizationId.rowId },
      }),
      getPrices(),
      queryClient.ensureQueryData({
        ...projectColumnsOptions({
          organizationId: organizationId!,
        }),
      }),
    ]);

    return {
      settingId: settingByOrganizationId.rowId,
      organizationId,
      setting: settingByOrganizationId,
      subscription,
      prices,
    };
  },
  head: ({ params }) => ({
    meta: [
      ...createMetaTags({
        title: "Workspace Settings",
        description: "Settings for this workspace.",
        url: `${BASE_URL}/workspaces/${params.workspaceSlug}/settings`,
      }),
    ],
  }),
  notFoundComponent: () => <NotFound>Workspace Not Found</NotFound>,
  component: SettingsPage,
});

function SettingsPage() {
  return (
    <div className="no-scrollbar relative h-full overflow-auto px-4 py-8 lg:p-12">
      <WorkspaceSettingsHeader />

      <div className="ml-2 flex flex-col gap-12 lg:ml-0">
        <Team />

        <Projects />

        <WorkspaceColumnsForm />

        <WorkspaceBenefits />
      </div>
    </div>
  );
}
