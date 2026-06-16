import { generateKeyBetween, generateNKeysBetween } from "fractional-indexing";

/**
 * Compute a fractional-indexing key strictly between `prev` and `next`.
 * Pass `null` for an open-ended boundary (start or end of the list).
 * @param prev - Existing key immediately before the new position, or null.
 * @param next - Existing key immediately after the new position, or null.
 * @returns A new key that lex-sorts strictly between `prev` and `next`.
 */
export const keyBetween = (prev: string | null, next: string | null): string =>
  generateKeyBetween(prev, next);

/**
 * Compute `n` evenly-spaced fractional-indexing keys between `prev` and `next`.
 * @param prev - Existing key before the first new position, or null.
 * @param next - Existing key after the last new position, or null.
 * @param n - Number of keys to generate.
 * @returns Array of `n` strictly increasing keys.
 */
export const keysBetween = (
  prev: string | null,
  next: string | null,
  n: number,
): string[] => generateNKeysBetween(prev, next, n);

/**
 * Byte-order comparator for fractional-indexing keys. Use with `Array.sort`
 * to match server-side ORDER BY under `COLLATE "C"`. JavaScript string
 * comparison is byte-wise by default; this helper exists so call sites do
 * not accidentally reach for `localeCompare`, which returns the wrong order
 * (uppercase Z would sort after lowercase a in en_US.UTF-8).
 * @param a - First key.
 * @param b - Second key.
 * @returns -1, 0, or 1.
 */
export const compareKeys = (a: string, b: string): number =>
  a < b ? -1 : a > b ? 1 : 0;

/**
 * Compute a key for an item being inserted at `toIndex` in `siblings`.
 * `siblings` must be the destination list ordered by key, EXCLUDING the moved item.
 * @param siblings - Destination list (without the moved item) ordered by key.
 * @param toIndex - Target index for the moved item within `siblings`.
 * @param keyOf - Reads the key from a sibling.
 * @returns A new key that places the moved item at `toIndex` after sort.
 */
export const reorderKey = <T>(
  siblings: T[],
  toIndex: number,
  keyOf: (item: T) => string,
): string => {
  const prev = toIndex === 0 ? null : keyOf(siblings[toIndex - 1]!);
  const next = toIndex >= siblings.length ? null : keyOf(siblings[toIndex]!);

  return generateKeyBetween(prev, next);
};
