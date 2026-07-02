import { buildFallbackUrl, buildSrcset } from "./image-utils";

import type { CSSProperties } from "react";

type ImageProps = {
  /** Attachment serve URL (`/api/attachments/file/{id}`); the route resizes it. */
  src: string;
  /** Required alt text. Pass an empty string for purely decorative images. */
  alt: string;
  /** Standard HTML `sizes` so the browser can pick the right `srcset` candidate. */
  sizes: string;
  /** Inline base64 LQIP (`attachment.metadata.lqip`) shown blurred until decode. */
  lqip?: string | null;
  /** Classes for the wrapper, which sizes the slot (e.g. `aspect-video w-full`). */
  className?: string;
  /** Eager-load + high fetch priority for above-the-fold images. */
  priority?: boolean;
  /** Extra inline styles for the wrapper. */
  style?: CSSProperties;
};

/**
 * Responsive, blur-up image for runa-api attachments. The browser downloads a
 * right-sized derivative via `srcset`; until it decodes, a smoothly blurred LQIP
 * sits behind the image. The placeholder is a static CSS layer (no opacity state
 * or load handler), so a cached image shows instantly and a loading one reveals
 * cleanly over the blur, with no flash.
 */
export function Image({
  src,
  alt,
  sizes,
  lqip,
  className,
  priority,
  style,
}: ImageProps) {
  return (
    <div
      className={className}
      style={{ position: "relative", overflow: "hidden", ...style }}
    >
      {lqip ? (
        <span
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `url(${lqip})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "blur(16px)",
            transform: "scale(1.1)",
          }}
        />
      ) : null}
      <img
        src={buildFallbackUrl(src)}
        srcSet={buildSrcset(src)}
        sizes={sizes}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : undefined}
        decoding="async"
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      />
    </div>
  );
}
