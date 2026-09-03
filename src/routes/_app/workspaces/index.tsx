import { gatekeeperDashboardUrl } from "@omnidotdev/providers/react";
import {
  AvatarFallback,
  AvatarImage,
  AvatarRoot,
} from "@omnidotdev/thornberry/avatar";
import {
  createFileRoute,
  redirect,
  useRouteContext,
} from "@tanstack/react-router";
import { ExternalLinkIcon, InfoIcon, LayersIcon } from "lucide-react";

import { Link } from "@/components/core";
import { Button } from "@/components/ui/button";
import CreateWorkspaceButton from "@/components/workspaces/CreateWorkspaceButton";
import signIn from "@/lib/auth/signIn";
import { AUTH_BASE_URL, BASE_URL } from "@/lib/config/env.config";
import createMetaTags from "@/lib/util/createMetaTags";
import { useOrganization } from "@/providers/OrganizationProvider";
import { signOutLocal } from "@/server/functions/auth";
import { setLastWorkspaceCookie } from "@/server/functions/lastWorkspace";

export const Route = createFileRoute("/_app/workspaces/")({
  beforeLoad: async ({ context: { session }, preload }) => {
    const organizations = session?.organizations ?? [];
    if (!organizations.length || organizations.length > 1) return;

    // Single workspace — skip the picker and go straight to it
    // Guard against preload so hovering the picker link does not navigate
    if (preload) return;

    const org = organizations[0];
    const slug = org.slug ?? org.id;

    throw redirect({
      to: "/@{$workspaceSlug}",
      params: { workspaceSlug: slug },
    });
  },
  head: () => ({
    meta: [
      ...createMetaTags({
        title: "Workspaces",
        description:
          "Create a new workspace, or select a current one to view details.",
        url: `${BASE_URL}/workspaces`,
      }),
    ],
  }),
  component: WorkspacesOverviewPage,
});

function WorkspacesOverviewPage() {
  const orgContext = useOrganization();

  // Get user's organizations from JWT claims
  const organizations = orgContext?.organizations ?? [];

  // A degraded session (refresh-token grant failed) is authenticated but has no
  // access token, so organizations came back empty. Without a signal it renders
  // identically to a genuinely workspace-less user; distinguish it so the user
  // gets a re-login prompt instead of a dead-end "create a workspace" state.
  const { authDegraded } = useRouteContext({ strict: false }) as {
    authDegraded?: boolean;
  };

  const handleReAuth = async () => {
    // The better-auth session is still valid (only the OAuth refresh token is
    // dead), so signing in with an active session just bounces back to the
    // callback without re-authorizing. Clear the local session (and row-id
    // cache) first so the OAuth redirect actually fires and mints a fresh
    // token family.
    try {
      await signOutLocal();
    } catch {
      // Proceed with re-auth even if local sign-out fails.
    }
    await signIn({ redirectUrl: `${BASE_URL}/workspaces`, providerId: "omni" });
  };

  if (!organizations.length && authDegraded) {
    return (
      <div className="flex h-full flex-col">
        <div className="shrink-0 px-12 pt-12">
          <div className="mx-auto flex max-w-4xl flex-col items-center justify-center gap-4">
            <LayersIcon className="size-12 text-base-500 dark:text-base-400" />

            <h1 className="text-pretty text-center font-semibold text-2xl text-base-900 dark:text-base-100">
              Your session expired
            </h1>
          </div>
        </div>

        <div className="custom-scrollbar flex-1 overflow-y-auto px-12 py-8">
          <div className="mx-auto w-full max-w-4xl">
            <div className="flex flex-col items-center gap-4 rounded-lg border border-base-300 border-dashed bg-base-50 p-8 text-center dark:border-base-700 dark:bg-base-900">
              <InfoIcon className="size-6 text-base-500" />
              <p className="mx-auto max-w-sm text-base-700 text-sm dark:text-base-300">
                We could not refresh your session, so your workspaces could not
                be loaded. Sign in again to restore access.
              </p>
              <Button onClick={handleReAuth}>Sign in again</Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      {/* Sticky header */}
      <div className="shrink-0 px-12 pt-12">
        <div className="mx-auto flex max-w-4xl flex-col items-center justify-center gap-4">
          <LayersIcon className="size-12 text-base-500 dark:text-base-400" />

          <h1 className="text-pretty text-center font-semibold text-2xl text-base-900 dark:text-base-100">
            {organizations.length
              ? "Select a workspace"
              : "Create a workspace to get started"}
          </h1>

          {!!organizations.length && <CreateWorkspaceButton />}
        </div>
      </div>

      {/* Scrollable content */}
      <div className="custom-scrollbar flex-1 overflow-y-auto px-12 py-8">
        <div className="mx-auto w-full max-w-4xl">
          {!!organizations.length && (
            <div className="mb-8 grid grid-cols-[repeat(auto-fit,minmax(16rem,1fr))] justify-center gap-6">
              {organizations.map((org) => {
                const orgName = org.name;
                const orgSlug = org.slug;
                const orgLogo = org.logo;

                return (
                  <Link
                    key={org.id}
                    to="/@{$workspaceSlug}"
                    params={{ workspaceSlug: orgSlug! }}
                    preload="intent"
                    variant="outline"
                    className="relative flex h-32 flex-col p-4"
                    onClick={() => setLastWorkspaceCookie({ data: orgSlug! })}
                  >
                    <AvatarRoot size="lg">
                      <AvatarImage src={orgLogo ?? undefined} alt={orgName} />
                      <AvatarFallback className="border font-semibold uppercase">
                        {orgName?.charAt(0)}
                      </AvatarFallback>
                    </AvatarRoot>

                    <div className="flex w-full min-w-0 flex-1 flex-col items-center justify-center">
                      <h3 className="line-clamp-2 w-full break-words text-center font-semibold text-base-900 dark:text-base-100">
                        {orgName}
                      </h3>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}

          <div className="flex flex-col items-center gap-4 rounded-lg border border-base-300 border-dashed bg-base-50 p-8 text-center dark:border-base-700 dark:bg-base-900">
            <InfoIcon className="size-6 text-base-500" />
            <div className="space-y-2">
              <p className="text-base-700 text-sm dark:text-base-300">
                {organizations.length
                  ? "Need another workspace? Create one below."
                  : "Create your first workspace to get started."}
              </p>
              <p className="text-base-500 text-xs">
                A workspace is where your projects and tasks live.
              </p>
            </div>

            <CreateWorkspaceButton>
              {organizations.length ? "New workspace" : "Create workspace"}
            </CreateWorkspaceButton>

            {AUTH_BASE_URL && (
              <a
                href={gatekeeperDashboardUrl(AUTH_BASE_URL)}
                className="inline-flex items-center gap-2 text-primary text-sm hover:underline"
              >
                Manage Organizations
                <ExternalLinkIcon className="size-3" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
