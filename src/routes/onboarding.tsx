import { createFileRoute, redirect } from "@tanstack/react-router";

import { OnboardingWizard } from "@/components/onboarding";
import { BASE_URL } from "@/lib/config/env.config";
import workspacesOptions from "@/lib/options/workspaces.options";
import createMetaTags from "@/lib/util/createMetaTags";

/**
 * Onboarding page - minimal chrome for first-time user setup.
 * Accessible at /onboarding, separate from _auth layout to avoid sidebar.
 */
export const Route = createFileRoute("/onboarding")({
  beforeLoad: async ({ context: { queryClient, session } }) => {
    // Must be authenticated
    if (!session?.user.rowId) {
      throw redirect({ to: "/" });
    }

    // Check if user already has organizations (from JWT claims)
    const hasOrganizations = (session.organizations?.length ?? 0) > 0;

    if (hasOrganizations) {
      // User already has orgs, redirect to workspaces
      // (workspaces will be auto-provisioned on access)
      throw redirect({ to: "/workspaces" });
    }

    // Double-check by querying workspaces directly
    const { workspaces } = await queryClient.fetchQuery({
      ...workspacesOptions({ userId: session.user.rowId }),
    });

    if (workspaces?.nodes?.length) {
      throw redirect({ to: "/workspaces" });
    }

    return {};
  },
  head: () => ({
    meta: [
      ...createMetaTags({
        title: "Get Started",
        description: "Set up your first workspace in Runa",
        url: `${BASE_URL}/onboarding`,
      }),
    ],
  }),
  component: OnboardingPage,
});

function OnboardingPage() {
  return <OnboardingWizard />;
}
