interface LabelColors {
  backgroundColor: string;
  textColor: string;
}

const getLabelColors = (color: string, isDark = false): LabelColors => {
  const [r, g, b] = color
    .replace(/[^\d,]/g, "")
    .split(",")
    .map(Number);

  if (isDark) {
    // Dark mode: higher background opacity for visibility, lighter text for contrast
    const backgroundColor = `rgba(${r}, ${g}, ${b}, 0.2)`;
    // Lighten the text color by blending toward white
    const lightenedR = Math.min(255, r + (255 - r) * 0.4);
    const lightenedG = Math.min(255, g + (255 - g) * 0.4);
    const lightenedB = Math.min(255, b + (255 - b) * 0.4);
    const textColor = `rgba(${Math.round(lightenedR)}, ${Math.round(lightenedG)}, ${Math.round(lightenedB)}, 1)`;

    return {
      backgroundColor,
      textColor,
    };
  }

  // Light mode: subtle background, full color text
  const backgroundColor = `rgba(${r}, ${g}, ${b}, 0.06)`;
  const textColor = `rgba(${r}, ${g}, ${b})`;

  return {
    backgroundColor,
    textColor,
  };
};

export default getLabelColors;
