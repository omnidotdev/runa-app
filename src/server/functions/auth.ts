import { redirect } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";

import auth from "@/lib/auth/auth";
import { getAuth } from "@/lib/auth/getAuth";

export const fetchSession = createServerFn().handler(async () => {
  try {
    const request = getRequest();
    const session = await getAuth(request);

    // Debug: verify the session is serializable
    if (session) {
      try {
        JSON.stringify(session);
      } catch (serializationError) {
        console.error(
          "[fetchSession] Session contains non-serializable data:",
          serializationError,
        );
        // Return a safely serialized version
        return { session: null, error: "Session serialization failed" };
      }
    }

    return { session };
  } catch (error) {
    console.error("[fetchSession] Error:", error);
    return { session: null };
  }
});

export const signOutAndRedirect = createServerFn({ method: "POST" }).handler(
  async () => {
    const request = getRequest();

    await auth.api.signOut({ headers: request.headers });

    throw redirect({ to: "/" });
  },
);
