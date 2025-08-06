import { ark } from "@ark-ui/react";
import { tv } from "tailwind-variants";

import { cn } from "@/lib/utils";

import type { ComponentProps } from "react";
import type { VariantProps } from "tailwind-variants";

const buttonVariants = tv({
  base: "inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 whitespace-nowrap outline-none focus-visible:outline-none focus-visible:ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-md font-medium text-sm outline-hidden transition-transform disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0 transition-[color,box-shadow]",
  variants: {
    variant: {
      solid: "bg-primary text-primary-foreground shadow-xs hover:bg-primary/90",
      outline:
        "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground",
      ghost: "hover:bg-accent hover:text-accent-foreground",
      destructive:
        "bg-red-500 text-white dark:text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-red-500 aria-invalid:ring-red-500/20 dark:aria-invalid:ring-red-500/40",
    },
    size: {
      xs: "h-7 gap-1 rounded-sm px-2.5 has-[>svg]:px-2",
      sm: "h-8 gap-1.5 rounded-md px-3 has-[>svg]:px-2.5",
      md: "h-9 px-4 py-2 has-[>svg]:px-3",
      lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
      icon: "size-9",
    },
  },
  defaultVariants: {
    variant: "solid",
    size: "md",
  },
});

interface Props
  extends ComponentProps<typeof ark.button>,
    VariantProps<typeof buttonVariants> {}

const Button = ({ className, variant, size, ...rest }: Props) => (
  <ark.button
    type="button"
    className={cn(buttonVariants({ variant, size }), className)}
    {...rest}
  />
);

export { Button, buttonVariants };
