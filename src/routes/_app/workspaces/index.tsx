import { workspacesUrl } from "@omnidotdev/providers/react";
import {
  AvatarFallback,
  AvatarImage,
  AvatarRoot,
} from "@omnidotdev/thornberry/avatar";
import { createFileRoute, redirect, useRouter } from "@tanstack/react-router";
import { zodValidator } from "@tanstack/zod-adapter";
import { InfoIcon, LayersIcon, PlusIcon, RefreshCwIcon } from "lucide-react";
import { z } from "zod";

import DegradedSessionRecovery from "@/components/auth/DegradedSessionRecovery";
import { Link } from "@/components/core";
import { Button, buttonVariants } from "@/components/ui/button";
import { ACCOUNT_URL, BASE_URL } from "@/lib/config/env.config";
import createMetaTags from "@/lib/util/createMetaTags";
import { fetchFreshSession } from "@/server/functions/auth";
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
  // Re-hydrate organizations live (bypassing the display cache) so a workspace
  // just created in the account portal shows on arrival, rather than waiting
  // out getAuth's org cache TTL. Invalidating the route re-runs this.
  loader: async () => {
    const { organizations, authDegraded } = await fetchFreshSession();
    return { organizations, authDegraded };
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

/**
 * Workspaces overview page.
 *
 * Lists the workspaces the user belongs to. Workspace creation and management
 * is funneled to the account hub (account.omni.dev/workspaces), the single
 * ecosystem surface that owns it, so this page lists and links out rather than
 * embedding its own creation flow.
 */
function WorkspacesOverviewPage() {
  const router = useRouter();
  const { organizations, authDegraded } = Route.useLoaderData();

  const { from } = Route.useSearch();

  // A degraded session (refresh-token grant failed) is authenticated but has no
  // access token, so organizations came back empty. Without a signal it renders
  // identically to a genuinely workspace-less user; distinguish it so the
  // session is recovered automatically instead of showing a dead-end "create a
  // workspace" state.
  if (!organizations.length && authDegraded) {
    return <DegradedSessionRecovery returnTo={resolveReturnUrl(from)} />;
  }

  // The account hub owns workspace creation; link out to it. Rendered only when
  // the hub URL is configured (optional env), so a missing config degrades to
  // no button rather than a dead link.
  const newWorkspaceHref = workspacesUrl(ACCOUNT_URL);
  const NewWorkspaceLink = newWorkspaceHref
    ? ({ className }: { className?: string }) => (
        <a href={newWorkspaceHref} className={buttonVariants({ className })}>
          <PlusIcon className="size-4" />
          New workspace
        </a>
      )
    : () => null;

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

          {!!organizations.length && (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                aria-label="Refresh workspaces"
                title="Refresh workspaces"
                onClick={() => router.invalidate()}
              >
                <RefreshCwIcon className="size-4" />
              </Button>
              <NewWorkspaceLink />
            </div>
          )}
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
                  ? "Need another workspace? Create one in your Omni account."
                  : "Create your first workspace in your Omni account to get started."}
              </p>
              <p className="text-base-500 text-xs">
                A workspace is part of your Omni account and works across Omni
                products.
              </p>
            </div>

            <NewWorkspaceLink />
          </div>
        </div>
      </div>
    </div>
  );
}
