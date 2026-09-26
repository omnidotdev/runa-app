interface LabelColors {
  backgroundColor: string;
  textColor: string;
}

/** Parse an `rgb(r, g, b)` or `r,g,b` string into channels. */
const parseRgb = (color: string): [number, number, number] => {
  const [r, g, b] = color
    .replace(/[^\d,]/g, "")
    .split(",")
    .map(Number);
  return [r, g, b];
};

/** WCAG relative luminance of an sRGB color (0 = black, 1 = white). */
const relativeLuminance = (r: number, g: number, b: number): number => {
  const channel = (c: number) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
};

/** WCAG contrast ratio between two relative luminances. */
const contrastRatio = (l1: number, l2: number) =>
  (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);

// AA contrast target for the small label text against its chip background
const MIN_CONTRAST = 4.5;

/**
 * Compute readable background/text colors for a label chip, per theme.
 *
 * Light mode: a subtle tint background (~6% of the color over white) with the
 * color darkened toward black until it clears AA contrast against that near-white
 * background. Previously the raw color was used as text, so pale labels (light
 * yellow, pale blue) were unreadable. Darkening preserves hue, so labels stay
 * distinguishable. Dark mode: a stronger tint with the color lightened toward white
 */
const getLabelColors = (color: string, isDark = false): LabelColors => {
  const [r, g, b] = parseRgb(color);

  if (isDark) {
    const backgroundColor = `rgba(${r}, ${g}, ${b}, 0.2)`;
    // Lighten the text color by blending toward white
    const lightenedR = Math.min(255, r + (255 - r) * 0.4);
    const lightenedG = Math.min(255, g + (255 - g) * 0.4);
    const lightenedB = Math.min(255, b + (255 - b) * 0.4);
    const textColor = `rgba(${Math.round(lightenedR)}, ${Math.round(lightenedG)}, ${Math.round(lightenedB)}, 1)`;

    return { backgroundColor, textColor };
  }

  // Light mode: subtle background, text darkened toward black until AA-readable.
  // The chip background is ~6% color over white, so contrast is measured vs white
  // (a conservative worst case). Darkening is monotonic, so the loop terminates
  const backgroundColor = `rgba(${r}, ${g}, ${b}, 0.06)`;

  let [tr, tg, tb] = [r, g, b];
  for (
    let i = 0;
    i < 40 && contrastRatio(relativeLuminance(tr, tg, tb), 1) < MIN_CONTRAST;
    i++
  ) {
    tr = Math.round(tr * 0.9);
    tg = Math.round(tg * 0.9);
    tb = Math.round(tb * 0.9);
  }

  return { backgroundColor, textColor: `rgb(${tr}, ${tg}, ${tb})` };
};

export default getLabelColors;
