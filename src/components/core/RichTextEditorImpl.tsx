import {
  CodeHighlightNode,
  CodeNode,
  registerCodeHighlighting,
} from "@lexical/code";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { RichTextEditor as BaseRichTextEditor } from "@omnidotdev/thornberry/rich-text-editor";
import { useEffect } from "react";

import CodeBlockPlugin from "./CodeBlockPlugin";
import ImagePastePlugin from "./ImagePastePlugin";
import theme from "./lexical-theme";
import { ImageNode } from "./nodes/ImageNode";

import type { EditorApi } from "@omnidotdev/thornberry/rich-text-editor";
import type { LexicalEditor } from "lexical";
import type { ComponentProps, RefObject } from "react";

export type { EditorApi };

export interface RichTextEditorProps
  extends Omit<ComponentProps<"div">, "placeholder"> {
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
  /** Class applied to the editable surface (e.g. to set a compact min-height). */
  editorClassName?: string;
  /** Hide the formatting toolbar (e.g. for single-line title fields). */
  hideToolbar?: boolean;
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
 *
 * Lexical and prismjs are browser-only and crash on import during SSR, so this
 * module is loaded lazily behind a client-only boundary (see RichTextEditor).
 */
const RichTextEditorImpl = ({
  imageUpload,
  onUpdate,
  ...rest
}: RichTextEditorProps) => (
  <BaseRichTextEditor
    {...rest}
    theme={theme}
    enableChecklist
    toolbarClassName="bg-muted/40"
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

export default RichTextEditorImpl;
