import type { KeyboardEvent } from "react";

/** Enter, not part of an IME composition and not a newline (Shift+Enter). */
const isPlainEnter = (event: KeyboardEvent): boolean =>
  event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing;

/**
 * Submit a form when Enter is pressed in a single-line field.
 *
 * Attach to the primary text input of a dialog form so typing a value and
 * pressing Enter creates/saves it. Ignores Enter with a modifier (handled by
 * {@link submitOnModEnter} at the form level) to avoid double submits, and
 * leaves Shift+Enter / IME composition alone.
 */
export const submitOnEnter =
  (submit: () => void) =>
  (event: KeyboardEvent): void => {
    if (!isPlainEnter(event) || event.metaKey || event.ctrlKey) return;
    event.preventDefault();
    submit();
  };

/**
 * Submit a form on Cmd/Ctrl+Enter from anywhere.
 *
 * Attach to the `<form>` so a value can be saved without leaving a multi-line
 * field (e.g. the rich-text description), where plain Enter must still insert a
 * newline.
 */
export const submitOnModEnter =
  (submit: () => void) =>
  (event: KeyboardEvent): void => {
    if (event.key !== "Enter" || !(event.metaKey || event.ctrlKey)) return;
    if (event.nativeEvent.isComposing) return;
    event.preventDefault();
    submit();
  };
