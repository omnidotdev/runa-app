import { TagIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { getLabelClasses } from "@/lib/util/getLabelClasses";
import { cn } from "@/lib/utils";

import type { ComponentProps } from "react";
import type { LabelFragment as Label } from "@/generated/graphql";

interface Props extends ComponentProps<"div"> {
  labels: Label[];
  showFallback?: boolean;
}

const Labels = ({ labels, showFallback = true, ...rest }: Props) => {
  if (!showFallback && !labels.length) return null;

  if (!labels.length)
    return (
      <p className="place-self-center text-muted-foreground text-sm">
        No labels
      </p>
    );

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
