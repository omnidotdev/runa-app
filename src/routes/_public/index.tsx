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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import signIn from "@/lib/auth/signIn";
import app from "@/lib/config/app.config";
import { BASE_URL } from "@/lib/config/env.config";
import { cn } from "@/lib/utils";

import type { ReactNode } from "react";

export const Route = createFileRoute("/_public/")({
  beforeLoad: ({ context: { session } }) => {
    if (session?.user) throw redirect({ to: "/workspaces" });
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
              <Badge className="gap-2 border-primary-500/20 bg-primary-500/10 px-4 py-2 text-primary-700 dark:border-primary-400/20 dark:bg-primary-500/10 dark:text-primary-400">
                <span>{app.description}</span>
              </Badge>
            </div>

            {/* Headline */}
            <h1 className="mb-6 font-extrabold text-4xl tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              <span className="block text-foreground">Project management</span>
              <span className="mt-2 block text-shimmer">done right.</span>
            </h1>

            <p className="mx-auto mb-10 max-w-2xl text-base text-base-600 dark:text-base-400">
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
                  className="group h-12 gap-2 bg-primary-500 px-8 font-semibold text-base text-base-950 shadow-lg shadow-primary-500/25 transition-all hover:bg-primary-400 hover:shadow-primary-500/30 hover:shadow-xl dark:bg-primary-500 dark:hover:bg-primary-400"
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
                    className="h-12 gap-2 border-base-300 px-8 text-base dark:border-base-700"
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
                  <div className="font-bold text-2xl text-foreground sm:text-3xl">
                    {stat.value}
                  </div>
                  <div className="text-base-500 text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Decorative gradient orb behind hero */}
        <div className="pointer-events-none absolute top-1/2 left-1/2 -z-10 h-150 w-150 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary-500/5 blur-[100px]" />
      </section>

      {/* Demo CTA Section */}
      <section className="relative px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <div className="relative overflow-hidden rounded-2xl border border-primary-500/20 bg-linear-to-br from-primary-50/50 to-base-100 p-8 text-center dark:border-primary-500/10 dark:from-primary-950/20 dark:to-base-950">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 h-32 w-32 rounded-full bg-primary-500/15 blur-2xl" />
            <div className="absolute bottom-0 left-0 h-32 w-32 rounded-full bg-primary-400/10 blur-2xl" />

            <div className="relative">
              <Badge className="mb-4 border-primary-500/20 bg-primary-500/10 text-primary-700 dark:border-primary-400/20 dark:text-primary-400">
                Try It Out
              </Badge>

              <h2 className="mb-4 font-bold text-2xl text-foreground sm:text-3xl">
                See it in action
              </h2>

              <p className="mb-6 text-base-600 dark:text-base-400">
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
                  className="group h-12 gap-2 bg-primary-500 px-8 font-semibold text-base text-base-950 shadow-lg shadow-primary-500/25 transition-all hover:bg-primary-400 hover:shadow-primary-500/30 hover:shadow-xl dark:bg-primary-500 dark:hover:bg-primary-400"
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
            <Badge className="mb-4 border-primary-500/20 bg-primary-500/10 text-primary-700 dark:border-primary-400/20 dark:text-primary-400">
              Features
            </Badge>
            <h2 className="mb-4 font-bold text-3xl text-foreground sm:text-4xl">
              Everything you need to execute
            </h2>
            <p className="text-base-600 text-lg dark:text-base-400">
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
                <h3 className="mb-2 font-semibold text-foreground text-lg">
                  {feature.title}
                </h3>
                <p className="text-base-600 text-sm leading-relaxed dark:text-base-400">
                  {feature.description}
                </p>

                {/* Decorative gradient */}
                <div className="pointer-events-none absolute -right-20 -bottom-20 h-40 w-40 rounded-full bg-linear-to-br from-primary-500/10 to-transparent opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100" />
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
            <Badge className="mb-4 border-primary-500/20 bg-primary-500/10 text-primary-700 dark:border-primary-400/20 dark:text-primary-400">
              How It Works
            </Badge>
            <h2 className="mb-4 font-bold text-3xl text-foreground sm:text-4xl">
              From zero to 🌙 in minutes
            </h2>
            <p className="text-base-600 text-lg dark:text-base-400">
              Getting started in {app.name} is simple. No complex setup, no
              steep learning curve.
            </p>
          </div>

          {/* Steps */}
          <div className="relative grid gap-8 md:grid-cols-3">
            {/* Connecting line */}
            <div className="absolute top-16 right-0 left-0 hidden h-0.5 bg-linear-to-r from-transparent via-primary-500/30 to-transparent md:block" />

            {steps.map((step, _index) => (
              <TiltCard
                key={step.title}
                maxTilt={15}
                liftAmount={12}
                hoverScale={1.03}
                glareIntensity={0.18}
                className="group flex flex-col items-center rounded-2xl border-primary-500/10 bg-white/50 text-center backdrop-blur-sm dark:border-primary-500/10 dark:bg-base-900/50"
              >
                {/* Step number with icon */}
                <div className="relative mb-6">
                  <div className="flex h-20 w-20 items-center justify-center rounded-2xl border border-primary-500/20 bg-white shadow-lg transition-all duration-300 group-hover:border-primary-500/40 group-hover:shadow-primary-500/10 dark:border-primary-500/10 dark:bg-base-900">
                    <div className="text-primary-500">{step.icon}</div>
                  </div>
                  <div className="absolute -top-2 -right-2 flex h-7 w-7 items-center justify-center rounded-full bg-primary-500 font-bold text-base-950 text-xs">
                    {step.number}
                  </div>
                </div>

                {/* Content */}
                <h3 className="mb-2 font-semibold text-foreground text-xl">
                  {step.title}
                </h3>
                <p className="max-w-xs text-base-600 dark:text-base-400">
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
          <div className="relative overflow-hidden rounded-3xl border border-primary-500/20 bg-linear-to-br from-primary-50/50 to-base-100 p-8 sm:p-12 lg:p-16 dark:border-primary-500/10 dark:from-primary-950/20 dark:to-base-950">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 h-64 w-64 rounded-full bg-primary-500/15 blur-3xl" />
            <div className="absolute bottom-0 left-0 h-64 w-64 rounded-full bg-primary-400/10 blur-3xl" />

            <div className="relative flex flex-col items-center gap-8 lg:flex-row lg:justify-between">
              {/* Content */}
              <div className="max-w-xl text-center lg:text-left">
                <Badge className="mb-4 border-primary-500/20 bg-primary-500/10 text-primary-700 dark:border-primary-400/20 dark:text-primary-400">
                  <CheckCircle2Icon size={14} className="mr-1" />
                  Open Source
                </Badge>
                <h2 className="mb-4 font-bold text-3xl text-foreground sm:text-4xl">
                  Built in the open, for everyone
                </h2>
                <p className="text-base-600 text-lg dark:text-base-400">
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
                      className="h-12 gap-2 border-base-300 px-6 dark:border-base-700"
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
            <div className="h-100 w-100 rounded-full bg-primary-500/10 blur-[100px]" />
          </div>

          <div className="relative">
            <h2 className="mb-6 font-bold text-4xl text-foreground sm:text-5xl">
              Ready for <span className="text-shimmer">stellar execution?</span>
            </h2>
            <p className="mx-auto mb-10 max-w-xl text-base-600 text-lg dark:text-base-400">
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
                  className="group h-14 gap-2 bg-primary-500 px-10 font-semibold text-base-950 text-lg shadow-lg shadow-primary-500/25 transition-all hover:bg-primary-400 hover:shadow-primary-500/30 hover:shadow-xl dark:bg-primary-500 dark:hover:bg-primary-400"
                >
                  Get Started for Free
                  <ArrowRightIcon
                    size={20}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </Button>
              </TiltCard>
            </div>

            <p className="mt-6 text-base-500 text-sm">
              No credit card required. Free and open source.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
