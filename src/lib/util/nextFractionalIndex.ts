import { compareKeys, keyBetween } from "./fractionalKey";

/**
 * Compute the fractional index for appending an item to the end of an ordered
 * list (checklists on a task, or items within a checklist). Finds the current
 * maximum key by byte-order comparison (matches the DB's COLLATE "C") so it is
 * correct even if the input is not pre-sorted
 */
const nextFractionalIndex = (
  existing: ReadonlyArray<{ index: string }> | null | undefined,
): string => {
  const last = (existing ?? [])
    .map((entry) => entry.index)
    .reduce<string | null>(
      (max, key) => (max === null || compareKeys(key, max) > 0 ? key : max),
      null,
    );

  return keyBetween(last, null);
};

export default nextFractionalIndex;
