import { redirect } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";

import auth from "@/lib/auth/auth";
import { getAuth } from "@/lib/auth/getAuth";

export const fetchSession = createServerFn().handler(async () => {
  const request = getRequest();

  const session = await getAuth(request);

  return { session };
});

export const signOutAndRedirect = createServerFn({ method: "POST" }).handler(
  async () => {
    const request = getRequest();

    await auth.api.signOut({ headers: request.headers });

    throw redirect({ to: "/" });
  },
);
