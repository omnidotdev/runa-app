import { createServerFn } from "@tanstack/react-start";
import { getWebRequest } from "@tanstack/react-start/server";

import { getAuth } from "@/lib/auth/getAuth";

const fetchSession = createServerFn().handler(async () => {
  const request = getWebRequest();
  const session = await getAuth(request);

  return {
    session,
  };
});

export default fetchSession;
