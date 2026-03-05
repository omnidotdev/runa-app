/**
 * Query options for GitHub App installation status.
 */

import { queryOptions } from "@tanstack/react-query";

import { API_BASE_URL } from "@/lib/config/env.config";

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

export interface GitHubInstallationResponse {
  installed: boolean;
  githubOrgLogin: string | null;
  installationId: number | null;
}

// ─────────────────────────────────────────────
// Query Key
// ─────────────────────────────────────────────

export function githubInstallationQueryKey(organizationId: string) {
  return ["GitHubInstallation", organizationId] as const;
}

// ─────────────────────────────────────────────
// Fetcher
// ─────────────────────────────────────────────

async function fetchGitHubInstallation(
  organizationId: string,
  accessToken: string,
): Promise<GitHubInstallationResponse> {
  const url = new URL(`${API_BASE_URL}/api/github/installation`);
  url.searchParams.set("organizationId", organizationId);

  const response = await fetch(url.toString(), {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch GitHub installation status");
  }

  return response.json() as Promise<GitHubInstallationResponse>;
}

// ─────────────────────────────────────────────
// Options
// ─────────────────────────────────────────────

export interface GitHubInstallationVariables {
  organizationId: string;
  accessToken: string;
}

const githubInstallationOptions = ({
  organizationId,
  accessToken,
}: GitHubInstallationVariables) =>
  queryOptions({
    queryKey: githubInstallationQueryKey(organizationId),
    queryFn: () => fetchGitHubInstallation(organizationId, accessToken),
    enabled: !!organizationId && !!accessToken,
  });

export default githubInstallationOptions;
