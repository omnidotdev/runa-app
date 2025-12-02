import { createServerFn } from "@tanstack/react-start";
import {
  deleteCookie,
  getCookie,
  getRequest,
  setCookie,
} from "@tanstack/react-start/server";
import { z } from "zod";

import { getHints } from "@/components/scripts/ClientHintCheck";
import { isDevEnv } from "@/lib/config/env.config";

const key = "theme";

const themeSchema = z.enum(["system", "light", "dark"]);

export type Theme = Exclude<z.infer<typeof themeSchema>, "system">;

export const getTheme = createServerFn().handler(() => {
  const theme = getCookie(key) as Theme | undefined;

  return theme ?? null;
});

export const setTheme = createServerFn({ method: "POST" })
  .inputValidator(themeSchema)
  .handler(async ({ data }) => {
    if (data === "system") {
      deleteCookie(key);
    } else {
      setCookie(key, data, {
        path: "/",
        sameSite: "lax",
        httpOnly: true,
        secure: !isDevEnv,
      });
    }
  });

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
