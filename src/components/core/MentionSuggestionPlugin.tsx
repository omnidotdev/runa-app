/**
 * Lexical plugin that shows @agent / @runa autocomplete suggestions
 * when the user types "@" in the editor.
 *
 * Simple floating menu approach:
 *  1. Listens for text changes in the editor
 *  2. Detects "@" prefix at the cursor position
 *  3. Shows a floating suggestion popover
 *  4. On selection, replaces the partial text with the full mention
 */

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  $createTextNode,
  $getSelection,
  $isRangeSelection,
  $isTextNode,
  COMMAND_PRIORITY_HIGH,
  COMMAND_PRIORITY_LOW,
  KEY_ARROW_DOWN_COMMAND,
  KEY_ARROW_UP_COMMAND,
  KEY_ENTER_COMMAND,
  KEY_ESCAPE_COMMAND,
  KEY_TAB_COMMAND,
} from "lexical";
import { BotIcon } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";

import { cn } from "@/lib/utils";
import { $createMentionNode } from "./MentionNode";

/** Available mention targets. */
const MENTION_OPTIONS = [
  { label: "Runa", value: "runa", description: "Trigger the AI agent" },
  { label: "Agent", value: "agent", description: "Trigger the AI agent" },
] as const;

/** Match @partial_text at the end of the text before the cursor. */
const MENTION_TRIGGER_REGEX = /@(\w*)$/;

interface MentionOption {
  label: string;
  value: string;
  description: string;
}

interface FloatingMenuProps {
  anchorRect: DOMRect;
  options: readonly MentionOption[];
  selectedIndex: number;
  onSelect: (value: string) => void;
}

function FloatingMenu({
  anchorRect,
  options,
  selectedIndex,
  onSelect,
}: FloatingMenuProps) {
  return createPortal(
    <div
      className="fixed z-50 min-w-40 rounded-md border bg-popover p-1 shadow-md"
      style={{
        top: anchorRect.bottom + 4,
        left: anchorRect.left,
      }}
    >
      {options.map((option, index) => (
        <button
          key={option.value}
          type="button"
          className={cn(
            "flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-left text-sm transition-colors",
            index === selectedIndex
              ? "bg-accent text-accent-foreground"
              : "hover:bg-accent/50",
          )}
          onMouseDown={(e) => {
            // Prevent blur on the editor
            e.preventDefault();
            onSelect(option.value);
          }}
        >
          <BotIcon className="size-3.5 text-muted-foreground" />
          <div className="flex flex-col">
            <span className="font-medium">@{option.value}</span>
            <span className="text-[10px] text-muted-foreground">
              {option.description}
            </span>
          </div>
        </button>
      ))}
    </div>,
    document.body,
  );
}

/**
 * Lexical plugin that provides @mention autocomplete for the AI agent.
 *
 * Usage: Include this component as a child inside a `<LexicalComposer>`.
 */
const MentionSuggestionPlugin = () => {
  const [editor] = useLexicalComposerContext();
  const [isOpen, setIsOpen] = useState(false);
  const [anchorRect, setAnchorRect] = useState<DOMRect | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [matchText, setMatchText] = useState("");

  /** Filter options based on partial text (memoized to avoid re-registering keyboard handlers). */
  const filteredOptions = useMemo(
    () =>
      MENTION_OPTIONS.filter((opt) =>
        opt.value.startsWith(matchText.toLowerCase()),
      ),
    [matchText],
  );

  /** Replace the @partial text with the selected mention node. */
  const insertMention = useCallback(
    (value: string) => {
      editor.update(() => {
        const selection = $getSelection();
        if (!$isRangeSelection(selection)) return;

        const anchor = selection.anchor;
        const anchorNode = anchor.getNode();

        if (!$isTextNode(anchorNode)) return;

        const textContent = anchorNode.getTextContent();
        const cursorOffset = anchor.offset;

        // Find the @ trigger position
        const textBeforeCursor = textContent.slice(0, cursorOffset);
        const triggerMatch = textBeforeCursor.match(MENTION_TRIGGER_REGEX);
        if (!triggerMatch) return;

        const triggerStart = textBeforeCursor.lastIndexOf(triggerMatch[0]);

        // Split the text: keep text before trigger, remove the @partial
        const beforeTrigger = textContent.slice(0, triggerStart);
        const afterCursor = textContent.slice(cursorOffset);

        // Update the text node to only contain text before the trigger
        anchorNode.setTextContent(beforeTrigger);

        // Create the mention node
        const mentionNode = $createMentionNode(value);

        // Create a text node for the space and text after cursor
        const afterNode = $createTextNode(` ${afterCursor}`);

        // Insert mention and space after the current text node
        anchorNode.insertAfter(mentionNode);
        mentionNode.insertAfter(afterNode);

        // Move selection to after the space
        afterNode.select(1, 1);
      });

      setIsOpen(false);
      setMatchText("");
    },
    [editor],
  );

  // Listen for text changes to detect @ trigger
  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        const selection = $getSelection();
        if (!$isRangeSelection(selection) || !selection.isCollapsed()) {
          setIsOpen(false);
          return;
        }

        const anchor = selection.anchor;
        const anchorNode = anchor.getNode();

        if (anchorNode.getType() !== "text") {
          setIsOpen(false);
          return;
        }

        const textContent = anchorNode.getTextContent();
        const textBeforeCursor = textContent.slice(0, anchor.offset);

        const match = textBeforeCursor.match(MENTION_TRIGGER_REGEX);
        if (!match) {
          setIsOpen(false);
          return;
        }

        const partialText = match[1] ?? "";
        const hasMatches = MENTION_OPTIONS.some((opt) =>
          opt.value.startsWith(partialText.toLowerCase()),
        );

        if (!hasMatches) {
          setIsOpen(false);
          return;
        }

        setMatchText(partialText);
        setSelectedIndex(0);

        // Get caret position for floating menu
        const domSelection = window.getSelection();
        if (domSelection && domSelection.rangeCount > 0) {
          const range = domSelection.getRangeAt(0);
          const rect = range.getBoundingClientRect();
          setAnchorRect(rect);
          setIsOpen(true);
        }
      });
    });
  }, [editor]);

  // Keyboard navigation for the floating menu
  useEffect(() => {
    if (!isOpen) return;

    const removeArrowDown = editor.registerCommand(
      KEY_ARROW_DOWN_COMMAND,
      () => {
        setSelectedIndex((prev) =>
          prev < filteredOptions.length - 1 ? prev + 1 : 0,
        );
        return true;
      },
      COMMAND_PRIORITY_LOW,
    );

    const removeArrowUp = editor.registerCommand(
      KEY_ARROW_UP_COMMAND,
      () => {
        setSelectedIndex((prev) =>
          prev > 0 ? prev - 1 : filteredOptions.length - 1,
        );
        return true;
      },
      COMMAND_PRIORITY_LOW,
    );

    const removeEnter = editor.registerCommand(
      KEY_ENTER_COMMAND,
      () => {
        const option = filteredOptions[selectedIndex];
        if (option) {
          insertMention(option.value);
          return true;
        }
        return false;
      },
      COMMAND_PRIORITY_LOW,
    );

    // Use HIGH priority for Tab to ensure mention completion takes precedence
    // over default Tab behavior (focus next element)
    const removeTab = editor.registerCommand(
      KEY_TAB_COMMAND,
      () => {
        const option = filteredOptions[selectedIndex];
        if (option) {
          insertMention(option.value);
          return true;
        }
        return false;
      },
      COMMAND_PRIORITY_HIGH,
    );

    const removeEscape = editor.registerCommand(
      KEY_ESCAPE_COMMAND,
      () => {
        setIsOpen(false);
        return true;
      },
      COMMAND_PRIORITY_LOW,
    );

    // DOM-level Tab key handler to prevent default focus change behavior.
    // Only call preventDefault() - do NOT stopPropagation() so the event
    // still reaches Lexical's command handlers to insert the mention.
    const rootElement = editor.getRootElement();
    const handleTabKeyDown = (e: KeyboardEvent) => {
      // Only intercept if the event originated from within the editor
      if (
        e.key === "Tab" &&
        filteredOptions.length > 0 &&
        rootElement?.contains(e.target as Node)
      ) {
        e.preventDefault();
      }
    };
    document.addEventListener("keydown", handleTabKeyDown, true);

    return () => {
      removeArrowDown();
      removeArrowUp();
      removeEnter();
      removeTab();
      removeEscape();
      document.removeEventListener("keydown", handleTabKeyDown, true);
    };
  }, [editor, isOpen, filteredOptions, selectedIndex, insertMention]);

  if (!isOpen || !anchorRect || filteredOptions.length === 0) {
    return null;
  }

  return (
    <FloatingMenu
      anchorRect={anchorRect}
      options={filteredOptions}
      selectedIndex={selectedIndex}
      onSelect={insertMention}
    />
  );
};

export default MentionSuggestionPlugin;
