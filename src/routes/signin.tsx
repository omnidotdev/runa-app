import { createFileRoute } from "@tanstack/react-router";
import { zodValidator } from "@tanstack/zod-adapter";
import { z } from "zod";

import { AuthRequired } from "@/components/layout";
import { BASE_URL } from "@/lib/config/env.config";

const searchSchema = z.object({
  /** Path to return to after authentication */
  redirect: z.string().optional(),
});

/**
 * Sign-in handoff. Loaders for surfaces that are not viewable while logged out
 * (private or nonexistent projects/tasks) redirect here with the requested path
 * in `redirect`; this kicks off the OAuth flow and returns the visitor there
 * afterward, rather than surfacing a 404.
 */
export const Route = createFileRoute("/signin")({
  validateSearch: zodValidator(searchSchema),
  component: SignInPage,
});

/**
 * Resolve the post-auth return URL. Only same-origin absolute paths are
 * honored (the value is user-controlled via the query string); anything else,
 * including protocol-relative `//host` and absolute URLs, falls back to home.
 */
const resolveRedirectUrl = (redirect: string | undefined) => {
  if (redirect?.startsWith("/") && !redirect.startsWith("//")) {
    return `${BASE_URL}${redirect}`;
  }

  return BASE_URL;
};

function SignInPage() {
  const { redirect } = Route.useSearch();

  return (
    <div className="flex h-dvh flex-col bg-background">
      <AuthRequired redirectTo={resolveRedirectUrl(redirect)} />
    </div>
  );
}
