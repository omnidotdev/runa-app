/**
 * Centralized permission definitions for RBAC. Mirrors the backend permission system for consistent UI gating.
 */

import { Role } from "@/generated/graphql";

/**
 * Check if user has admin or owner role.
 */
export const isAdminOrOwner = (role: Role): boolean =>
  role === Role.Admin || role === Role.Owner;

/**
 * Check if user is the workspace owner.
 */
export const isOwner = (role: Role): boolean => role === Role.Owner;
