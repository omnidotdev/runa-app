import { ark } from "@ark-ui/react";
import { tv } from "tailwind-variants";

import { cn } from "@/lib/utils";

import type { ComponentProps } from "react";
import type { VariantProps } from "tailwind-variants";

// TODO: add label
const inputVariants = tv({
  base: "flex h-9 w-full text-foreground! rounded-md border bg-transparent shadow-xs px-3 py-1 text-xs file:border-0 file:bg-transparent file:font-medium file:text-foreground file:text-sm placeholder:text-muted-foreground text-foreground outline-none outline-hidden disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
  variants: {
    variant: {
      default:
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
      destructive:
        "focus-visible:border-red-500 focus-visible:ring-red-500/50 focus-visible:ring-[3px]",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

interface Props
  extends ComponentProps<typeof ark.input>,
    VariantProps<typeof inputVariants> {}

const Input = ({ className, variant, ...rest }: Props) => (
  <ark.input className={cn(inputVariants({ variant }), className)} {...rest} />
);

export { Input };
