import {
  SiGithub as GithubIcon,
  SiX as XIcon,
} from "@icons-pack/react-simple-icons";
import { AppFooter } from "@omnidotdev/thornberry/app-footer";
import { Badge } from "@omnidotdev/thornberry/badge";
import { Outlet, createFileRoute } from "@tanstack/react-router";
import { XIcon as CloseIcon, MenuIcon } from "lucide-react";
import { useState } from "react";
import { FaLinkedin as LinkedInIcon } from "react-icons/fa6";
import { SiDiscord as DiscordIcon } from "react-icons/si";

import { Link, Logo, ThemeToggle } from "@/components/core";
import { ShootingStars } from "@/components/landing";
import { Button } from "@/components/ui/button";
import signIn from "@/lib/auth/signIn";
import signOut from "@/lib/auth/signOut";
import app from "@/lib/config/app.config";
import { BASE_URL, hasBilling } from "@/lib/config/env.config";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_public")({
  component: PublicLayout,
});

function PublicLayout() {
  const { session } = Route.useRouteContext();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSignIn = async () => {
    try {
      await signIn({ redirectUrl: BASE_URL, providerId: "omni" });
    } catch (error) {
      console.error("[handleSignIn] OAuth sign-in failed:", error);
    }
  };

  return (
    <div className="relative">
      {/* cosmic background */}
      <div className="fixed inset-0 overflow-hidden">
        {/* base gradient */}
        <div className="from-base-50 via-base-100 to-base-50 dark:from-base-950 dark:via-base-900 dark:to-base-950 absolute inset-0 bg-linear-to-b" />

        {/* ambient glow orbs */}
        <div className="bg-primary-500/10 dark:bg-primary-400/5 absolute top-1/4 left-1/4 h-125 w-125 rounded-full blur-[120px]" />
        <div className="bg-primary-500/10 dark:bg-primary-400/5 absolute top-1/2 right-1/4 h-100 w-100 rounded-full blur-[100px]" />
        <div className="bg-secondary-500/5 dark:bg-secondary-400/5 absolute bottom-1/4 left-1/2 h-75 w-75 rounded-full blur-[80px]" />

        <ShootingStars className="opacity-40 dark:opacity-70" />

        {/* grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.02] dark:opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)`,
            backgroundSize: "100px 100px",
          }}
        />
      </div>

      {/* banner + header */}
      <div className="sticky top-0 z-50">
        <div className="border-primary-500/20 bg-primary-500/20 flex w-full items-center justify-center gap-2 border-b px-4 py-2 text-sm backdrop-blur-sm sm:gap-3">
          <span className="text-base-700 dark:text-base-300">
            <strong className="font-semibold">Runa is in early access</strong> —
            help shape it!
          </span>

          <div className="flex items-center gap-2">
            <a
              href={app.organization.discord}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-primary-500/20 text-primary-700 hover:bg-primary-500/30 dark:text-primary-300 inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors"
            >
              <DiscordIcon className="size-3" />
              Discord
            </a>

            {/* TODO enable after Backfeed `next`/`redirectTo`, public boards, TanStack migration, and brand repaint */}
            {/* <a
              href={app.links.feedback}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 rounded-full bg-base-500/10 px-2.5 py-0.5 font-medium text-base-700 text-xs transition-colors hover:bg-base-500/20 dark:text-base-300"
            >
              <MegaphoneIcon className="size-3" />
              Feedback
            </a> */}
          </div>
        </div>

        <header className="border-base-200/50 dark:border-base-800/50 dark:bg-base-950/80 w-full border-b bg-white/80 backdrop-blur-xl">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between">
              <Link
                to="/"
                variant="ghost"
                className="gap-2 hover:bg-transparent dark:hover:bg-transparent"
              >
                <Logo className="text-primary-500 size-7" />
                <span className="text-xl font-bold tracking-tight">
                  {app.name}
                </span>
                <Badge className="border-primary-500/20 bg-primary-500/10 text-shimmer hidden text-xs sm:inline-flex">
                  Early Access
                </Badge>
              </Link>

              {/* Desktop Navigation */}
              <div className="hidden items-center gap-3 md:flex">
                <Link
                  to="/demo"
                  variant="ghost"
                  className="text-base-600 hover:text-foreground dark:text-base-400 dark:hover:text-foreground"
                >
                  Demo
                </Link>

                {hasBilling && (
                  <Link
                    to="/pricing"
                    variant="ghost"
                    className="text-base-600 hover:text-foreground dark:text-base-400 dark:hover:text-foreground"
                  >
                    Pricing
                  </Link>
                )}

                <a
                  href={app.links.docs}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-base-600 hover:text-foreground dark:text-base-400 dark:hover:text-foreground rounded-md px-3 py-2 text-sm font-medium"
                >
                  Docs
                </a>

                <ThemeToggle />

                {session?.user?.rowId ? (
                  <Button variant="outline" onClick={() => void signOut()}>
                    Sign Out
                  </Button>
                ) : (
                  <Button
                    onClick={handleSignIn}
                    className="bg-primary-500 text-base-950 hover:bg-primary-400 dark:bg-primary-500 dark:hover:bg-primary-400"
                  >
                    Sign In
                  </Button>
                )}
              </div>

              {/* Mobile Menu Button */}
              <div className="flex items-center gap-2 md:hidden">
                <ThemeToggle />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  aria-label="Toggle menu"
                >
                  {mobileMenuOpen ? (
                    <CloseIcon className="size-5" />
                  ) : (
                    <MenuIcon className="size-5" />
                  )}
                </Button>
              </div>
            </div>
          </div>

          {/* Mobile Menu */}
          <div
            className={cn(
              "border-base-200/50 border-t bg-white/95 backdrop-blur-xl md:hidden dark:border-base-800/50 dark:bg-base-950/95",
              mobileMenuOpen ? "block" : "hidden",
            )}
          >
            <div className="space-y-1 px-4 py-3">
              <Link
                to="/demo"
                variant="ghost"
                className="text-base-600 hover:text-foreground dark:text-base-400 dark:hover:text-foreground block w-full justify-start"
                onClick={() => setMobileMenuOpen(false)}
              >
                Demo
              </Link>

              {hasBilling && (
                <Link
                  to="/pricing"
                  variant="ghost"
                  className="text-base-600 hover:text-foreground dark:text-base-400 dark:hover:text-foreground block w-full justify-start"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Pricing
                </Link>
              )}

              <a
                href={app.links.docs}
                target="_blank"
                rel="noopener noreferrer"
                className="text-base-600 hover:bg-base-100 hover:text-foreground dark:text-base-400 dark:hover:bg-base-800 dark:hover:text-foreground block rounded-md px-3 py-2 text-sm font-medium"
              >
                Docs
              </a>

              <div className="pt-2">
                {session?.user?.rowId ? (
                  <Button
                    variant="outline"
                    onClick={() => void signOut()}
                    className="w-full"
                  >
                    Sign Out
                  </Button>
                ) : (
                  <Button
                    onClick={handleSignIn}
                    className="bg-primary-500 text-base-950 hover:bg-primary-400 dark:bg-primary-500 dark:hover:bg-primary-400 w-full"
                  >
                    Sign In
                  </Button>
                )}
              </div>
            </div>
          </div>
        </header>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex min-h-dvh w-full flex-col">
        <main className="flex-1">
          <Outlet />
        </main>

        {/* Footer */}
        <AppFooter
          className="border-base-200/50 bg-base-50/50 dark:border-base-800/50 dark:bg-base-950/50 relative border-t backdrop-blur-sm"
          appLogo={<Logo className="text-primary-500 size-4" />}
          appSymbol={app.icon}
          docsUrl={app.links.docs}
          orgUrl={app.organization.url}
          socials={
            <>
              <a
                href={app.links.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="hover:text-foreground rounded px-2 py-1 transition-colors"
              >
                <GithubIcon className="size-5" />
              </a>

              <a
                href={app.organization.x}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="X"
                className="hover:text-foreground rounded px-2 py-1 transition-colors"
              >
                <XIcon className="size-5" />
              </a>

              <a
                href={app.organization.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="hover:text-foreground rounded px-2 py-1 transition-colors"
              >
                <LinkedInIcon className="size-5" />
              </a>
            </>
          }
        />
      </div>
    </div>
  );
}
