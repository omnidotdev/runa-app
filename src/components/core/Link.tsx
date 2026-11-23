import { buttonVariants } from "@omnidotdev/thornberry/button";
import { createLink } from "@tanstack/react-router";

import { cn } from "@/lib/utils";

import type { LinkComponent } from "@tanstack/react-router";
import type { VariantProps } from "class-variance-authority";
import type { AnchorHTMLAttributes } from "react";

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
