import { LinkIcon } from "lucide-react";

import { useLinkPreviewQuery } from "@/generated/graphql";
import extractUrls from "@/lib/util/extractUrls";
import { isHttpUrl, shortenUrl } from "@/lib/util/linkChip";
import { cn } from "@/lib/utils";

// Server caches unfurls, so keep them fresh for the session without refetching
const PREVIEW_STALE_TIME = 60 * 60 * 1000;

const hostname = (url: string): string => {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
};

/** PreviewFavicon image with a graceful fallback to a generic link glyph. */
const PreviewFavicon = ({
  dataUri,
  className,
}: {
  dataUri?: string | null;
  className?: string;
}) =>
  dataUri ? (
    <img
      src={dataUri}
      alt=""
      width={14}
      height={14}
      className={cn("size-3.5 shrink-0 rounded-sm", className)}
    />
  ) : (
    <LinkIcon className={cn("size-3.5 shrink-0 text-base-400", className)} />
  );

interface LinkChipProps {
  /** The URL to render. Non-http(s) values render as plain text. */
  url: string;
  /** Render in a completed/struck-through style. */
  done?: boolean;
}

/**
 * Inline link chip: favicon + a shortened label (page title once unfurled, else
 * the shortened URL), opening in a new tab. Used for checklist items that are a
 * bare URL
 */
export const LinkChip = ({ url, done = false }: LinkChipProps) => {
  const enabled = isHttpUrl(url);
  const { data } = useLinkPreviewQuery(
    { url },
    { enabled, staleTime: PREVIEW_STALE_TIME },
  );

  if (!enabled) return <span className="flex-1 text-sm">{url}</span>;

  const preview = data?.linkPreview;
  const label = preview?.title || shortenUrl(url);

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      title={url}
      className={cn(
        "flex min-w-0 flex-1 items-center gap-1.5 text-sm",
        done && "opacity-60",
      )}
    >
      <PreviewFavicon dataUri={preview?.faviconDataUri} />
      <span
        className={cn(
          "truncate text-primary",
          done ? "line-through" : "hover:underline",
        )}
      >
        {label}
      </span>
    </a>
  );
};

/** A single link preview card (favicon + title + host). */
const LinkPreviewCard = ({ url }: { url: string }) => {
  const { data } = useLinkPreviewQuery(
    { url },
    { enabled: true, staleTime: PREVIEW_STALE_TIME },
  );
  const preview = data?.linkPreview;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      title={url}
      className="flex items-center gap-2 rounded-md border px-2.5 py-1.5 no-underline transition-colors hover:bg-base-50 dark:hover:bg-base-800"
    >
      <PreviewFavicon dataUri={preview?.faviconDataUri} className="size-4" />
      <span className="flex min-w-0 flex-col">
        <span className="truncate font-medium text-base-900 text-sm dark:text-base-100">
          {preview?.title || shortenUrl(url)}
        </span>
        <span className="truncate text-base-500 text-xs dark:text-base-400">
          {hostname(url)}
        </span>
      </span>
    </a>
  );
};

/**
 * Render preview cards for any http(s) URLs found in a description or comment.
 * Non-invasive: rendered beneath the read-only rich text rather than rewriting
 * the editor content. Returns nothing when there are no links
 */
export const LinkPreviews = ({ content }: { content?: string | null }) => {
  const urls = extractUrls(content);
  if (!urls.length) return null;

  return (
    <div className="mt-2 flex flex-col gap-1.5">
      {urls.map((url) => (
        <LinkPreviewCard key={url} url={url} />
      ))}
    </div>
  );
};
