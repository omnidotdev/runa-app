import { shallow } from "zustand/shallow";
import { createWithEqualityFn } from "zustand/traditional";

interface SubscriptionStoreState {
  subscriptionId: string | null;
  setSubscriptionId: (subscriptionId: string | null) => void;
  isProductUpdating: boolean;
  setIsProductUpdating: (isProductUpdating: boolean) => void;
}

const useSubscriptionStore = createWithEqualityFn<SubscriptionStoreState>(
  (set) => ({
    subscriptionId: null,
    setSubscriptionId: (subscriptionId) => set({ subscriptionId }),
    isProductUpdating: false,
    setIsProductUpdating: (isProductUpdating) => set({ isProductUpdating }),
  }),
  shallow,
);

export default useSubscriptionStore;
