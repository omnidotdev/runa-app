import { shallow } from "zustand/shallow";
import { createWithEqualityFn } from "zustand/traditional";

interface TaskStoreState {
  taskId: string | null;
  setTaskId: (taskId: string | null) => void;
  columnId: string | null;
  setColumnId: (columnId: string | null) => void;
  // Context-scoped creation
  focusedColumnId: string | null;
  setFocusedColumnId: (columnId: string | null) => void;
  hoveredColumnId: string | null;
  setHoveredColumnId: (columnId: string | null) => void;
  quickAddColumnId: string | null;
  setQuickAddColumnId: (columnId: string | null) => void;
  pendingTitle: string | null;
  setPendingTitle: (pendingTitle: string | null) => void;
}

const useTaskStore = createWithEqualityFn<TaskStoreState>(
  (set) => ({
    taskId: null,
    setTaskId: (taskId: string | null) => set({ taskId }),
    columnId: null,
    setColumnId: (columnId: string | null) => set({ columnId }),
    focusedColumnId: null,
    setFocusedColumnId: (focusedColumnId: string | null) =>
      set({ focusedColumnId }),
    hoveredColumnId: null,
    setHoveredColumnId: (hoveredColumnId: string | null) =>
      set({ hoveredColumnId }),
    quickAddColumnId: null,
    setQuickAddColumnId: (quickAddColumnId: string | null) =>
      set({ quickAddColumnId }),
    pendingTitle: null,
    setPendingTitle: (pendingTitle: string | null) => set({ pendingTitle }),
  }),
  shallow,
);

export default useTaskStore;
