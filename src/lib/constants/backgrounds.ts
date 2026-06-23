import type { CSSProperties } from "react";

/**
 * Board background. Distinct from a project's accent `color`. `null` (absent)
 * renders the neutral default board surface.
 *
 * Mirrors the API `ProjectBackground` union (runa-api project.table.ts). Solid
 * and gradient presets are stored by token id and resolved to CSS client-side
 * so palettes/theming stay owned by the app, not the database.
 */
export type ProjectBackground =
  | { kind: "solid"; token: string }
  | { kind: "gradient"; token: string }
  | {
      kind: "image";
      assetId: string;
      position?: string;
      blur?: number;
      chromeContrast?: "light" | "dark";
    };

interface BackgroundPreset {
  /** Stable token id persisted in `project.background.token`. */
  id: string;
  /** Human label for the picker. */
  label: string;
  kind: "solid" | "gradient";
  /** CSS `background` value. Theme-aware via `color-mix` over `--color-background`. */
  css: string;
}

/**
 * Subtle tint of a palette color over the themed background, so presets stay
 * legible and on-brand in both light and dark.
 */
const tint = (color: string, amount: number) =>
  `color-mix(in oklch, ${color} ${amount}%, var(--color-background))`;

/**
 * Curated presets: solids, gradients, and CSS patterns. Kept low-saturation so
 * columns and cards remain readable without frosting (frosting arrives with
 * image backgrounds). Patterns layer a faint motif over the themed surface, so
 * they stay theme-aware like the tints and need no bundled assets.
 */
export const backgroundPresets: BackgroundPreset[] = [
  {
    id: "amber",
    label: "Amber",
    kind: "solid",
    css: tint("var(--primary-400)", 14),
  },
  {
    id: "magenta",
    label: "Magenta",
    kind: "solid",
    css: tint("var(--secondary-400)", 12),
  },
  {
    id: "slate",
    label: "Slate",
    kind: "solid",
    css: tint("var(--base-600)", 14),
  },
  {
    id: "dusk",
    label: "Dusk",
    kind: "gradient",
    css: `linear-gradient(160deg, ${tint("var(--secondary-400)", 16)}, ${tint("var(--primary-400)", 14)})`,
  },
  {
    id: "ember",
    label: "Ember",
    kind: "gradient",
    css: `linear-gradient(160deg, ${tint("var(--primary-200)", 18)}, ${tint("var(--primary-600)", 14)})`,
  },
  {
    id: "tide",
    label: "Tide",
    kind: "gradient",
    css: `linear-gradient(160deg, ${tint("var(--base-400)", 16)}, ${tint("var(--secondary-400)", 12)})`,
  },
  {
    id: "mist",
    label: "Mist",
    kind: "gradient",
    css: `linear-gradient(160deg, ${tint("var(--base-300)", 14)}, ${tint("var(--base-600)", 12)})`,
  },
  {
    id: "dots",
    label: "Dots",
    kind: "gradient",
    css: `radial-gradient(${tint("var(--base-600)", 45)} 1.2px, transparent 1.3px) 0 0 / 18px 18px, var(--color-background)`,
  },
  {
    id: "grid",
    label: "Grid",
    kind: "gradient",
    css: `linear-gradient(${tint("var(--base-600)", 35)} 1px, transparent 1px) 0 0 / 22px 22px, linear-gradient(90deg, ${tint("var(--base-600)", 35)} 1px, transparent 1px) 0 0 / 22px 22px, var(--color-background)`,
  },
  {
    id: "twill",
    label: "Twill",
    kind: "gradient",
    css: `repeating-linear-gradient(45deg, ${tint("var(--primary-400)", 30)} 0 1px, transparent 1px 13px), var(--color-background)`,
  },
];

const presetsById = new Map(
  backgroundPresets.map((preset) => [preset.id, preset]),
);

/** Longest edge requested from the serve route; snaps to a supported width. */
const IMAGE_RENDER_WIDTH = 1920;

/**
 * Build the optimized serve URL for an uploaded background. Asks the
 * transform-capable serve route for a downscaled WebP so full-screen
 * backgrounds stay light.
 */
const imageAssetUrl = (assetBaseUrl: string, assetId: string) =>
  `${assetBaseUrl.replace(/\/$/, "")}/api/attachments/file/${encodeURIComponent(
    assetId,
  )}?w=${IMAGE_RENDER_WIDTH}&q=82&fm=webp`;

/**
 * Resolve a stored background to an inline style. Returns `undefined` for the
 * neutral default (null background) or an unknown/unsupported token, so the
 * board falls back to its neutral surface class.
 *
 * Image backgrounds require `assetBaseUrl` (the API origin) to build the serve
 * URL; without it they resolve to `undefined` so the resolver stays a pure,
 * environment-free function for callers that only use presets (and for tests).
 */
export const resolveBackgroundStyle = (
  background: ProjectBackground | null | undefined,
  options?: { assetBaseUrl?: string },
): CSSProperties | undefined => {
  if (!background) return undefined;

  if (background.kind === "solid" || background.kind === "gradient") {
    const preset = presetsById.get(background.token);
    return preset ? { background: preset.css } : undefined;
  }

  if (background.kind === "image") {
    const { assetBaseUrl } = options ?? {};
    if (!assetBaseUrl) return undefined;

    // Soften the photo toward the themed surface so frosted columns and chrome
    // stay legible over any image.
    const scrim =
      "color-mix(in oklch, var(--color-background) 22%, transparent)";

    return {
      backgroundImage: `linear-gradient(${scrim}, ${scrim}), url("${imageAssetUrl(
        assetBaseUrl,
        background.assetId,
      )}")`,
      backgroundSize: "cover",
      backgroundPosition: background.position ?? "center",
      backgroundRepeat: "no-repeat",
    };
  }

  return undefined;
};
