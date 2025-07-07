import { TagIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { getLabelClasses } from "@/lib/util/getLabelClasses";
import { cn } from "@/lib/utils";

interface Props extends React.ComponentProps<"div"> {
  labels: { name: string; color: string }[];
}

const Labels = ({ labels, ...rest }: Props) => {
  if (!labels.length) return null;

  return (
    <div {...rest}>
      {labels.map((label) => {
        const colors = getLabelClasses(label.color);

        return (
          <Badge
            key={label.name}
            size="sm"
            variant="outline"
            className={cn("border-border/50", colors.bg, colors.text)}
          >
            <TagIcon className={cn("!size-2.5", colors.icon)} />
            <span className="font-medium text-[10px]">{label.name}</span>
          </Badge>
        );
      })}
    </div>
  );
};

export default Labels;
