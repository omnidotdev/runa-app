import Stripe from "stripe";

let _payments: Stripe | null = null;

/**
 * Get payments client.
 */
const getPayments = (): Stripe => {
  if (_payments) return _payments;

  const apiKey = process.env.STRIPE_API_KEY;

  if (!apiKey) {
    throw new Error("STRIPE_API_KEY environment variable is required");
  }

  _payments = new Stripe(apiKey);

  return _payments;
};

/**
 * Payments client proxy.
 *
 * Proxies access to the lazily-initialized Stripe client.
 */
const payments = new Proxy({} as Stripe, {
  get(_, prop) {
    return getPayments()[prop as keyof Stripe];
  },
});

export default payments;
