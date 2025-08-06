import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import {
  NodeViewContent,
  NodeViewWrapper,
  ReactNodeViewRenderer,
} from "@tiptap/react";
import { CheckIcon, CopyIcon } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";

import type { ReactNodeViewProps } from "@tiptap/react";
import type React from "react";

const CodeBlockComponent: React.FC<ReactNodeViewProps> = ({ node }) => {
  const language = (node.attrs.language as string) || "text";
  const [copied, setCopied] = useState(false);

  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(node.textContent || "");
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <NodeViewWrapper className="mt-2">
      <div className="rounded-t-lg border bg-base-100 px-4 py-2 dark:bg-base-900/70">
        <div className="flex items-center justify-between">
          <span className="font-medium text-base-600 text-sm dark:text-base-400">
            {language}
          </span>
          <div className="flex items-center gap-2">
            <Button
              onClick={handleCopyToClipboard}
              variant="ghost"
              title="Copy to clipboard"
              className="size-6"
            >
              {copied ? <CheckIcon /> : <CopyIcon />}
            </Button>
          </div>
        </div>
      </div>
      <pre className="overflow-x-auto rounded-b-lg border-x border-b bg-base-50 p-4 text-sm dark:bg-base-950">
        {/* @ts-ignore: Todo */}
        <NodeViewContent as="code" />
      </pre>
    </NodeViewWrapper>
  );
};

export const CodeBlockWithHeader = CodeBlockLowlight.extend({
  addNodeView() {
    return ReactNodeViewRenderer(CodeBlockComponent);
  },
});
