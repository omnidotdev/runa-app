import { shallow } from "zustand/shallow";
import { createWithEqualityFn } from "zustand/traditional";

interface TaskStoreState {
  taskId: string | null;
  setTaskId: (taskId: string | null) => void;
  columnId: string | null;
  setColumnId: (columnId: string | null) => void;
}

const useTaskStore = createWithEqualityFn<TaskStoreState>(
  (set) => ({
    taskId: null,
    setTaskId: (taskId: string | null) => set({ taskId }),
    columnId: null,
    setColumnId: (columnId: string | null) => set({ columnId }),
  }),
  shallow,
);

export default useTaskStore;
