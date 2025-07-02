import { shallow } from "zustand/shallow";
import { createWithEqualityFn } from "zustand/traditional";

interface DragStoreState {
  sourceId: string | null;
  draggableId: string | null;
  setSourceId: (sourceId: string | null) => void;
  setDraggableId: (draggableId: string | null) => void;
}

const useDragStore = createWithEqualityFn<DragStoreState>(
  (set) => ({
    sourceId: null,
    draggableId: null,
    setSourceId: (sourceId: string | null) => set({ sourceId }),
    setDraggableId: (draggableId: string | null) => set({ draggableId }),
  }),
  shallow,
);

export default useDragStore;
