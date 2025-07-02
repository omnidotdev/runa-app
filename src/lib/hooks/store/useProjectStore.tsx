import { shallow } from "zustand/shallow";
import { createWithEqualityFn } from "zustand/traditional";

import type { ProjectStatus } from "@/generated/graphql";

interface ProjectStoreState {
  status: ProjectStatus | null;
  setStatus: (status: ProjectStatus | null) => void;
}

const useProjectStore = createWithEqualityFn<ProjectStoreState>(
  (set) => ({
    status: null,
    setStatus: (status: ProjectStatus | null) => set({ status }),
  }),
  shallow,
);

export default useProjectStore;
