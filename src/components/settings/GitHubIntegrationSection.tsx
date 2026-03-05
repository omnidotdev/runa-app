/**
 * Per-project GitHub repository connection.
 *
 * Allows connecting/disconnecting a single repository for a project.
 * The GitHub App must be installed at the workspace level first.
 */

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useLoaderData, useRouteContext } from "@tanstack/react-router";
import { GitBranchIcon, LinkIcon, Trash2Icon } from "lucide-react";
import { useCallback, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { API_BASE_URL } from "@/lib/config/env.config";
import githubInstallationOptions from "@/lib/options/githubInstallation.options";
import githubRepositoriesOptions, {
  githubRepositoriesQueryKey,
} from "@/lib/options/githubRepositories.options";

import type { GitHubRepository } from "@/lib/options/githubRepositories.options";

// ─────────────────────────────────────────────
// API
// ─────────────────────────────────────────────

async function connectRepo(
  projectId: string,
  repoFullName: string,
  accessToken: string,
): Promise<{ repository: GitHubRepository }> {
  const response = await fetch(`${API_BASE_URL}/api/github/repos`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ projectId, repoFullName }),
  });

  if (!response.ok) {
    const data = (await response.json().catch(() => null)) as {
      error?: string;
    } | null;
    throw new Error(data?.error ?? "Failed to connect repository");
  }

  return response.json() as Promise<{ repository: GitHubRepository }>;
}

async function disconnectRepo(
  repoId: string,
  accessToken: string,
): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/github/repos/${repoId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!response.ok) {
    throw new Error("Failed to disconnect repository");
  }
}

// ─────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────

export function GitHubIntegrationSection() {
  const { organizationId, projectId } = useLoaderData({
    from: "/_app/workspaces/$workspaceSlug/projects/$projectSlug/settings",
  });
  const { session } = useRouteContext({
    from: "/_app/workspaces/$workspaceSlug/projects/$projectSlug/settings",
  });

  const accessToken = session?.accessToken!;
  const queryClient = useQueryClient();

  // Check if GitHub App is installed (org-level prerequisite)
  const { data: installationData } = useQuery(
    githubInstallationOptions({
      organizationId: organizationId!,
      accessToken,
    }),
  );

  const isInstalled = installationData?.installed ?? false;

  // Repository connection for this project
  const { data: repoData } = useQuery(
    githubRepositoriesOptions({ projectId, accessToken }),
  );

  const connectedRepo = repoData?.repositories?.[0];

  const [repoInput, setRepoInput] = useState("");

  const { mutate: connect, isPending: isConnecting } = useMutation({
    mutationFn: () => connectRepo(projectId, repoInput, accessToken),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: githubRepositoriesQueryKey(projectId),
      });
      setRepoInput("");
    },
  });

  const { mutate: disconnect, isPending: isDisconnecting } = useMutation({
    mutationFn: () => disconnectRepo(connectedRepo!.id, accessToken),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: githubRepositoriesQueryKey(projectId),
      });
    },
  });

  const handleConnect = useCallback(() => {
    if (repoInput.trim()) {
      connect();
    }
  }, [connect, repoInput]);

  if (!isInstalled) {
    return (
      <section className="flex flex-col gap-4">
        <div>
          <h3 className="font-semibold text-lg">Repository Connection</h3>
          <p className="text-muted-foreground text-sm">
            Install the Runa GitHub App in workspace settings to connect a
            repository.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="flex flex-col gap-4">
      <div>
        <h3 className="font-semibold text-lg">Repository Connection</h3>
        <p className="text-muted-foreground text-sm">
          Connect a GitHub repository to enable autonomous code execution for
          this project.
        </p>
      </div>

      <div className="flex items-center gap-3 rounded-md border p-3">
        <GitBranchIcon className="size-4 shrink-0 text-muted-foreground" />

        {connectedRepo ? (
          <div className="flex flex-1 items-center justify-between gap-2">
            <div className="flex items-center gap-1.5">
              <LinkIcon className="size-3 text-green-600" />
              <span className="text-sm">{connectedRepo.repoFullName}</span>
            </div>
            <Button
              size="sm"
              variant="ghost"
              disabled={isDisconnecting}
              onClick={() => disconnect()}
            >
              <Trash2Icon className="size-3.5" />
            </Button>
          </div>
        ) : (
          <div className="flex flex-1 items-center gap-2">
            <Input
              value={repoInput}
              onChange={(e) => setRepoInput(e.target.value)}
              placeholder="owner/repo"
              className="h-8 text-sm"
            />
            <Button
              size="sm"
              variant="outline"
              disabled={!repoInput.trim() || isConnecting}
              onClick={handleConnect}
            >
              Connect
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
