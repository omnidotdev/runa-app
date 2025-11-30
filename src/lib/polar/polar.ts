import { Polar } from "@polar-sh/sdk";

import {
  POLAR_ACCESS_TOKEN,
  enablePolarSandbox,
} from "@/lib/config/env.config";

/**
 * Polar SDK client.
 */
const polar = new Polar({
  accessToken: POLAR_ACCESS_TOKEN!,
  server: enablePolarSandbox ? "sandbox" : "production",
});

export default polar;
