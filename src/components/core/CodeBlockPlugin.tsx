import { $isCodeNode, getLanguageFriendlyName } from "@lexical/code";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getNearestNodeFromDOMNode } from "lexical";
import { CheckIcon, CopyIcon } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { Button } from "@/components/ui/button";

interface CodeBlockHeaderProps {
  language: string;
  codeText: string;
  anchorElement: HTMLElement;
}

const CodeBlockHeader = ({
  language,
  codeText,
  anchorElement,
}: CodeBlockHeaderProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(codeText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text:", err);
    }
  };

  const displayLanguage = getLanguageFriendlyName(language) || language;

  return createPortal(
    <div className="flex items-center justify-between rounded-t-lg border bg-base-100 px-4 py-2 dark:bg-base-900/70">
      <span className="font-medium text-base-600 text-sm dark:text-base-400">
        {displayLanguage}
      </span>
      <Button
        onClick={handleCopy}
        variant="ghost"
        title="Copy to clipboard"
        className="size-6"
        type="button"
      >
        {copied ? <CheckIcon /> : <CopyIcon />}
      </Button>
    </div>,
    anchorElement,
  );
};

const CodeBlockPlugin = () => {
  const [editor] = useLexicalComposerContext();
  const [codeBlocks, setCodeBlocks] = useState<
    Array<{
      key: string;
      language: string;
      text: string;
      element: HTMLElement;
    }>
  >([]);
  const headerContainersRef = useRef<Map<string, HTMLElement>>(new Map());

  const updateCodeBlocks = useCallback(() => {
    const editorElement = editor.getRootElement();
    if (!editorElement) return;

    const newCodeBlocks: typeof codeBlocks = [];
    const codeElements = editorElement.querySelectorAll(
      "code[data-lexical-code]",
    );

    editor.getEditorState().read(() => {
      codeElements.forEach((codeEl) => {
        const node = $getNearestNodeFromDOMNode(codeEl);
        if (node && $isCodeNode(node)) {
          const key = node.getKey();
          const language = node.getLanguage() || "text";
          const text = node.getTextContent();

          // Get or create header container
          let headerContainer = headerContainersRef.current.get(key);
          if (!headerContainer) {
            headerContainer = document.createElement("div");
            headerContainer.className = "code-block-header-container";
            headerContainersRef.current.set(key, headerContainer);
          }

          // Insert header before the code element if not already there
          const codeWrapper = codeEl.parentElement;
          if (codeWrapper && !codeWrapper.contains(headerContainer)) {
            codeWrapper.insertBefore(headerContainer, codeEl);
          }

          newCodeBlocks.push({
            key,
            language,
            text,
            element: headerContainer,
          });
        }
      });
    });

    // Clean up old containers
    headerContainersRef.current.forEach((container, key) => {
      if (!newCodeBlocks.find((block) => block.key === key)) {
        container.remove();
        headerContainersRef.current.delete(key);
      }
    });

    setCodeBlocks(newCodeBlocks);
  }, [editor]);

  useEffect(() => {
    // Update on initial load
    updateCodeBlocks();

    // Register update listener
    return editor.registerUpdateListener(() => {
      updateCodeBlocks();
    });
  }, [editor, updateCodeBlocks]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      headerContainersRef.current.forEach((container) => container.remove());
      headerContainersRef.current.clear();
    };
  }, []);

  return (
    <>
      {codeBlocks.map((block) => (
        <CodeBlockHeader
          key={block.key}
          language={block.language}
          codeText={block.text}
          anchorElement={block.element}
        />
      ))}
    </>
  );
};

export default CodeBlockPlugin;
