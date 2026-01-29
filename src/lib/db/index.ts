import { Pool } from "pg";

import { AUTH_CLIENT_ID } from "@/lib/config/env.config";

const { DATABASE_URL } = process.env;

/**
 * Whether running in SaaS mode (Omni OAuth configured).
 * SaaS mode is stateless - no database connection needed in app.
 */
const isSaaSMode = !!AUTH_CLIENT_ID;

/**
 * Postgres database pool for Better Auth (self-hosted only).
 * Only initialized when:
 * - NOT in SaaS mode (no AUTH_CLIENT_ID)
 * - DATABASE_URL is available
 */
export const pgPool =
  !isSaaSMode && DATABASE_URL
    ? new Pool({
        connectionString: DATABASE_URL,
        max: 5,
        idleTimeoutMillis: 30_000,
        connectionTimeoutMillis: 5_000,
      })
    : null;
