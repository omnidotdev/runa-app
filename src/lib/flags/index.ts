import { GrowthBook } from "@growthbook/growthbook";

import {
  FLAGS_API_HOST,
  FLAGS_CLIENT_KEY,
  isProdEnv,
} from "@/lib/config/env.config";
import { defaultFlags } from "./defaults";

import type { FlagConfig } from "./defaults";

export interface FlagContext {
  userId?: string;
  email?: string;
  [key: string]: string | undefined;
}

/**
 * Create a GrowthBook instance with the given context.
 */
export async function createGrowthBook(context: FlagContext = {}) {
  const gb = new GrowthBook({
    apiHost: FLAGS_API_HOST,
    clientKey: FLAGS_CLIENT_KEY,
    attributes: context,
  });

  // Only load features from API in production with valid config
  if (isProdEnv && FLAGS_API_HOST && FLAGS_CLIENT_KEY) {
    try {
      await gb.init({ timeout: 2000 });
    } catch {
      // Fall back to defaults if API is unavailable
      console.warn("Failed to load features, using defaults");
    }
  }

  return gb;
}

/**
 * Get a feature flag value with fallback to defaults.
 */
export function getFlag<T = boolean>(gb: GrowthBook, flagKey: string): T {
  // Try to get from feature flags provider first
  const gbValue = gb.getFeatureValue(flagKey, undefined);

  if (gbValue !== undefined) {
    return gbValue as T;
  }

  // Fall back to default configuration
  const flagConfig = defaultFlags[flagKey] as FlagConfig | undefined;

  if (flagConfig) {
    return flagConfig.variants[flagConfig.defaultVariant] as T;
  }

  return false as T;
}

export { FLAGS } from "./defaults";
