import {
  AlertTriangleIcon,
  CircleDotIcon,
  MinusCircleIcon,
} from "lucide-react";

const priorityConfig = {
  high: {
    icon: AlertTriangleIcon,
    className: "text-red-500 dark:text-red-400",
  },
  medium: {
    icon: CircleDotIcon,
    className: "text-yellow-500 dark:text-yellow-400",
  },
  low: {
    icon: MinusCircleIcon,
    className: "text-green-500 dark:text-green-400",
  },
};

export const getPriorityIcon = (priority: string) => {
  const config = priorityConfig[priority as keyof typeof priorityConfig];
  if (!config) return null;
  const Icon = config.icon;
  return <Icon className={`h-4 w-4 ${config.className} flex-shrink-0`} />;
};
