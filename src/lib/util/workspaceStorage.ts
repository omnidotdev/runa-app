const STORAGE_KEY = "runa:lastWorkspaceSlug";

/**
 * Get the last selected workspace slug from localStorage
 */
export function getLastWorkspaceSlug(): string | null {
  if (typeof window === "undefined") return null;

  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    // localStorage may be unavailable (private browsing, etc.)
    return null;
  }
}

/**
 * Save the current workspace slug to localStorage
 */
export function setLastWorkspaceSlug(slug: string): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(STORAGE_KEY, slug);
  } catch {
    // localStorage may be unavailable
  }
}

/**
 * Clear the saved workspace slug from localStorage
 * @knipignore - utility for logout/account deletion flows
 */
export function clearLastWorkspaceSlug(): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // localStorage may be unavailable
  }
}
