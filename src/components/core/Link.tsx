import { createLink } from "@tanstack/react-router";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import type { LinkComponent } from "@tanstack/react-router";
import type { AnchorHTMLAttributes } from "react";
import type { VariantProps } from "tailwind-variants";

const BasicLink = ({
  variant,
  size,
  className,
  ...rest
}: AnchorHTMLAttributes<HTMLAnchorElement> &
  VariantProps<typeof buttonVariants>) => (
  <a className={cn(buttonVariants({ variant, size }), className)} {...rest} />
);

const CreatedLink = createLink(BasicLink);

const Link: LinkComponent<typeof BasicLink> = (props) => (
  <CreatedLink preload="intent" {...props} />
);

export default Link;
