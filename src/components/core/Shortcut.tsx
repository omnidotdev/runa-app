import { cn } from "@/lib/utils";

import type { ComponentProps } from "react";

const Shortcut = ({ className, ...rest }: ComponentProps<"kbd">) => {
  return (
    <kbd
      data-slot="kbd"
      className={cn(
        "pointer-events-none ml-auto inline-flex h-5 w-fit min-w-5 select-none items-center justify-center gap-0.5 rounded border bg-background px-1 font-medium font-sans text-muted-foreground text-xs uppercase",
        className,
      )}
      {...rest}
    />
  );
};

export default Shortcut;
