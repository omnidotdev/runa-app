/** A single workspace link (website, social, doc, etc.). */
export interface WorkspaceLink {
  url: string;
  title?: string | null;
  visibility?: string | null;
}

/**
 * Coerce a workspace's `links` into an array of well-formed links.
 *
 * Gatekeeper stores `links` in a `text` column as a JSON string, and the API
 * returns it as-is, so a consumer that trusts the `WorkspaceLink[]` type and
 * calls `.map`/`.length` on it crashes when the value is actually the raw
 * string (the `?? []` fallback only catches null/undefined, and a string has a
 * truthy `.length`). Normalize every shape here: parse a JSON string, pass an
 * array through, and drop anything without a string `url`; anything else
 * becomes an empty array.
 */
const normalizeWorkspaceLinks = (raw: unknown): WorkspaceLink[] => {
  let value = raw;

  if (typeof value === "string") {
    try {
      value = JSON.parse(value);
    } catch {
      return [];
    }
  }

  if (!Array.isArray(value)) return [];

  return value.filter(
    (link): link is WorkspaceLink =>
      !!link &&
      typeof link === "object" &&
      typeof (link as { url?: unknown }).url === "string",
  );
};

export default normalizeWorkspaceLinks;
