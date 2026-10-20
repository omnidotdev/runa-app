import { GlobeIcon } from "lucide-react";
import { useMemo, useState } from "react";

import { cn } from "@/lib/utils";

interface Props {
  url: string;
  /** Size in pixels (default: 16) */
  size?: number;
  className?: string;
}

/**
 * Candidate favicon sources for a site, best-first: the site's own declared
 * icon paths (handles sites that serve favicon.svg / apple-touch-icon rather
 * than a root favicon.ico), then a public favicon service as a last resort.
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
 * Favicon for a website URL. Tries the site's declared icon paths and falls
 * through to a favicon service, then to a globe when none resolve.
 */
const Favicon = ({ url, size = 16, className }: Props) => {
  const candidates = useMemo(() => faviconCandidates(url), [url]);
  const [index, setIndex] = useState(0);
  const src = candidates[index];

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
          onError={() => setIndex((current) => current + 1)}
        />
      ) : (
        <GlobeIcon className="size-4 text-current" />
      )}
    </div>
  );
};

export default Favicon;
