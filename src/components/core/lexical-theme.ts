import type { EditorThemeClasses } from "lexical";

const theme: EditorThemeClasses = {
  paragraph: "mb-2 last:mb-0",
  heading: {
    h1: "text-2xl font-bold mb-4 mt-6 first:mt-0",
    h2: "text-xl font-bold mb-3 mt-5 first:mt-0",
  },
  text: {
    bold: "font-bold",
    italic: "italic",
    strikethrough: "line-through",
    underline: "underline",
    code: "bg-base-100 dark:bg-base-800 px-1 py-0.5 rounded text-sm font-mono",
  },
  list: {
    ul: "list-disc ml-4 mb-2",
    ol: "list-decimal ml-4 mb-2",
    listitem: "mb-1",
    nested: {
      listitem: "list-none",
    },
    listitemChecked:
      "relative ml-2 list-none line-through text-base-500 dark:text-base-400 before:absolute before:-left-6 before:content-['✓'] before:text-primary-500",
    listitemUnchecked:
      "relative ml-2 list-none before:absolute before:-left-6 before:content-['○'] before:text-base-400",
  },
  link: "text-primary-500 hover:underline cursor-pointer",
  code: "block bg-base-50 dark:bg-base-950 border-x border-b rounded-b-lg p-4 text-sm font-mono overflow-x-auto",
  codeHighlight: {
    atrule: "text-purple-600 dark:text-purple-400",
    attr: "text-yellow-600 dark:text-yellow-400",
    boolean: "text-purple-600 dark:text-purple-400",
    builtin: "text-cyan-600 dark:text-cyan-400",
    cdata: "text-base-500",
    char: "text-green-600 dark:text-green-400",
    class: "text-yellow-600 dark:text-yellow-400",
    "class-name": "text-yellow-600 dark:text-yellow-400",
    comment: "text-base-500 italic",
    constant: "text-purple-600 dark:text-purple-400",
    deleted: "text-red-600 dark:text-red-400",
    doctype: "text-base-500",
    entity: "text-red-600 dark:text-red-400",
    function: "text-blue-600 dark:text-blue-400",
    important: "text-purple-600 dark:text-purple-400 font-bold",
    inserted: "text-green-600 dark:text-green-400",
    keyword: "text-purple-600 dark:text-purple-400",
    namespace: "text-base-600 dark:text-base-400",
    number: "text-orange-600 dark:text-orange-400",
    operator: "text-base-600 dark:text-base-300",
    prolog: "text-base-500",
    property: "text-blue-600 dark:text-blue-400",
    punctuation: "text-base-600 dark:text-base-400",
    regex: "text-red-600 dark:text-red-400",
    selector: "text-green-600 dark:text-green-400",
    string: "text-green-600 dark:text-green-400",
    symbol: "text-purple-600 dark:text-purple-400",
    tag: "text-red-600 dark:text-red-400",
    url: "text-cyan-600 dark:text-cyan-400",
    variable: "text-orange-600 dark:text-orange-400",
  },
};

export default theme;
