import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";

import { getHints } from "@/components/scripts/ClientHintCheck";
import { getTheme } from "@/lib/util/theme";

export const getRequestInfo = createServerFn().handler(async () => {
  const request = getRequest();

  const requestInfo = {
    hints: getHints(request),
    userPreferences: {
      theme: await getTheme(),
    },
  };

  return requestInfo;
});
