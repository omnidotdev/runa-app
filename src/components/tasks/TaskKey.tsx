import { CopyIcon } from "lucide-react";
import { toast } from "sonner";

import { buildTaskDisplayKey } from "@/lib/util/taskUrl";
import { cn } from "@/lib/utils";

interface Props {
  /** Project prefix (e.g. `API`), used to build the `API-42` key. */
  prefix?: string | null;
  /** Per-project sequential task number. */
  number?: number | null;
  className?: string;
}

/**
 * Copyable task key chip (e.g. `API-42`). The key is the canonical token for
 * referencing a task across projects and products.
 */
const TaskKey = ({ prefix, number, className }: Props) => {
  if (number == null) return null;

  const key = buildTaskDisplayKey({ prefix, number });

  const copy = async (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();

    try {
      await navigator.clipboard.writeText(key);
      toast.success(`${key} copied to clipboard`);
    } catch {
      // clipboard unavailable (e.g. insecure context); ignore silently
    }
  };

  return (
    <button
      type="button"
      onClick={copy}
      title={`Copy ${key}`}
      className={cn(
        "inline-flex w-fit items-center gap-1 font-mono transition-colors hover:text-base-900 dark:hover:text-base-100",
        className,
      )}
    >
      <CopyIcon className="size-3" />
      {key}
    </button>
  );
};

export default TaskKey;
