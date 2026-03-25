import { useCallback, useState } from "react";

type CookieOptions = {
  maxAge?: number;
  path?: string;
  sameSite?: "Strict" | "Lax" | "None";
};

const DEFAULT_OPTIONS: CookieOptions = {
  maxAge: 31_536_000,
  path: "/",
  sameSite: "Lax",
};

export default function useCookieState<T extends string>(
  name: string,
  fallback: T,
  options: CookieOptions = {},
) {
  const { maxAge, path, sameSite } = { ...DEFAULT_OPTIONS, ...options };

  const [value, setValue] = useState<T>(() => {
    const match =
      typeof document !== "undefined"
        ? document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`))
        : null;
    return (match?.[1] as T) ?? fallback;
  });

  const set = useCallback(
    (next: T) => {
      setValue(next);
      // biome-ignore lint/suspicious/noDocumentCookie: centralised cookie access
      document.cookie = `${name}=${next}; path=${path}; max-age=${maxAge}; SameSite=${sameSite}`;
    },
    [name, path, maxAge, sameSite],
  );

  return [value, set] as const;
}
