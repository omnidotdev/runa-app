import generateSlug from "@/lib/util/generateSlug";

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const NUMBER_KEY_PATTERN = /^(\d+)(?:-(.*))?$/;

/**
 * Parsed form of the dynamic task route segment.
 *
 * - `uuid`: a legacy permalink keyed by the task's `rowId`
 * - `number`: a vanity key of `{number}-{slug}` (slug optional/decorative)
 * - `invalid`: neither form, the route should 404
 */
export type ParsedTaskParam =
  | { type: "uuid"; rowId: string }
  | { type: "number"; number: number; slug?: string }
  | { type: "invalid" };

/**
 * Parse the `$taskId` route segment into a lookup strategy. Supports the legacy
 * UUID permalink and the vanity `{number}-{slug}` form.
 */
export const parseTaskParam = (param: string): ParsedTaskParam => {
  if (UUID_PATTERN.test(param)) {
    return { type: "uuid", rowId: param };
  }

  const match = param.match(NUMBER_KEY_PATTERN);
  if (match) {
    return {
      type: "number",
      number: Number(match[1]),
      slug: match[2] || undefined,
    };
  }

  return { type: "invalid" };
};

/** Strip HTML tags and collapse whitespace from rich-text task content. */
export const stripMarkup = (html: string): string =>
  html
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

/**
 * Build the canonical vanity key for a task: `{number}-{slug}`, where the slug
 * derives from the task's rich-text content. Falls back to the bare number when
 * the content has no slugifiable text.
 */
export const buildTaskKey = ({
  number,
  content,
}: {
  number: number;
  content?: string | null;
}): string => {
  const text = content ? stripMarkup(content) : "";
  const slug = text ? generateSlug(text) : "";

  return slug ? `${number}-${slug}` : `${number}`;
};

/**
 * Build the human-facing display key for a task: `{PREFIX}-{number}` (e.g.
 * `API-42`), falling back to `PROJ-{number}` when the project has no prefix.
 */
export const buildTaskDisplayKey = ({
  prefix,
  number,
}: {
  prefix?: string | null;
  number: number;
}): string => `${prefix || "PROJ"}-${number}`;
