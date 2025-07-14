import {
  AlertCircleIcon,
  CheckCircle2Icon,
  CircleIcon,
  ClockIcon,
  EyeIcon,
} from "lucide-react";

export const columnIcons = [
  {
    name: "To Do",
    icon: ClockIcon,
    classes: "h-4 w-4 text-base-400 dark:text-base-500",
  },
  {
    name: "In Progress",
    icon: AlertCircleIcon,
    classes: "h-4 w-4 text-primary-500",
  },
  {
    name: "Awaiting Review",
    icon: EyeIcon,
    classes: "h-4 w-4 text-purple-500",
  },
  {
    name: "Done",
    icon: CheckCircle2Icon,
    classes: "h-4 w-4 text-green-500",
  },
  {
    name: "Backlog",
    icon: CircleIcon,
    classes: "h-4 w-4 text-base-400 dark:text-base-500",
  },
];
