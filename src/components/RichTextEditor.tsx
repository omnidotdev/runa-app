'use client';

import { useLayoutEffect, useRef, useEffect, useState, useMemo } from 'react';
import { useEditor, EditorContent, ReactRenderer } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import Link from '@tiptap/extension-link';
import { MentionExtension } from '@/extensions/mention';
import { MentionList } from './MentionList';
import { Project, Task, Assignee } from '@/types';

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

export function RichTextEditor({
  content,
  onChange,
  placeholder = 'Write something...',
  readOnly = false,
  autoFocus = false,
  projects = [],
  tasks = [],
  team = [],
  onEditStart,
}: RichTextEditorProps) {
  const mounted = useRef(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const [mentionQuery, setMentionQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const suggestionRef = useRef<{ destroy: () => void } | null>(null);

  const filteredItems = useMemo(() => {
    const query = mentionQuery.toLowerCase();

    const items = [
      ...team.map(member => ({
        id: member.id,
        type: 'user',
        label: member.name
      })),
      ...tasks.map(task => ({
        id: task.id,
        type: 'task',
        label: task.content,
        description: `#${task.id}`
      })),
      ...projects.map(project => ({
        id: project.id,
        type: 'project',
        label: project.name,
        description: project.description
      })),
    ];

    return items.filter(item => !query ||
      item.label.toLowerCase().includes(query) ||
      (item.description?.toLowerCase() || '').includes(query)
    );
  }, [mentionQuery, team, tasks, projects]);

  useLayoutEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const editor = useEditor({
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
          char: '@',
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

                popup = document.createElement('div');
                popup.className = 'mention-popup';
                popup.style.position = 'absolute';
                popup.style.zIndex = '50';
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
                  popup.style.visibility = filteredItems.length ? 'visible' : 'hidden';
                }
              },
              onKeyDown: ({ event, props }: { event: KeyboardEvent; props: any }) => {
                if (event.key === 'ArrowUp') {
                  setSelectedIndex((selectedIndex + filteredItems.length - 1) % filteredItems.length);
                  return true;
                }

                if (event.key === 'ArrowDown') {
                  setSelectedIndex((selectedIndex + 1) % filteredItems.length);
                  return true;
                }

                if (event.key === 'Enter') {
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
        class: 'focus:outline-none prose-sm',
        spellcheck: 'false',
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
      className={`relative prose prose-sm max-w-none dark:prose-invert ${
        readOnly ? 'cursor-pointer' : ''
      } ${readOnly ? 'pointer-events-none' : ''}`}
    >
      <EditorContent
        editor={editor}
        className={`min-h-[120px] text-gray-600 dark:text-gray-300 bg-transparent rounded-md p-3 pointer-events-auto ${
          readOnly
            ? 'cursor-pointer'
            : editor?.isFocused
              ? 'border-2 border-blue-500/20 dark:border-blue-500/10 bg-blue-50/50 dark:bg-blue-900/5'
              : 'border border-dashed border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
        }`}
      />
    </div>
  );
}
