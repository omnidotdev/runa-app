/**
 * Client helpers for the task attachment REST routes.
 *
 * Attachments are written through REST (not GraphQL) so storage and database
 * stay in sync. Reads still flow through the generated `attachments` query.
 */

import { API_BASE_URL } from "@/lib/config/env.config";
import { fetchSession } from "@/server/functions/auth";

/** Server-returned attachment record (mirrors the `attachment` table) */
export interface AttachmentRecord {
  id: string;
  taskId: string;
  postId: string | null;
  authorId: string | null;
  organizationId: string;
  filename: string;
  mimeType: string;
  fileSize: number;
  kind: "image" | "video" | "file";
  storageKey: string;
  url: string;
  width: number | null;
  height: number | null;
  metadata: {
    thumbnailUrl?: string;
    thumbnailWidth?: number;
    thumbnailHeight?: number;
    lqip?: string;
  } | null;
  createdAt: string;
  updatedAt: string;
}

const authHeaders = async (): Promise<Record<string, string>> => {
  const { session } = await fetchSession();
  const accessToken = session?.accessToken;
  return accessToken ? { Authorization: `Bearer ${accessToken}` } : {};
};

/**
 * Upload a single file as an attachment on a task (and optionally a comment).
 */
export const uploadAttachment = async (
  file: File,
  taskId: string,
  postId?: string,
): Promise<AttachmentRecord> => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("taskId", taskId);
  if (postId) formData.append("postId", postId);

  const response = await fetch(`${API_BASE_URL}/api/attachments/upload`, {
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

  return response.json() as Promise<AttachmentRecord>;
};

/** Delete an attachment by id. */
export const deleteAttachment = async (id: string): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/api/attachments/${id}`, {
    method: "DELETE",
    headers: await authHeaders(),
  });

  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as {
      error?: string;
    } | null;
    throw new Error(body?.error ?? `Delete failed (${response.status})`);
  }
};
