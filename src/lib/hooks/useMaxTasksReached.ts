/**
 * Hook to check if maximum tasks limit is reached.
 *
 * Limit enforcement is handled server-side via Aether entitlements.
 * This hook is kept for API compatibility but always returns false.
 * The server will return an error if the limit is exceeded.
 */
const useMaxTasksReached = () => {
  // Limits are enforced server-side via Aether entitlements
  // The server will reject mutations that exceed limits
  return false;
};

export default useMaxTasksReached;
