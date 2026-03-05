/**
 * GitHub App installation status for the workspace.
 *
 * Org-level concern: shows whether the Runa GitHub App is installed
 * and provides an install link if not. Repo connections are managed
 * per-project in project settings.
 */

import { useQuery } from "@tanstack/react-query";
import { useLoaderData, useRouteContext } from "@tanstack/react-router";
import { CheckCircleIcon, XCircleIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { GITHUB_APP_INSTALL_URL } from "@/lib/config/env.config";
import githubInstallationOptions from "@/lib/options/githubInstallation.options";

export function GitHubAppInstallSection() {
  const { organizationId } = useLoaderData({
    from: "/_app/workspaces/$workspaceSlug/settings",
  });
  const { session } = useRouteContext({
    from: "/_app/workspaces/$workspaceSlug/settings",
  });

  const { data: installationData } = useQuery(
    githubInstallationOptions({
      organizationId: organizationId!,
      accessToken: session?.accessToken!,
    }),
  );

  const isInstalled = installationData?.installed ?? false;

  return (
    <section className="flex flex-col gap-4">
      <div>
        <h3 className="font-semibold text-lg">GitHub Integration</h3>
        <p className="text-muted-foreground text-sm">
          Install the Runa GitHub App to enable autonomous code execution across
          projects.
        </p>
      </div>

      <div className="flex items-center gap-3 rounded-lg border p-4">
        {isInstalled ? (
          <>
            <CheckCircleIcon className="size-5 text-green-600" />
            <div className="flex flex-1 flex-col">
              <span className="font-medium text-sm">GitHub App Installed</span>
              <span className="text-muted-foreground text-xs">
                Connected to {installationData?.githubOrgLogin}
              </span>
            </div>
          </>
        ) : (
          <>
            <XCircleIcon className="size-5 text-muted-foreground" />
            <div className="flex flex-1 flex-col">
              <span className="font-medium text-sm">
                GitHub App Not Installed
              </span>
              <span className="text-muted-foreground text-xs">
                Install the Runa GitHub App to enable code execution
              </span>
            </div>
            {GITHUB_APP_INSTALL_URL && (
              <Button size="sm" variant="outline" asChild>
                <a
                  href={GITHUB_APP_INSTALL_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Install App
                </a>
              </Button>
            )}
          </>
        )}
      </div>
    </section>
  );
}
