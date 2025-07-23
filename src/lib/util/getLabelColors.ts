const getLabelColors = (color: string) => {
  const [r, g, b] = color
    .replace(/[^\d,]/g, "")
    .split(",")
    .map(Number);

  // Custom alpha levels
  const backgroundColor = `rgba(${r}, ${g}, ${b}, 0.15)`;
  const textColor = `rgba(${r}, ${g}, ${b}, 0.9)`;

  return {
    backgroundColor,
    textColor,
  };
};

export default getLabelColors;
