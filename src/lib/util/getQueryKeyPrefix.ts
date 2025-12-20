import type { QueryKey } from "@tanstack/react-query";

/**
 * Extract the query key prefix from a generated query hook's `getKey` function.
 * Used for cache invalidation to match all queries of a given type.
 *
 * @example
 * // Instead of hardcoded: invalidates: [["Task"], ["Tasks"]]
 * // Use: invalidates: [getQueryKeyPrefix(useTaskQuery), getQueryKeyPrefix(useTasksQuery)]
 */
const getQueryKeyPrefix = <
  T extends { getKey: (...args: never[]) => QueryKey },
>(
  hook: T,
): QueryKey => {
  // call `getKey` with a dummy object to extract the prefix (first element)
  const [keyPrefix] = hook.getKey({} as never);

  return [keyPrefix];
};

export default getQueryKeyPrefix;
