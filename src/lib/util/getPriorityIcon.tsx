import { priorityConfig } from "@/lib/constants/priorities";
import { cn } from "../utils";

export const getPriorityIcon = (priority?: string) => {
  const currentPriority = priorityConfig.find(
    (p) => p.name.toLowerCase() === priority?.toLowerCase(),
  );

  return <div className={cn(currentPriority?.classes)} />;
};
