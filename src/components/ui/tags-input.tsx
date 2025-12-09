import { TagsInput as ArkTagsInput } from "@ark-ui/react/tags-input";
import { X } from "lucide-react";

import { cn } from "@/lib/utils";

import type { ComponentProps } from "react";

const TagsInputItemPreview = ({
  className,
  ...rest
}: ComponentProps<typeof ArkTagsInput.ItemPreview>) => (
  <ArkTagsInput.ItemPreview
    className={cn("flex items-center gap-2", className)}
    {...rest}
  />
);

const TagsInputLabel = ({
  className,
  ...rest
}: ComponentProps<typeof ArkTagsInput.Label>) => (
  <ArkTagsInput.Label
    className={cn("font-medium text-foreground text-sm", className)}
    {...rest}
  />
);

const TagsInputControl = ({
  className,
  ...rest
}: ComponentProps<typeof ArkTagsInput.Control>) => (
  <ArkTagsInput.Control
    className={cn(
      "flex flex-wrap gap-2 rounded-md bg-background px-3 py-2 text-sm ring-offset-background focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
      className,
    )}
    {...rest}
  />
);

const TagsInputInput = ({
  className,
  ...rest
}: ComponentProps<typeof ArkTagsInput.Input>) => (
  <ArkTagsInput.Input
    className={cn(
      "h-9 flex-1 bg-transparent px-3 py-2 text-sm outline-none placeholder:text-muted-foreground",
      className,
    )}
    {...rest}
  />
);

const TagsInputItem = ({
  className,
  ...rest
}: ComponentProps<typeof ArkTagsInput.Item>) => (
  <ArkTagsInput.Item
    className={cn(
      "flex w-fit items-center justify-center gap-1 rounded-md border bg-transparent px-3 font-medium text-foreground text-sm",
      className,
    )}
    {...rest}
  />
);

const TagsInputItemText = ({
  className,
  ...rest
}: ComponentProps<typeof ArkTagsInput.ItemText>) => (
  <ArkTagsInput.ItemText className={cn("px-2 py-0.5", className)} {...rest} />
);

const TagsInputItemInput = ({
  className,
  ...rest
}: ComponentProps<typeof ArkTagsInput.ItemInput>) => (
  <ArkTagsInput.ItemInput
    className={cn(
      "w-full bg-transparent px-2 py-0.5 text-foreground outline-none",
      className,
    )}
    {...rest}
  />
);

const TagsInputItemDeleteTrigger = ({
  className,
  children,
  asChild,
  ...rest
}: ComponentProps<typeof ArkTagsInput.ItemDeleteTrigger>) => {
  if (!children) {
    return (
      <ArkTagsInput.ItemDeleteTrigger
        className={cn(
          "bg-transparent text-foreground hover:text-red-500",
          className,
        )}
        {...rest}
      >
        <X className="h-4 w-4" />
        <span className="sr-only">Delete</span>
      </ArkTagsInput.ItemDeleteTrigger>
    );
  }

  return (
    <ArkTagsInput.ItemDeleteTrigger
      className={className}
      asChild={asChild}
      {...rest}
    >
      {children}
    </ArkTagsInput.ItemDeleteTrigger>
  );
};

const TagsInputClearTrigger = ({
  className,
  children,
  asChild,
  ...rest
}: ComponentProps<typeof ArkTagsInput.ClearTrigger>) => {
  if (!children) {
    return (
      <ArkTagsInput.ClearTrigger
        className={cn(
          "mt-2 inline-flex h-10 w-full items-center justify-center rounded-md border px-4 py-2 font-medium text-sm ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
          className,
        )}
        {...rest}
      >
        Clear
      </ArkTagsInput.ClearTrigger>
    );
  }

  return (
    <ArkTagsInput.ClearTrigger
      className={className}
      asChild={asChild}
      {...rest}
    >
      {children}
    </ArkTagsInput.ClearTrigger>
  );
};

const TagsInputContext = ArkTagsInput.Context;
const TagsInputRoot = ArkTagsInput.Root;

export {
  TagsInputClearTrigger,
  TagsInputControl,
  TagsInputContext,
  TagsInputInput,
  TagsInputItem,
  TagsInputItemDeleteTrigger,
  TagsInputItemInput,
  TagsInputItemText,
  TagsInputLabel,
  TagsInputRoot,
  TagsInputItemPreview,
};
