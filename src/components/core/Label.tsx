import { useColorPicker } from "@ark-ui/react/color-picker";
import { TagIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { parseColor } from "@/components/ui/color-picker";
import getLabelColors from "@/lib/util/getLabelColors";

import type { LabelFragment } from "@/generated/graphql";

interface Props {
  label: LabelFragment;
}

const Label = ({ label }: Props) => {
  const colorPicker = useColorPicker({
    value: parseColor(label.color),
  });

  const { backgroundColor, textColor } = getLabelColors(
    colorPicker.value.toString("rgb"),
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
        <TagIcon
          className="size-2.5!"
          style={{ color: colorPicker.value.toString("css") }}
        />
        <span className="font-medium text-[10px]">{label.name}</span>
      </Badge>
    </div>
  );
};

export default Label;
