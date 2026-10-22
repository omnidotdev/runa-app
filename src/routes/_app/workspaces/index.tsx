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
import { zodValidator } from "@tanstack/zod-adapter";
import { ExternalLinkIcon, InfoIcon, LayersIcon } from "lucide-react";
import { z } from "zod";

import DegradedSessionRecovery from "@/components/auth/DegradedSessionRecovery";
import { Link } from "@/components/core";
import CreateWorkspaceButton from "@/components/workspaces/CreateWorkspaceButton";
import { AUTH_BASE_URL, BASE_URL } from "@/lib/config/env.config";
import createMetaTags from "@/lib/util/createMetaTags";
import { useWorkspace } from "@/providers/WorkspaceProvider";
import { setLastWorkspaceCookie } from "@/server/functions/lastWorkspace";

const searchSchema = z.object({
  /** Path to return to after a degraded session is recovered */
  from: z.string().optional(),
});

/**
 * Resolve the post-recovery return URL. Only same-origin absolute paths are
 * honored (the value is user-controlled via the query string); anything else,
 * including protocol-relative `//host` and absolute URLs, falls back to the
 * workspaces page.
 */
const resolveReturnUrl = (from: string | undefined) => {
  if (from?.startsWith("/") && !from.startsWith("//")) {
    return `${BASE_URL}${from}`;
  }

  return `${BASE_URL}/workspaces`;
};

export const Route = createFileRoute("/_app/workspaces/")({
  validateSearch: zodValidator(searchSchema),
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
  const orgContext = useWorkspace();

  // Get user's organizations from JWT claims
  const organizations = orgContext?.workspaces ?? [];

  // A degraded session (refresh-token grant failed) is authenticated but has no
  // access token, so organizations came back empty. Without a signal it renders
  // identically to a genuinely workspace-less user; distinguish it so the
  // session is recovered automatically instead of showing a dead-end "create a
  // workspace" state.
  const { authDegraded } = useRouteContext({ strict: false }) as {
    authDegraded?: boolean;
  };

  const { from } = Route.useSearch();

  if (!organizations.length && authDegraded) {
    return <DegradedSessionRecovery returnTo={resolveReturnUrl(from)} />;
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
                Manage Workspaces
                <ExternalLinkIcon className="size-3" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
