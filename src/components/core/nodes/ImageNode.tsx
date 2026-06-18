import { DecoratorNode } from "lexical";

import type {
  DOMConversionMap,
  DOMConversionOutput,
  DOMExportOutput,
  EditorConfig,
  NodeKey,
  SerializedLexicalNode,
  Spread,
} from "lexical";
import type { JSX } from "react";

export type SerializedImageNode = Spread<
  { src: string; altText: string },
  SerializedLexicalNode
>;

const convertImageElement = (
  domNode: HTMLElement,
): DOMConversionOutput | null => {
  if (domNode instanceof HTMLImageElement && domNode.src) {
    return {
      node: $createImageNode({ src: domNode.src, altText: domNode.alt }),
    };
  }
  return null;
};

/**
 * Lexical decorator node for an inline image. Round-trips through HTML
 * (export/importDOM) so images embedded in a task description survive the
 * HTML serialization used to persist descriptions and comments.
 */
export class ImageNode extends DecoratorNode<JSX.Element> {
  __src: string;
  __altText: string;

  static getType(): string {
    return "image";
  }

  static clone(node: ImageNode): ImageNode {
    return new ImageNode(node.__src, node.__altText, node.__key);
  }

  constructor(src: string, altText: string, key?: NodeKey) {
    super(key);
    this.__src = src;
    this.__altText = altText;
  }

  static importJSON(serialized: SerializedImageNode): ImageNode {
    return $createImageNode({
      src: serialized.src,
      altText: serialized.altText,
    });
  }

  exportJSON(): SerializedImageNode {
    return {
      type: "image",
      version: 1,
      src: this.__src,
      altText: this.__altText,
    };
  }

  static importDOM(): DOMConversionMap | null {
    return {
      img: () => ({ conversion: convertImageElement, priority: 0 }),
    };
  }

  exportDOM(): DOMExportOutput {
    const element = document.createElement("img");
    element.setAttribute("src", this.__src);
    element.setAttribute("alt", this.__altText);
    return { element };
  }

  createDOM(config: EditorConfig): HTMLElement {
    const span = document.createElement("span");
    const className = config.theme.image;
    if (className) span.className = className;
    return span;
  }

  updateDOM(): false {
    return false;
  }

  decorate(): JSX.Element {
    return (
      <img
        src={this.__src}
        alt={this.__altText}
        className="my-2 max-w-full rounded-md border"
      />
    );
  }
}

export const $createImageNode = ({
  src,
  altText,
}: {
  src: string;
  altText: string;
}): ImageNode => new ImageNode(src, altText);
