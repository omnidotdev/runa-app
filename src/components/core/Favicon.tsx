import { GlobeIcon } from "lucide-react";
import { useMemo, useState } from "react";

import { useLinkPreviewQuery } from "@/generated/graphql";
import { cn } from "@/lib/utils";

interface Props {
  url: string;
  /** Size in pixels (default: 16) */
  size?: number;
  className?: string;
}

// Favicon unfurls are cached server-side, so keep them fresh for the session
// without refetching
const FAVICON_STALE_TIME = 60 * 60 * 1000;

/**
 * Client-fetchable favicon sources for a site, best-first: the site's own
 * declared icon paths (handles sites that serve favicon.svg / apple-touch-icon
 * rather than a root favicon.ico), then a public favicon service. Used only as
 * a fallback when the server-side unfurl returns no favicon.
 */
const faviconCandidates = (url: string): string[] => {
  try {
    const { origin, hostname } = new URL(url);
    return [
      `${origin}/favicon.svg`,
      `${origin}/favicon.ico`,
      `${origin}/apple-touch-icon.png`,
      `https://www.google.com/s2/favicons?domain=${hostname}&sz=64`,
    ];
  } catch {
    return [];
  }
};

/**
 * Favicon for a website URL.
 *
 * Prefers the server-side unfurl's favicon, which the API fetches and inlines
 * as a data URI: the browser makes no cross-origin request, so an ad blocker or
 * privacy extension that blocks social domains or third-party favicon services
 * (a common reason link favicons silently go missing) cannot break it. Falls
 * back to fetching the site's own declared icon paths directly, then to a globe
 * when nothing resolves.
 */
const Favicon = ({ url, size = 16, className }: Props) => {
  const { data } = useLinkPreviewQuery(
    { url },
    { staleTime: FAVICON_STALE_TIME },
  );
  const dataUri = data?.linkPreview?.faviconDataUri;

  const candidates = useMemo(() => faviconCandidates(url), [url]);
  // Index into the client fallback chain, and whether the server data URI
  // itself failed to render (so we drop to the fallback chain)
  const [index, setIndex] = useState(0);
  const [dataUriFailed, setDataUriFailed] = useState(false);

  const useDataUri = !!dataUri && !dataUriFailed;
  const src = useDataUri ? dataUri : candidates[index];

  return (
    <div
      className={cn(
        "flex size-4 shrink-0 items-center justify-center",
        className,
      )}
    >
      {src ? (
        <img
          key={src}
          src={src}
          alt=""
          width={size}
          height={size}
          className="size-4 object-contain"
          onError={() =>
            useDataUri ? setDataUriFailed(true) : setIndex((i) => i + 1)
          }
        />
      ) : (
        <GlobeIcon className="size-4 text-current" />
      )}
    </div>
  );
};

export default Favicon;
