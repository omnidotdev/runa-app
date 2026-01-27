import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { LuGithub as GithubIcon } from "react-icons/lu";
import { SiGoogle as GoogleIcon } from "react-icons/si";

import { Button } from "@/components/ui/button";
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardRoot,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import authClient from "@/lib/auth/authClient";
import app from "@/lib/config/app.config";
import {
  AUTH_CLIENT_ID,
  BASE_URL,
  GITHUB_CLIENT_ID,
  GOOGLE_CLIENT_ID,
  OIDC_ISSUER,
  isSelfHosted,
} from "@/lib/config/env.config";

export const Route = createFileRoute("/_public/login")({
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  // SaaS mode: Omni OAuth configured
  const hasOmni = !!AUTH_CLIENT_ID;
  const hasGoogle = !!GOOGLE_CLIENT_ID;
  const hasGithub = !!GITHUB_CLIENT_ID;
  const hasOidc = !!OIDC_ISSUER;
  const hasOAuth = hasGoogle || hasGithub || hasOidc;

  // Self-hosted mode: email/password available
  const hasEmailPassword = isSelfHosted;

  const handleOAuth = async (
    provider: "omni" | "google" | "github" | "oidc",
  ) => {
    setError(null);
    try {
      await authClient.signIn.oauth2({
        providerId: provider,
        callbackURL: BASE_URL,
      });
    } catch {
      setError("OAuth sign in failed");
    }
  };

  const handleEmailPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isSignUp) {
        const { error } = await authClient.signUp.email({
          email,
          password,
          name,
          callbackURL: BASE_URL,
        });
        if (error) {
          setError(error.message || "Failed to create account");
          return;
        }
      } else {
        const { error } = await authClient.signIn.email({
          email,
          password,
          callbackURL: BASE_URL,
        });
        if (error) {
          setError(error.message || "Invalid email or password");
          return;
        }
      }
      navigate({ to: "/" });
    } catch {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  // SaaS mode: auto-redirect to Omni OAuth (no login screen needed)
  // biome-ignore lint/correctness/useExhaustiveDependencies: intentional one-time redirect
  useEffect(() => {
    if (hasOmni) {
      handleOAuth("omni");
    }
  }, [hasOmni]);

  // SaaS mode: show loading while redirecting to Omni
  if (hasOmni) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center">
        <p className="text-muted-foreground">Redirecting to sign in...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-12">
      <CardRoot className="w-full max-w-md border-base-200/50 bg-white/80 backdrop-blur-xl dark:border-base-800/50 dark:bg-base-900/80">
        <CardHeader className="text-center">
          <div className="mb-2 text-4xl">🌙</div>
          <CardTitle className="text-2xl">{app.name}</CardTitle>
          <CardDescription>
            {isSignUp ? "Create a new account" : "Sign in to your account"}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {error && (
            <div className="rounded-md bg-red-500/10 p-3 text-center text-red-600 text-sm dark:text-red-400">
              {error}
            </div>
          )}

          {/* Self-hosted: email/password form */}
          {hasEmailPassword && (
            <>
              <form onSubmit={handleEmailPassword} className="space-y-4">
                {isSignUp && (
                  <Input
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                )}
                <Input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <Input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                />
                <Button
                  type="submit"
                  className="w-full bg-primary-500 text-base-950 hover:bg-primary-400"
                  disabled={loading}
                >
                  {loading ? "..." : isSignUp ? "Create Account" : "Sign In"}
                </Button>
              </form>

              <div className="text-center text-sm">
                {isSignUp ? (
                  <span className="text-muted-foreground">
                    Already have an account?{" "}
                    <button
                      type="button"
                      onClick={() => setIsSignUp(false)}
                      className="cursor-pointer text-primary-500 hover:underline"
                    >
                      Sign in
                    </button>
                  </span>
                ) : (
                  <span className="text-muted-foreground">
                    Don't have an account?{" "}
                    <button
                      type="button"
                      onClick={() => setIsSignUp(true)}
                      className="cursor-pointer text-primary-500 hover:underline"
                    >
                      Sign up
                    </button>
                  </span>
                )}
              </div>
            </>
          )}

          {/* OAuth providers (optional for self-hosted) */}
          {hasOAuth && (
            <>
              {hasEmailPassword && (
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-base-200 border-t dark:border-base-700" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-muted-foreground dark:bg-base-900">
                      or continue with
                    </span>
                  </div>
                </div>
              )}
              <div className="flex flex-col gap-2">
                {hasGoogle && (
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => handleOAuth("google")}
                  >
                    <GoogleIcon className="mr-2 size-4" />
                    Continue with Google
                  </Button>
                )}
                {hasGithub && (
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => handleOAuth("github")}
                  >
                    <GithubIcon className="mr-2 size-4" />
                    Continue with GitHub
                  </Button>
                )}
                {hasOidc && (
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => handleOAuth("oidc")}
                  >
                    Continue with SSO
                  </Button>
                )}
              </div>
            </>
          )}

          {/* No auth configured (shouldn't happen in production) */}
          {!hasEmailPassword && !hasOAuth && (
            <div className="text-center text-muted-foreground text-sm">
              No authentication method available.
            </div>
          )}
        </CardContent>
      </CardRoot>
    </div>
  );
}
