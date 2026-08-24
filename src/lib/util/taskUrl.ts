import generateSlug from "@/lib/util/generateSlug";

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
// Canonical item key: an optional `{PREFIX}-` (letters, then letters/digits),
// a load-bearing `{number}`, and an optional decorative `-{slug}` tail. Both
// the prefixed form (`API-42-fix-login`) and the legacy bare-number form
// (`42-fix-login`) parse; only the number is used for lookup.
const NUMBER_KEY_PATTERN = /^(?:([A-Za-z][A-Za-z0-9]*)-)?(\d+)(?:-(.*))?$/;

/**
 * Parsed form of the dynamic task route segment.
 *
 * - `uuid`: a legacy permalink keyed by the task's `rowId`
 * - `number`: a vanity key of `{prefix}-{number}-{slug}` (prefix and slug both
 *   optional/decorative; only the number is load-bearing)
 * - `invalid`: neither form, the route should 404
 */
export type ParsedTaskParam =
  | { type: "uuid"; rowId: string }
  | { type: "number"; number: number; prefix?: string; slug?: string }
  | { type: "invalid" };

/**
 * Parse the `$taskId` route segment into a lookup strategy. Supports the legacy
 * UUID permalink and the vanity `{prefix}-{number}-{slug}` form (the prefix and
 * slug are decorative and self-heal via the canonical redirect).
 */
export const parseTaskParam = (param: string): ParsedTaskParam => {
  if (UUID_PATTERN.test(param)) {
    return { type: "uuid", rowId: param };
  }

  const match = param.match(NUMBER_KEY_PATTERN);
  if (match) {
    return {
      type: "number",
      prefix: match[1] || undefined,
      number: Number(match[2]),
      slug: match[3] || undefined,
    };
  }

  return { type: "invalid" };
};

/**
 * Whether a value is a canonical task `rowId` (a UUID) rather than a vanity
 * `{number}-{slug}` key. Guards mutations that require the `rowId`, since the
 * detail route's `$taskId` param is a vanity key, not the `rowId`.
 */
export const isTaskRowId = (
  value: string | null | undefined,
): value is string => !!value && UUID_PATTERN.test(value);

/** Strip HTML tags and collapse whitespace from rich-text task content. */
export const stripMarkup = (html: string): string =>
  html
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

/**
 * Build the canonical vanity key for a task: `{prefix}-{number}-{slug}` (e.g.
 * `API-42-fix-login`), where the slug derives from the task's rich-text content.
 * The prefix is included when the project has one so the key is self-describing
 * when pasted into a changelog, PR, or another product (golden/URL-GRAMMAR.md
 * rule 5). Falls back to dropping the prefix and/or slug, down to the bare
 * number.
 */
export const buildTaskKey = ({
  prefix,
  number,
  content,
}: {
  prefix?: string | null;
  number: number;
  content?: string | null;
}): string => {
  const base = prefix ? `${prefix}-${number}` : `${number}`;
  const text = content ? stripMarkup(content) : "";
  const slug = text ? generateSlug(text) : "";

  return slug ? `${base}-${slug}` : base;
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
