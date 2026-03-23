import { GatekeeperOrgClient } from "@omnidotdev/providers/auth";

import { AUTH_INTERNAL_URL } from "./env.config";

const gatekeeperOrg = new GatekeeperOrgClient(AUTH_INTERNAL_URL!);

export default gatekeeperOrg;
