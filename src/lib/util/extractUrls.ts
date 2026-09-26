import { isHttpUrl } from "./linkChip";

// Bare URL run: grab until whitespace or a quote/angle bracket
const URL_PATTERN = /https?:\/\/[^\s"'<>]+/gi;
// href="..." or href='...'
const HREF_PATTERN = /href=["']([^"']+)["']/gi;

/** Strip punctuation that commonly trails a URL in prose. */
const trimTrailing = (url: string): string =>
  url.replace(/[.,;:!?)\]}>'"]+$/, "");

/**
 * Extract unique http(s) URLs from a description/comment's HTML (or plain text)
 * for link previews: anchor hrefs plus bare URLs in the text, with trailing
 * prose punctuation stripped, non-http links dropped, deduped, and capped
 */
const extractUrls = (html: string | null | undefined, max = 5): string[] => {
  if (!html) return [];

  const found: string[] = [];
  for (const [, href] of html.matchAll(HREF_PATTERN)) found.push(href);
  for (const [match] of html.matchAll(URL_PATTERN)) found.push(match);

  const seen = new Set<string>();
  const urls: string[] = [];
  for (const raw of found) {
    const url = trimTrailing(raw.trim());
    if (!isHttpUrl(url) || seen.has(url)) continue;
    seen.add(url);
    urls.push(url);
    if (urls.length >= max) break;
  }
  return urls;
};

export default extractUrls;
