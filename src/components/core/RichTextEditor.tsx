import { Skeleton } from "@omnidotdev/thornberry/skeleton";
import { ClientOnly } from "@tanstack/react-router";
import { Suspense, lazy } from "react";

import { cn } from "@/lib/utils";

import type { EditorApi, RichTextEditorProps } from "./RichTextEditorImpl";

export type { EditorApi };

/**
 * Lexical and prismjs are browser-only: importing them executes module-level
 * code that crashes during SSR (missing Node-conditional exports, no `Prism`
 * global). Loading the editor through a dynamic import keeps it out of the
 * server module graph, and the client-only boundary ensures it is never
 * rendered (and thus never resolved) on the server. A skeleton stands in until
 * the client hydrates and the chunk loads.
 */
const RichTextEditorImpl = lazy(() => import("./RichTextEditorImpl"));

const EditorSkeleton = ({
  skeletonClassName,
  className,
}: Pick<RichTextEditorProps, "skeletonClassName" | "className">) => (
  <Skeleton
    className={cn("h-24 w-full rounded-md", skeletonClassName ?? className)}
  />
);

const RichTextEditor = (props: RichTextEditorProps) => {
  const fallback = (
    <EditorSkeleton
      skeletonClassName={props.skeletonClassName}
      className={props.className}
    />
  );

  return (
    <ClientOnly fallback={fallback}>
      <Suspense fallback={fallback}>
        <RichTextEditorImpl {...props} />
      </Suspense>
    </ClientOnly>
  );
};

export default RichTextEditor;
