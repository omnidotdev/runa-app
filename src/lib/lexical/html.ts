import { $generateHtmlFromNodes, $generateNodesFromDOM } from "@lexical/html";
import { $getRoot, $insertNodes, $setSelection } from "lexical";

import type { LexicalEditor } from "lexical";

/**
 * Export editor content to HTML string
 */
export function exportToHtml(editor: LexicalEditor): string {
  let html = "";
  editor.getEditorState().read(() => {
    html = $generateHtmlFromNodes(editor);
  });
  return html;
}

/**
 * Convert plain text @agent and @runa mentions to MentionNode-compatible spans.
 * The data-mention attribute is used by MentionNode.importDOM() to recognize
 * and convert these spans into proper MentionNodes.
 */
function convertMentionsToNodes(html: string): string {
  return html.replace(
    /@(agent|runa)\b/gi,
    '<span data-mention="$1" class="mention-highlight">@$1</span>',
  );
}

/**
 * Import HTML content into the editor
 */
export function importFromHtml(editor: LexicalEditor, html: string): void {
  // Preprocess HTML to convert plain text mentions to MentionNode format
  const processedHtml = convertMentionsToNodes(html);

  editor.update(() => {
    const parser = new DOMParser();
    const dom = parser.parseFromString(processedHtml, "text/html");
    const nodes = $generateNodesFromDOM(editor, dom);

    const root = $getRoot();
    root.clear();
    $insertNodes(nodes);
    // Clear selection to prevent auto-focus on navigation
    $setSelection(null);
  });
}

/**
 * Check if the editor is empty (only whitespace or empty paragraph)
 */
export function isEditorEmpty(editor: LexicalEditor): boolean {
  let isEmpty = true;
  editor.getEditorState().read(() => {
    const root = $getRoot();
    const textContent = root.getTextContent().trim();
    isEmpty = textContent.length === 0;
  });
  return isEmpty;
}

/**
 * Get plain text content from the editor
 */
export function getTextContent(editor: LexicalEditor): string {
  let text = "";
  editor.getEditorState().read(() => {
    const root = $getRoot();
    text = root.getTextContent();
  });
  return text;
}
