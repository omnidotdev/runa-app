import { priorityConfig } from "@/lib/constants/priorities";
import { cn } from "@/lib/utils";

import type { ComponentProps } from "react";

interface Props extends ComponentProps<"div"> {
  priority?: string;
}

const PriorityIcon = ({ priority, className, ...rest }: Props) => {
  const currentPriority = priorityConfig.find(
    (p) => p.name.toLowerCase() === priority?.toLowerCase(),
  );

  return <div className={cn(currentPriority?.classes, className)} {...rest} />;
};

export default PriorityIcon;
