import {
  createFileRoute,
  useNavigate,
  useParams,
} from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardRoot,
  CardTitle,
} from "@/components/ui/card";
import app from "@/lib/config/app.config";
import { acceptInvite } from "@/server/functions/invitations";

export const Route = createFileRoute("/_public/invite/$token")({
  component: InviteAcceptPage,
});

function InviteAcceptPage() {
  const { token } = useParams({ from: "/_public/invite/$token" });
  const { session } = Route.useRouteContext();
  const navigate = useNavigate();
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [error, setError] = useState<string | null>(null);

  // If not authenticated, redirect to login with return URL
  useEffect(() => {
    if (!session) {
      navigate({
        to: "/login",
        search: { returnTo: `/invite/${token}` },
      });
    }
  }, [session, navigate, token]);

  const handleAccept = async () => {
    setStatus("loading");
    setError(null);

    try {
      const result = await acceptInvite({ data: { token } });
      setStatus("success");

      // Redirect to the workspace after a brief delay
      setTimeout(() => {
        navigate({ to: "/workspaces" });
      }, 1500);
    } catch (err) {
      setStatus("error");
      setError(
        err instanceof Error ? err.message : "Failed to accept invitation",
      );
    }
  };

  if (!session) {
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
            {status === "success"
              ? "You've joined the workspace"
              : "You've been invited to join a workspace"}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {error && (
            <div className="rounded-md bg-red-500/10 p-3 text-center text-red-600 text-sm dark:text-red-400">
              {error}
            </div>
          )}

          {status === "success" ? (
            <div className="rounded-md bg-green-500/10 p-3 text-center text-green-600 text-sm dark:text-green-400">
              Invitation accepted. Redirecting...
            </div>
          ) : (
            <Button
              onClick={handleAccept}
              disabled={status === "loading"}
              className="w-full bg-primary-500 text-base-950 hover:bg-primary-400"
            >
              {status === "loading" ? "Joining..." : "Accept Invitation"}
            </Button>
          )}
        </CardContent>
      </CardRoot>
    </div>
  );
}
