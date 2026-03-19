/**
 * Custom Lexical node for @mentions (e.g., @agent, @runa).
 *
 * This node renders mentions with distinct styling and properly
 * serializes/deserializes to HTML for persistence.
 */

import { $applyNodeReplacement, DecoratorNode } from "lexical";

import type {
  DOMConversionMap,
  DOMConversionOutput,
  DOMExportOutput,
  NodeKey,
  SerializedLexicalNode,
  Spread,
} from "lexical";
import type { ReactElement } from "react";

export type SerializedMentionNode = Spread<
  { mentionName: string },
  SerializedLexicalNode
>;

function convertMentionElement(
  domNode: HTMLElement,
): DOMConversionOutput | null {
  const mentionName = domNode.getAttribute("data-mention");
  if (mentionName) {
    const node = $createMentionNode(mentionName);
    return { node };
  }
  return null;
}

export class MentionNode extends DecoratorNode<ReactElement> {
  __mention: string;

  static getType(): string {
    return "mention";
  }

  static clone(node: MentionNode): MentionNode {
    return new MentionNode(node.__mention, node.__key);
  }

  static importJSON(serializedNode: SerializedMentionNode): MentionNode {
    return $createMentionNode(serializedNode.mentionName);
  }

  static importDOM(): DOMConversionMap | null {
    return {
      span: (domNode: HTMLElement) => {
        if (!domNode.hasAttribute("data-mention")) {
          return null;
        }
        return {
          conversion: convertMentionElement,
          priority: 1,
        };
      },
    };
  }

  constructor(mentionName: string, key?: NodeKey) {
    super(key);
    this.__mention = mentionName;
  }

  exportJSON(): SerializedMentionNode {
    return {
      mentionName: this.__mention,
      type: "mention",
      version: 1,
    };
  }

  exportDOM(): DOMExportOutput {
    const element = document.createElement("span");
    element.setAttribute("data-mention", this.__mention);
    element.className = "mention-highlight";
    element.textContent = `@${this.__mention}`;
    return { element };
  }

  createDOM(): HTMLElement {
    // Container element - styling is handled by decorate()
    return document.createElement("span");
  }

  updateDOM(): false {
    return false;
  }

  decorate(): ReactElement {
    return <span className="mention-highlight">@{this.__mention}</span>;
  }

  getTextContent(): string {
    return `@${this.__mention}`;
  }

  isInline(): boolean {
    return true;
  }
}

export function $createMentionNode(mentionName: string): MentionNode {
  return $applyNodeReplacement(new MentionNode(mentionName));
}
