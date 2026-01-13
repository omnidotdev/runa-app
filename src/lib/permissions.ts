/**
 * UI-level permission helpers for role-based access control.
 *
 * IMPORTANT: These functions are for UI/UX purposes only (e.g., hiding buttons, disabling actions).
 * Actual authorization is enforced server-side via the PDP.
 * The API is the security boundary - these checks simply provide a better user experience
 * by preventing users from attempting actions they cannot perform.
 */

/**
 * Role type matching the IDP organization member roles.
 * This replaces the GraphQL Role enum since membership is now managed by the IDP.
 */
export type Role = "owner" | "admin" | "member";

/**
 * Role enum-like object for compatibility with existing code.
 */
export const Role = {
  Owner: "owner" as const,
  Admin: "admin" as const,
  Member: "member" as const,
};

/**
 * Check if user has admin or owner role.
 */
export const isAdminOrOwner = (role: Role): boolean =>
  role === Role.Admin || role === Role.Owner;

/**
 * Check if user is the workspace owner.
 */
export const isOwner = (role: Role): boolean => role === Role.Owner;
