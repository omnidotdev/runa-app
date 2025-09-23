import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";

import { getAuth } from "@/lib/auth/getAuth";

const fetchSession = createServerFn().handler(async () => {
  const request = getRequest();
  const session = await getAuth(request);

  return {
    session,
  };
});

export default fetchSession;
