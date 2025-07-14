import { priorityConfig } from "@/lib/constants/priorities";

export const getPriorityIcon = (priority?: string) => {
  const currentPriority = priorityConfig.find(
    (p) => p.name.toLowerCase() === priority?.toLowerCase(),
  );

  return <div className={currentPriority?.classes} />;
};
