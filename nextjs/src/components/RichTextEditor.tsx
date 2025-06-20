"use client";

import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import TaskItem from "@tiptap/extension-task-item";
import TaskList from "@tiptap/extension-task-list";
import { EditorContent, ReactRenderer, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";

import MentionList from "@/components/MentionList";
import { MentionExtension } from "@/extensions/mention";

import type { Assignee, Project, Task } from "@/types";

interface RichTextEditorProps {
  content: string;
  onChange?: (content: string) => void;
  placeholder?: string;
  readOnly?: boolean;
  autoFocus?: boolean;
  projects?: Project[];
  tasks?: Task[];
  team?: Assignee[];
  onEditStart?: () => void;
}

const RichTextEditor = ({
  content,
  onChange,
  placeholder = "Write something...",
  readOnly = false,
  autoFocus = false,
  projects = [],
  tasks = [],
  team = [],
  onEditStart,
}: RichTextEditorProps) => {
  const mounted = useRef(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const [mentionQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const suggestionRef = useRef<{ destroy: () => void } | null>(null);

  const filteredItems = useMemo(() => {
    const query = mentionQuery.toLowerCase();

    const items = [
      ...team.map((member) => ({
        id: member.id,
        type: "user",
        label: member.name,
      })),
      ...tasks.map((task) => ({
        id: task.id,
        type: "task",
        label: task.content,
        description: `#${task.id}`,
      })),
      ...projects.map((project) => ({
        id: project.id,
        type: "project",
        label: project.name,
        description: project.description,
      })),
    ];

    return items.filter(
      (item) =>
        !query ||
        item.label.toLowerCase().includes(query) ||
        (item.description?.toLowerCase() || "").includes(query),
    );
  }, [mentionQuery, team, tasks, projects]);

  useLayoutEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2],
        },
      }),
      Placeholder.configure({
        placeholder,
        showOnlyWhenEditable: true,
      }),
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
      MentionExtension.configure({
        suggestion: {
          allowSpaces: true,
          startOfLine: false,
          char: "@",
          items: () => {
            setSelectedIndex(0);
            return filteredItems;
          },
          render: () => {
            let component: any;
            let popup: HTMLElement | null;

            return {
              onStart: (props: any) => {
                component = new ReactRenderer(MentionList, {
                  props: {
                    ...props,
                    items: filteredItems,
                    command: (item: any) => {
                      props.command(item);
                    },
                    selectedIndex,
                  },
                  editor: props.editor,
                });
                suggestionRef.current = component;

                popup = document.createElement("div");
                popup.className = "mention-popup";
                popup.style.position = "absolute";
                popup.style.zIndex = "50";
                document.body.appendChild(popup);

                popup.appendChild(component.element);
              },
              onUpdate: (props: any) => {
                component.updateProps({
                  ...props,
                  items: filteredItems,
                  selectedIndex,
                });

                const coordinates = props.clientRect();

                if (coordinates && popup) {
                  popup.style.left = `${coordinates.left}px`;
                  popup.style.top = `${coordinates.top + coordinates.height}px`;
                  popup.style.visibility = filteredItems.length
                    ? "visible"
                    : "hidden";
                }
              },
              onKeyDown: ({
                event,
                props,
              }: {
                event: KeyboardEvent;
                props: any;
              }) => {
                if (event.key === "ArrowUp") {
                  setSelectedIndex(
                    (selectedIndex + filteredItems.length - 1) %
                      filteredItems.length,
                  );
                  return true;
                }

                if (event.key === "ArrowDown") {
                  setSelectedIndex((selectedIndex + 1) % filteredItems.length);
                  return true;
                }

                if (event.key === "Enter") {
                  const item = filteredItems[selectedIndex];
                  if (item) {
                    props.command(item);
                  }
                  return true;
                }

                return false;
              },
              onExit: () => {
                if (popup) {
                  document.body.removeChild(popup);
                  popup = null;
                }
                component.destroy();
                suggestionRef.current = null;
              },
            };
          },
        },
      }),
      Link.configure({
        openOnClick: false,
      }),
    ],
    content,
    editable: !readOnly,
    onUpdate: ({ editor }) => {
      if (mounted.current && onChange) {
        onChange(editor.getHTML());
      }
    },
    editorProps: {
      attributes: {
        class: "focus:outline-none prose-sm",
        spellcheck: "false",
      },
      handleDOMEvents: {
        click: (view, event) => {
          if (!readOnly) {
            event.stopPropagation();
            if (!view.hasFocus()) {
              view.focus();
            }
          }
          return false;
        },
      },
    },
    autofocus: autoFocus,
  });

  useEffect(() => {
    if (editor && !readOnly) {
      editor.setEditable(true);
    }
  }, [editor, readOnly]);

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [editor, content]);

  useEffect(() => {
    return () => {
      if (suggestionRef.current) {
        suggestionRef.current.destroy();
      }
    };
  }, []);

  const handleContainerClick = () => {
    if (!readOnly && editor && !editor.isFocused) {
      editor.commands.focus();
    } else if (readOnly && onEditStart) {
      onEditStart();
    }
  };

  return (
    <div
      ref={containerRef}
      onClick={handleContainerClick}
      className={`prose prose-sm dark:prose-invert relative max-w-none ${
        readOnly ? "cursor-pointer" : ""
      } ${readOnly ? "pointer-events-none" : ""}`}
    >
      <EditorContent
        editor={editor}
        className={`pointer-events-auto min-h-[120px] rounded-md bg-transparent p-3 text-gray-600 dark:text-gray-300 ${
          readOnly
            ? "cursor-pointer"
            : editor?.isFocused
              ? "border-2 border-primary-500/20 bg-primary-50/50 dark:border-primary-500/10 dark:bg-primary-900/5"
              : "border border-gray-300 border-dashed hover:border-gray-400 dark:border-gray-600 dark:hover:border-gray-500"
        }`}
      />
    </div>
  );
};

export default RichTextEditor;
