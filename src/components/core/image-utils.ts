/**
 * Widths the runa-api attachment serve route will resize to. Keep in sync with
 * `ALLOWED_WIDTHS` in `runa-api/src/lib/media/serve.route.ts`. Emitting the
 * exact set in `srcset` lets the browser pick the perfect derivative without a
 * server-side snap.
 */
export const IMAGE_WIDTHS = [320, 640, 960, 1280, 1600, 1920] as const;

const appendParams = (src: string, params: string): string =>
  `${src}${src.includes("?") ? "&" : "?"}${params}`;

/**
 * Build a `srcset` of webp derivatives from the attachment serve route
 * (`/api/attachments/file/{id}?w=&q=&fm=`), one per allowed width. The browser
 * downloads the smallest candidate that still fills the rendered slot.
 */
export const buildSrcset = (src: string): string =>
  IMAGE_WIDTHS.map(
    (width) => `${appendParams(src, `w=${width}&q=82&fm=webp`)} ${width}w`,
  ).join(", ");

/** Mid-size webp fallback for browsers that ignore `srcset`. */
export const buildFallbackUrl = (src: string): string =>
  appendParams(src, "w=1280&q=82&fm=webp");
