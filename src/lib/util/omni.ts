/**
 * Utility functions for Omni organization membership checks.
 */

/**
 * Decode JWT token payload without verification (for client-side use with trusted tokens).
 */
function decodeJWTPayload(token: string): Record<string, any> | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const payload = parts[1];
    const decoded = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(decoded);
  } catch (error) {
    console.error("Error decoding JWT:", error);
    return null;
  }
}

/**
 * Check if user is an Omni team member based on JWT claims.
 */
export function isOmniTeamMember(accessToken?: string): boolean {
  if (!accessToken) return false;
  const payload = decodeJWTPayload(accessToken);
  return payload?.omni_team_member === true;
}

/**
 * Get user's Omni role if they are a team member.
 */
export function getOmniRole(accessToken?: string): string | null {
  if (!accessToken) return null;
  const payload = decodeJWTPayload(accessToken);
  if (payload?.omni_team_member === true) {
    return payload?.omni_role || null;
  }
  return null;
}

/**
 * Get all OIDC claims from the access token.
 */
export function getOIDCClaims(
  accessToken?: string,
): Record<string, any> | null {
  if (!accessToken) return null;
  return decodeJWTPayload(accessToken);
}
