import { $generateHtmlFromNodes, $generateNodesFromDOM } from "@lexical/html";
import { $getRoot, $insertNodes } from "lexical";

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
 * Import HTML content into the editor
 */
export function importFromHtml(editor: LexicalEditor, html: string): void {
  editor.update(() => {
    const parser = new DOMParser();
    const dom = parser.parseFromString(html, "text/html");
    const nodes = $generateNodesFromDOM(editor, dom);

    const root = $getRoot();
    root.clear();
    $insertNodes(nodes);
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
