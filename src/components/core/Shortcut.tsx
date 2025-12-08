import { cn } from "@/lib/utils";

import type { ComponentProps } from "react";

const Shortcut = ({ className, ...rest }: ComponentProps<"span">) => {
  return (
    <span
      className={cn(
        "ml-auto flex items-center justify-center gap-0.5 rounded-md border bg-background px-1 font-medium text-[10px] text-foreground",
        className,
      )}
      {...rest}
    />
  );
};

export default Shortcut;
