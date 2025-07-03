import { shallow } from "zustand/shallow";
import { createWithEqualityFn } from "zustand/traditional";

interface TaskStoreState {
  columnId: string | null;
  setColumnId: (columnId: string | null) => void;
}

const useTaskStore = createWithEqualityFn<TaskStoreState>(
  (set) => ({
    columnId: null,
    setColumnId: (columnId: string | null) => set({ columnId }),
  }),
  shallow,
);

export default useTaskStore;
