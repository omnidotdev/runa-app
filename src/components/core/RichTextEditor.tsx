import {
  CodeHighlightNode,
  CodeNode,
  registerCodeHighlighting,
} from "@lexical/code";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useEffect } from "react";

import { RichTextEditor as BaseRichTextEditor } from "@/components/ui/rich-text-editor";
import CodeBlockPlugin from "./CodeBlockPlugin";
import ImagePastePlugin from "./ImagePastePlugin";
import theme from "./lexical-theme";
import { ImageNode } from "./nodes/ImageNode";

import type { LexicalEditor } from "lexical";
import type { ComponentProps, RefObject } from "react";
import type { EditorApi } from "@/components/ui/rich-text-editor";

export type { EditorApi };

interface Props extends Omit<ComponentProps<"div">, "placeholder"> {
  editorApi?: RefObject<EditorApi | null>;
  onUpdate?: (props: {
    editor?: LexicalEditor;
    getHTML: () => string;
    getText: () => string;
    isEmpty: boolean;
  }) => void;
  defaultContent?: string;
  editable?: boolean;
  placeholder?: string;
  skeletonClassName?: string;
  /** When set, pasted/dropped images upload to this task (and optional comment) and embed inline. */
  imageUpload?: { taskId: string; postId?: string };
}

/** Registers Lexical code-block syntax highlighting. */
const CodeHighlightPlugin = () => {
  const [editor] = useLexicalComposerContext();

  useEffect(() => registerCodeHighlighting(editor), [editor]);

  return null;
};

/**
 * Runa's rich-text editor. A thin wrapper over the shared Thornberry editor SSOT
 * (toolbar, @-mentions, #-references, lists), extended with Runa's own code
 * blocks + syntax highlighting, checklists, and inline image paste/upload. The
 * public API is unchanged so existing call sites keep working.
 */
const RichTextEditor = ({ imageUpload, onUpdate, ...rest }: Props) => (
  <BaseRichTextEditor
    {...rest}
    theme={theme}
    enableChecklist
    extraNodes={[
      CodeNode,
      CodeHighlightNode,
      ...(imageUpload ? [ImageNode] : []),
    ]}
    plugins={
      <>
        <CodeHighlightPlugin />
        <CodeBlockPlugin />
        {imageUpload && (
          <ImagePastePlugin
            taskId={imageUpload.taskId}
            postId={imageUpload.postId}
          />
        )}
      </>
    }
    onUpdate={
      onUpdate
        ? ({ getHTML, getText, isEmpty }) =>
            onUpdate({ getHTML, getText, isEmpty })
        : undefined
    }
  />
);

export default RichTextEditor;
