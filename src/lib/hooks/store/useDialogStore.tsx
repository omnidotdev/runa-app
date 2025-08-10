import { createStore } from "zustand";
import { shallow } from "zustand/shallow";
import { useStoreWithEqualityFn } from "zustand/traditional";

export enum DialogType {
  DeleteTeamMember = "delete_team_member",
  DeleteWorkspace = "delete_workspace",
  CreateTask = "create_task",
  CreateProject = "create_project",
  CreateWorkspace = "create_workspace",
  DeleteProject = "delete_project",
  CreateMember = "create_member",
  UpdateAssignees = "update_assignees",
  UpdateDueDate = "update_due_date",
  UpdateTaskLabels = "update_task_labels",
  DeleteColumn = "delete_column",
  DeleteProjectColumn = "delete_project_column",
}

interface DialogState {
  /** Whether the dialog is open. */
  isOpen: boolean;
}

interface DialogActions {
  /** Set the dialog open state. */
  setIsOpen: (isOpen: boolean) => void;
}

/**
 * Create a dialog store.
 */
const createDialogStore = () =>
  createStore<DialogState & DialogActions>()((set) => ({
    isOpen: false,
    setIsOpen: (isOpen: boolean) => set(() => ({ isOpen })),
  }));

const defaultDialogStores = new Map<
  DialogType,
  ReturnType<typeof createDialogStore>
>();

/**
 * Retrieve a dialog store.
 */
const getDialogStore = ({ type }: { type: DialogType }) => {
  if (!defaultDialogStores.has(type)) {
    defaultDialogStores.set(type, createDialogStore());
  }

  return defaultDialogStores.get(type)!;
};

interface Options {
  /** Dialog type. */
  type: DialogType | undefined;
}

/**
 * Hook for managing the open state of dialogs.
 */
const useDialogStore = ({ type }: Options) => {
  const store = getDialogStore({ type: type! });

  return useStoreWithEqualityFn(store, (state) => state, shallow);
};

export default useDialogStore;
