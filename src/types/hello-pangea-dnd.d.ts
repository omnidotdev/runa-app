import "@hello-pangea/dnd";

/**
 * `@radix-ui/react-primitive` augments `React.CSSProperties` with a
 * `--radix-${string}` index signature (for its CSS variables). That makes
 * @hello-pangea/dnd's `DraggingStyle`/`NotDraggingStyle` unassignable to a
 * `div`'s `style` (which is `CSSProperties`), since the dnd styles don't declare
 * that index signature. Mirror it onto the dnd style interfaces so spreading
 * `provided.draggableProps` onto an element type-checks.
 */
declare module "@hello-pangea/dnd" {
  interface DraggingStyle {
    [varName: `--radix-${string}`]: string | number | undefined | null;
  }
  interface NotDraggingStyle {
    [varName: `--radix-${string}`]: string | number | undefined | null;
  }
}
