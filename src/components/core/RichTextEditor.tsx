import {
  CodeHighlightNode,
  CodeNode,
  registerCodeHighlighting,
} from "@lexical/code";
import { AutoLinkNode, LinkNode } from "@lexical/link";
import { ListItemNode, ListNode } from "@lexical/list";
import { CheckListPlugin } from "@lexical/react/LexicalCheckListPlugin";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { ClientOnly } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";

import { Skeleton } from "@/components/ui/skeleton";
import {
  exportToHtml,
  getTextContent,
  importFromHtml,
  isEditorEmpty,
} from "@/lib/lexical/html";
import { cn } from "@/lib/utils";
import CodeBlockPlugin from "./CodeBlockPlugin";
import theme from "./lexical-theme";
import MentionSuggestionPlugin from "./MentionSuggestionPlugin";

import type { EditorState, LexicalEditor } from "lexical";
import type { ComponentProps, RefObject } from "react";

export interface EditorApi {
  clearContent: () => void;
  focus: () => void;
}

interface Props extends Omit<ComponentProps<"div">, "placeholder"> {
  editorApi?: RefObject<EditorApi | null>;
  onUpdate?: (props: {
    editor: LexicalEditor;
    getHTML: () => string;
    getText: () => string;
    isEmpty: boolean;
  }) => void;
  defaultContent?: string;
  editable?: boolean;
  placeholder?: string;
  skeletonClassName?: string;
  /** Enable @agent mention autocomplete suggestions. */
  enableMentions?: boolean;
}

// Plugin to register code highlighting
const CodeHighlightPlugin = () => {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    return registerCodeHighlighting(editor);
  }, [editor]);

  return null;
};

// Custom hook to get the composer context
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

// Plugin to sync editable state with Lexical's internal state
const EditablePlugin = ({ editable }: { editable: boolean }) => {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    editor.setEditable(editable);
  }, [editor, editable]);

  return null;
};

// Plugin to handle initial content and editorApi ref
const EditorApiPlugin = ({
  editorApi,
  defaultContent,
}: {
  editorApi?: RefObject<EditorApi | null>;
  defaultContent?: string;
}) => {
  const [editor] = useLexicalComposerContext();
  const hasSetInitialContent = useRef(false);

  // Set initial content from HTML
  useEffect(() => {
    if (defaultContent && !hasSetInitialContent.current) {
      hasSetInitialContent.current = true;
      importFromHtml(editor, defaultContent);
    }
  }, [editor, defaultContent]);

  // Expose API methods via ref
  useEffect(() => {
    if (editorApi) {
      editorApi.current = {
        clearContent: () => {
          editor.update(() => {
            const root = $getRoot();
            root.clear();
            const paragraph = $createParagraphNode();
            root.append(paragraph);
            paragraph.select();
          });
        },
        focus: () => {
          editor.focus(() => {
            editor.update(() => {
              const root = $getRoot();
              root.selectEnd();
            });
          });
        },
      };
    }
  }, [editor, editorApi]);

  return null;
};

import { $createParagraphNode, $getRoot } from "lexical";

// Plugin to handle placeholder visibility
const PlaceholderPlugin = ({
  placeholder,
  show,
}: {
  placeholder?: string;
  show: boolean;
}) => {
  if (!placeholder || !show) return null;

  return (
    <div className="pointer-events-none absolute top-3 left-3 select-none text-base-400 dark:text-base-500">
      {placeholder}
    </div>
  );
};

const RichTextEditor = ({
  editorApi,
  onUpdate,
  defaultContent,
  className,
  editable = true,
  placeholder,
  skeletonClassName,
  enableMentions = false,
  ...rest
}: Props) => {
  const editorContainerRef = useRef<HTMLDivElement>(null);
  const [isEmpty, setIsEmpty] = useState(true);
  const [isFocused, setIsFocused] = useState(false);

  const initialConfig = {
    namespace: "RichTextEditor",
    theme,
    onError: (error: Error) => {
      console.error("Lexical error:", error);
    },
    editable,
    nodes: [
      HeadingNode,
      QuoteNode,
      ListNode,
      ListItemNode,
      CodeNode,
      CodeHighlightNode,
      LinkNode,
      AutoLinkNode,
    ],
  };

  const handleChange = (_editorState: EditorState, editor: LexicalEditor) => {
    const empty = isEditorEmpty(editor);
    setIsEmpty(empty);

    if (onUpdate) {
      onUpdate({
        editor,
        getHTML: () => exportToHtml(editor),
        getText: () => getTextContent(editor),
        isEmpty: empty,
      });
    }
  };

  return (
    <div
      ref={editorContainerRef}
      className="prose prose-sm dark:prose-invert relative flex h-full min-h-0 max-w-none flex-1 flex-col"
      {...rest}
    >
      <ClientOnly
        fallback={<Skeleton className={cn("rounded-md", skeletonClassName)} />}
      >
        <LexicalComposer initialConfig={initialConfig}>
          <div
            className={cn(
              "lexical-editor-container pointer-events-auto relative min-h-30 flex-1 rounded-md border border-base-300 border-dashed bg-transparent p-3 text-base-600 dark:border-base-600 dark:text-base-300",
              isFocused
                ? "border-2 border-primary-500/20 dark:border-primary-500/10"
                : "hover:border-base-400 dark:hover:border-base-500",
              className,
            )}
          >
            <RichTextPlugin
              contentEditable={
                <div className="block min-h-full flex-1">
                  <ContentEditable
                    className="prose-sm min-h-full flex-1 focus:outline-none"
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    spellCheck={false}
                  />
                </div>
              }
              ErrorBoundary={LexicalErrorBoundary}
            />
            <PlaceholderPlugin placeholder={placeholder} show={isEmpty} />
            <HistoryPlugin />
            <ListPlugin />
            <CheckListPlugin />
            <CodeHighlightPlugin />
            <CodeBlockPlugin />
            <OnChangePlugin onChange={handleChange} />
            <EditablePlugin editable={editable} />
            <EditorApiPlugin
              editorApi={editorApi}
              defaultContent={defaultContent}
            />
            {enableMentions && <MentionSuggestionPlugin />}
          </div>
        </LexicalComposer>
      </ClientOnly>
    </div>
  );
};

export default RichTextEditor;
