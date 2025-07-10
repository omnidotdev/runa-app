const priorityConfig = [
  {
    key: "high",
    label: "High",
    className: "bg-red-500 opacity-50 h-2 w-2 rounded-full",
  },
  {
    key: "medium",
    label: "Medium",
    className: "bg-yellow-500 opacity-50 h-2 w-2 rounded-full",
  },
  {
    key: "low",
    label: "Low",
    className: "bg-green-500  opacity-50h-2 w-2 rounded-full",
  },
];

export const getPriorityIcon = (priority: string) => {
  const currentPriority = priorityConfig.find((p) => p.key === priority);

  return <div className={currentPriority?.className} />;
};
