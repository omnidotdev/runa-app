/**
 * Centralized permission definitions for RBAC. Mirrors the backend permission system for consistent UI gating.
 */

import { Role } from "@/generated/graphql";

/**
 * Role hierarchy for permission checks.
 * Higher number = more permissions.
 */
export const RoleHierarchy = {
  [Role.Owner]: 3,
  [Role.Admin]: 2,
  [Role.Member]: 1,
} as const;

/**
 * Check if a role meets the minimum required role level.
 */
export const hasMinRole = (userRole: Role, minRole: Role): boolean =>
  RoleHierarchy[userRole] >= RoleHierarchy[minRole];

/**
 * Check if user has admin or owner role.
 */
export const isAdminOrOwner = (role: Role): boolean =>
  role === Role.Admin || role === Role.Owner;

/**
 * Check if user is the workspace owner.
 */
export const isOwner = (role: Role): boolean => role === Role.Owner;

/**
 * Check if user is a regular member (not admin or owner).
 */
export const isMemberOnly = (role: Role): boolean => role === Role.Member;
