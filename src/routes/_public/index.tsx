import { Badge } from "@omnidotdev/thornberry/badge";
import { createFileRoute, redirect } from "@tanstack/react-router";
import {
  ArrowRightIcon,
  ChartNoAxesColumnIncreasingIcon,
  CheckCircle2Icon,
  KanbanIcon,
  ListTodoIcon,
  RocketIcon,
  SparklesIcon,
  UsersIcon,
  WorkflowIcon,
} from "lucide-react";
import { LuGithub as GithubIcon } from "react-icons/lu";

import { Link, TiltCard } from "@/components/core";
import { Button } from "@/components/ui/button";
import signIn from "@/lib/auth/signIn";
import app from "@/lib/config/app.config";
import { BASE_URL } from "@/lib/config/env.config";
import { cn } from "@/lib/utils";

import type { ReactNode } from "react";

export const Route = createFileRoute("/_public/")({
  beforeLoad: async ({ context: { session }, preload }) => {
    // Clear zombie session (OAuth session exists but user not provisioned in DB)
    if (session?.user && !session.user.rowId) {
      const { signOutAndRedirect } = await import("@/server/functions/auth");
      await signOutAndRedirect();
    }

    // Guard against preload so hovering a link home does not navigate authed users
    if (!preload && session?.user?.rowId) throw redirect({ to: "/workspaces" });
  },
  component: HomePage,
});

interface Feature {
  title: string;
  description: string;
  icon: ReactNode;
  className?: string;
  iconClassName?: string;
}

const features: Feature[] = [
  {
    title: "Intuitive Kanban Boards",
    description:
      "Drag and drop tasks across customizable columns. Visualize your workflow and keep your team aligned with beautiful, responsive boards.",
    icon: <KanbanIcon size={28} />,
    className: "md:col-span-2 md:row-span-2",
    iconClassName: "bg-primary-500/10 text-primary-500",
  },
  {
    title: "Smart Task Management",
    description:
      "Organize tasks with labels, priorities, and due dates. Coming soon, find anything instantly with powerful search.",
    icon: <ListTodoIcon size={24} />,
    className: "md:col-span-1",
    iconClassName: "bg-primary-500/10 text-primary-500",
  },
  {
    title: "Team Collaboration",
    description:
      "Assign tasks, leave comments, and mention teammates. Everyone stays in the loop.",
    icon: <UsersIcon size={24} />,
    className: "md:col-span-1",
    iconClassName: "bg-primary-500/10 text-primary-500",
  },
  {
    title: "Custom Workflows",
    description:
      "Create columns that match your process. Define statuses that make sense for your team.",
    icon: <WorkflowIcon size={24} />,
    className: "md:col-span-1",
    iconClassName: "bg-primary-500/10 text-primary-500",
  },
  {
    title: "Project Analytics",
    description:
      "Coming soon, track progress, measure velocity, and gain insights into your team's productivity.",
    icon: <ChartNoAxesColumnIncreasingIcon size={24} />,
    className: "md:col-span-1",
    iconClassName: "bg-primary-500/10 text-primary-500",
  },
];

const steps = [
  {
    number: "01",
    title: "Create Your Workspace",
    description:
      "Set up your team's home base in seconds. Invite members and get organized.",
    icon: <SparklesIcon size={24} />,
  },
  {
    number: "02",
    title: "Build Your Boards",
    description:
      "Create projects with customizable columns that match your workflow.",
    icon: <KanbanIcon size={24} />,
  },
  {
    number: "03",
    title: "Execute with Precision",
    description:
      "Track tasks, collaborate with your team, and ship great work.",
    icon: <RocketIcon size={24} />,
  },
];

const stats = [
  { value: "100%", label: "Open Source" },
  { value: "Free", label: "For Individuals" },
  { value: "∞", label: "Possibilities" },
];

function HomePage() {
  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="relative px-4 pt-20 pb-32 sm:px-6 md:pt-32 md:pb-40 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-4xl text-center">
            {/* Badge */}
            <div className="mb-8 flex justify-center">
              <Badge className="border-primary-500/20 bg-primary-500/10 text-primary-700 dark:border-primary-400/20 dark:bg-primary-500/10 dark:text-primary-400 gap-2 px-4 py-2">
                <span>{app.description}</span>
              </Badge>
            </div>

            {/* Headline */}
            <h1 className="mb-6 text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              <span className="text-foreground block">Project management</span>
              <span className="text-shimmer mt-2 block">done right.</span>
            </h1>

            <p className="text-base-600 dark:text-base-400 mx-auto mb-10 max-w-2xl text-base">
              Beautiful Kanban boards, seamless collaboration, and powerful
              workflows. Everything your team needs to ship faster, completely
              free and open source.
            </p>

            {/* CTAs */}
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <TiltCard
                maxTilt={8}
                liftAmount={4}
                hoverScale={1.02}
                glareIntensity={0.25}
                onClick={() =>
                  signIn({ redirectUrl: BASE_URL, providerId: "omni" })
                }
                className="rounded-xl border-0 bg-transparent p-0 shadow-none"
              >
                <Button
                  size="lg"
                  className="group bg-primary-500 text-base-950 shadow-primary-500/25 hover:bg-primary-400 hover:shadow-primary-500/30 dark:bg-primary-500 dark:hover:bg-primary-400 h-12 gap-2 px-8 text-base font-semibold shadow-lg transition-all hover:shadow-xl"
                >
                  Get Started Free
                  <ArrowRightIcon
                    size={18}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </Button>
              </TiltCard>

              <a
                href={app.links.github}
                target="_blank"
                rel="noopener noreferrer"
              >
                <TiltCard
                  maxTilt={8}
                  liftAmount={4}
                  hoverScale={1.02}
                  glareIntensity={0.2}
                  className="rounded-xl border-0 bg-transparent p-0 shadow-none"
                >
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-base-300 dark:border-base-700 h-12 gap-2 px-8 text-base"
                  >
                    <GithubIcon size={18} />
                    View on GitHub
                  </Button>
                </TiltCard>
              </a>
            </div>

            {/* Social Proof */}
            <div className="mt-16 flex flex-wrap items-center justify-center gap-8">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-foreground text-2xl font-bold sm:text-3xl">
                    {stat.value}
                  </div>
                  <div className="text-base-500 text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Decorative gradient orb behind hero */}
        <div className="bg-primary-500/5 pointer-events-none absolute top-1/2 left-1/2 -z-10 h-150 w-150 -translate-x-1/2 -translate-y-1/2 rounded-full blur-[100px]" />
      </section>

      {/* Demo CTA Section */}
      <section className="relative px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <div className="border-primary-500/20 from-primary-50/50 to-base-100 dark:border-primary-500/10 dark:from-primary-950/20 dark:to-base-950 relative overflow-hidden rounded-2xl border bg-linear-to-br p-8 text-center">
            {/* Background decoration */}
            <div className="bg-primary-500/15 absolute top-0 right-0 h-32 w-32 rounded-full blur-2xl" />
            <div className="bg-primary-400/10 absolute bottom-0 left-0 h-32 w-32 rounded-full blur-2xl" />

            <div className="relative">
              <Badge className="border-primary-500/20 bg-primary-500/10 text-primary-700 dark:border-primary-400/20 dark:text-primary-400 mb-4">
                Try It Out
              </Badge>

              <h2 className="text-foreground mb-4 text-2xl font-bold sm:text-3xl">
                See it in action
              </h2>

              <p className="text-base-600 dark:text-base-400 mb-6">
                Experience the intuitive drag-and-drop workflow with our
                interactive demo board.
              </p>

              <TiltCard
                maxTilt={8}
                liftAmount={4}
                hoverScale={1.02}
                glareIntensity={0.2}
                className="inline-block rounded-xl border-0 bg-transparent p-0 shadow-none"
              >
                <Link
                  to="/demo"
                  className="group bg-primary-500 text-base-950 shadow-primary-500/25 hover:bg-primary-400 hover:shadow-primary-500/30 dark:bg-primary-500 dark:hover:bg-primary-400 h-12 gap-2 px-8 text-base font-semibold shadow-lg transition-all hover:shadow-xl"
                >
                  Try the Demo
                  <ArrowRightIcon
                    size={18}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </Link>
              </TiltCard>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Bento Grid */}
      <section id="features" className="relative px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {/* Section Header */}
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <Badge className="border-primary-500/20 bg-primary-500/10 text-primary-700 dark:border-primary-400/20 dark:text-primary-400 mb-4">
              Features
            </Badge>
            <h2 className="text-foreground mb-4 text-3xl font-bold sm:text-4xl">
              Everything you need to execute
            </h2>
            <p className="text-base-600 dark:text-base-400 text-lg">
              Powerful features wrapped in a beautiful, intuitive interface.
            </p>
          </div>

          {/* Bento Grid */}
          <div className="grid gap-4 md:grid-cols-4 md:grid-rows-2">
            {features.map((feature) => (
              <TiltCard
                key={feature.title}
                maxTilt={12}
                liftAmount={10}
                hoverScale={1.02}
                glareIntensity={0.2}
                className={cn(
                  "group relative overflow-hidden rounded-2xl border border-primary-500/10 bg-white/50 backdrop-blur-sm dark:border-primary-500/10 dark:bg-base-900/50",
                  feature.className,
                )}
              >
                {/* Icon */}
                <div
                  className={cn(
                    "mb-4 flex h-12 w-12 items-center justify-center rounded-xl",
                    feature.iconClassName,
                  )}
                >
                  {feature.icon}
                </div>

                {/* Content */}
                <h3 className="text-foreground mb-2 text-lg font-semibold">
                  {feature.title}
                </h3>
                <p className="text-base-600 dark:text-base-400 text-sm leading-relaxed">
                  {feature.description}
                </p>

                {/* Decorative gradient */}
                <div className="from-primary-500/10 pointer-events-none absolute -right-20 -bottom-20 h-40 w-40 rounded-full bg-linear-to-br to-transparent opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100" />
              </TiltCard>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="relative px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {/* Section Header */}
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <Badge className="border-primary-500/20 bg-primary-500/10 text-primary-700 dark:border-primary-400/20 dark:text-primary-400 mb-4">
              How It Works
            </Badge>
            <h2 className="text-foreground mb-4 text-3xl font-bold sm:text-4xl">
              From zero to 🌙 in minutes
            </h2>
            <p className="text-base-600 dark:text-base-400 text-lg">
              Getting started in {app.name} is simple. No complex setup, no
              steep learning curve.
            </p>
          </div>

          {/* Steps */}
          <div className="relative grid gap-8 md:grid-cols-3">
            {/* Connecting line */}
            <div className="via-primary-500/30 absolute top-16 right-0 left-0 hidden h-0.5 bg-linear-to-r from-transparent to-transparent md:block" />

            {steps.map((step, _index) => (
              <TiltCard
                key={step.title}
                maxTilt={15}
                liftAmount={12}
                hoverScale={1.03}
                glareIntensity={0.18}
                className="group border-primary-500/10 dark:border-primary-500/10 dark:bg-base-900/50 flex flex-col items-center rounded-2xl bg-white/50 text-center backdrop-blur-sm"
              >
                {/* Step number with icon */}
                <div className="relative mb-6">
                  <div className="border-primary-500/20 group-hover:border-primary-500/40 group-hover:shadow-primary-500/10 dark:border-primary-500/10 dark:bg-base-900 flex h-20 w-20 items-center justify-center rounded-2xl border bg-white shadow-lg transition-all duration-300">
                    <div className="text-primary-500">{step.icon}</div>
                  </div>
                  <div className="bg-primary-500 text-base-950 absolute -top-2 -right-2 flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold">
                    {step.number}
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-foreground mb-2 text-xl font-semibold">
                  {step.title}
                </h3>
                <p className="text-base-600 dark:text-base-400 max-w-xs">
                  {step.description}
                </p>
              </TiltCard>
            ))}
          </div>
        </div>
      </section>

      {/* Open Source Section */}
      <section className="relative px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="border-primary-500/20 from-primary-50/50 to-base-100 dark:border-primary-500/10 dark:from-primary-950/20 dark:to-base-950 relative overflow-hidden rounded-3xl border bg-linear-to-br p-8 sm:p-12 lg:p-16">
            {/* Background decoration */}
            <div className="bg-primary-500/15 absolute top-0 right-0 h-64 w-64 rounded-full blur-3xl" />
            <div className="bg-primary-400/10 absolute bottom-0 left-0 h-64 w-64 rounded-full blur-3xl" />

            <div className="relative flex flex-col items-center gap-8 lg:flex-row lg:justify-between">
              {/* Content */}
              <div className="max-w-xl text-center lg:text-left">
                <Badge className="border-primary-500/20 bg-primary-500/10 text-primary-700 dark:border-primary-400/20 dark:text-primary-400 mb-4">
                  <CheckCircle2Icon size={14} className="mr-1" />
                  Open Source
                </Badge>
                <h2 className="text-foreground mb-4 text-3xl font-bold sm:text-4xl">
                  Built in the open, for everyone
                </h2>
                <p className="text-base-600 dark:text-base-400 text-lg">
                  {app.name} is completely open source. Inspect the code,
                  contribute features, or self-host on your own infrastructure.
                  Your data, your rules.
                </p>
              </div>

              {/* CTA */}
              <div className="flex flex-col gap-4 sm:flex-row">
                <a
                  href={app.links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <TiltCard
                    maxTilt={8}
                    liftAmount={4}
                    hoverScale={1.02}
                    glareIntensity={0.2}
                    className="rounded-xl border-0 bg-transparent p-0 shadow-none"
                  >
                    <Button
                      size="lg"
                      variant="outline"
                      className="border-base-300 dark:border-base-700 h-12 gap-2 px-6"
                    >
                      <GithubIcon size={20} />
                      View on GitHub
                    </Button>
                  </TiltCard>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="relative px-4 py-32 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          {/* Decorative elements */}
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div className="bg-primary-500/10 h-100 w-100 rounded-full blur-[100px]" />
          </div>

          <div className="relative">
            <h2 className="text-foreground mb-6 text-4xl font-bold sm:text-5xl">
              Ready for <span className="text-shimmer">stellar execution?</span>
            </h2>
            <p className="text-base-600 dark:text-base-400 mx-auto mb-10 max-w-xl text-lg">
              Join innovative teams shipping better products with {app.name}.
              Free for individuals and small teams.
            </p>

            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <TiltCard
                maxTilt={10}
                liftAmount={6}
                hoverScale={1.03}
                glareIntensity={0.3}
                onClick={() =>
                  signIn({ redirectUrl: BASE_URL, providerId: "omni" })
                }
                className="rounded-xl border-0 bg-transparent p-0 shadow-none"
              >
                <Button
                  size="lg"
                  className="group bg-primary-500 text-base-950 shadow-primary-500/25 hover:bg-primary-400 hover:shadow-primary-500/30 dark:bg-primary-500 dark:hover:bg-primary-400 h-14 gap-2 px-10 text-lg font-semibold shadow-lg transition-all hover:shadow-xl"
                >
                  Get Started for Free
                  <ArrowRightIcon
                    size={20}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </Button>
              </TiltCard>
            </div>

            <p className="text-base-500 mt-6 text-sm">
              No credit card required. Free and open source.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
