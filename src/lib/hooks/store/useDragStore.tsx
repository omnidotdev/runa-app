import { shallow } from "zustand/shallow";
import { createWithEqualityFn } from "zustand/traditional";

interface DragStoreState {
  draggableId: string | null;
  setDraggableId: (draggableId: string | null) => void;
  isDragging: boolean;
  setIsDragging: (isDragging: boolean) => void;
}

const useDragStore = createWithEqualityFn<DragStoreState>(
  (set) => ({
    draggableId: null,
    setDraggableId: (draggableId: string | null) => set({ draggableId }),
    isDragging: false,
    setIsDragging: (isDragging: boolean) => set({ isDragging }),
  }),
  shallow,
);

export default useDragStore;
