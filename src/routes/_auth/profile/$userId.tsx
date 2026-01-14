import { createFileRoute } from "@tanstack/react-router";

import {
  CustomizationTab,
  ProfileHeader,
  WorkspacesTable,
} from "@/components/profile";
import {
  TabsContent,
  TabsList,
  TabsRoot,
  TabsTrigger,
} from "@/components/ui/tabs";
import { BASE_URL } from "@/lib/config/env.config";
import createMetaTags from "@/lib/util/createMetaTags";
import { useOrganization } from "@/providers/OrganizationProvider";

export const Route = createFileRoute("/_auth/profile/$userId")({
  head: (context) => ({
    meta: [
      ...createMetaTags({
        title: "Profile",
        description: "User profile page.",
        url: `${BASE_URL}/profile/${context.params.userId}`,
      }),
    ],
  }),
  component: ProfilePage,
});

function ProfilePage() {
  const { session } = Route.useRouteContext();
  const orgContext = useOrganization();

  const isOmniMember =
    session?.organizations?.some((org) => org.slug === "omni") ?? false;

  // Get user's organizations from JWT claims
  const organizations = orgContext?.organizations ?? [];

  return (
    <div className="no-scrollbar min-h-dvh overflow-y-auto bg-linear-to-br from-background via-background to-muted/20 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-6 lg:gap-8 xl:grid-cols-12">
          <div className="xl:col-span-4">
            <ProfileHeader session={session} isOmniTeamMember={isOmniMember} />
          </div>

          <div className="xl:col-span-8">
            <TabsRoot defaultValue="account">
              <TabsList>
                <TabsTrigger value="account">Account</TabsTrigger>
                <TabsTrigger value="customization">Customization</TabsTrigger>
              </TabsList>

              <TabsContent value="account">
                <div className="mt-4 space-y-8">
                  <div className="space-y-4">
                    <h2 className="font-bold text-lg">Current Workspaces</h2>
                    <WorkspacesTable organizations={organizations} />
                  </div>

                  {/* Invitations are now managed via Gatekeeper (IDP) */}
                  {/* Users accept/reject invitations through the IDP UI or email links */}
                </div>
              </TabsContent>

              <TabsContent value="customization">
                <CustomizationTab />
              </TabsContent>
            </TabsRoot>
          </div>
        </div>
      </div>
    </div>
  );
}
