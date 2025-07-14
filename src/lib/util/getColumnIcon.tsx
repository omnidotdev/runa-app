import { columnIcons } from "@/lib/constants/columns";
import { cn } from "../utils";

export const getColumnIcon = (column?: string) => {
  const currentIcon = columnIcons.find(
    (c) => c.name.toLowerCase() === column?.toLowerCase(),
  );

  if (!currentIcon) {
    return null;
  }

  return <currentIcon.icon className={cn(currentIcon.classes)} />;
};
