import type {
  GetAuthSession,
  OrganizationClaim,
} from "@omnidotdev/providers/auth";

/**
 * Session shape sent to the browser. Built field by field instead of spreading
 * the Better Auth result, which carries the session token (the httpOnly cookie
 * value) plus the client IP and user agent, none of which the client may see
 */
export type ClientSession = {
  user: {
    id: string;
    name: string;
    email: string;
    image?: string | null;
    identityProviderId?: string | null;
    rowId?: string;
  };
  accessToken?: string;
  organizations: OrganizationClaim[];
};

/**
 * Reduce a server-side auth session to the fields the client reads
 */
export const toClientSession = (
  session: GetAuthSession | null,
): ClientSession | null => {
  if (!session) return null;

  return {
    user: {
      id: session.user.id,
      name: session.user.name,
      email: session.user.email,
      image: session.user.image,
      identityProviderId: session.user.identityProviderId,
      rowId: session.user.rowId,
    },
    accessToken: session.accessToken,
    organizations: session.organizations,
  };
};
