import { shallow } from "zustand/shallow";
import { createWithEqualityFn } from "zustand/traditional";

interface DragStoreState {
  draggableId: string | null;
  setDraggableId: (draggableId: string | null) => void;
}

const useDragStore = createWithEqualityFn<DragStoreState>(
  (set) => ({
    draggableId: null,
    setDraggableId: (draggableId: string | null) => set({ draggableId }),
  }),
  shallow,
);

export default useDragStore;
