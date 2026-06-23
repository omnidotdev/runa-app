/**
 * Client helper for the project board background REST route.
 *
 * Mirrors uploadProjectImage: the image is written through REST (not GraphQL)
 * so storage stays in sync, then the returned storage key is persisted inside
 * `project.background` (kind "image") via `updateProject`. The key, not a bare
 * URL, is stored so the board can request an optimized derivative from the
 * transform-capable serve route.
 */

import { API_BASE_URL } from "@/lib/config/env.config";
import { fetchSession } from "@/server/functions/auth";

const authHeaders = async (): Promise<Record<string, string>> => {
  const { session } = await fetchSession();
  const accessToken = session?.accessToken;
  return accessToken ? { Authorization: `Bearer ${accessToken}` } : {};
};

/**
 * Upload a board background image and return its storage key (`assetId`).
 *
 * @param file image file selected by the user
 * @param projectId rowId of the project whose background is being set
 */
export const uploadProjectBackground = async (
  file: File,
  projectId: string,
): Promise<{ assetId: string; url: string }> => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("projectId", projectId);

  const response = await fetch(`${API_BASE_URL}/api/projects/background`, {
    method: "POST",
    headers: await authHeaders(),
    body: formData,
  });

  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as {
      error?: string;
    } | null;
    throw new Error(body?.error ?? `Upload failed (${response.status})`);
  }

  return response.json() as Promise<{ assetId: string; url: string }>;
};
