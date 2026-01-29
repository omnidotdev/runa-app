import { createFileRoute, notFound } from "@tanstack/react-router";
import { all } from "better-all";

import { AgentConfigSection } from "@/components/agent/AgentConfigSection";
import { NotFound } from "@/components/layout";
import {
  Projects,
  Team,
  WorkspaceBenefits,
  WorkspaceColumnsForm,
  WorkspaceSettingsHeader,
} from "@/components/workspaces";
import { BASE_URL, isSelfHosted } from "@/lib/config/env.config";
import agentConfigOptions from "@/lib/options/agentConfig.options";
import agentPersonasOptions from "@/lib/options/agentPersonas.options";
import agentSessionTokenUsageOptions from "@/lib/options/agentSessionTokenUsage.options";
import organizationMembersOptions from "@/lib/options/organizationMembers.options";
import pricesOptions from "@/lib/options/prices.options";
import projectColumnsOptions from "@/lib/options/projectColumns.options";
import projectsOptions from "@/lib/options/projects.options";
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
      async projects() {
        return queryClient.ensureQueryData(
          projectsOptions({
            organizationId: organizationId!,
            userId: session?.user?.rowId,
          }),
        );
      },
      async subscription() {
        const setting = await this.$.setting;
        return queryClient.ensureQueryData(
          subscriptionOptions(setting.organizationId),
        );
      },
      async members() {
        // Self-hosted: skip IDP query (personal workspace only)
        if (isSelfHosted) return { data: [] };
        return queryClient.ensureQueryData(
          organizationMembersOptions({
            organizationId: organizationId!,
            accessToken: session?.accessToken!,
          }),
        );
      },
      async agentConfig() {
        // Prefetch agent config to prevent CLS in AgentConfigSection
        return queryClient.ensureQueryData(
          agentConfigOptions({
            organizationId: organizationId!,
            accessToken: session?.accessToken!,
          }),
        );
      },
      async agentPersonas() {
        // Prefetch agent personas to prevent CLS in AgentPersonaManager
        return queryClient.ensureQueryData(
          agentPersonasOptions({
            organizationId: organizationId!,
            accessToken: session?.accessToken!,
          }),
        );
      },
      async agentTokenUsage() {
        // Prefetch token usage stats to prevent CLS in AgentTokenUsage
        return queryClient.ensureQueryData(
          agentSessionTokenUsageOptions({ organizationId: organizationId! }),
        );
      },
    });

    return {
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

        <AgentConfigSection />

        <WorkspaceBenefits />
      </div>
    </div>
  );
}
