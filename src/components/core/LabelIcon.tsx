import { TagIcon, icons } from "lucide-react";

import parseIcon from "@/lib/util/parseIcon";
import { cn } from "@/lib/utils";

import type { LucideProps } from "lucide-react";

interface Props extends LucideProps {
  icon: string | null | undefined;
}

/**
 * Render a label icon from the icon string.
 *
 * Supports:
 * - `emoji:🐛` - renders the emoji directly
 * - `lucide:bug` - renders the Lucide icon component
 * - null/undefined - renders TagIcon as fallback
 */
const LabelIcon = ({ icon, ...props }: Props) => {
  const parsed = parseIcon(icon);

  if (!parsed) {
    return <TagIcon {...props} />;
  }

  if (parsed.type === "emoji") {
    return (
      <span
        className={cn(
          "inline-flex items-center justify-center",
          props.className,
        )}
      >
        {parsed.value}
      </span>
    );
  }

  if (parsed.type === "lucide") {
    // Convert kebab-case to PascalCase for icon lookup
    const iconName = parsed.value
      .split("-")
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join("") as keyof typeof icons;

    const IconComponent = icons[iconName];

    if (IconComponent) {
      return <IconComponent {...props} />;
    }

    // Fallback if icon name not found
    return <TagIcon {...props} />;
  }

  return <TagIcon {...props} />;
};

export default LabelIcon;
