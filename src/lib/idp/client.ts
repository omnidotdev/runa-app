/**
 * IDP (Identity Provider) client for organization member reads.
 * Membership itself is managed centrally in the Omni account hub (Gatekeeper);
 * products only reflect the roster read-only
 */

import type { GatekeeperMember } from "@omnidotdev/providers/auth";

// Backwards-compatible type aliases
export type IdpMember = GatekeeperMember;
export type IdpMembersResponse = { data: IdpMember[] };
