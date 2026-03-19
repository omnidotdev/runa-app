import { Streamdown } from "streamdown";

import { streamdownPlugins } from "@/lib/ai/streamdown";

interface AgentMarkdownProps {
  content: string;
  isStreaming?: boolean;
}

/** Renders AI-generated markdown with syntax-highlighted code blocks. */
export function AgentMarkdown({ content, isStreaming }: AgentMarkdownProps) {
  return (
    <Streamdown
      plugins={streamdownPlugins}
      isAnimating={isStreaming}
      className="agent-markdown text-sm [&_a]:text-primary [&_a]:underline [&_blockquote]:border-muted-foreground/30 [&_blockquote]:border-l-2 [&_blockquote]:pl-3 [&_blockquote]:text-muted-foreground [&_blockquote]:italic [&_code]:rounded [&_code]:bg-muted/50 [&_code]:px-1 [&_code]:py-0.5 [&_code]:text-xs [&_h1]:font-bold [&_h1]:text-base [&_h2]:font-semibold [&_h2]:text-sm [&_h3]:font-medium [&_h3]:text-sm [&_li]:my-0.5 [&_ol]:ml-4 [&_ol]:list-decimal [&_p]:leading-relaxed [&_pre]:overflow-x-auto [&_pre]:rounded-md [&_pre]:text-xs [&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_ul]:ml-4 [&_ul]:list-disc"
    >
      {content}
    </Streamdown>
  );
}
