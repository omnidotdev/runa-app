import { Outlet, createFileRoute } from "@tanstack/react-router";
import { XIcon as CloseIcon, MegaphoneIcon, MenuIcon } from "lucide-react";
import { useState } from "react";
import { LuGithub as GithubIcon } from "react-icons/lu";
import {
  SiDiscord as DiscordIcon,
  SiLinkedin as LinkedinIcon,
  SiX as TwitterIcon,
} from "react-icons/si";

import { Link, ThemeToggle } from "@/components/core";
import { ShootingStars } from "@/components/landing";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import signIn from "@/lib/auth/signIn";
import signOut from "@/lib/auth/signOut";
import app from "@/lib/config/app.config";
import { BASE_URL } from "@/lib/config/env.config";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_public")({
  component: PublicLayout,
});

function PublicLayout() {
  const { session } = Route.useRouteContext();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="relative">
      {/* cosmic background */}
      <div className="fixed inset-0 overflow-hidden">
        {/* base gradient */}
        <div className="absolute inset-0 bg-linear-to-b from-base-50 via-base-100 to-base-50 dark:from-base-950 dark:via-base-900 dark:to-base-950" />

        {/* ambient glow orbs */}
        <div className="absolute top-1/4 left-1/4 h-125 w-125 rounded-full bg-primary-500/10 blur-[120px] dark:bg-primary-400/5" />
        <div className="absolute top-1/2 right-1/4 h-100 w-100 rounded-full bg-primary-500/10 blur-[100px] dark:bg-primary-400/5" />
        <div className="absolute bottom-1/4 left-1/2 h-75 w-75 rounded-full bg-secondary-500/5 blur-[80px] dark:bg-secondary-400/5" />

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
        <div className="flex w-full items-center justify-center gap-2 border-primary-500/20 border-b bg-primary-500/20 px-4 py-2 text-sm backdrop-blur-sm sm:gap-3">
          <span className="text-base-700 dark:text-base-300">
            <strong className="font-semibold">Runa is in open alpha</strong> —
            help shape it!
          </span>

          <div className="flex items-center gap-2">
            <a
              href={app.organization.discord}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 rounded-full bg-primary-500/20 px-2.5 py-0.5 font-medium text-primary-700 text-xs transition-colors hover:bg-primary-500/30 dark:text-primary-300"
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

        <header className="w-full border-base-200/50 border-b bg-white/80 backdrop-blur-xl dark:border-base-800/50 dark:bg-base-950/80">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between">
              <Link
                to="/"
                variant="ghost"
                className="gap-2 hover:bg-transparent dark:hover:bg-transparent"
              >
                {/* TODO: Replace with real logo */}
                <span className="text-2xl">🌙</span>
                <span className="font-bold text-xl tracking-tight">
                  {app.name}
                </span>
                <Badge className="hidden border-primary-500/20 bg-primary-500/10 text-shimmer text-xs sm:inline-flex">
                  Alpha
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

                <Link
                  to="/pricing"
                  variant="ghost"
                  className="text-base-600 hover:text-foreground dark:text-base-400 dark:hover:text-foreground"
                >
                  Pricing
                </Link>

                <a
                  href={app.links.docs}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-md px-3 py-2 font-medium text-base-600 text-sm hover:text-foreground dark:text-base-400 dark:hover:text-foreground"
                >
                  Docs
                </a>

                <ThemeToggle />

                {session ? (
                  <Button variant="outline" onClick={signOut}>
                    Sign Out
                  </Button>
                ) : (
                  <Button
                    onClick={() => signIn({ redirectUrl: BASE_URL })}
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
                className="block w-full justify-start text-base-600 hover:text-foreground dark:text-base-400 dark:hover:text-foreground"
                onClick={() => setMobileMenuOpen(false)}
              >
                Demo
              </Link>

              <Link
                to="/pricing"
                variant="ghost"
                className="block w-full justify-start text-base-600 hover:text-foreground dark:text-base-400 dark:hover:text-foreground"
                onClick={() => setMobileMenuOpen(false)}
              >
                Pricing
              </Link>

              <a
                href={app.links.docs}
                target="_blank"
                rel="noopener noreferrer"
                className="block rounded-md px-3 py-2 font-medium text-base-600 text-sm hover:bg-base-100 hover:text-foreground dark:text-base-400 dark:hover:bg-base-800 dark:hover:text-foreground"
              >
                Docs
              </a>

              <div className="pt-2">
                {session ? (
                  <Button
                    variant="outline"
                    onClick={signOut}
                    className="w-full"
                  >
                    Sign Out
                  </Button>
                ) : (
                  <Button
                    onClick={() => signIn({ redirectUrl: BASE_URL })}
                    className="w-full bg-primary-500 text-base-950 hover:bg-primary-400 dark:bg-primary-500 dark:hover:bg-primary-400"
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
        <footer className="relative border-base-200/50 border-t bg-base-50/50 backdrop-blur-sm dark:border-base-800/50 dark:bg-base-950/50">
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
              {/* Brand */}
              <div className="flex items-center gap-2">
                {/* TODO: Replace with real logo */}
                <span className="text-xl opacity-60">🌙</span>
                <span className="text-base-500 text-sm">
                  Made with 🌙 by{" "}
                  <a
                    href="https://omni.dev"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-foreground transition-colors hover:text-primary-500"
                  >
                    {app.organization.name}
                  </a>
                </span>
              </div>

              <div className="flex items-center gap-6">
                <a
                  href={app.links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-base-500 transition-colors hover:text-foreground"
                >
                  <GithubIcon size={20} />
                </a>
                <a
                  href={app.organization.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-base-500 transition-colors hover:text-foreground"
                >
                  <TwitterIcon size={20} />
                </a>
                <a
                  href={app.organization.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-base-500 transition-colors hover:text-foreground"
                >
                  <LinkedinIcon size={20} />
                </a>
              </div>

              <p className="text-base-500 text-sm">
                &copy; {new Date().getFullYear()}{" "}
                {/* TODO improve, this is strange DX; <a> used elsewhere for simplicity */}
                <Link
                  variant="link"
                  className="p-0"
                  to={app.organization.website}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {app.organization.name}
                </Link>
                . All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
