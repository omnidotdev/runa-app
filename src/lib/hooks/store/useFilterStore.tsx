import { shallow } from "zustand/shallow";
import { createWithEqualityFn } from "zustand/traditional";

interface TaskFiltersState {
  selectedLabels: string[];
  selectedUsers: string[];
  setSelectedLabels: (labels: string[]) => void;
  setSelectedUsers: (users: string[]) => void;
}

const useTaskFiltersStore = createWithEqualityFn<TaskFiltersState>(
  (set) => ({
    selectedLabels: [],
    selectedUsers: [],
    setSelectedLabels: (labels) => set({ selectedLabels: labels }),
    setSelectedUsers: (users) => set({ selectedUsers: users }),
  }),
  shallow,
);

export default useTaskFiltersStore;
