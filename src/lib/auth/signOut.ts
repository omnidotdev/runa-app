import { BASE_URL } from "@/lib/config/env.config";

export async function signOut() {
  const response = await fetch("/api/auth/csrf");
  const { csrfToken } = await (response.json() as Promise<{
    csrfToken: string;
  }>);
  const res = await fetch("/api/auth/signout", {
    method: "post",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "X-Auth-Return-Redirect": "1",
    },
    body: new URLSearchParams({
      csrfToken,
    }),
  });

  const data = await res.clone().json();
  const error = new URL(data.url).searchParams.get("error");

  if (!error) {
    window.location.href = BASE_URL;
    return;
  }

  return res;
}
