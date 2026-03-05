import { GlobeIcon } from "lucide-react";
import { useState } from "react";

import getFaviconUrl from "@/lib/util/getFaviconUrl";
import { cn } from "@/lib/utils";

interface Props {
  url: string;
  /** Size in pixels (default: 16) */
  size?: number;
  className?: string;
}

/**
 * Favicon component that fetches and displays a website's favicon.
 * Falls back to a globe icon if favicon fails to load.
 */
const Favicon = ({ url, size = 16, className }: Props) => {
  const [hasError, setHasError] = useState(false);
  const faviconUrl = getFaviconUrl(url);

  return (
    <div
      className={cn(
        "flex size-4 shrink-0 items-center justify-center",
        className,
      )}
    >
      {faviconUrl && !hasError ? (
        <img
          src={faviconUrl}
          alt=""
          width={size}
          height={size}
          className="size-4 object-contain"
          onError={() => setHasError(true)}
        />
      ) : (
        <GlobeIcon className="size-4 text-current" />
      )}
    </div>
  );
};

export default Favicon;
