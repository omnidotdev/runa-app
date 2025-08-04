import { shallow } from "zustand/shallow";
import { createWithEqualityFn } from "zustand/traditional";

import type { Tier } from "@/lib/polar/productIds";

interface SubscriptionStoreState {
  subscriptionId: string | null;
  setSubscriptionId: (subscriptionId: string | null) => void;
  productId: Tier | null;
  setProductId: (productId: Tier | null) => void;
}

const useSubscriptionStore = createWithEqualityFn<SubscriptionStoreState>(
  (set) => ({
    subscriptionId: null,
    setSubscriptionId: (subscriptionId) => set({ subscriptionId }),
    productId: null,
    setProductId: (productId) => set({ productId }),
  }),
  shallow,
);

export default useSubscriptionStore;
