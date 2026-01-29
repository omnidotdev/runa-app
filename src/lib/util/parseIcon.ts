type IconDescriptor =
  | { type: "emoji"; value: string }
  | { type: "lucide"; value: string };

/**
 * Parse an icon string into a typed descriptor.
 *
 * @param icon - Icon string in format "provider:value" (e.g., "emoji:🐛", "lucide:bug")
 * @returns Parsed icon descriptor or null if invalid
 *
 * @example
 * parseIcon("emoji:🐛") // { type: "emoji", value: "🐛" }
 * parseIcon("lucide:bug") // { type: "lucide", value: "bug" }
 * parseIcon(null) // null
 */
const parseIcon = (icon: string | null | undefined): IconDescriptor | null => {
  if (!icon) return null;

  const colonIndex = icon.indexOf(":");
  if (colonIndex === -1) return null;

  const type = icon.slice(0, colonIndex);
  const value = icon.slice(colonIndex + 1);

  if (!value) return null;

  if (type === "emoji" || type === "lucide") {
    return { type, value };
  }

  return null;
};

export type { IconDescriptor };
export default parseIcon;
