import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import TaskItem from "@tiptap/extension-task-item";
import TaskList from "@tiptap/extension-task-list";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import css from "highlight.js/lib/languages/css";
import js from "highlight.js/lib/languages/javascript";
import json from "highlight.js/lib/languages/json";
import ts from "highlight.js/lib/languages/typescript";
import html from "highlight.js/lib/languages/xml";
import { createLowlight } from "lowlight";
import { useEffect, useRef } from "react";

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

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2],
        },
        codeBlock: false,
      }),
      Placeholder.configure({
        placeholder,
      }),
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
      Link.configure({
        openOnClick: false,
      }),
      CodeBlockLowlight.configure({
        lowlight,
      }),
    ],
    editable,
    editorProps: {
      attributes: {
        class: "focus:outline-none prose-sm",
        spellcheck: "false",
      },
    },
    content: defaultContent,
    onUpdate,
    immediatelyRender: false,
  });

  useEffect(() => {
    if (editor && editorApi) {
      // Assign methods the the ref's current property
      editorApi.current = {
        clearContent: () => editor.commands.clearContent(),
      };
    }
  }, [editor, editorApi]);

  return (
    <div
      ref={editorContainerRef}
      onClick={() => {
        if (editor) {
          editor.commands.focus();
        }
      }}
      className="prose prose-sm dark:prose-invert relative max-w-none"
    >
      {editor ? (
        <EditorContent
          editor={editor}
          className={cn(
            " pointer-events-auto min-h-[120px] rounded-md border border-base-300 border-dashed bg-transparent p-3 text-base-600 dark:border-base-600 dark:text-base-300 dark:hover:border-base-500",
            editor?.isFocused
              ? "border-2 border-primary-500/20 bg-primary-50/50 dark:border-primary-500/10 dark:bg-primary-900/5"
              : "hover:border-base-400 dark:hover:border-base-500",
            className,
          )}
          {...rest}
        />
      ) : (
        <Skeleton
          className={cn("pointer-events-auto rounded-md", skeletonClassName)}
        />
      )}
    </div>
  );
};

export default RichTextEditor;
