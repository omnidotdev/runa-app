import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import TaskItem from "@tiptap/extension-task-item";
import TaskList from "@tiptap/extension-task-list";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useRef } from "react";

import { cn } from "@/lib/utils";

import type { EditorEvents } from "@tiptap/react";
import type { ComponentProps } from "react";

interface Props extends Omit<ComponentProps<typeof EditorContent>, "editor"> {
  onUpdate?: (props: EditorEvents["update"]) => void;
  defaultContent?: string;
  editable?: boolean;
}

const RichTextEditor = ({
  onUpdate,
  defaultContent,
  className,
  editable = true,
  ...rest
}: Props) => {
  const editorContainerRef = useRef<HTMLDivElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2],
        },
      }),
      Placeholder.configure({
        placeholder: "Add a detailed description...",
      }),
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
      Link.configure({
        openOnClick: false,
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
    // TODO: discuss. This saves the HTML in db, i.e. `<p>Testing <strong>bold</strong> text</p>` which we could later render. `getText` removes any rich text
    onUpdate,
  });

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
      <EditorContent
        editor={editor}
        className={cn(
          "pointer-events-auto min-h-[120px] rounded-md border border-base-300 border-dashed bg-transparent p-3 text-base-600 dark:border-base-600 dark:text-base-300 dark:hover:border-base-500",
          editor?.isFocused
            ? "border-2 border-primary-500/20 bg-primary-50/50 dark:border-primary-500/10 dark:bg-primary-900/5"
            : "hover:border-base-400 dark:hover:border-base-500",
          className,
        )}
        {...rest}
      />
    </div>
  );
};

export default RichTextEditor;
