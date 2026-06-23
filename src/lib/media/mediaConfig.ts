/**
 * Client-side attachment config (advisory).
 *
 * Mirrors the server-authoritative limits in runa-api's `lib/media/mediaConfig`.
 * These checks only improve UX; the server is the source of truth.
 *
 * The per-file size cap is tier-aware (`max_attachment_bytes` in the omni-api
 * catalog SSOT: free 25MB, pro 100MB, team 250MB) and resolved via
 * `getMaxAttachmentBytes` in `@/lib/types/tier`.
 */

import { Tier, getMaxAttachmentBytes } from "@/lib/types/tier";

const MB = 1024 * 1024;

/** Image MIME types that render as inline previews */
export const IMAGE_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/avif",
]);

/** Video MIME types that render as inline previews */
export const VIDEO_MIME_TYPES = new Set([
  "video/mp4",
  "video/webm",
  "video/quicktime",
]);

/**
 * Per-file cap for project images (avatars). Not a tier attachment limit;
 * project images are not counted against `max_attachment_bytes`.
 */
export const MAX_PROJECT_IMAGE_BYTES = 20 * MB;

export type MediaKind = "image" | "video" | "file";

export const kindFromMimeType = (mimeType: string): MediaKind => {
  if (IMAGE_MIME_TYPES.has(mimeType)) return "image";
  if (VIDEO_MIME_TYPES.has(mimeType)) return "video";
  return "file";
};

/**
 * Advisory pre-flight check before uploading; returns an error string or null.
 *
 * `maxBytes` is the tier-aware per-file cap; defaults to the free-tier
 * attachment limit so callers without tier context stay conservative.
 */
export const validateFile = (
  file: File,
  maxBytes: number = getMaxAttachmentBytes(Tier.Free),
): string | null => {
  if (file.size <= 0) return "File is empty";
  if (Number.isFinite(maxBytes) && file.size > maxBytes) {
    return `File exceeds the ${Math.round(maxBytes / MB)}MB limit`;
  }
  return null;
};

/** Human-readable file size, e.g. 1.4 MB */
export const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  const units = ["KB", "MB", "GB"];
  let size = bytes / 1024;
  let unit = 0;
  while (size >= 1024 && unit < units.length - 1) {
    size /= 1024;
    unit += 1;
  }
  return `${size.toFixed(size < 10 ? 1 : 0)} ${units[unit]}`;
};
