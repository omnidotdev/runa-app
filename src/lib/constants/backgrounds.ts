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
 * Curated solid + gradient presets. Kept low-saturation so columns and cards
 * remain readable without frosting (frosting arrives with image backgrounds).
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
];

const presetsById = new Map(
  backgroundPresets.map((preset) => [preset.id, preset]),
);

/**
 * Resolve a stored background to an inline style. Returns `undefined` for the
 * neutral default (null background) or an unknown/unsupported token, so the
 * board falls back to its neutral surface class.
 */
export const resolveBackgroundStyle = (
  background: ProjectBackground | null | undefined,
): CSSProperties | undefined => {
  if (!background) return undefined;

  if (background.kind === "solid" || background.kind === "gradient") {
    const preset = presetsById.get(background.token);
    return preset ? { background: preset.css } : undefined;
  }

  // image backgrounds resolve in a later phase
  return undefined;
};
