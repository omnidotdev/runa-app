import { columnIcons } from "@/lib/constants/columns";

export const getColumnIcon = (column?: string) => {
  const currentIcon = columnIcons.find(
    (c) => c.name.toLowerCase() === column?.toLowerCase(),
  );

  if (!currentIcon) {
    return null;
  }

  return <currentIcon.icon className={currentIcon.classes} />;
};
