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

// const darkBackgroundColor = `rgba(${r}, ${g}, ${b}, 0.25)`;
// const darkTextColor = `rgba(${r}, ${g}, ${b}, 0 .85)`;

// const labelColors = match(theme)
//   .with("light", () => ({
//     backgroundColor: lightBackgroundColor,
//     textColor: lightTextColor,
//   }))
//   .with("dark", () => ({
//     backgroundColor: darkBackgroundColor,
//     textColor: darkTextColor,
//   }))
//   .otherwise(() => ({
//     backgroundColor: lightBackgroundColor,
//     textColor: lightTextColor,
//   }));
