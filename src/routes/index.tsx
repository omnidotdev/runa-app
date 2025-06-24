import { Link } from "@tanstack/react-router";
import {
  ChartNoAxesColumnIncreasingIcon,
  ListIcon,
  UsersIcon,
  WorkflowIcon,
} from "lucide-react";
import { match } from "ts-pattern";

import ThemeToggle from "@/components/ThemeToggle";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

import type { ReactNode } from "react";

interface Feature {
  title: string;
  description: string;
  icon: ReactNode;
  color: "primary" | "amber" | "fuchsia" | "emerald";
}

const features: Feature[] = [
  {
    title: "Task Management",
    description:
      "Organize and track your tasks with flexible views and intuitive workflows.",
    icon: <ListIcon className="text-primary-500" size={24} />,
    color: "primary",
  },
  {
    title: "Team Collaboration",
    description:
      "Collaborate effortlessly with team members through comments, mentions, and assignments.",
    icon: <UsersIcon className="text-fuchsia-500" size={24} />,
    color: "fuchsia",
  },
  {
    title: "Customizable Workflows",
    description:
      "Create custom workflows that match your team's processes and project needs.",
    icon: <WorkflowIcon className="text-emerald-500" size={24} />,
    color: "emerald",
  },
  {
    title: "Project Analytics",
    description:
      "Get insights into your team's performance with detailed analytics and progress tracking.",
    icon: (
      <ChartNoAxesColumnIncreasingIcon className="text-amber-500" size={24} />
    ),
    color: "amber",
  },
];

export const Route = createFileRoute({
  component: Home,
});

function Home() {
  return (
    <div className="relative min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Background elements */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 z-0 opacity-50 dark:opacity-20"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='grid' width='200' height='200' patternUnits='userSpaceOnUse' patternTransform='rotate(12)'%3E%3Cpath d='M 200 0 L 0 0 0 200' fill='none' stroke='rgba(37, 99, 235, 0.45)' stroke-width='2.5' class='light-stroke'/%3E%3Cpath d='M 200 0 L 0 0 0 200' fill='none' stroke='rgba(96, 165, 250, 0.55)' stroke-width='2.5' class='dark-stroke' style='display:none'/%3E%3C/pattern%3E%3CradialGradient id='fade' cx='50%25' cy='50%25' r='70%25' fx='50%25' fy='50%25'%3E%3Cstop offset='0%25' style='stop-color:white;stop-opacity:0' /%3E%3Cstop offset='70%25' style='stop-color:white;stop-opacity:1' /%3E%3C/radialGradient%3E%3Cmask id='mask' x='0' y='0' width='100%25' height='100%25'%3E%3Crect x='0' y='0' width='100%25' height='100%25' fill='url(%23fade)'/%3E%3C/mask%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='url(%23grid)' mask='url(%23mask)'/%3E%3Cstyle%3E@media (prefers-color-scheme: dark) { .light-stroke { display: none; } .dark-stroke { display: block !important; } }%3C/style%3E%3C/svg%3E")`,
            backgroundSize: "cover",
          }}
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-gray-100/70 via-transparent to-gray-100/70 dark:from-gray-800/70 dark:via-transparent dark:to-gray-800/70" />
      </div>

      {/* Navigation */}
      <nav className="relative z-10 border-gray-200 border-b bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between">
            <div className="flex items-center">
              <h1 className="font-bold text-primary-600 text-xl dark:text-primary-400">
                Runa
              </h1>
            </div>
            <div className="flex items-center space-x-6">
              <ThemeToggle />
              {/* TODO */}
              {/* <Link
                  to="/docs"
                  className={cn(buttonVariants({ variant: "link" }))}
                >
                  Docs
                </Link> */}

              <Link to="/workspaces" className={cn(buttonVariants())}>
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Hero section */}
        <div className="py-20 md:py-28 lg:py-36">
          <div className="relative z-10 max-w-3xl">
            <Badge variant="subtle" className="mb-5 rounded-full">
              Introducing Runa
            </Badge>

            <h1 className="mb-8 font-extrabold text-4xl text-gray-900 sm:text-5xl md:text-6xl dark:text-white">
              Transform Your Projects into{" "}
              <span className="relative whitespace-nowrap text-primary-600 dark:text-primary-400">
                <span className="relative z-10">Success Stories</span>
                <span className="-inset-1 -skew-y-3 -z-10 absolute rounded-sm bg-primary-100 dark:bg-primary-900/40" />
              </span>
            </h1>

            <p className="mb-12 max-w-2xl text-gray-600 text-xl leading-relaxed dark:text-gray-400">
              Streamline your workflow, collaborate seamlessly, and deliver
              projects on time with our intuitive Kanban board solution.
            </p>

            <div className="flex flex-col gap-5 sm:flex-row">
              <Link
                to="/workspaces"
                className="group cursor-pointer rounded-lg bg-primary-600 px-8 py-4 font-medium text-base text-white shadow-md transition-all hover:bg-primary-700 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary-600 focus:ring-offset-2"
              >
                Get Started{" "}
                <span className="ml-1 inline-block transition-transform group-hover:translate-x-1">
                  →
                </span>
              </Link>
              <Link
                to="/pricing"
                className="rounded-lg border border-gray-300 bg-white px-8 py-4 text-center font-medium text-base text-primary-600 shadow-sm hover:bg-gray-50 hover:shadow dark:border-gray-700 dark:bg-gray-800 dark:text-primary-400 dark:hover:bg-gray-700"
              >
                View Pricing
              </Link>
            </div>
          </div>

          {/* Features grid */}
          <div className="relative z-10 mt-32">
            <div className="mb-16 flex flex-col justify-between gap-4 md:flex-row md:items-center">
              <h2 className="relative inline-block font-bold text-2xl text-gray-900 underline decoration-4 decoration-primary-600/30 underline-offset-8 dark:text-white dark:decoration-primary-600/40">
                Everything you need to manage projects effectively
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-4">
              {features.map(({ title, description, icon, color }) => {
                const { hoverBorder, iconBg } = match(color)
                  .with("primary", () => ({
                    hoverBorder:
                      "hover:border-primary-200 dark:hover:border-primary-800",
                    iconBg: "bg-primary-100 dark:bg-primary-900/50",
                  }))
                  .with("amber", () => ({
                    hoverBorder:
                      "hover:border-amber-200 dark:hover:border-amber-800",
                    iconBg: "bg-amber-100 dark:bg-amber-900/50",
                  }))
                  .with("fuchsia", () => ({
                    hoverBorder:
                      "hover:border-fuchsia-200 dark:hover:border-fuchsia-800",
                    iconBg: "bg-fuchsia-100 dark:bg-fuchsia-900/50",
                  }))
                  .with("emerald", () => ({
                    hoverBorder:
                      "hover:border-emerald-200 dark:hover:border-emerald-800",
                    iconBg: "bg-emerald-100 dark:bg-emerald-900/50",
                  }))
                  .exhaustive();

                return (
                  <Card
                    key={title}
                    title={title}
                    description={description}
                    icon={
                      <div
                        className={cn(
                          "mb-4 flex h-12 w-12 items-center justify-center rounded-xl",
                          iconBg,
                        )}
                      >
                        {icon}
                      </div>
                    }
                    className={cn(
                      "hover:-translate-y-0.5 rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-transform hover:shadow-md dark:border-gray-700 dark:bg-gray-800",
                      hoverBorder,
                    )}
                    headerProps={{ className: "gap-4 p-0 pt-2" }}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
