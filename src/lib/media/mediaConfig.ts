/**
 * Client-side attachment config (advisory).
 *
 * Mirrors the server-authoritative limits in runa-api's `lib/media/mediaConfig`.
 * These checks only improve UX; the server is the source of truth.
 */

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

/** Per-kind size limits, matching the server */
export const MAX_BYTES = {
  image: 20 * MB,
  video: 50 * MB,
  file: 25 * MB,
} as const;

export type MediaKind = "image" | "video" | "file";

export const kindFromMimeType = (mimeType: string): MediaKind => {
  if (IMAGE_MIME_TYPES.has(mimeType)) return "image";
  if (VIDEO_MIME_TYPES.has(mimeType)) return "video";
  return "file";
};

/** Advisory pre-flight check before uploading; returns an error string or null */
export const validateFile = (file: File): string | null => {
  if (file.size <= 0) return "File is empty";
  const kind = kindFromMimeType(file.type);
  if (file.size > MAX_BYTES[kind]) {
    return `${kind} exceeds the ${Math.round(MAX_BYTES[kind] / MB)}MB limit`;
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
