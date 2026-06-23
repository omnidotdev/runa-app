import LabelIcon from "@/components/core/LabelIcon";
import { Badge } from "@/components/ui/badge";
import { parseColor } from "@/components/ui/color-picker";
import getLabelColors from "@/lib/util/getLabelColors";
import { useTheme } from "@/providers/ThemeProvider";

import type { LabelFragment } from "@/generated/graphql";

interface Props {
  label: LabelFragment;
}

const Label = ({ label }: Props) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // Parse the stored color directly rather than through Ark's `useColorPicker`
  // machine. As a controlled value with no `onValueChange`, the machine reset
  // to its default (white) once it started after hydration, so labels rendered
  // white-on-white (invisible) the moment the loading state cleared
  const color = parseColor(label.color);

  const { backgroundColor, textColor } = getLabelColors(
    color.toString("rgb"),
    isDark,
  );

  return (
    <div className="size-fit rounded-md dark:bg-zinc-950">
      <Badge
        key={label.name}
        variant="outline"
        className="border-none"
        style={{
          backgroundColor,
          color: textColor,
        }}
      >
        <LabelIcon
          icon={label.icon}
          className="size-2.5!"
          style={{
            color: isDark ? textColor : color.toString("css"),
          }}
        />
        <span className="font-medium text-[10px]">{label.name}</span>
      </Badge>
    </div>
  );
};

export default Label;
