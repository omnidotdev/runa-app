import { cn } from "@/lib/utils";

import type { ComponentProps } from "react";

const Skeleton = ({ className, ...props }: ComponentProps<"div">) => (
  <div
    data-slot="skeleton"
    className={cn("animate-pulse rounded-md bg-accent", className)}
    {...props}
  />
);

export { Skeleton };
