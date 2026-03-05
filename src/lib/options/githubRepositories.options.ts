/**
 * Query options for GitHub repositories connected to a project.
 */

import { queryOptions } from "@tanstack/react-query";

import { API_BASE_URL } from "@/lib/config/env.config";

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

export interface GitHubRepository {
  id: string;
  organizationId: string;
  projectId: string;
  repoFullName: string;
  repoId: number;
  defaultBranch: string;
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
}

interface GitHubRepositoriesResponse {
  repositories: GitHubRepository[];
}

// ─────────────────────────────────────────────
// Query Key
// ─────────────────────────────────────────────

export function githubRepositoriesQueryKey(projectId: string) {
  return ["GitHubRepositories", projectId] as const;
}

// ─────────────────────────────────────────────
// Fetcher
// ─────────────────────────────────────────────

async function fetchGitHubRepositories(
  projectId: string,
  accessToken: string,
): Promise<GitHubRepositoriesResponse> {
  const url = new URL(`${API_BASE_URL}/api/github/repos`);
  url.searchParams.set("projectId", projectId);

  const response = await fetch(url.toString(), {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch GitHub repositories");
  }

  return response.json() as Promise<GitHubRepositoriesResponse>;
}

// ─────────────────────────────────────────────
// Options
// ─────────────────────────────────────────────

export interface GitHubRepositoriesVariables {
  projectId: string;
  accessToken: string;
}

const githubRepositoriesOptions = ({
  projectId,
  accessToken,
}: GitHubRepositoriesVariables) =>
  queryOptions({
    queryKey: githubRepositoriesQueryKey(projectId),
    queryFn: () => fetchGitHubRepositories(projectId, accessToken),
    enabled: !!projectId && !!accessToken,
  });

export default githubRepositoriesOptions;
