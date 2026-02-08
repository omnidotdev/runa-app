import AetherBillingProvider from "./aether.provider";

import type { BillingProvider } from "./interface";

export type {
  BillingProvider,
  CheckoutParams,
  Entitlement,
  EntitlementsResponse,
  Price,
  Subscription,
} from "./interface";

/**
 * Singleton billing provider instance.
 */
const billing: BillingProvider = new AetherBillingProvider();

export default billing;
