import { shallow } from "zustand/shallow";
import { createWithEqualityFn } from "zustand/traditional";

interface ProjectStoreState {
  projectColumnId: string | null;
  setProjectColumnId: (projectColumnId: string | null) => void;
}

const useProjectStore = createWithEqualityFn<ProjectStoreState>(
  (set) => ({
    projectColumnId: null,
    setProjectColumnId: (projectColumnId) => set({ projectColumnId }),
  }),
  shallow,
);

export default useProjectStore;
