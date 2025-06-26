import { ark } from "@ark-ui/react";
import { tv } from "tailwind-variants";

import { cn } from "@/lib/utils";

import type { ComponentProps } from "react";

// TODO: add label
const inputVariants = tv({
  slots: {
    input:
      "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-xs shadow-sm transition-colors file:border-0 file:bg-transparent file:font-medium file:text-foreground file:text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 dark:bg-input/30 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
  },
});

const { input } = inputVariants();

const Input = ({ className, ...rest }: ComponentProps<typeof ark.input>) => (
  <ark.input className={cn(input(), className)} {...rest} />
);

export { Input };
