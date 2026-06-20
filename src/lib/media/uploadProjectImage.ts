/**
 * Client helper for the project avatar REST route.
 *
 * Avatars are written through REST (not GraphQL) so storage stays in sync, then
 * the returned serve URL is persisted onto `project.image` via `updateProject`.
 */

import { API_BASE_URL } from "@/lib/config/env.config";
import { fetchSession } from "@/server/functions/auth";

const authHeaders = async (): Promise<Record<string, string>> => {
  const { session } = await fetchSession();
  const accessToken = session?.accessToken;
  return accessToken ? { Authorization: `Bearer ${accessToken}` } : {};
};

/**
 * Upload a project avatar image and return its serve URL.
 *
 * @param file image file selected by the user
 * @param projectId rowId of the project whose avatar is being set
 */
export const uploadProjectImage = async (
  file: File,
  projectId: string,
): Promise<{ url: string }> => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("projectId", projectId);

  const response = await fetch(`${API_BASE_URL}/api/projects/avatar`, {
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

  return response.json() as Promise<{ url: string }>;
};
