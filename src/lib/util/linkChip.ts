/**
 * Helpers for rendering a checklist item (or any short text) that is a URL as a
 * compact link chip: an icon plus a shortened, readable label. Only http(s) URLs
 * are treated as links so we never render a dangerous scheme (e.g. `javascript:`)
 * as a clickable href
 */

/** Whether a string is a safe, clickable http(s) URL. */
export const isHttpUrl = (value: string): boolean => {
  try {
    const url = new URL(value.trim());
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
};

/**
 * Shorten a URL to a readable label: host (without `www.`) plus path, collapsing a
 * long path to `host/…/lastSegment`. Returns the input unchanged if it is not a URL.
 */
export const shortenUrl = (value: string): string => {
  try {
    const url = new URL(value.trim());
    const host = url.hostname.replace(/^www\./, "");
    const path = url.pathname === "/" ? "" : url.pathname.replace(/\/$/, "");
    const full = `${host}${path}`;
    if (full.length <= 42) return full;

    const lastSegment = path.split("/").filter(Boolean).pop();
    return lastSegment ? `${host}/…/${lastSegment}` : host;
  } catch {
    return value;
  }
};

/**
 * A clean, human label for a link that has no fetched title. Auth-walled pages
 * (e.g. a private Google Doc) never yield a title to an anonymous server fetch,
 * so rather than show an ugly `host/…/edit` path we show the provider or the
 * bare host. Used for the preview-card fallback, not inline chips.
 */
export const friendlyLinkLabel = (value: string): string => {
  try {
    const url = new URL(value.trim());
    const host = url.hostname.replace(/^www\./, "");
    const path = url.pathname;

    if (host === "docs.google.com") {
      if (path.startsWith("/spreadsheets")) return "Google Sheets";
      if (path.startsWith("/presentation")) return "Google Slides";
      if (path.startsWith("/forms")) return "Google Forms";
      return "Google Docs";
    }
    if (host === "drive.google.com") return "Google Drive";

    // otherwise the bare host reads better than a truncated path
    return host;
  } catch {
    return value;
  }
};

/** A favicon URL for the link's host, or null if the value is not a URL. */
export const faviconUrl = (value: string): string | null => {
  try {
    const { hostname } = new URL(value.trim());
    return `https://icons.duckduckgo.com/ip3/${hostname}.ico`;
  } catch {
    return null;
  }
};
