import { createFileRoute, notFound } from "@tanstack/react-router";
import { all } from "better-all";

import { NotFound } from "@/components/layout";
import {
  Projects,
  Team,
  WorkspaceBenefits,
  WorkspaceColumnsForm,
  WorkspaceSettingsHeader,
} from "@/components/workspaces";
import { BASE_URL } from "@/lib/config/env.config";
import organizationMembersOptions from "@/lib/options/organizationMembers.options";
import pricesOptions from "@/lib/options/prices.options";
import projectColumnsOptions from "@/lib/options/projectColumns.options";
import settingByOrganizationIdOptions from "@/lib/options/settingByOrganizationId.options";
import subscriptionOptions from "@/lib/options/subscription.options";
import createMetaTags from "@/lib/util/createMetaTags";

export const Route = createFileRoute(
  "/_auth/workspaces/$workspaceSlug/settings",
)({
  loader: async ({ context: { session, queryClient, organizationId } }) => {
    if (!organizationId) throw notFound();

    const { setting, subscription, prices } = await all({
      async setting() {
        const { settingByOrganizationId } = await queryClient.ensureQueryData(
          settingByOrganizationIdOptions({ organizationId }),
        );
        if (!settingByOrganizationId) throw notFound();
        return settingByOrganizationId;
      },
      async prices() {
        return queryClient.ensureQueryData(pricesOptions());
      },
      async projectColumns() {
        return queryClient.ensureQueryData(
          projectColumnsOptions({ organizationId: organizationId! }),
        );
      },
      async subscription() {
        const setting = await this.$.setting;
        return queryClient.ensureQueryData(subscriptionOptions(setting.rowId));
      },
      async members() {
        return queryClient.ensureQueryData(
          organizationMembersOptions({
            organizationId: organizationId!,
            accessToken: session?.accessToken!,
          }),
        );
      },
    });

    return {
      settingId: setting.rowId,
      organizationId,
      setting,
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
