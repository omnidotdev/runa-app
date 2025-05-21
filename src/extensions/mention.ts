import { Extension } from '@tiptap/core';
import Suggestion from '@tiptap/suggestion';

interface MentionItem {
  id: string;
  type: string;
  label: string;
  description?: string;
}

export const MentionExtension = Extension.create({
  name: 'mention',

  addOptions() {
    return {
      suggestion: {
        char: '',
        command: ({ editor, range, props }: { editor: any, range: any, props: MentionItem }) => {
          const text = props.type === 'user'
            ? `@${props.label}`
            : props.type === 'task'
            ? `#${props.id}`
            : props.label;
            
          editor
            .chain()
            .focus()
            .deleteRange(range)
            .insertContent(`${text} `)
            .run();
        }, 
      },
    };
  },

  addProseMirrorPlugins() {
    return [
      Suggestion({
        editor: this.editor,
        ...this.options.suggestion,
      }),
    ];
  },
});