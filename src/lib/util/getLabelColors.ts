const getLabelColors = (color: string) => {
  const [r, g, b] = color
    .replace(/[^\d,]/g, "")
    .split(",")
    .map(Number);

  // Custom alpha levels
  const backgroundColor = `rgba(${r}, ${g}, ${b}, 0.06)`;
  const textColor = `rgba(${r}, ${g}, ${b})`;

  return {
    backgroundColor,
    textColor,
  };
};

export default getLabelColors;
