import { ClientOnly } from "@tanstack/react-router";
import { TaskItem, TaskList } from "@tiptap/extension-list";
import { Placeholder } from "@tiptap/extensions";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import css from "highlight.js/lib/languages/css";
import js from "highlight.js/lib/languages/javascript";
import json from "highlight.js/lib/languages/json";
import ts from "highlight.js/lib/languages/typescript";
import html from "highlight.js/lib/languages/xml";
import { createLowlight } from "lowlight";
import { useEffect, useRef } from "react";

import { CodeBlockWithHeader } from "@/components/core/CodeBlockWithHeader";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

import type { EditorEvents } from "@tiptap/react";
import type { ComponentProps, RefObject } from "react";

const lowlight = createLowlight();
lowlight.register("ts", ts);
lowlight.register("js", js);
lowlight.register("html", html);
lowlight.register("css", css);
lowlight.register("json", json);

export interface EditorApi {
  clearContent: () => void;
  focus: () => void;
}

interface Props extends Omit<ComponentProps<typeof EditorContent>, "editor"> {
  editorApi?: RefObject<EditorApi | null>;
  onUpdate?: (props: EditorEvents["update"]) => void;
  defaultContent?: string;
  editable?: boolean;
  skeletonClassName?: string;
}

const RichTextEditor = ({
  editorApi,
  onUpdate,
  defaultContent,
  className,
  editable = true,
  placeholder,
  skeletonClassName,
  ...rest
}: Props) => {
  const editorContainerRef = useRef<HTMLDivElement>(null);

  const editor = useEditor(
    {
      extensions: [
        StarterKit.configure({
          heading: {
            levels: [1, 2],
          },
          codeBlock: false,
          link: {
            openOnClick: false,
          },
        }),
        Placeholder.configure({
          placeholder,
        }),
        TaskList,
        TaskItem.configure({
          nested: true,
        }),
        CodeBlockWithHeader.configure({
          lowlight,
        }),
      ],
      editable,
      editorProps: {
        attributes: {
          class:
            "focus:outline-none focus-visible:border-base-400! dark:focus-visible:border-base-500 prose-sm",
          spellcheck: "false",
        },
      },
      content: defaultContent,
      onUpdate,
      immediatelyRender: false,
    },
    [editable, defaultContent],
  );

  useEffect(() => {
    if (editor && editorApi) {
      // Assign methods the the ref's current property
      editorApi.current = {
        clearContent: () => editor.commands.clearContent(),
        focus: () => editor.commands.focus("end"),
      };
    }
  }, [editor, editorApi]);

  return (
    <div
      ref={editorContainerRef}
      onClick={() => {
        if (editor) {
          editor.commands.focus("end");
        }
      }}
      className="prose prose-sm dark:prose-invert relative flex h-full min-h-0 max-w-none flex-1 flex-col"
    >
      <ClientOnly
        fallback={<Skeleton className={cn("rounded-md", skeletonClassName)} />}
      >
        <EditorContent
          editor={editor}
          className={cn(
            " pointer-events-auto min-h-[120px] flex-1 rounded-md border border-base-300 border-dashed bg-transparent p-3 text-base-600 focus-visible:border-base-400! dark:border-base-600 dark:text-base-300 dark:focus-visible:border-base-500 dark:hover:border-base-500",
            editor?.isFocused
              ? "border-2 border-primary-500/20 dark:border-primary-500/10"
              : "hover:border-base-400 dark:hover:border-base-500",
            className,
          )}
          {...rest}
        />
      </ClientOnly>
    </div>
  );
};

export default RichTextEditor;
